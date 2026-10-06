'use client';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Clock3,
  Headphones,
  Phone,
  PhoneIncoming,
  Radio,
  RotateCcw,
  Users,
} from 'lucide-react';
import { apiFetch } from './api-client';

const team = [
  ['Ravi Kumar', 'Technical Support', 'Online'],
  ['Priya Sharma', 'Customer Support', 'Online'],
  ['Arjun Mehta', 'Technical Support', 'Online'],
  ['Sneha Kapoor', 'Customer Support', 'Online'],
  ['Vikram Tiwari', 'Sales Support', 'Busy'],
];
export default function OwnerOverview({ records, onSelect, onUpdate }) {
  const waiting = records.filter((r) => r.status === 'waiting');
  const human = records.filter((r) => r.status === 'human');
  const ended = records.filter((r) => r.status === 'ended');
  async function accept(item) {
    onSelect(item);
    localStorage.setItem('chatbucket:call', item._id);
    const response = await apiFetch(`/api/records/call/${item._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'human', data: { assignedAgent: 'Sharath' } }),
    });
    if (response.ok) {
      await onUpdate();
      window.location.href = '/calls/takeover';
    }
  }
  return (
    <div className={'overview-page max-w-385 m-auto text-[#f7f6ff]'}>
      <div
        className={
          'overview-title flex items-start justify-between gap-5 mb-5.5 [&_h1]:m-[0_0_8px] [&_h1]:text-3xl [&_h1]:tracking-[-.04em] [&_p]:text-[#abb0c4] [&_p]:m-0'
        }
      >
        <div>
          <h1>Voice Operations Overview</h1>
          <p>Real-time voice calls, AI agent activity and team performance</p>
        </div>
        <span
          className={
            'date-chip p-[12px_17px] border border-[#3a3a47] rounded-[10px] text-[#d5d5df]'
          }
        >
          Today · Demo data
        </span>
      </div>
      <div
        className={
          'channel-tabs flex items-center gap-0 border-b border-b-[#363541] mb-4.25 *:p-[14px_24px] *:inline-flex *:gap-2.5 *:items-center *:text-[#a7a9b9] [&_strong]:bg-[#49317c] [&_strong]:text-white [&_strong]:rounded-[8px_8px_0_0] [&_strong]:border-b-[2px_solid_#a07bff]'
        }
      >
        <span>◌ &nbsp;Chat</span>
        <strong>
          <Phone size={17} /> Voice
        </strong>
      </div>
      <div
        className={
          'overview-layout grid grid-cols-[minmax(0,1fr)_320px] gap-3.75 max-[1250px]:grid-cols-1'
        }
      >
        <div className={'overview-main min-w-0'}>
          <div
            className={
              'overview-metrics grid grid-cols-4 gap-3 mb-3.5 max-[900px]:grid-cols-[repeat(2,1fr)]'
            }
          >
            {[
              ['Active AI calls', waiting.length, Headphones, 'purple'],
              ['Waiting for human', waiting.length, Clock3, 'amber'],
              ['Live human calls', human.length, Phone, 'blue'],
              ['Callback requests', '1', RotateCcw, 'purple'],
            ].map(([label, value, Icon, color]) => (
              <article
                className={
                  'overview-metric border border-[#34333f] rounded-xl bg-[linear-gradient(140deg,#1e1e24,#1b1b21)] p-4.5 flex gap-3 items-center min-h-28.5 [&>span:last-child]:text-[13px] [&>span:last-child]:text-[#b7b9ca] [&_strong]:block [&_strong]:text-white [&_strong]:text-[29px] [&_strong]:leading-tight [&_small]:text-[#45d6a2] [&_small]:text-[11px] [&_.stat-icon]:w-11.25 [&_.stat-icon]:h-11.25 [&_.stat-icon]:shrink-0'
                }
                key={label}
              >
                <span
                  className={`stat-icon h-15 w-15 grid place-items-center rounded-[11px] [&.purple]:text-[#ad82ff] [&.purple]:bg-[#35274e] [&.green]:text-(--green) [&.green]:bg-[#1b413b] [&.amber]:text-(--amber) [&.amber]:bg-[#403222] max-[800px]:w-9 max-[800px]:h-9${color}`}
                >
                  <Icon size={21} />
                </span>
                <span>
                  {label}
                  <strong>{value}</strong>
                  <small>● Live demo</small>
                </span>
              </article>
            ))}
          </div>
          <div
            className={
              'overview-charts grid grid-cols-[1.45fr_1fr] gap-3.5 mb-3.5 max-[900px]:grid-cols-1'
            }
          >
            <section
              className={
                'overview-panel border border-[#34333f] rounded-xl bg-[linear-gradient(140deg,#1e1e24,#1b1b21)] p-4.5 [&_h3]:text-[17px] [&_h3]:tracking-[-.02em] [&_h3]:m-[0_0_12px] [&_h3_small]:float-right [&_h3_small]:font-normal [&_h3_small]:text-[#a5abbd] [&_h3_small]:text-[13px] [&>p]:text-[13px] [&>p]:text-[#b3b7c7] [&>div>strong]:text-[25px] [&>div>strong_small]:text-xs [&>div>strong_small]:text-[#40d5a3]'
              }
            >
              <div>
                <h3>Voice calls today</h3>
                <strong>
                  {records.length} <small>Demo activity</small>
                </strong>
              </div>
              <div
                className={
                  'bar-chart flex items-end gap-1 border-b border-b-[#494755] h-32.5 p-[8px_0] [&_span]:bg-[linear-gradient(#a780ff,#6244d7)] [&_span]:flex-1 [&_span]:min-h-0.75 [&_span]:rounded-[3px_3px_0_0]'
                }
                aria-label="Sample call activity chart"
              >
                {[
                  4, 9, 13, 10, 18, 26, 15, 9, 19, 13, 31, 24, 18, 11, 15, 27, 23, 15, 13, 7, 4, 3,
                  2, 1,
                ].map((h, i) => (
                  <span key={i} style={{ height: `${h * 2 + 5}%` }} />
                ))}
              </div>
              <div className={'chart-axis text-[10px] text-[#9a9dac] flex justify-between mt-2.25'}>
                12 AM <span>3 AM</span>
                <span>6 AM</span>
                <span>9 AM</span>
                <span>12 PM</span>
                <span>3 PM</span>
                <span>6 PM</span>
                <span>9 PM</span>
              </div>
            </section>
            <section
              className={
                'overview-panel border border-[#34333f] rounded-xl bg-[linear-gradient(140deg,#1e1e24,#1b1b21)] p-4.5 [&_h3]:text-[17px] [&_h3]:tracking-[-.02em] [&_h3]:m-[0_0_12px] [&_h3_small]:float-right [&_h3_small]:font-normal [&_h3_small]:text-[#a5abbd] [&_h3_small]:text-[13px] [&>p]:text-[13px] [&>p]:text-[#b3b7c7] [&>div>strong]:text-[25px] [&>div>strong_small]:text-xs [&>div>strong_small]:text-[#40d5a3]'
              }
            >
              <h3>Call outcomes</h3>
              <div className={'outcome-flex flex items-center gap-4.5 min-h-44'}>
                <div
                  className={
                    'donut shrink-0 w-35.75 h-35.75 rounded-full bg-[conic-gradient(#30d39a_0_65%,#579aff_65%_88%,#bc84fa_88%)] grid place-items-center [&>span]:rounded-full [&>span]:bg-[#202128] [&>span]:w-23.75 [&>span]:h-23.75 [&>span]:flex [&>span]:flex-col [&>span]:items-center [&>span]:justify-center [&>span]:text-[11px] [&_strong]:text-[27px]'
                  }
                >
                  <span>
                    <strong>{records.length}</strong>Calls
                  </span>
                </div>
                <div
                  className={
                    'outcome-legend grid gap-3.5 text-xs text-[#c6c8d5] [&_span]:flex [&_span]:gap-3 [&_span]:justify-between'
                  }
                >
                  <span>
                    ● AI handling <b>{waiting.length}</b>
                  </span>
                  <span>
                    ● Human handled <b>{human.length}</b>
                  </span>
                  <span>
                    ● Completed <b>{ended.length}</b>
                  </span>
                </div>
              </div>
            </section>
          </div>
          <div
            className={
              'overview-bottom grid grid-cols-[1.45fr_1fr] gap-3.5 mb-3.5 grid-cols-[1fr_1fr] max-[900px]:grid-cols-1'
            }
          >
            <section
              className={
                'overview-panel border border-[#34333f] rounded-xl bg-[linear-gradient(140deg,#1e1e24,#1b1b21)] p-4.5 [&_h3]:text-[17px] [&_h3]:tracking-[-.02em] [&_h3]:m-[0_0_12px] [&_h3_small]:float-right [&_h3_small]:font-normal [&_h3_small]:text-[#a5abbd] [&_h3_small]:text-[13px] [&>p]:text-[13px] [&>p]:text-[#b3b7c7] [&>div>strong]:text-[25px] [&>div>strong_small]:text-xs [&>div>strong_small]:text-[#40d5a3]'
              }
            >
              <h3>
                Waiting voice requests{' '}
                <b
                  className={
                    'small-count bg-[#eb386e] p-[3px_8px] rounded-full text-[11px] ml-1.5 [&.blue]:bg-[#526bef]'
                  }
                >
                  {waiting.length}
                </b>
              </h3>
              <p>AI has prepared the caller context for your team.</p>
              {waiting.length ? (
                waiting.slice(0, 4).map((item) => (
                  <div
                    className={
                      'overview-call flex items-center gap-2.5 border-t border-t-[#393840] p-[12px_0] [&>span:nth-child(2)]:flex-1 [&>span:nth-child(2)]:min-w-0 [&_strong]:block [&_strong]:text-[13px] [&_small]:block [&_small]:text-[#a4a8b8] [&_small]:text-[11px] [&_small]:overflow-hidden [&_small]:text-ellipsis [&_small]:whitespace-nowrap [&_button]:border [&_button]:border-[#7852df] [&_button]:bg-[#633deb] [&_button]:text-white [&_button]:p-[7px_10px] [&_button]:rounded-[7px] [&_button]:text-[11px] [&_button]:no-underline [&_button]:cursor-pointer [&>a]:border [&>a]:border-[#7852df] [&>a]:bg-[#633deb] [&>a]:text-white [&>a]:p-[7px_10px] [&>a]:rounded-[7px] [&>a]:text-[11px] [&>a]:no-underline [&>a]:cursor-pointer [&>a]:bg-transparent'
                    }
                    key={item._id}
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
                      <small>
                        {item.data?.screen_14?.['Issue summary'] || 'Human support requested'}
                      </small>
                    </span>
                    <button onClick={() => accept(item)}>Accept call</button>
                    <Link href="/inbox">View</Link>
                  </div>
                ))
              ) : (
                <p className={'muted text-(--muted) m-0 leading-normal'}>
                  No requests waiting right now.
                </p>
              )}
            </section>
            <section
              className={
                'overview-panel border border-[#34333f] rounded-xl bg-[linear-gradient(140deg,#1e1e24,#1b1b21)] p-4.5 [&_h3]:text-[17px] [&_h3]:tracking-[-.02em] [&_h3]:m-[0_0_12px] [&_h3_small]:float-right [&_h3_small]:font-normal [&_h3_small]:text-[#a5abbd] [&_h3_small]:text-[13px] [&>p]:text-[13px] [&>p]:text-[#b3b7c7] [&>div>strong]:text-[25px] [&>div>strong_small]:text-xs [&>div>strong_small]:text-[#40d5a3]'
              }
            >
              <h3>
                Live human calls{' '}
                <b
                  className={
                    'small-count blue bg-[#eb386e] p-[3px_8px] rounded-full text-[11px] ml-1.5 [&.blue]:bg-[#526bef]'
                  }
                >
                  {human.length}
                </b>
              </h3>
              <p>Agents are speaking with customers.</p>
              {human.map((item) => (
                <div
                  className={
                    'overview-call flex items-center gap-2.5 border-t border-t-[#393840] p-[12px_0] [&>span:nth-child(2)]:flex-1 [&>span:nth-child(2)]:min-w-0 [&_strong]:block [&_strong]:text-[13px] [&_small]:block [&_small]:text-[#a4a8b8] [&_small]:text-[11px] [&_small]:overflow-hidden [&_small]:text-ellipsis [&_small]:whitespace-nowrap [&_button]:border [&_button]:border-[#7852df] [&_button]:bg-[#633deb] [&_button]:text-white [&_button]:p-[7px_10px] [&_button]:rounded-[7px] [&_button]:text-[11px] [&_button]:no-underline [&_button]:cursor-pointer [&>a]:border [&>a]:border-[#7852df] [&>a]:bg-[#633deb] [&>a]:text-white [&>a]:p-[7px_10px] [&>a]:rounded-[7px] [&>a]:text-[11px] [&>a]:no-underline [&>a]:cursor-pointer [&>a]:bg-transparent'
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
                  <span>
                    <strong>{item.data?.assignedAgent || 'Human agent'}</strong>
                    <small>{item.title}</small>
                  </span>
                  <Link href="/calls/live">Monitor</Link>
                </div>
              ))}
              {!human.length && (
                <p className={'muted text-(--muted) m-0 leading-normal'}>No active human calls.</p>
              )}
            </section>
          </div>
        </div>
        <aside
          className={
            'overview-aside min-w-0 [&_.overview-panel]:mb-3.5 max-[1250px]:grid max-[1250px]:grid-cols-[1fr_1fr] max-[1250px]:gap-3 max-[1250px]:[&_.overview-panel]:m-0 max-[900px]:grid-cols-1'
          }
        >
          <section
            className={
              'overview-panel border border-[#34333f] rounded-xl bg-[linear-gradient(140deg,#1e1e24,#1b1b21)] p-4.5 [&_h3]:text-[17px] [&_h3]:tracking-[-.02em] [&_h3]:m-[0_0_12px] [&_h3_small]:float-right [&_h3_small]:font-normal [&_h3_small]:text-[#a5abbd] [&_h3_small]:text-[13px] [&>p]:text-[13px] [&>p]:text-[#b3b7c7] [&>div>strong]:text-[25px] [&>div>strong_small]:text-xs [&>div>strong_small]:text-[#40d5a3]'
            }
          >
            <h3>
              Team availability <small>5 members</small>
            </h3>
            {team.map(([name, department, status]) => (
              <div
                className={
                  'team-line flex items-center gap-2.5 border-t border-t-[#393840] p-[12px_0] [&>span:nth-child(3)]:flex-1 [&>span:nth-child(3)]:min-w-0 [&_strong]:block [&_strong]:text-[13px] [&_small]:block [&_small]:text-[#a4a8b8] [&_small]:text-[11px] [&_small]:overflow-hidden [&_small]:text-ellipsis [&_small]:whitespace-nowrap [&>i]:bg-[#30d39a] [&>i]:w-2 [&>i]:h-2 [&>i]:rounded-full [&>i.busy]:bg-[#ffbc47] [&_em]:not-italic [&_em]:text-[#afb4c1] [&_em]:text-[11px]'
                }
                key={name}
              >
                <i className={status === 'Busy' ? 'busy' : ''} />
                <span
                  className={
                    'mini-avatar grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
                  }
                >
                  {name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
                <span>
                  <strong>{name}</strong>
                  <small>{department}</small>
                </span>
                <em>{status}</em>
              </div>
            ))}
          </section>
          <section
            className={
              'overview-panel border border-[#34333f] rounded-xl bg-[linear-gradient(140deg,#1e1e24,#1b1b21)] p-4.5 [&_h3]:text-[17px] [&_h3]:tracking-[-.02em] [&_h3]:m-[0_0_12px] [&_h3_small]:float-right [&_h3_small]:font-normal [&_h3_small]:text-[#a5abbd] [&_h3_small]:text-[13px] [&>p]:text-[13px] [&>p]:text-[#b3b7c7] [&>div>strong]:text-[25px] [&>div>strong_small]:text-xs [&>div>strong_small]:text-[#40d5a3]'
            }
          >
            <h3>
              Callback alerts{' '}
              <b
                className={
                  'small-count bg-[#eb386e] p-[3px_8px] rounded-full text-[11px] ml-1.5 [&.blue]:bg-[#526bef]'
                }
              >
                1
              </b>
            </h3>
            <p>Someone requested a call from your team.</p>
            <Link
              className={
                'overview-link inline-flex gap-1.75 items-center text-[#b995ff] no-underline text-[13px] [&.standalone]:border [&.standalone]:border-[#654ca5] [&.standalone]:p-3.25 [&.standalone]:rounded-[9px] [&.standalone]:w-full [&.standalone]:justify-center'
              }
              href="/callbacks"
            >
              Open callback requests <ArrowRight size={17} />
            </Link>
          </section>
          <Link
            className={
              'overview-link standalone inline-flex gap-1.75 items-center text-[#b995ff] no-underline text-[13px] [&.standalone]:border [&.standalone]:border-[#654ca5] [&.standalone]:p-3.25 [&.standalone]:rounded-[9px] [&.standalone]:w-full [&.standalone]:justify-center'
            }
            href="/inbox"
          >
            <PhoneIncoming size={18} /> View all incoming requests <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
