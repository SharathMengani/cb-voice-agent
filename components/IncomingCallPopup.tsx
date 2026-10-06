'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AudioLines,
  ArrowRight,
  CircleMinus,
  Clock3,
  Headphones,
  Phone,
  Sparkles,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiFetch } from './api-client';

export default function IncomingCallPopup({ records, selected, onUpdate }) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(120);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const waiting =
    records.find((row) => row._id === selected?._id && row.status === 'waiting') ||
    records.find((row) => row.status === 'waiting');
  useEffect(() => {
    const timer = setInterval(() => setSeconds((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(timer);
  }, []);
  async function accept() {
    if (!waiting) return setFeedback('No waiting call is available.');
    setBusy(true);
    try {
      const response = await apiFetch(`/api/records/call/${waiting._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'human', data: { assignedAgent: 'Priya Sharma' } }),
      });
      const value = await response.json();
      if (!response.ok) throw Error(value.error);
      localStorage.setItem('chatbucket:call', waiting._id);
      await onUpdate();
      router.push('/flow/24');
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      className={'popup-background min-h-[calc(100vh-120px)] relative text-[#f5f3ff] flex gap-3.75'}
    >
      <div
        className={
          'popup-calls w-[36%] min-w-62.5 [&_h1]:m-[5px_0] [&_h1]:text-[29px] [&>p]:text-[13px] [&>p]:text-[#afb2c2] [&_.live-tabs]:m-[22px_0] [&_.live-tabs>span]:text-xs [&_.live-tabs>span]:grid [&_.live-tabs>span]:place-items-center [&_.live-tabs>span]:text-[#b7b3c6] [&_.live-tabs>span]:flex-1 max-[900px]:hidden'
        }
      >
        <h1>My Calls</h1>
        <p>Handle your active and assigned calls.</p>
        <div
          className={
            'live-tabs flex border border-[#343640] rounded-lg overflow-hidden mb-3.25 *:w-[50%] *:p-2.5 *:text-center *:no-underline *:text-[#b6b7ca] *:text-[13px] [&_strong]:bg-[#663ff1] [&_strong]:text-white [&_small]:text-[10px] [&_small]:bg-[#8463ec] [&_small]:rounded-[10px] [&_small]:p-[2px_5px]'
          }
        >
          <strong>
            Active calls <small>{records.filter((r) => r.status === 'human').length}</small>
          </strong>
          <span>Completed calls</span>
        </div>
        {records
          .filter((r) => r.status === 'human')
          .map((item) => (
            <div
              className={
                'popup-call-row flex items-center gap-2.5 p-3.5 border border-[#393840] rounded-lg m-[9px_0] [&_div]:flex-1 [&_strong]:block [&_small]:block [&_small]:text-[#aeb1c1] [&_small]:text-[10px] [&_i]:text-[10px] [&_i]:text-[#35d49d] [&_i]:not-italic'
              }
              key={item._id}
            >
              <span
                className={
                  'mini-avatar grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
                }
              >
                {item.title[0]}
              </span>
              <div>
                <strong>{item.title}</strong>
                <small>#{item._id.slice(-6).toUpperCase()} · Website voice call</small>
              </div>
              <i>● Live</i>
            </div>
          ))}
      </div>
      <div
        className={
          'incoming-popup relative w-[min(680px,65%)] h-max bg-[linear-gradient(150deg,#24232d,#1e1e25)] border border-[#9d58ec] rounded-[13px] p-[24px_27px] shadow-[0_20px_90px_#0d0b14] [&_header]:flex [&_header]:items-center [&_header]:gap-3 [&_header]:border-b [&_header]:border-b-[#403d49] [&_header]:pb-4.25 [&_header_svg]:text-[#aa6fff] [&_header_div]:flex-1 [&_header_strong]:text-[21px] [&_header_p]:text-[#b5b5c7] [&_header_p]:m-[3px_0] [&_header_p]:text-[13px] [&_header>a]:text-white max-[900px]:w-full'
        }
        role="dialog"
        aria-label="Incoming call from AI Voice Agent"
      >
        <header>
          <span
            className={
              'mini-avatar grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
            }
          >
            AI
          </span>
          <AudioLines size={25} />
          <div>
            <strong>Incoming from AI Voice Agent</strong>
            <p>Handoff to human agent</p>
          </div>
          <Link href="/flow/21" aria-label="Close popup">
            <X size={23} />
          </Link>
        </header>
        <div
          className={
            'popup-caller flex gap-5 items-center p-[24px_0] [&>div]:flex-1 [&>div]:min-w-0 [&_h2]:m-[0_0_6px] [&_p]:text-[#c2c1cd] [&_p]:text-[13px] [&_small]:text-[#b8bdd0] [&_small]:text-[11px] [&_small_svg]:align-middle max-[900px]:gap-2.25'
          }
        >
          <span
            className={
              'incoming-orb w-23.5 h-23.5 shrink-0 rounded-full bg-[linear-gradient(145deg,#9f6fff,#5c35ef)] border-[10px_solid_#332a51] grid place-items-center text-[27px] font-bold max-[900px]:w-16.25 max-[900px]:h-16.25 max-[900px]:text-lg'
            }
          >
            {waiting?.title
              ?.split(' ')
              .map((s) => s[0])
              .slice(0, 2)
              .join('') || '—'}
          </span>
          <div>
            <h2>{waiting?.title || 'No waiting request'}</h2>
            <p>#{waiting?._id?.slice(-6).toUpperCase() || '—'} · Website voice call</p>
            <small>
              <Headphones size={14} /> {waiting?.data?.screen_14?.Department || 'Technical Support'}{' '}
              &nbsp;·&nbsp; English (India)
            </small>
          </div>
          <span
            className={
              'popup-timer flex items-center gap-1.75 text-[#ff658a] text-xl whitespace-nowrap [&_small]:block [&_small]:text-[10px] [&_small]:text-[#b5aec5]'
            }
          >
            <Clock3 size={15} /> {String(Math.floor(seconds / 60)).padStart(2, '0')}:
            {String(seconds % 60).padStart(2, '0')} <small>demo timer</small>
          </span>
        </div>
        <div className={'popup-issue text-[13px] [&_strong]:text-[#b7b7c8] [&_p]:m-[6px_0_18px]'}>
          <strong>Issue</strong>
          <p>{waiting?.data?.screen_14?.['Issue summary'] || 'Human assistance requested.'}</p>
        </div>
        <div
          className={
            'popup-ai-summary flex gap-3.25 items-start p-[17px_14px] border border-[#4a4757] rounded-[9px] bg-[#292a35] [&_svg]:text-[#aa6fff] [&_svg]:shrink-0 [&_strong]:text-sm [&_p]:text-[13px] [&_p]:text-[#babccc] [&_p]:leading-normal [&_p]:m-[7px_0_0]'
          }
        >
          <Sparkles size={20} />
          <div>
            <strong>AI summary</strong>
            <p>
              Website Support AI has gathered the customer's request and notified your team. Review
              the details before accepting.
            </p>
          </div>
        </div>
        {feedback && (
          <p role="status" className={'live-feedback text-[#b3ffda] text-xs p-[0_15px]'}>
            {feedback}
          </p>
        )}
        <div
          className={
            'popup-actions flex gap-3 m-[16px_0_20px] *:flex-1 *:flex *:gap-2 *:justify-center *:items-center *:border *:border-[#9167ed] *:rounded-[9px] *:no-underline *:text-[15px] *:p-3.75 *:text-white *:bg-none *:cursor-pointer [&_button]:border-0 [&_button]:bg-[linear-gradient(90deg,#6b3bea,#6139ef)] [&_button:disabled]:opacity-[.6] [&_button:disabled]:cursor-not-allowed'
          }
        >
          <button onClick={accept} disabled={busy || !waiting}>
            <Phone size={18} /> {busy ? 'Joining…' : 'Accept call'}
          </button>
          <Link href="/flow/21">
            <CircleMinus size={18} /> Decline
          </Link>
        </div>
        <Link
          href="/flow/23"
          className={
            'popup-review text-[#b882ff] flex items-center justify-center gap-2 no-underline text-[13px]'
          }
        >
          Review details <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
