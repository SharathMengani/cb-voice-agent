'use client';
import Link from 'next/link';
import {
  ArrowRight,
  AudioLines,
  FileText,
  Headphones,
  Info,
  Phone,
  Repeat2,
  Sparkles,
} from 'lucide-react';
export default function TransferAccept({
  records,
  selected,
  feedback,
  working,
  onAccept,
  onSelect,
}) {
  const transfers = records.filter((row) => row.status === 'transfer-pending');
  const call = transfers.find((row) => row._id === selected?._id) || transfers[0];
  const nextAgent = call?.data?.screen_25?.['Transfer to agent'] || 'Receiving specialist';
  const note = call?.data?.screen_25?.['Reason for transfer'] || 'Support specialist needed.';
  const issue = call?.data?.screen_14?.['Issue summary'] || 'Customer support request.';
  return (
    <div
      className={
        'transfer-accept-page grid grid-cols-[minmax(0,1fr)_300px] gap-3.5 text-[#f9f7ff] max-w-375 m-auto max-[1050px]:grid-cols-1'
      }
    >
      <div
        className={
          'transfer-accept-main border border-[#3b3946] rounded-[10px] bg-[#1e1f27] p-4 [&_h1]:text-[25px] [&_h1]:m-0 [&>p]:text-[#b9baca] [&>p]:text-xs'
        }
      >
        <h1>Transfers</h1>
        <p>Manage incoming and outgoing call transfers.</p>
        <div
          className={
            'transfer-tabs flex border-b border-b-[#43424d] m-[15px_0] *:p-[12px_20px] *:text-[#c3c0ce] *:text-xs *:no-underline [&>strong]:bg-[#653ce9] [&>strong]:text-white [&>strong]:rounded-[7px_7px_0_0]'
          }
        >
          <strong>Incoming ({transfers.length})</strong>
          <Link href="/flow/25">Outgoing</Link>
          <Link href="/flow/27">Transfer history</Link>
        </div>
        {transfers.length > 1 && (
          <div
            className={
              'transfer-pick flex gap-2.25 flex-wrap [&_button]:bg-[#282334] [&_button]:text-white [&_button]:border [&_button]:border-[#73539e] [&_button]:rounded-md [&_button]:p-2 [&_button]:cursor-pointer'
            }
          >
            {transfers.map((row) => (
              <button key={row._id} onClick={() => onSelect(row)}>
                {row.title} · #{row._id.slice(-6)}
              </button>
            ))}
          </div>
        )}
        <div
          className={
            'transfer-accept-card bg-[linear-gradient(145deg,#242439,#1d1b29)] border border-[#8450ea] rounded-[11px] p-4 [&_header]:flex [&_header]:items-center [&_header]:gap-3 [&_header]:border-b [&_header]:border-b-[#4b3f64] [&_header]:pb-4.5 [&_header>div]:flex-1 [&_h2]:text-lg [&_h2]:m-0 [&_header_p]:text-[#c2c1d0] [&_header_p]:m-[3px_0] [&_header_p]:text-xs [&>p:last-child]:flex [&>p:last-child]:items-center [&>p:last-child]:gap-1.75 [&>p:last-child]:text-[#b3b4c3] [&>p:last-child]:text-[11px]'
          }
        >
          <header>
            <span
              className={
                'heading-icon bg-[#362452] text-[#bf9aff] rounded-lg w-10.5 h-10.5 grid place-items-center flex-none'
              }
            >
              <Repeat2 size={21} />
            </span>
            <div>
              <h2>
                {call ? 'An agent is transferring a live call to you' : 'No incoming transfer'}
              </h2>
              <p>Accepting moves the demo call into your My Calls.</p>
            </div>
            <span
              className={
                'transfer-countdown text-[#d2b7ff] border border-[#8b5bea] rounded-[7px] p-2 text-[11px]'
              }
            >
              Pending
            </span>
          </header>
          <div
            className={
              'transfer-people flex items-center gap-3 p-[20px_12px] bg-[#24253b] border border-[#454157] rounded-[9px] mt-3.5 [&>div]:flex-1 [&_small]:block [&_strong]:block [&_small]:text-[#b3b2c4] [&_small]:text-[11px] [&_strong]:text-[13px] [&>svg]:text-[#c1a3ff] max-[650px]:flex-wrap'
            }
          >
            <span
              className={
                'mini-avatar grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
              }
            >
              PS
            </span>
            <div>
              <small>From · current owner</small>
              <strong>Priya Sharma</strong>
            </div>
            <ArrowRight size={25} />
            <span
              className={
                'mini-avatar grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
              }
            >
              {nextAgent
                .split(' ')
                .map((s) => s[0])
                .join('')}
            </span>
            <div>
              <small>To · receiving agent</small>
              <strong>{nextAgent}</strong>
            </div>
          </div>
          <div
            className={
              'transfer-customer flex items-center gap-3 border border-[#484452] rounded-lg mt-3 p-3 [&_h3]:text-base [&_h3]:m-0 [&_p]:text-[#b3b4c3] [&_p]:text-[11px] [&_p]:m-[5px_0] [&_small]:text-[#49dcac] [&_small]:text-[10px]'
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
              <h3>{call?.title || 'No caller selected'}</h3>
              <p>#{call?._id?.slice(-6).toUpperCase() || '—'} · Website voice call</p>
              <small>● Waiting for receiving agent</small>
            </div>
          </div>
          <div
            className={
              'transfer-notes flex items-center gap-3 items-stretch m-[12px_0] [&>div]:w-[50%] [&>div]:border [&>div]:border-[#454457] [&>div]:rounded-lg [&>div]:p-3.25 [&_h3]:text-[13px] [&_h3]:flex [&_h3]:gap-2 [&_h3]:items-center [&_h3_svg]:text-[#b67dff] [&_p]:text-xs [&_p]:leading-normal [&_p]:text-[#c3c3d3] max-[650px]:flex-col max-[650px]:[&>div]:w-full'
            }
          >
            <div>
              <h3>
                <Sparkles size={17} /> AI + human handoff summary
              </h3>
              <p>{issue}</p>
            </div>
            <div>
              <h3>
                <FileText size={17} /> Internal note
              </h3>
              <p>{note}</p>
            </div>
          </div>
          {feedback && (
            <p className={'live-feedback text-[#b3ffda] text-xs p-[0_15px]'} role="status">
              {feedback}
            </p>
          )}
          <div
            className={
              'transfer-accept-actions flex items-center gap-3 justify-center [&_.button]:min-w-40 [&_.button]:justify-center'
            }
          >
            <button
              className={
                'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
              }
              onClick={onAccept}
              disabled={working || !call}
            >
              <Phone size={17} /> {working ? 'Accepting…' : 'Accept transfer'}
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
          <p>
            <Info size={15} /> AI stays paused during this human-to-human handoff.
          </p>
        </div>
      </div>
      <aside
        className={
          'transfer-accept-aside [&>section]:border [&>section]:border-[#3b3946] [&>section]:rounded-[10px] [&>section]:bg-[#1e1f27] [&>section]:p-4 [&_section]:mb-3 [&_h2]:text-base [&_h2]:flex [&_h2]:gap-1.5 [&_h2]:items-center [&_p]:text-xs [&_p]:text-[#c3c3d0] [&_p]:leading-[1.6] [&_.detail-line]:text-[11px] max-[1050px]:grid max-[1050px]:grid-cols-[1fr_1fr] max-[1050px]:gap-2.5 max-[650px]:grid-cols-1'
        }
      >
        <section>
          <h2>Call context</h2>
          {[
            ['Customer', call?.title],
            ['Conversation ID', call?._id?.slice(-6).toUpperCase()],
            ['AI voice agent', 'Website Support'],
            ['Department', call?.data?.screen_14?.Department || 'Technical Support'],
            ['Issue', issue],
          ].map(([key, value]) => (
            <div
              className={
                'detail-line flex justify-between gap-4 p-[12px_0] border-t border-t-[#42414a] text-xs [&_span]:text-[#b6b7c6] [&_strong]:max-w-[60%] [&_strong]:font-medium [&_strong]:text-right'
              }
              key={key}
            >
              <span>{key}</span>
              <strong>{value || '—'}</strong>
            </div>
          ))}
        </section>
        <section>
          <h2>
            <Sparkles size={17} /> AI summary
          </h2>
          <p>{issue} The customer requested further help from your team.</p>
        </section>
      </aside>
    </div>
  );
}
