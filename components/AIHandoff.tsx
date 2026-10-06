'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  Check,
  Clock3,
  Headphones,
  MessageSquare,
  PhoneCall,
  RefreshCw,
  UserRound,
} from 'lucide-react';
import Shell from './Shell';
import { apiFetch } from './api-client';
const active = ['waiting', 'human', 'follow-up', 'callback'];
export default function AIHandoff() {
  const [calls, setCalls] = useState([]),
    [selected, setSelected] = useState(''),
    [filter, setFilter] = useState('active'),
    [note, setNote] = useState(''),
    [phone, setPhone] = useState(''),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState('');
  async function load() {
    setError('');
    try {
      const response = await apiFetch('/api/records/call?limit=250');
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'Could not load call queue.');
      setCalls(data);
      setSelected((current) =>
        data.some((c) => c._id === current)
          ? current
          : data.find((c) => active.includes(c.status))?._id || data[0]?._id || '',
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  const visible = calls.filter((c) => filter === 'all' || active.includes(c.status)),
    call = calls.find((c) => c._id === selected),
    details = call?.data?.screen_14 || {};
  async function advance(status) {
    if (!call) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const action =
        status === 'human'
          ? 'Accepted for Priya Sharma'
          : status === 'callback'
            ? 'Callback requested'
            : status === 'ended'
              ? 'Case resolved'
              : 'Updated';
      if (status === 'callback' && !/^\+[1-9]\d{7,14}$/.test(phone.trim()))
        throw Error('Enter a valid phone number with country code, for example +919876543210.');
      const data = {
        ...call.data,
        aiHandoffNote: note.trim().slice(0, 1000),
        handoffUpdatedAt: new Date().toISOString(),
      };
      if (status === 'human') data.assignedAgent = 'Priya Sharma';
      if (status === 'callback') {
        const callbackResponse = await apiFetch('/api/records/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: call.title,
            data: {
              screen_32: {
                'Your name': call.title,
                'Phone number': phone.trim(),
                'How can we help?':
                  details['Issue summary'] || call.data?.aiSummary || 'AI handoff callback',
              },
              sourceCallId: call._id,
            },
          }),
        });
        const callback = await callbackResponse.json();
        if (!callbackResponse.ok) throw Error(callback.error || 'Could not create callback.');
        data.callbackId = callback._id;
        data.phone = phone.trim();
      }
      const response = await apiFetch(`/api/records/call/${call._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, data }),
      });
      const updated = await response.json();
      if (!response.ok) throw Error(updated.error || 'Could not update handoff.');
      setCalls((old) => old.map((item) => (item._id === updated._id ? updated : item)));
      setNotice(action);
      setNote('');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell active="/ai-handoff">
      <div
        className={
          'ah-page max-w-390 m-[0_auto] p-[8px_8px_55px] text-[#f7f4fc] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_8px] [&_button]:[font:inherit] [&_textarea]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_a]:no-underline max-[680px]:p-[4px_0_30px] max-[680px]:[&_h1]:text-[25px]'
        }
      >
        <div
          className={
            'ah-heading flex items-center justify-between gap-5 mb-5.75 [&_p]:text-[13px] [&_p]:text-[#bab4c4] [&_p]:leading-normal mb-4.5 max-[680px]:items-start max-[680px]:flex-col'
          }
        >
          <div>
            <span className={'tl-kicker text-[11px] font-bold tracking-[.11em] text-[#b390f7]'}>
              MONITOR / HUMAN SUPPORT
            </span>
            <h1>AI Handoff</h1>
            <p>Review the AI context, accept a waiting conversation, or arrange a callback.</p>
          </div>
          <button
            className={
              'tl-secondary inline-flex items-center justify-center gap-2 rounded-[9px] font-bold text-[13px] p-[10px_15px] border border-[#9d76f2] text-white! bg-[#8057e8] whitespace-nowrap text-[#eee7f7]! bg-[#2c2935] border-[#554a61] [&:hover]:bg-[#393244]'
            }
            onClick={load}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
        <div
          className={
            'ah-metrics [&>div]:bg-[#20212a] [&>div]:border [&>div]:border-[#413c49] [&>div]:rounded-[13px] grid grid-cols-[repeat(3,1fr)] gap-3.25 mb-4 [&>div]:p-4.25 [&_strong]:block [&_span]:block [&_strong]:text-[23px] [&_span]:text-[#b5acbd] [&_span]:text-xs'
          }
        >
          <div>
            <strong>{calls.filter((c) => c.status === 'waiting').length}</strong>
            <span>Waiting</span>
          </div>
          <div>
            <strong>{calls.filter((c) => c.status === 'human').length}</strong>
            <span>With human</span>
          </div>
          <div>
            <strong>{calls.filter((c) => c.status === 'callback').length}</strong>
            <span>Callbacks</span>
          </div>
        </div>
        <div
          className={
            'ah-layout grid grid-cols-[minmax(270px,.8fr)_minmax(0,1.55fr)] gap-3.75 items-start max-[1000px]:grid-cols-1'
          }
        >
          <aside
            className={
              'ah-list bg-[#20212a] border border-[#413c49] rounded-[13px] overflow-hidden min-h-125 max-[1000px]:min-h-0 max-[1000px]:max-h-100 max-[1000px]:overflow-auto'
            }
          >
            <div
              className={
                'ah-list-head flex justify-between gap-2.5 items-center p-4 border-b border-b-[#413b49] [&_h2]:m-0 [&_button]:text-[11px] [&_button]:border-0 [&_button]:text-[#bbb1c8] [&_button]:bg-transparent [&_button]:p-1.75 [&_button.active]:bg-[#493469] [&_button.active]:rounded-md [&_button.active]:text-white'
              }
            >
              <h2>Handoff queue</h2>
              <div>
                <button
                  className={filter === 'active' ? 'active' : ''}
                  onClick={() => setFilter('active')}
                >
                  Active
                </button>
                <button
                  className={filter === 'all' ? 'active' : ''}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
              </div>
            </div>
            {loading ? (
              <p>Loading handoffs…</p>
            ) : visible.length ? (
              visible.map((item) => (
                <button
                  key={item._id}
                  onClick={() => {
                    setSelected(item._id);
                    setNote('');
                    setPhone(item.data?.phone || '');
                    setNotice('');
                  }}
                  className={`ah-case flex w-full items-center gap-2.25 p-[14px_12px] text-[#f1eaf8] bg-none border-0 border-b border-b-[#383340] text-left [&:hover]:bg-[#302740] [&.selected]:bg-[#302740] [&.selected]:shadow-[inset_3px_0_#9f78f1] [&>span:nth-child(2)]:flex-1 [&>span:nth-child(2)]:min-w-0 [&_strong]:block [&_small]:block [&_em]:block [&_strong]:text-xs [&_small]:text-[11px] [&_small]:text-[#d0c5dc] [&_small]:overflow-hidden [&_small]:text-ellipsis [&_small]:whitespace-nowrap [&_small]:mt-1 [&_em]:not-italic [&_em]:text-[#aba1b8] [&_em]:text-[10px] [&_em]:mt-1.5 [&_b]:text-[10px] [&_b]:rounded-[50px] [&_b]:p-[5px_7px] [&_b]:text-[#e2c8a1] [&_b]:bg-[#544332] [&_b]:capitalize [&_b.human]:text-[#9ce0cd] [&_b.human]:bg-[#245343]${selected === item._id ? 'selected' : ''}`}
                >
                  <span
                    className={
                      'ah-avatar w-9 h-9 grid place-items-center rounded-full text-white bg-[#7455b1] flex-none font-bold [&.big]:w-13 [&.big]:h-13 [&.big]:text-xl'
                    }
                  >
                    {item.title.slice(0, 1)}
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>
                      {item.data?.screen_14?.['Issue summary'] ||
                        item.data?.aiSummary ||
                        'Customer request'}
                    </small>
                    <em>
                      {item.data?.screen_14?.Department || 'Support'} ·{' '}
                      {new Date(item.updatedAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </em>
                  </span>
                  <b className={`${item.status} [&]:text-[#ff8f99]!`}>{item.status}</b>
                </button>
              ))
            ) : (
              <div
                className={
                  'ah-empty grid place-content-center text-center gap-2.5 min-h-57.5 text-[#b3aabd]'
                }
              >
                No cases in this view.
              </div>
            )}
          </aside>
          <section
            className={
              'ah-detail bg-[#20212a] border border-[#413c49] rounded-[13px] p-6.25 min-h-130 max-[680px]:p-4'
            }
          >
            {call ? (
              <>
                <div
                  className={
                    'ah-detail-head flex items-center gap-3.5 border-b border-b-[#494252] pb-5 [&>div]:flex-1 [&_h2]:m-[4px_0] [&_p]:text-[#b9b0c4] [&_p]:text-[11px] [&_p]:m-0 max-[680px]:flex-wrap'
                  }
                >
                  <span
                    className={
                      'ah-avatar big w-9 h-9 grid place-items-center rounded-full text-white bg-[#7455b1] flex-none font-bold [&.big]:w-13 [&.big]:h-13 [&.big]:text-xl'
                    }
                  >
                    {call.title.slice(0, 1)}
                  </span>
                  <div>
                    <span
                      className={'tl-kicker text-[11px] font-bold tracking-[.11em] text-[#b390f7]'}
                    >
                      CASE · {call._id.slice(0, 8)}
                    </span>
                    <h2>{call.title}</h2>
                    <p>
                      {details.Department || 'Support'} · {call.data?.source || 'web'} channel
                    </p>
                  </div>
                  <span
                    className={`ah-badge text-[10px] rounded-[50px] p-[5px_7px] text-[#e2c8a1] bg-[#544332] capitalize [&.human]:text-[#9ce0cd] [&.human]:bg-[#245343]${call.status}`}
                  >
                    {call.status}
                  </span>
                </div>
                <div
                  className={
                    'ah-summary border border-[#4b4351] bg-[#292832] rounded-[10px] p-4.25 mt-4.25 [&_h3]:flex [&_h3]:items-center [&_h3]:gap-2 [&_h3]:text-sm [&_h3]:m-[0_0_12px] [&_h3_svg]:text-[#b493f2] [&>p]:text-[13px] [&>p]:leading-normal [&>p]:text-[#e2dce9] [&_dl]:border-t [&_dl]:border-t-[#443d4c] [&_dl]:pt-2.5 [&_dl]:m-[12px_0_0] [&_dl>div]:flex [&_dl>div]:gap-2.25 [&_dl>div]:mt-1.75 [&_dl>div]:text-xs [&_dt]:w-22.5 [&_dt]:flex-none [&_dt]:text-[#afa6b9] [&_dd]:m-0 max-[680px]:[&_dl>div]:block max-[680px]:[&_dt]:w-auto'
                  }
                >
                  <h3>
                    <Bot size={18} /> AI context
                  </h3>
                  <p>
                    {call.data?.aiSummary ||
                      details['Issue summary'] ||
                      'No AI summary was recorded for this demo call.'}
                  </p>
                  <dl>
                    <div>
                      <dt>Issue</dt>
                      <dd>{details['Issue summary'] || 'Not captured'}</dd>
                    </div>
                    <div>
                      <dt>Assigned to</dt>
                      <dd>{call.data?.assignedAgent || 'Nobody yet'}</dd>
                    </div>
                  </dl>
                </div>
                <div
                  className={
                    'ah-transcript border border-[#4b4351] bg-[#292832] rounded-[10px] p-4.25 mt-4.25 [&_h3]:flex [&_h3]:items-center [&_h3]:gap-2 [&_h3]:text-sm [&_h3]:m-[0_0_12px] [&_h3_svg]:text-[#b493f2] [&>div]:flex [&>div]:gap-3 [&>div]:items-start [&>div]:mt-2.75 [&>div_span]:w-20 [&>div_span]:flex-none [&>div_span]:text-[#b89ae9] [&>div_span]:text-[11px] [&>div_p]:m-0 [&>div_p]:p-2.25 [&>div_p]:rounded-[7px] [&>div_p]:bg-[#33303e] [&>div_p]:text-xs max-[680px]:[&>div]:flex-wrap max-[680px]:[&>div_span]:w-full'
                  }
                >
                  <h3>
                    <MessageSquare size={18} /> Conversation so far
                  </h3>
                  {call.data?.transcript?.length ? (
                    call.data.transcript.map((line, i) => (
                      <div key={i}>
                        <span>{line.speaker}</span>
                        <p>{line.text}</p>
                      </div>
                    ))
                  ) : (
                    <p>No transcript is available for this call.</p>
                  )}
                </div>
                {call.status === 'waiting' && (
                  <label
                    className={
                      'tl-field flex flex-col gap-2 text-[13px] text-[#e9e3f0] font-[650] m-[19px_0] [&_small]:text-[#aaa3b5] [&_small]:text-[11px] [&_small]:font-normal [&_input]:w-full [&_input]:border [&_input]:border-[#554a5d] [&_input]:rounded-lg [&_input]:bg-[#2b2934] [&_input]:text-white [&_input]:outline-0 [&_input]:p-[11px_12px] [&_input]:min-w-0 [&_input]:resize-y [&_select]:w-full [&_select]:border [&_select]:border-[#554a5d] [&_select]:rounded-lg [&_select]:bg-[#2b2934] [&_select]:text-white [&_select]:outline-0 [&_select]:p-[11px_12px] [&_select]:min-w-0 [&_select]:resize-y [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[#554a5d] [&_textarea]:rounded-lg [&_textarea]:bg-[#2b2934] [&_textarea]:text-white [&_textarea]:outline-0 [&_textarea]:p-[11px_12px] [&_textarea]:min-w-0 [&_textarea]:resize-y [&_:is(input,select,textarea):focus]:border-[#aa83f1]'
                    }
                  >
                    Callback phone (country code)
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+919876543210"
                    />
                  </label>
                )}
                <label
                  className={
                    'tl-field flex flex-col gap-2 text-[13px] text-[#e9e3f0] font-[650] m-[19px_0] [&_small]:text-[#aaa3b5] [&_small]:text-[11px] [&_small]:font-normal [&_input]:w-full [&_input]:border [&_input]:border-[#554a5d] [&_input]:rounded-lg [&_input]:bg-[#2b2934] [&_input]:text-white [&_input]:outline-0 [&_input]:p-[11px_12px] [&_input]:min-w-0 [&_input]:resize-y [&_select]:w-full [&_select]:border [&_select]:border-[#554a5d] [&_select]:rounded-lg [&_select]:bg-[#2b2934] [&_select]:text-white [&_select]:outline-0 [&_select]:p-[11px_12px] [&_select]:min-w-0 [&_select]:resize-y [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[#554a5d] [&_textarea]:rounded-lg [&_textarea]:bg-[#2b2934] [&_textarea]:text-white [&_textarea]:outline-0 [&_textarea]:p-[11px_12px] [&_textarea]:min-w-0 [&_textarea]:resize-y [&_:is(input,select,textarea):focus]:border-[#aa83f1]'
                  }
                >
                  Internal handoff note
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add context for the human agent…"
                  />
                </label>
                {call.data?.aiHandoffNote && (
                  <p className={'ah-note text-xs text-[#b6adc3]'}>
                    Previous note: {call.data.aiHandoffNote}
                  </p>
                )}
                {error && (
                  <div
                    role="alert"
                    className={
                      'tl-error m-[11px_0] p-[11px_12px] rounded-lg bg-[#522e3c] border border-[#825066] text-[#ffc0d0] text-xs'
                    }
                  >
                    {error}
                  </div>
                )}
                {notice && (
                  <div
                    role="status"
                    className={
                      'tl-success m-[11px_0] p-[11px_12px] rounded-lg bg-[#522e3c] border border-[#825066] text-[#ffc0d0] text-xs bg-[#214b3d] border-[#427966] text-[#a9eed0] flex gap-1.75 items-center'
                    }
                  >
                    <Check size={16} />
                    {notice}
                  </div>
                )}
                <div className={'ah-actions flex items-center gap-2.5 flex-wrap'}>
                  {call.status === 'waiting' && (
                    <>
                      <button
                        className={
                          'tl-primary inline-flex items-center justify-center gap-2 rounded-[9px] font-bold text-[13px] p-[10px_15px] border border-[#9d76f2] text-white! bg-[#8057e8] whitespace-nowrap [&:hover]:bg-[#916cf3]'
                        }
                        disabled={busy}
                        onClick={() => advance('human')}
                      >
                        <Headphones size={16} /> Accept for Priya
                      </button>
                      <button
                        className={
                          'tl-secondary inline-flex items-center justify-center gap-2 rounded-[9px] font-bold text-[13px] p-[10px_15px] border border-[#9d76f2] text-white! bg-[#8057e8] whitespace-nowrap text-[#eee7f7]! bg-[#2c2935] border-[#554a61] [&:hover]:bg-[#393244]'
                        }
                        disabled={busy}
                        onClick={() => advance('callback')}
                      >
                        <Clock3 size={16} /> Request callback
                      </button>
                    </>
                  )}
                  {call.status === 'human' && (
                    <button
                      className={
                        'tl-primary inline-flex items-center justify-center gap-2 rounded-[9px] font-bold text-[13px] p-[10px_15px] border border-[#9d76f2] text-white! bg-[#8057e8] whitespace-nowrap [&:hover]:bg-[#916cf3]'
                      }
                      disabled={busy}
                      onClick={() => advance('ended')}
                    >
                      <Check size={16} /> Mark resolved
                    </button>
                  )}
                  {call.status === 'follow-up' && (
                    <button
                      className={
                        'tl-primary inline-flex items-center justify-center gap-2 rounded-[9px] font-bold text-[13px] p-[10px_15px] border border-[#9d76f2] text-white! bg-[#8057e8] whitespace-nowrap [&:hover]:bg-[#916cf3]'
                      }
                      disabled={busy}
                      onClick={() => advance('human')}
                    >
                      <UserRound size={16} /> Reopen with human
                    </button>
                  )}
                  {call.status === 'callback' && (
                    <Link
                      className={
                        'tl-secondary inline-flex items-center justify-center gap-2 rounded-[9px] font-bold text-[13px] p-[10px_15px] border border-[#9d76f2] text-white! bg-[#8057e8] whitespace-nowrap text-[#eee7f7]! bg-[#2c2935] border-[#554a61] [&:hover]:bg-[#393244]'
                      }
                      href="/flow/18"
                    >
                      <PhoneCall size={16} /> View callbacks
                    </Link>
                  )}
                  <Link
                    href="/tools/new/handoff"
                    className={
                      'tl-text-link inline-flex items-center gap-1.5 text-[#c8aaff] text-xs'
                    }
                  >
                    Configure handoff tool <ArrowRight size={15} />
                  </Link>
                </div>
                <p className={'tl-note text-[13px] text-[#bab4c4] leading-normal text-[11px] mt-4'}>
                  Demo case updates only. Live voice handoff, availability and callback scheduling
                  need their runtime integrations.
                </p>
              </>
            ) : (
              <div
                className={
                  'ah-empty grid place-content-center text-center gap-2.5 min-h-57.5 text-[#b3aabd]'
                }
              >
                <UserRound size={30} /> Select a case to review its context.
              </div>
            )}
          </section>
        </div>
      </div>
    </Shell>
  );
}
