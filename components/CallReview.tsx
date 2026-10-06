'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Headphones, Info, Mic, Phone, Sparkles } from 'lucide-react';
import { apiFetch } from './api-client';

export default function CallReview({ records, selected, onSelect, onUpdate }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [micReady, setMicReady] = useState(false);
  const queue = records.filter((row) => row.status === 'waiting');
  const call = queue.find((row) => row._id === selected?._id) || queue[0];
  const issue =
    call?.data?.screen_14?.['Issue summary'] || 'Customer asked for a human specialist.';
  async function accept() {
    if (!call) return setMessage('No waiting request is selected.');
    setBusy(true);
    try {
      const response = await apiFetch(`/api/records/call/${call._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'human', data: { assignedAgent: 'Priya Sharma' } }),
      });
      const value = await response.json();
      if (!response.ok) throw Error(value.error);
      localStorage.setItem('chatbucket:call', call._id);
      await onUpdate();
      router.push('/flow/24');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }
  async function checkMic() {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      media.getTracks().forEach((track) => track.stop());
      setMicReady(true);
    } catch {
      setMessage('Microphone permission was denied. You can still review the call in this demo.');
    }
  }
  return (
    <div className={'review-call-page text-[#faf9ff] max-w-377.5 m-auto'}>
      <div
        className={
          'review-call-heading [&_h1]:m-0 [&_h1]:text-[28px] [&_p]:text-[#aeb3c2] [&_p]:m-[4px_0_18px]'
        }
      >
        <h1>Inbox</h1>
        <p>Manage incoming customer requests from your website.</p>
        <div
          className={
            'inbox-channels flex items-center gap-0 border-b border-b-[#363541] mb-4.25 *:p-[14px_24px] *:inline-flex *:gap-2.5 *:items-center *:text-[#a7a9b9] [&_strong]:bg-[#49317c] [&_strong]:text-white [&_strong]:rounded-[8px_8px_0_0] [&_strong]:border-b-[2px_solid_#a07bff] [&_b]:bg-[#6652b7] [&_b]:p-[2px_8px] [&_b]:rounded-[15px] mb-4'
          }
        >
          <strong>
            <Phone size={15} /> Voice requests &nbsp;{queue.length}
          </strong>
          <span>◌ Chat requests</span>
        </div>
      </div>
      <div
        className={
          'review-call-columns grid grid-cols-[.8fr_1.4fr_.9fr] gap-2 min-h-137.5 max-[1100px]:grid-cols-[1fr_1.5fr] max-[700px]:grid-cols-1'
        }
      >
        <aside
          className={
            'review-call-queue border border-[#3f3c4b] rounded-[10px] bg-[#1d1e25] p-3.5 min-w-0 [&_h2]:text-[17px] [&_h2]:m-[0_0_15px] [&>button]:flex [&>button]:items-center [&>button]:gap-2 [&>button]:w-full [&>button]:text-left [&>button]:p-[11px_8px] [&>button]:border [&>button]:border-[#393943] [&>button]:rounded-lg [&>button]:text-white [&>button]:bg-[#24242c] [&>button]:mb-2.25 [&>button]:cursor-pointer [&>button.selected]:bg-[#35254e] [&>button.selected]:border-[#965df0] [&>button>span:nth-child(2)]:flex-1 [&>button>span:nth-child(2)]:min-w-0 [&_strong]:block [&_small]:block [&_small]:text-[10px] [&_small]:text-[#afb4c8] [&_small]:mt-1.25 [&_em]:text-[10px] [&_em]:text-[#f86987] [&_em]:not-italic'
          }
        >
          <h2>Voice requests</h2>
          {queue.map((row) => (
            <button
              key={row._id}
              className={row._id === call?._id ? 'selected' : ''}
              onClick={() => onSelect(row)}
            >
              <span
                className={
                  'mini-avatar grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
                }
              >
                {row.title
                  .split(' ')
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join('')}
              </span>
              <span>
                <strong>{row.title}</strong>
                <small>Website voice call · #{row._id.slice(-6).toUpperCase()}</small>
                <small>{row.data?.screen_14?.Department || 'Technical Support'}</small>
              </span>
              <em>Waiting</em>
            </button>
          ))}
          {!queue.length && (
            <p className={'muted text-(--muted) m-0 leading-normal'}>No human requests waiting.</p>
          )}
        </aside>
        <div
          className={
            'review-call-center border border-[#3f3c4b] rounded-[10px] bg-[#1d1e25] p-3.5 min-w-0'
          }
        >
          <div
            className={
              'review-call-center-title flex items-center gap-2.25 border-b border-b-[#42404c] pb-3.25 [&_a]:text-white [&_a]:border [&_a]:border-[#4c4a54] [&_a]:rounded-[7px] [&_a]:p-1.5 [&_a]:grid [&_a]:place-items-center [&_div]:flex-1 [&_h2]:m-0 [&_h2]:text-lg [&_p]:text-[#b4b7c6] [&_p]:text-[11px] [&_p]:m-[3px_0] [&>span]:text-[10px] [&>span]:text-[#ff6888] max-[700px]:[&>span]:hidden'
            }
          >
            <Link href="/flow/21">
              <ArrowLeft size={17} />
            </Link>
            <div>
              <h2>AI to human handoff</h2>
              <p>Review the conversation before connecting.</p>
            </div>
            <span>● Waiting for human</span>
          </div>
          <div
            className={
              'review-call-main flex gap-3.25 items-center p-[17px_0] [&_h2]:text-lg [&_h2]:m-0 [&_p]:text-[11px] [&_p]:text-[#b6b4c6]'
            }
          >
            <span
              className={
                'mini-avatar large grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
              }
            >
              {call?.title
                ?.split(' ')
                .map((s) => s[0])
                .slice(0, 2)
                .join('') || '—'}
            </span>
            <div>
              <h2>{call?.title || 'No caller selected'}</h2>
              <p>
                #{call?._id?.slice(-6).toUpperCase() || '—'} · Website voice call ·{' '}
                {call?.data?.screen_14?.Department || 'Technical Support'}
              </p>
            </div>
          </div>
          <section
            className={
              'review-call-summary border border-[#484551] rounded-[9px] p-3.25 mb-2.5 [&_h3]:text-sm [&_h3]:m-[0_0_10px] [&_h3]:flex [&_h3]:gap-2.25 [&_h3]:items-center [&_h3_svg]:text-[#b478ff] [&_p]:text-[#ced0d9] [&_p]:text-xs [&_p]:leading-normal [&_p]:m-[8px_0]'
            }
          >
            <h3>
              <Sparkles size={18} /> AI summary
            </h3>
            <p>• {issue}</p>
            <p>• The AI has passed the request to your team for help.</p>
            <p>• AI stops speaking after you accept.</p>
          </section>
          <section
            className={
              'review-call-transcript border border-[#484551] rounded-[9px] p-3.25 mb-2.5 [&_h3]:text-sm [&_h3]:m-[0_0_10px] [&_h3]:flex [&_h3]:gap-2.25 [&_h3]:items-center [&>div]:flex [&>div]:gap-2.25 [&>div]:items-start [&>div]:m-[10px_0] [&>div_p]:text-[11px] [&>div_p]:bg-[#283443] [&>div_p]:border [&>div_p]:border-[#3d4c5b] [&>div_p]:rounded-[9px] [&>div_p]:p-2.5 [&>div_p]:m-0 [&>div_p]:leading-normal'
            }
          >
            <h3>Prior spoken conversation</h3>
            {(call?.data?.transcript || []).map((line, i) => (
              <div key={i}>
                <span
                  className={
                    'mini-avatar grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
                  }
                >
                  {line.speaker === 'AI' ? 'AI' : 'C'}
                </span>
                <p>
                  <strong>{line.speaker}</strong>
                  <br />
                  {line.text}
                </p>
              </div>
            ))}
            {!call?.data?.transcript?.length && (
              <p className={'muted text-(--muted) m-0 leading-normal'}>No transcript events yet.</p>
            )}
          </section>
        </div>
        <aside
          className={
            'review-call-details border border-[#3f3c4b] rounded-[10px] bg-[#1d1e25] p-3.5 min-w-0 [&_h2]:text-[17px] [&_h2]:m-[0_0_15px] [&_.detail-line]:text-[11px] max-[1100px]:col-span-full max-[700px]:col-auto'
          }
        >
          <h2>Call details</h2>
          {[
            ['Customer', call?.title],
            ['Conversation ID', call?._id?.slice(-6).toUpperCase()],
            ['Source', call?.data?.source === 'phone' ? 'Inbound phone' : 'Website voice'],
            ['Department', call?.data?.screen_14?.Department || 'Technical Support'],
            ['AI voice agent', 'Website Support'],
            ['Issue', issue],
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
          <div
            className={
              'review-microphone border border-[#474650] rounded-[9px] p-3 mt-5 [&_h3]:flex [&_h3]:items-center [&_h3]:gap-2 [&_h3]:text-[13px] [&_button]:p-2.25 [&_button]:bg-[#272733] [&_button]:border [&_button]:border-[#514a62] [&_button]:text-[#e4dbee] [&_button]:rounded-[7px] [&_button]:cursor-pointer [&_small]:block [&_small]:text-[#b3b4c3] [&_small]:mt-2.5'
            }
          >
            <h3>
              <Mic size={18} /> Your microphone
            </h3>
            <button onClick={checkMic}>
              {micReady ? '● Microphone ready' : 'Check microphone permission'}
            </button>
            <small>Browser permission check for the demo.</small>
          </div>
        </aside>
      </div>
      <div
        className={
          'review-call-actions border border-[#3e3c4b] rounded-[9px] bg-[#25242c] mt-2.25 p-2.75 flex items-center gap-3 [&>svg]:text-[#9a71f5] [&_p]:flex-1 [&_p]:text-[#c5c6d3] [&_p]:text-xs [&>span]:text-[11px] [&>span]:text-[#ffaeaa] [&_.button]:whitespace-nowrap max-[700px]:flex-wrap'
        }
      >
        <Info size={22} />
        <p>You're not connected yet. AI stays with the caller until you accept.</p>
        {message && <span role="status">{message}</span>}
        <button
          className={
            'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
          }
          disabled={busy || !call}
          onClick={accept}
        >
          <Phone size={18} /> Accept & connect
        </button>
        <Link
          className={
            'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
          }
          href="/flow/21"
        >
          Decline
        </Link>
      </div>
    </div>
  );
}
