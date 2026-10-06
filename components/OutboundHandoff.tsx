'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Bell,
  CircleMinus,
  Clock3,
  Headphones,
  Info,
  Phone,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { apiFetch } from './api-client';

export default function OutboundHandoff({ records, selected, onSelect, onUpdate }) {
  const router = useRouter();
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState('');
  const calls = records.filter((row) => row.data?.source === 'campaign');
  const call =
    calls.find((row) => row._id === selected?._id && row.status === 'waiting') ||
    calls.find((row) => row.status === 'waiting') ||
    calls[0];
  async function decide(accept) {
    if (!call) return;
    setWorking(true);
    setMessage('');
    try {
      const response = await apiFetch(`/api/records/call/${call._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: accept ? 'human' : 'ended',
          data: {
            ...(accept
              ? { assignedAgent: 'Priya Sharma', aiPaused: true }
              : { outcome: 'Declined by receiving agent' }),
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'Unable to update the handoff');
      onSelect(data);
      await onUpdate();
      if (accept) router.push('/agent/live-call');
      else setMessage('You declined the handoff. The demo call was marked ended.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setWorking(false);
    }
  }
  return (
    <div
      className={
        'handoff-page grid grid-cols-[minmax(0,1fr)_minmax(445px,1.2fr)] gap-5 min-h-180 max-[1150px]:grid-cols-1'
      }
    >
      <div
        className={
          'handoff-inbox [&_h1]:text-[29px] [&_h1]:m-[0_0_5px] [&>p]:text-[#b7b8c8] [&>p]:m-[0_0_25px]'
        }
      >
        <h1>Inbox</h1>
        <p>Incoming calls, messages and handoff requests.</p>
        <div
          className={
            'handoff-tabs flex items-center gap-5 p-[10px_0_18px] border-b border-b-[#42424e] mb-3.5 [&_strong]:bg-[#693cde] [&_strong]:rounded-[7px] [&_strong]:p-[10px_13px] [&_strong_span]:bg-[#d64c73] [&_strong_span]:rounded-full [&_strong_span]:p-[3px_7px] [&>span]:text-[#bcbacc] [&>span]:text-sm'
          }
        >
          <strong>
            All <span>{calls.filter((row) => row.status === 'waiting').length}</span>
          </strong>
          <span>Voice handoffs</span>
          <span>Messages</span>
        </div>
        {calls.map((row) => (
          <button
            className={`handoff-inbox-item w-full flex items-center gap-3.25 text-left bg-[#1d1e26] border border-[#393944] text-[#f6f3fb] rounded-xl p-[17px_12px] m-[10px_0] [&.active]:border-[#8956fb] [&.active]:bg-[linear-gradient(100deg,#302747,#1f202b)] [&_span:nth-child(2)]:flex-1 [&_span:nth-child(2)]:min-w-0 [&_b]:block [&_small]:block [&_small]:text-xs [&_small]:text-[#b9b3ca] [&_small]:mt-1 [&_em]:text-[13px] [&_em]:text-[#ff7b92] [&_em]:not-italic${row._id === call?._id ? 'active' : ''}`}
            key={row._id}
            onClick={() => onSelect(row)}
          >
            <span
              className={
                'handoff-avatar w-12 h-12 grid place-items-center flex-none bg-[#7857cf] text-white rounded-full font-bold [&.large]:w-19 [&.large]:h-19 [&.large]:text-[25px]'
              }
            >
              {row.title
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')}
            </span>
            <span>
              <b>{row.title}</b>
              <small>Outbound campaign handoff</small>
              <small>{row.status === 'waiting' ? 'Waiting for you' : row.status}</small>
            </span>
            <em>{row.status === 'waiting' ? '● Live' : 'Completed'}</em>
          </button>
        ))}
        {!calls.length && (
          <div
            className={
              'handoff-empty text-center p-[75px_30px] text-[#c1b4d9] [&_strong]:block [&_strong]:text-white [&_strong]:m-[14px_0]'
            }
          >
            <Bell size={30} />
            <strong>No campaign handoffs yet</strong>
            <p>Run a scheduled demo campaign to simulate an AI request for a human.</p>
            <Link
              className={
                'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
              }
              href="/campaigns/monitoring"
            >
              Campaign monitoring <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
      {call && (
        <aside
          className={
            'handoff-popup border border-[#8951ec] bg-[linear-gradient(160deg,#24232c,#1a1c26)] rounded-[13px] shadow-[0_22px_55px_#0005] self-start overflow-hidden [&>header]:flex [&>header]:items-center [&>header]:gap-3.5 [&>header]:p-[24px_26px] [&>header]:border-b [&>header]:border-b-[#383746] [&>header>span]:text-[#a877fa] [&_header_div]:flex-1 [&_h2]:text-[19px] [&_h2]:m-[0_0_5px] [&_header_p]:m-0 [&_header_p]:text-[#c3bdcd]'
          }
        >
          <header>
            <span>
              <Sparkles size={31} />
            </span>
            <div>
              <h2>Outbound campaign handoff — Sales Concierge AI</h2>
              <p>September Renewal Outreach</p>
            </div>
            <Link href="/agent/inbox" aria-label="Close handoff">
              <X size={20} />
            </Link>
          </header>
          <div
            className={
              'handoff-person flex items-center gap-4.25 p-6.5 [&>div:nth-child(2)]:flex-1 [&_p]:m-[5px_0] [&_p]:text-[#c8c6d3] [&_p]:flex [&_p]:items-center [&_p]:gap-1.75 max-[750px]:flex-wrap'
            }
          >
            <span
              className={
                'handoff-avatar large w-12 h-12 grid place-items-center flex-none bg-[#7857cf] text-white rounded-full font-bold [&.large]:w-19 [&.large]:h-19 [&.large]:text-[25px]'
              }
            >
              {call.title
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')}
            </span>
            <div>
              <h2>{call.title}</h2>
              <p>{call.data?.phone || 'Phone number not supplied'}</p>
              <p>
                <Phone size={16} /> Live demo call · {call.data?.campaignId?.slice(-6) || 'VC-3091'}
              </p>
            </div>
            <div
              className={
                'handoff-timers text-right grid gap-1 [&_strong]:text-[#fb6687] [&_strong]:flex [&_strong]:items-center [&_strong]:gap-1.75 [&_strong]:justify-end [&_small]:text-[#aaa6b7] max-[750px]:text-left'
              }
            >
              <strong>
                <Clock3 size={19} /> 02:14
              </strong>
              <small>sample call timer</small>
              <strong>
                <Bell size={19} /> Waiting
              </strong>
              <small>for your response</small>
            </div>
          </div>
          <div
            className={
              'handoff-request p-[0_26px_16px] [&_p]:flex [&_p]:items-center [&_p]:gap-2.25 [&_p]:text-[15px] [&_p]:font-[650] [&_blockquote]:m-[9px_0_0_27px] [&_blockquote]:text-[#e7e3f1] [&_blockquote]:leading-normal'
            }
          >
            <p>
              <Headphones size={18} /> Caller request
            </p>
            <blockquote>
              “{call.data?.screen_14?.['Issue summary'] || 'I would like to speak with a person.'}”
            </blockquote>
          </div>
          <div
            className={
              'handoff-context [&_h3]:flex [&_h3]:items-center [&_h3]:gap-2.25 [&_h3]:text-[15px] [&_h3]:font-[650] m-[9px_25px] p-[15px_19px] border border-[#474452] rounded-[10px] bg-[#292a36] [&_h3]:m-[0_0_9px] [&_h3_svg]:text-[#b991ff] [&_p]:m-[7px_0] [&_p]:text-[#d5d2df] [&_p]:text-sm [&_p]:leading-normal'
            }
          >
            <h3>
              <Sparkles size={20} /> AI summary
            </h3>
            <p>
              {call.data?.aiSummary ||
                'The customer asked to speak with a human before making a decision.'}
            </p>
          </div>
          <div
            className={
              'handoff-context [&_h3]:flex [&_h3]:items-center [&_h3]:gap-2.25 [&_h3]:text-[15px] [&_h3]:font-[650] m-[9px_25px] p-[15px_19px] border border-[#474452] rounded-[10px] bg-[#292a36] [&_h3]:m-[0_0_9px] [&_h3_svg]:text-[#b991ff] [&_p]:m-[7px_0] [&_p]:text-[#d5d2df] [&_p]:text-sm [&_p]:leading-normal'
            }
          >
            <h3>
              <UserRound size={20} /> Contact details
            </h3>
            <p>Source: Outbound campaign · Sales</p>
            <p>{call.data?.phone || 'Phone unavailable in this demo'}</p>
          </div>
          {message && (
            <p
              className={
                'flow-alert flex gap-2.5 items-center bg-[#173b34] border border-[#296a55] text-[#81e4b8] p-[13px_16px] rounded-[9px] m-[15px_0] text-sm [&.problem]:bg-[#402630] [&.problem]:border-[#a44c68] [&.problem]:text-[#ffb5c1]'
              }
              role="status"
            >
              {message}
            </p>
          )}
          <div className={'handoff-actions flex gap-2.75 m-[18px_25px] [&_.button]:flex-1'}>
            <button
              className={
                'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
              }
              disabled={working || call.status !== 'waiting'}
              onClick={() => decide(true)}
            >
              <Phone size={19} /> Accept & join call
            </button>
            <button
              className={
                'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
              }
              disabled={working || call.status !== 'waiting'}
              onClick={() => decide(false)}
            >
              <CircleMinus size={19} /> Decline
            </button>
          </div>
          <p
            className={
              'handoff-footnote flex items-center gap-2 text-[#bcb6ce] text-[13px] m-[0_25px_23px]'
            }
          >
            <Info size={17} /> AI is simulated until you accept; no actual phone connection is
            established.
          </p>
        </aside>
      )}
    </div>
  );
}
