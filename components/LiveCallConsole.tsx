'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  AudioLines,
  FileText,
  Headphones,
  Mic,
  MicOff,
  Pause,
  Phone,
  PhoneOff,
  Repeat2,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiFetch } from './api-client';

export default function LiveCallConsole({
  records,
  selected,
  onSelect,
  onUpdate,
  rightPanel = null,
}) {
  const router = useRouter();
  const active = records.filter((r) =>
    ['human', 'transfer-pending', 'follow-up'].includes(r.status),
  );
  const call = active.find((r) => r._id === selected?._id) || active[0];
  const [muted, setMuted] = useState(false);
  const [held, setHeld] = useState(false);
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const issue = call?.data?.screen_14?.['Issue summary'] || 'Customer needs support.';
  async function patch(data, status = '') {
    if (!call) return setFeedback('Select an active call first.');
    setBusy(true);
    try {
      const result = await apiFetch(`/api/records/call/${call._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, ...(status ? { status } : {}) }),
      });
      const value = await result.json();
      if (!result.ok) throw Error(value.error);
      await onUpdate();
      setFeedback(status === 'ended' ? 'Call ended. Add its outcome next.' : 'Private note saved.');
      if (status === 'ended') router.push('/flow/27');
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      className={
        'live-console h-[calc(100vh-130px)] min-h-175 grid grid-cols-[280px_minmax(380px,1fr)_305px] gap-2.5 text-[#f9f7ff] [&>aside]:border [&>aside]:border-[#3a3944] [&>aside]:rounded-[10px] [&>aside]:bg-[#1d1d23] [&>aside]:min-w-0 max-[1200px]:grid-cols-[240px_minmax(340px,1fr)] max-[1200px]:h-auto max-[790px]:grid-cols-1'
      }
    >
      <aside
        className={
          'live-call-list p-4 [&_h1]:text-[23px] [&_h1]:tracking-[-.03em] [&_h1]:m-[0_0_5px] [&>p]:text-[#a9aebe] [&>p]:text-[13px] [&>p]:m-[0_0_17px]'
        }
      >
        <h1>My Calls</h1>
        <p>Manage your active and recent calls.</p>
        <div
          className={
            'live-tabs flex border border-[#343640] rounded-lg overflow-hidden mb-3.25 *:w-[50%] *:p-2.5 *:text-center *:no-underline *:text-[#b6b7ca] *:text-[13px] [&_strong]:bg-[#663ff1] [&_strong]:text-white [&_small]:text-[10px] [&_small]:bg-[#8463ec] [&_small]:rounded-[10px] [&_small]:p-[2px_5px]'
          }
        >
          <strong>
            Active <small>{active.length}</small>
          </strong>
          <Link href="/flow/27">Recent</Link>
        </div>
        {active.map((row) => (
          <button
            className={`live-list-item flex relative text-left w-full border border-[#514961] rounded-lg bg-[#2b223c] text-white p-[12px_10px] gap-2 cursor-pointer mb-2 [&.chosen]:border-[#a067ff] [&>span:nth-child(2)]:min-w-0 [&_strong]:block [&_small]:block [&_em]:block [&_strong]:text-[13px] [&_small]:text-[10px] [&_small]:text-[#bcb8c8] [&_small]:leading-normal [&_em]:text-[10px] [&_em]:text-[#aeb0c0] [&_em]:not-italic [&_em]:pt-2 [&_i]:ml-auto [&_i]:text-[10px] [&_i]:text-[#4ed4a3] [&_i]:not-italic [&_i]:whitespace-nowrap${call?._id === row._id ? 'chosen' : ''}`}
            key={row._id}
            onClick={() => onSelect(row)}
          >
            <span
              className={
                'mini-avatar grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
              }
            >
              {row.title
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </span>
            <span>
              <strong>{row.title}</strong>
              <small>
                #{row._id.slice(-6).toUpperCase()} ·{' '}
                {row.data?.source === 'phone' ? 'Phone' : 'Website'} voice call
              </small>
              <em>Technical Support</em>
            </span>
            <i>● Live</i>
          </button>
        ))}
        {!active.length && (
          <p className={'muted text-(--muted) m-0 leading-normal'}>
            No active calls. Accept a request from your inbox to begin.
          </p>
        )}
      </aside>
      <section
        className={
          'live-stage border border-[#3a3944] rounded-[10px] bg-[#1d1d23] min-w-0 flex flex-col [&_header]:flex [&_header]:gap-3.5 [&_header]:items-center [&_header]:p-4.5 [&_header]:border-b [&_header]:border-b-[#34343d] [&_header>div]:min-w-0 [&_header>div]:flex-1 [&_header_h2]:text-xl [&_header_h2]:m-0 [&_header_p]:text-[11px] [&_header_p]:text-[#b9b7c9] [&_header_p]:m-[3px_0_8px] [&_header>div>span]:text-[11px] [&_header>div>span]:text-[#ccd0da] [&_header>div>span]:border [&_header>div>span]:border-[#393b47] [&_header>div>span]:p-[4px_7px] [&_header>div>span]:rounded-full'
        }
      >
        <header>
          <span
            className={
              'mini-avatar large grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
            }
          >
            {call?.title
              ?.split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('') || '—'}
          </span>
          <div>
            <h2>{call?.title || 'No live call'}</h2>
            <p>
              #{call?._id?.slice(-6).toUpperCase() || '—'} · Website voice call · Technical Support
            </p>
            <span>◉ English (India) &nbsp;·&nbsp; Website Support (AI)</span>
          </div>
          <strong
            className={
              'connected-badge text-[11px] text-[#52d6a6] border border-[#1c8564] rounded-full p-[6px_8px]'
            }
          >
            ● {call?.status === 'human' ? 'Connected' : 'Waiting'}
          </strong>
        </header>
        <div
          className={
            'live-stage-center flex flex-1 min-h-52.5 flex-col items-center justify-center [&_h2]:m-[25px_0_0] [&_p]:text-[#b3b5c7] [&_p]:text-[13px]'
          }
        >
          <div className={'live-wave flex items-center gap-4.5 text-[#9c6cfc]'}>
            <AudioLines size={30} />
            <span
              className={
                'live-orb grid place-items-center w-31.25 h-31.25 border-[10px_solid_#332756] rounded-full bg-[linear-gradient(140deg,#7d55ff,#5635e6)] shadow-[0_0_0_12px_#242039,0_0_0_23px_#211d30] text-white text-3xl font-bold'
              }
            >
              {call?.title
                ?.split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('') || '—'}
            </span>
            <AudioLines size={30} />
          </div>
          <h2>{call?.title || 'Customer'}</h2>
          <p>
            {held
              ? 'Demo call on hold'
              : muted
                ? 'Demo microphone muted'
                : 'Human conversation · demo call'}
          </p>
        </div>
        <div
          className={
            'live-controls flex items-center justify-center gap-4.25 m-[0_12px_35px] [&>button]:bg-none [&>button]:border-0 [&>button]:text-[#f4f2fa] [&>button]:[font:inherit] [&>button]:text-xs [&>button]:text-center [&>button]:cursor-pointer [&>button]:no-underline [&>button]:min-w-14.5 [&>a]:bg-none [&>a]:border-0 [&>a]:text-[#f4f2fa] [&>a]:[font:inherit] [&>a]:text-xs [&>a]:text-center [&>a]:cursor-pointer [&>a]:no-underline [&>a]:min-w-14.5 [&_span]:w-14 [&_span]:h-14 [&_span]:border [&_span]:border-[#4a4b57] [&_span]:rounded-full [&_span]:grid [&_span]:place-items-center [&_span]:m-[0_auto_8px] [&_.hangup_span]:bg-[#fc3168] [&_.hangup_span]:border-0 max-[790px]:gap-1 max-[790px]:[&_span]:w-11.25 max-[790px]:[&_span]:h-11.25'
          }
        >
          <button onClick={() => setMuted(!muted)}>
            <span>{muted ? <MicOff /> : <Mic />}</span>
            {muted ? 'Unmute' : 'Mute'}
          </button>
          <button onClick={() => setHeld(!held)}>
            <span>
              <Pause />
            </span>
            {held ? 'Resume' : 'Hold'}
          </button>
          <Link href="/flow/25">
            <span>
              <Repeat2 />
            </span>
            Transfer
          </Link>
          <button onClick={() => document.getElementById('call-private-note')?.focus()}>
            <span>
              <FileText />
            </span>
            Add note
          </button>
          <button
            className={'hangup'}
            disabled={busy || !call}
            onClick={() => patch({ screen_24: { 'Private team note': note } }, 'ended')}
          >
            <span>
              <PhoneOff />
            </span>
            End call
          </button>
        </div>
        <div
          className={
            'ai-silent flex gap-3 items-center p-3.5 border border-[#41404f] rounded-lg m-[0_15px_15px] bg-[#292732] [&>div]:flex-1 [&_strong]:text-[13px] [&_p]:text-[11px] [&_p]:text-[#b3b6c5] [&_p]:m-[4px_0_0]'
          }
        >
          <span
            className={
              'mini-avatar grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
            }
          >
            AI
          </span>
          <div>
            <strong>AI Voice Agent · Website Support</strong>
            <p>Silent. Human agent is handling this demo call.</p>
          </div>
          <MicOff size={18} />
        </div>
        {feedback && (
          <p className={'live-feedback text-[#b3ffda] text-xs p-[0_15px]'} role="status">
            {feedback}
          </p>
        )}
      </section>
      {rightPanel || (
        <aside
          className={
            'live-context p-4 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2 [&_h2]:text-[17px] [&_h2]:m-[0_0_13px] [&_h2_svg]:text-[#b477ff] [&_h3]:text-sm [&_h3]:border-t [&_h3]:border-t-[#393943] [&_h3]:pt-3.25 [&_.detail-line]:text-[11px] [&_.detail-line]:p-[8px_0] max-[1200px]:col-span-full max-[790px]:col-auto'
          }
        >
          <h2>
            <Sparkles size={19} /> AI summary
          </h2>
          <p
            className={
              'context-summary border border-[#43424e] p-3 rounded-lg text-[#dbd9e8] leading-normal text-xs'
            }
          >
            {issue} The AI passed this summary to your team before the handoff.
          </p>
          <h3>Key details</h3>
          {[
            ['Customer', call?.title],
            ['Conversation ID', call?._id?.slice(-6).toUpperCase()],
            ['AI voice agent', 'Website Support'],
            ['Department', call?.data?.screen_14?.Department || 'Technical Support'],
            ['Issue', issue],
            ['Language', 'English (India)'],
          ].map(([label, value]) => (
            <div
              className={
                'detail-line flex justify-between gap-4 p-[12px_0] border-t border-t-[#42414a] text-xs [&_span]:text-[#b6b7c6] [&_strong]:max-w-[60%] [&_strong]:font-medium [&_strong]:text-right'
              }
              key={label}
            >
              <span>{label}</span>
              <strong>{value || '—'}</strong>
            </div>
          ))}
          <h3>Transcript events</h3>
          <div
            className={
              'context-transcript max-h-33.75 overflow-y-auto text-[11px] text-[#bec0ce] [&_b]:text-[#bc97ff]'
            }
          >
            {(call?.data?.transcript || []).map((event, i) => (
              <p key={i}>
                <b>{event.speaker}</b> {event.text}
              </p>
            ))}
          </div>
          <label
            className={
              'context-note block text-xs mt-3 [&_textarea]:block [&_textarea]:w-full [&_textarea]:min-h-13.75 [&_textarea]:bg-[#24242c] [&_textarea]:border [&_textarea]:border-[#555362] [&_textarea]:text-white [&_textarea]:rounded-[7px] [&_textarea]:p-2.25 [&_textarea]:[font:inherit] [&_textarea]:mt-1.75'
            }
          >
            Internal note
            <textarea
              id="call-private-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a private note about this call…"
            />
          </label>
          <button
            className={
              'context-save bg-[#6745e5] border-0 rounded-[7px] text-white p-[9px_12px] mt-2 cursor-pointer'
            }
            disabled={busy || !call}
            onClick={() => patch({ screen_24: { 'Private team note': note } })}
          >
            Save note
          </button>
        </aside>
      )}
    </div>
  );
}
