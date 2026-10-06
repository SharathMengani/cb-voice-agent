'use client';
import Link from 'next/link';
import {
  AudioLines,
  ChevronRight,
  CircleAlert,
  Headphones,
  Info,
  Phone,
  Search,
  Sparkles,
  UserRound,
} from 'lucide-react';

export default function AgentInbox({ records, selected, onSelect }) {
  const waiting = records.filter(
    (item) => item.status === 'waiting' || item.status === 'transfer-pending',
  );
  const call = waiting.find((item) => item._id === selected?._id) || waiting[0];
  const issue =
    call?.data?.screen_14?.['Issue summary'] ||
    'The customer would like to speak with a support specialist.';
  const name = call?.title || 'No waiting caller';
  return (
    <div
      className={
        'agent-inbox-page max-w-385 m-auto text-[#f7f6ff] [&_.inbox-header]:mb-4 max-[1250px]:[&_.inbox-columns]:grid-cols-[1fr_1.2fr]'
      }
    >
      <div
        className={
          'inbox-header flex items-start justify-between gap-5 mb-5.5 [&_h1]:m-[0_0_8px] [&_h1]:text-3xl [&_h1]:tracking-[-.04em] [&_p]:text-[#abb0c4] [&_p]:m-0'
        }
      >
        <div>
          <h1>Inbox</h1>
          <p>Manage incoming customer requests from your website.</p>
        </div>
        <Link
          className={
            'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
          }
          href="/flow/22"
        >
          <Search size={16} /> View notification
        </Link>
      </div>
      <div
        className={
          'inbox-channels flex items-center gap-0 border-b border-b-[#363541] mb-4.25 *:p-[14px_24px] *:inline-flex *:gap-2.5 *:items-center *:text-[#a7a9b9] [&_strong]:bg-[#49317c] [&_strong]:text-white [&_strong]:rounded-[8px_8px_0_0] [&_strong]:border-b-[2px_solid_#a07bff] [&_b]:bg-[#6652b7] [&_b]:p-[2px_8px] [&_b]:rounded-[15px] mb-4'
        }
      >
        <span>◌ &nbsp;Chat requests</span>
        <strong>
          <Phone size={17} /> Voice requests <b>{waiting.length}</b>
        </strong>
      </div>
      <div
        className={
          'inbox-columns grid grid-cols-[1fr_1.42fr_1.03fr] gap-0 min-h-155 max-[900px]:grid-cols-1!'
        }
      >
        <section
          className={
            'inbox-panel inbox-queue border border-[#34333f] rounded-xl bg-[linear-gradient(140deg,#1e1e24,#1b1b21)] p-4.5 rounded-lg min-w-0 [&_h2]:text-[19px] [&_h2]:m-[0_0_6px] [&>p]:text-[13px] [&>p]:leading-normal [&>p]:text-[#afb4c3] [&>p]:m-[0_0_15px]'
          }
        >
          <h2>Voice requests</h2>
          <p>AI is speaking with customers and waiting for a human agent.</p>
          {waiting.map((item) => (
            <button
              className={`queue-item w-full flex text-left items-start gap-2.75 text-white bg-transparent border border-[#43404f] rounded-[9px] p-3 mb-2.25 cursor-pointer [&.active]:border-[#9f60fc] [&.active]:bg-[#33244e] [&>span:nth-child(2)]:flex-1 [&>span:nth-child(2)]:min-w-0 [&_strong]:block [&_small]:block [&_em]:block [&_strong]:text-sm [&_small]:text-[#c2c1ce] [&_small]:text-xs [&_small]:leading-[1.45] [&_small]:m-[5px_0] [&_em]:text-[11px] [&_em]:text-[#afb1c5] [&_em]:not-italic [&_em_svg]:align-middle [&>i]:not-italic [&>i]:text-[10px] [&>i]:text-[#ff6784]${call?._id === item._id ? 'active' : ''}`}
              key={item._id}
              onClick={() => onSelect(item)}
            >
              <span
                className={
                  'mini-avatar grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
                }
              >
                {item.title
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.data?.screen_14?.['Issue summary'] || 'Human help requested'}</small>
                <em>
                  <Headphones size={14} /> {item.data?.screen_14?.Department || 'Technical Support'}
                </em>
              </span>
              <i>Waiting</i>
            </button>
          ))}
          {!waiting.length && (
            <div
              className={
                'inbox-empty text-center text-[#aeb0c6] p-[90px_15px] [&_strong]:block [&_strong]:mt-3 [&_strong]:text-white'
              }
            >
              <Headphones size={34} />
              <strong>Queue is clear</strong>
              <p>New AI handoff requests will appear here.</p>
            </div>
          )}
        </section>
        <section
          className={
            'inbox-panel inbox-detail border border-[#34333f] rounded-xl bg-[linear-gradient(140deg,#1e1e24,#1b1b21)] p-4.5 rounded-lg min-w-0 [&_h2]:text-[19px] [&_h2]:m-[0_0_6px] [&>p]:text-[13px] [&>p]:leading-normal [&>p]:text-[#afb4c3] [&>p]:m-[0_0_15px] [&_h3]:text-base'
          }
        >
          <div
            className={
              'inbox-caller flex items-center gap-3 flex-wrap border-b border-b-[#45444e] p-[8px_0_18px] [&_h2]:m-0 [&_p]:m-0 [&_p]:text-[#b6b6c3] [&_p]:text-xs'
            }
          >
            <span
              className={
                'mini-avatar large grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
              }
            >
              {name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </span>
            <div>
              <h2>{name}</h2>
              <p>#{call?._id?.slice(-6).toUpperCase() || '—'} &nbsp;·&nbsp; Website voice call</p>
            </div>
            <span
              className={
                'waiting-badge ml-auto text-[#ff6c88] text-[11px] border border-[#d94366] rounded-full p-[5px_9px]'
              }
            >
              ● Waiting for human
            </span>
          </div>
          <div
            className={
              'voice-signal text-center p-[21px_10px] [&_svg]:text-[#a56cff] [&_svg]:block [&_svg]:m-[0_auto_10px] [&_strong]:block [&_strong]:text-base [&_p]:text-xs [&_p]:text-[#a9acc0]'
            }
          >
            <AudioLines size={54} />
            <strong>AI is speaking with the customer</strong>
            <p>The caller has asked to speak with a human.</p>
          </div>
          <div
            className={
              'handoff-reason flex items-center gap-2.5 p-3 border border-[#484550] bg-[#25242d] rounded-[9px] mb-4.25 [&_span]:block [&_span]:text-[#afb0c5] [&_span]:text-[11px] [&_strong]:text-xs'
            }
          >
            <UserRound size={21} />
            <div>
              <span>Handoff reason</span>
              <strong>{issue}</strong>
            </div>
          </div>
          <h3>Call details</h3>
          {[
            ['Customer', name],
            ['Conversation ID', call?._id?.slice(-6).toUpperCase() || '—'],
            ['Department', call?.data?.screen_14?.Department || 'Technical Support'],
            [
              'Source',
              call?.data?.source === 'phone' ? 'Inbound phone call' : 'Website voice call',
            ],
            ['Issue', issue],
          ].map(([key, value]) => (
            <div
              className={
                'detail-line flex justify-between gap-4 p-[12px_0] border-t border-t-[#42414a] text-xs [&_span]:text-[#b6b7c6] [&_strong]:max-w-[60%] [&_strong]:font-medium [&_strong]:text-right'
              }
              key={key}
            >
              <span>{key}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </section>
        <section
          className={
            'inbox-panel inbox-summary border border-[#34333f] rounded-xl bg-[linear-gradient(140deg,#1e1e24,#1b1b21)] p-4.5 rounded-lg min-w-0 [&_h2]:text-[19px] [&_h2]:m-[0_0_6px] [&>p]:text-[13px] [&>p]:leading-normal [&>p]:text-[#afb4c3] [&>p]:m-[0_0_15px] max-[1250px]:col-span-full'
          }
        >
          <div
            className={
              'inbox-summary-head flex gap-2.25 items-center mb-4.5 [&_svg]:text-[#a679ff] [&_h2]:m-0'
            }
          >
            <Sparkles size={21} />
            <h2>AI summary</h2>
          </div>
          <div
            className={
              'summary-text border border-[#44414f] bg-[#292831] rounded-[10px] p-3.5 mb-4 [&_p]:text-[13px] [&_p]:leading-[1.6]'
            }
          >
            <p>● &nbsp;{issue}</p>
            <p>
              ● &nbsp;The voice agent has gathered the customer's request. Review the context before
              joining.
            </p>
          </div>
          <div
            className={
              'detail-line flex justify-between gap-4 p-[12px_0] border-t border-t-[#42414a] text-xs [&_span]:text-[#b6b7c6] [&_strong]:max-w-[60%] [&_strong]:font-medium [&_strong]:text-right'
            }
          >
            <span>AI voice agent</span>
            <strong>Website Support</strong>
          </div>
          <div
            className={
              'detail-line flex justify-between gap-4 p-[12px_0] border-t border-t-[#42414a] text-xs [&_span]:text-[#b6b7c6] [&_strong]:max-w-[60%] [&_strong]:font-medium [&_strong]:text-right'
            }
          >
            <span>Source</span>
            <strong>Website voice call</strong>
          </div>
          <div
            className={
              'detail-line flex justify-between gap-4 p-[12px_0] border-t border-t-[#42414a] text-xs [&_span]:text-[#b6b7c6] [&_strong]:max-w-[60%] [&_strong]:font-medium [&_strong]:text-right'
            }
          >
            <span>Language</span>
            <strong>English (India)</strong>
          </div>
        </section>
      </div>
      <div
        className={
          'inbox-action-bar border border-[#34333f] rounded-xl bg-[linear-gradient(140deg,#1e1e24,#1b1b21)] p-4.5 flex gap-3.75 items-center mt-3.25 [&>svg]:text-[#a67fff] [&>svg]:shrink-0 [&_p]:flex-1 [&_p]:text-[#b7b9ca] [&_p]:text-[13px] [&_.button]:whitespace-nowrap max-[900px]:flex-wrap'
        }
      >
        <Info size={19} />
        <p>
          AI continues assisting the customer until you accept. Once you accept, AI stops speaking.
        </p>
        <Link
          className={
            'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
          }
          href="/flow/23"
        >
          Review request <ChevronRight size={18} />
        </Link>
        <Link
          className={
            'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
          }
          href="/flow/17"
        >
          View AI context
        </Link>
      </div>
    </div>
  );
}
