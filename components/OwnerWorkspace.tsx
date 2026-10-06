'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  AudioLines,
  CheckCircle2,
  Clock3,
  Headphones,
  PhoneIncoming,
  Repeat2,
  Search,
  Star,
  UserRound,
} from 'lucide-react';
import { apiFetch } from './api-client';

const statusText = {
  waiting: 'Waiting for human',
  human: 'Human connected',
  'transfer-pending': 'Transfer pending',
  ended: 'Completed',
  requested: 'New request',
  assigned: 'Assigned',
  completed: 'Completed',
  submitted: 'Submitted',
};
const groups = {
  inbox: [
    'Incoming voice requests',
    'Review customer context before an owner or agent accepts the handoff.',
  ],
  'live-calls': [
    'Live call monitoring',
    'See live ownership and waiting requests across your team.',
  ],
  'call-takeover': [
    'Owner call takeover',
    'Accept a waiting call or take responsibility for an active conversation.',
  ],
  'call-history': [
    'Call history & transcript',
    'Review completed calls, outcome notes and transcript events.',
  ],
  callbacks: ['Callback requests', 'Assign a follow-up and keep its status visible to the team.'],
  reviews: ['Reviews & ratings', 'Read feedback submitted after customer calls.'],
  transfers: ['Transfers', 'Track calls offered to another department or agent.'],
};

function details(item, view) {
  if (view === 'callbacks')
    return [
      [
        'Phone',
        item.data?.screen_32?.['Phone number'] ||
          item.data?.screen_18?.['Phone number'] ||
          'Not given',
      ],
      [
        'Request',
        item.data?.screen_32?.['How can we help?'] || item.data?.screen_18?.Reason || 'No details',
      ],
      ['Preferred time', item.data?.screen_32?.['Preferred time'] || 'Not specified'],
    ];
  if (view === 'reviews')
    return [
      ['Rating', `${item.data?.screen_33?.Rating || '—'} / 5`],
      ['Feedback', item.data?.screen_33?.['Your feedback'] || 'No written feedback'],
    ];
  return [
    ['Department', item.data?.screen_14?.Department || 'Customer Support'],
    ['Request', item.data?.screen_14?.['Issue summary'] || 'No summary available'],
    ['Assigned to', item.data?.assignedAgent || 'Unassigned'],
    ['Source', item.data?.source === 'phone' ? 'Phone' : 'Website'],
  ];
}

export default function OwnerWorkspace({ view, records, selected, onSelect, onUpdate }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState('');
  const [working, setWorking] = useState(false);
  const [assignedAgent, setAssignedAgent] = useState('Priya Sharma');
  const visible = useMemo(
    () =>
      records
        .filter((item) => {
          if (view === 'inbox') return item.status === 'waiting';
          if (view === 'live-calls')
            return ['waiting', 'human', 'transfer-pending'].includes(item.status);
          if (view === 'call-takeover')
            return ['waiting', 'human', 'transfer-pending'].includes(item.status);
          if (view === 'call-history') return item.status === 'ended';
          if (view === 'transfers')
            return item.status === 'transfer-pending' || Boolean(item.data?.screen_25);
          return true;
        })
        .filter((item) =>
          `${item.title} ${item.status} ${item.data?.screen_14?.['Issue summary'] || ''}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
    [records, view, search],
  );
  const active = visible.find((item) => item._id === selected?._id) || visible[0];
  const waiting = records.filter((item) => item.status === 'waiting').length;
  const humans = records.filter((item) => item.status === 'human').length;
  const finished = records.filter((item) => item.status === 'ended').length;

  async function patch(item, status, data = {}) {
    setWorking(true);
    setFeedback('');
    try {
      const response = await apiFetch(
        `/api/records/${view === 'callbacks' ? 'callback' : 'call'}/${item._id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...(status && status !== item.status ? { status } : {}), data }),
        },
      );
      const result = await response.json();
      if (!response.ok) throw Error(result.error || 'Update failed.');
      await onUpdate();
      if (view === 'call-takeover') router.push('/agent/live-call');
      else
        setFeedback(
          view === 'callbacks'
            ? `Callback assigned to ${assignedAgent}.`
            : 'Call assigned to the owner.',
        );
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setWorking(false);
    }
  }
  const [title, subtitle] = groups[view];
  return (
    <div className={'owner-workspace max-w-362.5 m-auto [&_.flow-alert]:m-[0_0_15px]'}>
      <div
        className={
          'flow-breadcrumb flex items-center gap-2 text-[#aaa8bb] text-[13px] mb-4 [&_a]:text-[#b59cff]'
        }
      >
        <Link href="/dashboard">← Voice overview</Link>
        <span> / {title}</span>
      </div>
      <header
        className={
          'owner-workspace-heading flex justify-between items-center gap-6 m-[20px_0_25px] [&_h1]:m-[0_0_8px] [&_h1]:text-4xl [&_h1]:tracking-[-.035em] max-[680px]:items-start max-[680px]:[&_.date-chip]:hidden'
        }
      >
        <div>
          <p className={'eyebrow text-[#a782ff] text-[11px] tracking-[2px] font-bold m-[0_0_9px]'}>
            OWNER WORKSPACE · VOICE
          </p>
          <h1>{title}</h1>
          <p className={'muted text-(--muted) m-0 leading-normal'}>{subtitle}</p>
        </div>
        <span
          className={
            'date-chip p-[12px_17px] border border-[#3a3a47] rounded-[10px] text-[#d5d5df]'
          }
        >
          Acme Support · Demo
        </span>
      </header>
      <div
        className={
          'owner-workspace-stats grid grid-cols-3 gap-4 mb-5 [&>div]:border [&>div]:border-[#343544] [&>div]:rounded-[13px] [&>div]:bg-[linear-gradient(145deg,#20212b,#1a1c27)] [&>div]:min-h-29.75 [&>div]:p-5 [&>div]:grid [&>div]:grid-cols-[47px_1fr] [&>div]:gap-x-3.5 [&>div]:items-center [&_span]:row-[1/3] [&_span]:w-11.5 [&_span]:h-11.5 [&_span]:grid [&_span]:place-items-center [&_span]:text-[#b791ff] [&_span]:bg-[#372952] [&_span]:rounded-xl [&_small]:text-[13px] [&_small]:text-[#adb0c3] [&_strong]:text-[28px] [&_strong]:leading-[1.1] max-[680px]:grid-cols-1'
        }
      >
        <div>
          <span>
            <PhoneIncoming size={19} />
          </span>
          <small>Waiting requests</small>
          <strong>{view === 'callbacks' || view === 'reviews' ? '—' : waiting}</strong>
        </div>
        <div>
          <span>
            <Headphones size={19} />
          </span>
          <small>
            {view === 'callbacks'
              ? 'Unassigned callbacks'
              : view === 'reviews'
                ? 'Feedback received'
                : 'Live human calls'}
          </small>
          <strong>
            {view === 'callbacks'
              ? records.filter((r) => r.status === 'requested').length
              : view === 'reviews'
                ? records.length
                : humans}
          </strong>
        </div>
        <div>
          <span>
            <CheckCircle2 size={19} />
          </span>
          <small>
            {view === 'callbacks'
              ? 'Completed callbacks'
              : view === 'reviews'
                ? 'Five-star reviews'
                : 'Completed calls'}
          </small>
          <strong>
            {view === 'callbacks'
              ? records.filter((r) => r.status === 'completed').length
              : view === 'reviews'
                ? records.filter((r) => r.data?.screen_33?.Rating === '5').length
                : finished}
          </strong>
        </div>
      </div>
      {feedback && (
        <div
          role="status"
          className={
            'flow-alert flex gap-2.5 items-center bg-[#173b34] border border-[#296a55] text-[#81e4b8] p-[13px_16px] rounded-[9px] m-[15px_0] text-sm [&.problem]:bg-[#402630] [&.problem]:border-[#a44c68] [&.problem]:text-[#ffb5c1]'
          }
        >
          {feedback}
        </div>
      )}
      <div
        className={
          'owner-workspace-grid grid grid-cols-[minmax(0,1.45fr)_minmax(340px,.85fr)] gap-4.5 items-start max-[1100px]:grid-cols-1'
        }
      >
        <section
          className={
            'form-card owner-workspace-list border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,#1d1e25,#1b1b22)] p-[22px_23px] border-[#363640] min-w-0 p-0 overflow-hidden'
          }
        >
          <div
            className={
              'owner-workspace-list-head flex justify-between items-center gap-4.5 p-[21px_22px] border-b border-b-[#363846] [&_h2]:m-[0_0_4px] [&_h2]:text-[17px] [&_p]:m-0 [&_p]:text-[#aab0c5] [&_p]:text-[13px] [&_label]:h-9.75 [&_label]:flex [&_label]:items-center [&_label]:gap-2.25 [&_label]:p-[0_11px] [&_label]:border [&_label]:border-[#47495a] [&_label]:rounded-lg [&_label]:text-[#abb0c7] [&_label]:min-w-52.5 [&_input]:bg-transparent [&_input]:border-0 [&_input]:outline-0 [&_input]:text-white [&_input]:min-w-0 [&_input]:w-full [&_input]:text-[13px] max-[680px]:flex-col max-[680px]:items-stretch'
            }
          >
            <div>
              <h2>
                {view === 'call-history'
                  ? 'Completed calls'
                  : view === 'transfers'
                    ? 'Transfer activity'
                    : view === 'reviews'
                      ? 'Customer reviews'
                      : view === 'callbacks'
                        ? 'Follow-up queue'
                        : 'Current calls'}
              </h2>
              <p>{visible.length} shown · latest first</p>
            </div>
            <label>
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by caller or issue"
                aria-label="Search records"
              />
            </label>
          </div>
          <div className={'owner-workspace-items max-h-158.75 overflow-auto'}>
            {visible.map((item) => (
              <button
                key={item._id}
                className={`owner-workspace-item flex items-center gap-3.75 w-full min-h-21 p-[14px_20px] border-0 border-b border-b-[#303443] bg-transparent text-white text-left [&:hover]:bg-[#292743] [&.selected]:bg-[#292743] [&.selected]:shadow-[inset_3px_0_#8761fc] [&>span:nth-child(2)]:min-w-0 [&>span:nth-child(2)]:flex-1 [&_strong]:block [&_strong]:overflow-hidden [&_strong]:text-ellipsis [&_strong]:whitespace-nowrap [&_small]:block [&_small]:overflow-hidden [&_small]:text-ellipsis [&_small]:whitespace-nowrap [&_strong]:text-sm [&_small]:mt-1.25 [&_small]:text-[#aab0c5] [&_small]:text-xs [&_em]:not-italic [&_em]:text-[#baa5ff] [&_em]:text-xs [&_em]:whitespace-nowrap max-[680px]:[&_em]:hidden${active?._id === item._id ? 'selected' : ''}`}
                onClick={() => onSelect(item)}
              >
                <span
                  className={
                    'owner-workspace-avatar w-10.5 h-10.5 grid place-items-center rounded-full bg-[#7561c8] flex-none font-[650]'
                  }
                >
                  {item.title
                    .split(' ')
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join('')
                    .toUpperCase()}
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>
                    {view === 'reviews'
                      ? item.data?.screen_33?.['Your feedback'] || 'No written feedback'
                      : item.data?.screen_14?.['Issue summary'] ||
                        item.data?.screen_32?.['How can we help?'] ||
                        'Review details'}
                  </small>
                </span>
                <em>{statusText[item.status] || item.status}</em>
              </button>
            ))}
            {!visible.length && (
              <div
                className={
                  'owner-workspace-empty p-[60px_18px] text-center text-[#b5afc9] [&_strong]:block [&_strong]:text-[#f8f6ff] [&_strong]:mt-3.25 [&_p]:text-[13px]'
                }
              >
                <AudioLines size={28} />
                <strong>No matching records</strong>
                <p>Try another search or return when new activity arrives.</p>
              </div>
            )}
          </div>
        </section>
        <aside
          className={
            'form-card owner-workspace-detail border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,#1d1e25,#1b1b22)] p-[22px_23px] border-[#363640] min-w-0 p-0 overflow-hidden [&_.details-rows]:p-[6px_22px] [&_.details-rows>div]:gap-3 [&_.details-rows_strong]:max-w-[65%] [&_.details-rows_strong]:wrap-anywhere [&_.details-rows_strong]:text-right'
          }
        >
          <div
            className={
              'owner-workspace-detail-head [&_h2]:m-[0_0_4px] [&_h2]:text-[17px] [&_p]:m-0 [&_p]:text-[#aab0c5] [&_p]:text-[13px] p-5.5 flex items-center gap-3.25 border-b border-b-[#363846] [&>span]:w-11 [&>span]:h-11 [&>span]:grid [&>span]:place-items-center [&>span]:rounded-xl [&>span]:text-[#bd9cff] [&>span]:bg-[#332948]'
            }
          >
            <span>
              {view === 'reviews' ? (
                <Star />
              ) : view === 'transfers' ? (
                <Repeat2 />
              ) : view === 'callbacks' ? (
                <Clock3 />
              ) : (
                <UserRound />
              )}
            </span>
            <div>
              <h2>{active?.title || 'Select a record'}</h2>
              <p>{active ? statusText[active.status] || active.status : 'Details appear here'}</p>
            </div>
          </div>
          {active && (
            <>
              <div
                className={
                  'details-rows mt-3 [&>div]:flex [&>div]:justify-between [&>div]:items-center [&>div]:gap-3.75 [&>div]:p-[14px_0] [&>div]:border-b [&>div]:border-b-(--line) [&>div]:text-sm [&>div_span]:text-[#ada9bc] [&>div_strong]:text-right [&>div_strong]:max-w-[58%] [&>div_strong]:font-medium'
                }
              >
                {details(active, view).map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              {view === 'call-history' && (
                <div
                  className={
                    'owner-workspace-transcript p-[19px_22px] border-t border-t-[#363846] [&_h3]:m-[0_0_13px] [&_h3]:text-sm [&_p]:text-[#c3c7d5] [&_p]:leading-[1.55] [&_p]:text-[13px] [&_p+b]:text-[#bca3ff]'
                  }
                >
                  <h3>Conversation transcript</h3>
                  {active.data?.transcript?.length ? (
                    active.data.transcript.map((line, index) => (
                      <p key={index}>
                        <b>{line.speaker}</b> · {line.text}
                      </p>
                    ))
                  ) : (
                    <p>No transcript was recorded for this demo call.</p>
                  )}
                  <h3>Outcome</h3>
                  <p>
                    {active.data?.screen_27?.Summary ||
                      active.data?.outcome ||
                      'No outcome note saved.'}
                  </p>
                </div>
              )}
              {view === 'transfers' && (
                <div
                  className={
                    'owner-workspace-transcript p-[19px_22px] border-t border-t-[#363846] [&_h3]:m-[0_0_13px] [&_h3]:text-sm [&_p]:text-[#c3c7d5] [&_p]:leading-[1.55] [&_p]:text-[13px] [&_p+b]:text-[#bca3ff]'
                  }
                >
                  <h3>Transfer note</h3>
                  <p>
                    {active.data?.screen_25?.['Reason for transfer'] ||
                      'No transfer note recorded.'}
                  </p>
                  <p>
                    Destination:{' '}
                    {active.data?.screen_25?.['Transfer to agent'] ||
                      active.data?.screen_25?.['Transfer to department'] ||
                      'Not specified'}
                  </p>
                </div>
              )}
              {view === 'callbacks' && active.status !== 'completed' && (
                <div
                  className={
                    'owner-workspace-actions p-[19px_22px] border-t border-t-[#363846] [&_p]:text-[#c3c7d5] [&_p]:leading-[1.55] [&_p]:text-[13px] [&_.button]:w-full [&_.button]:mt-3.25'
                  }
                >
                  <label
                    className={
                      'field grid gap-2 text-sm [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#454551] [&_textarea]:bg-[#202128] [&_textarea]:p-[12px_13px] [&_textarea]:text-[#f5f5f8] [&_textarea]:outline-0 [&_textarea]:text-sm [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#454551] [&_select]:bg-[#202128] [&_select]:p-[12px_13px] [&_select]:text-[#f5f5f8] [&_select]:outline-0 [&_select]:text-sm [&_textarea]:resize-y [&_textarea]:leading-normal [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] [&_textarea:focus]:border-[#a47aff] [&_textarea:focus]:shadow-[0_0_0_3px_#7646e323] [&_select:focus]:border-[#a47aff] [&_select:focus]:shadow-[0_0_0_3px_#7646e323] [&_small]:text-(--muted) [&_small]:text-xs'
                    }
                  >
                    <span className={'field-label text-[#f0eff5] font-[540]'}>Assign to</span>
                    <select
                      value={assignedAgent}
                      onChange={(event) => setAssignedAgent(event.target.value)}
                    >
                      <option>Priya Sharma</option>
                      <option>Ravi Kumar</option>
                      <option>Sharath</option>
                    </select>
                  </label>
                  <button
                    className={
                      'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                    }
                    disabled={working}
                    onClick={() => patch(active, 'assigned', { assignedAgent })}
                  >
                    {working ? 'Saving…' : 'Assign callback'} <ArrowRight size={17} />
                  </button>
                </div>
              )}
              {view === 'call-takeover' && (
                <div
                  className={
                    'owner-workspace-actions p-[19px_22px] border-t border-t-[#363846] [&_p]:text-[#c3c7d5] [&_p]:leading-[1.55] [&_p]:text-[13px] [&_.button]:w-full [&_.button]:mt-3.25'
                  }
                >
                  <p>
                    Accepting a waiting call connects the owner in the demo and pauses AI responses.
                  </p>
                  <button
                    className={
                      'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                    }
                    disabled={working}
                    onClick={() => patch(active, 'human', { assignedAgent: 'Sharath' })}
                  >
                    {working ? 'Connecting…' : 'Take over this call'} <ArrowRight size={17} />
                  </button>
                </div>
              )}
              {view === 'inbox' && (
                <div
                  className={
                    'owner-workspace-actions p-[19px_22px] border-t border-t-[#363846] [&_p]:text-[#c3c7d5] [&_p]:leading-[1.55] [&_p]:text-[13px] [&_.button]:w-full [&_.button]:mt-3.25'
                  }
                >
                  <Link
                    className={
                      'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                    }
                    href="/calls/takeover"
                    onClick={() => onSelect(active)}
                  >
                    Review & accept <ArrowRight size={17} />
                  </Link>
                </div>
              )}
              {view === 'live-calls' && (
                <div
                  className={
                    'owner-workspace-actions p-[19px_22px] border-t border-t-[#363846] [&_p]:text-[#c3c7d5] [&_p]:leading-[1.55] [&_p]:text-[13px] [&_.button]:w-full [&_.button]:mt-3.25'
                  }
                >
                  <p>
                    Listening and live media require a connected call provider. Ownership is shown
                    from the saved call state.
                  </p>
                  <Link
                    className={
                      'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                    }
                    href="/calls/takeover"
                    onClick={() => onSelect(active)}
                  >
                    Owner takeover <ArrowRight size={17} />
                  </Link>
                </div>
              )}
              {view === 'transfers' && active.status === 'transfer-pending' && (
                <div
                  className={
                    'owner-workspace-actions p-[19px_22px] border-t border-t-[#363846] [&_p]:text-[#c3c7d5] [&_p]:leading-[1.55] [&_p]:text-[13px] [&_.button]:w-full [&_.button]:mt-3.25'
                  }
                >
                  <Link
                    className={
                      'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                    }
                    href="/agent/accept-transfer"
                    onClick={() => onSelect(active)}
                  >
                    Review transfer <ArrowRight size={17} />
                  </Link>
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
