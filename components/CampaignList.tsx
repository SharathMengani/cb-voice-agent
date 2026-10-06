'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AudioLines,
  CalendarDays,
  ChevronRight,
  FileText,
  Headphones,
  Phone,
  Play,
  Plus,
  Search,
  Trophy,
  X,
} from 'lucide-react';
import { apiFetch } from './api-client';

export default function CampaignList({ records, agents, onUpdate }) {
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [name, setName] = useState('');
  const [agent, setAgent] = useState('');
  const [purpose, setPurpose] = useState('');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const visible = records.filter(
    (row) =>
      (filter === 'All' || row.status.toLowerCase() === filter.toLowerCase()) &&
      row.title.toLowerCase().includes(query.toLowerCase()),
  );
  async function create() {
    if (!name.trim()) return setError('Enter a campaign name.');
    if (!agents.some((a) => a.name === agent && a.status === 'ready'))
      return setError('Select a ready voice agent.');
    setBusy(true);
    setError('');
    try {
      const response = await apiFetch('/api/records/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: name.trim(),
          data: {
            screen_44: { 'Campaign name': name.trim(), 'Voice agent': agent, Purpose: purpose },
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'Could not create campaign.');
      localStorage.setItem('chatbucket:campaign', data._id);
      await onUpdate();
      router.push('/campaigns/new/basics');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={'campaign-list-screen text-[#f8f6ff] max-w-387.5 m-auto'}>
      <div
        className={
          'campaign-list-heading flex justify-between items-center gap-3.75 mb-6.25 [&_h1]:text-3xl [&_h1]:tracking-[-.04em] [&_h1]:m-[0_0_7px] [&_p]:text-[#adb2c4] [&_p]:m-0 [&>div]:flex-1 max-[900px]:flex-wrap'
        }
      >
        <div>
          <h1>Outbound campaigns</h1>
          <p>Call opted-in contacts with your AI voice agent.</p>
        </div>
        <Link
          className={
            'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
          }
          href="/voice-agents/new?step=4"
        >
          <Phone size={17} /> Make one test call
        </Link>
        <button
          className={
            'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
          }
          onClick={() => {
            setAgent(agents.find((a) => a.status === 'ready')?.name || '');
            setName('');
            setPurpose('');
            setError('');
            setDrawer(true);
          }}
        >
          <Plus size={18} /> Create campaign
        </button>
      </div>
      <div
        className={
          'campaign-summary grid grid-cols-[repeat(3,1fr)] gap-3.75 m-[30px_0] [&_article]:border [&_article]:border-[#3d3b49] [&_article]:bg-[#1e1e25] [&_article]:rounded-[11px] [&_article]:p-5 [&_article]:flex [&_article]:gap-5 [&_article]:items-center [&_article]:min-h-25 [&_article>span]:bg-[#3b2e5b] [&_article>span]:rounded-[10px] [&_article>span]:text-[#ad7bff] [&_article>span]:w-13.5 [&_article>span]:h-13.5 [&_article>span]:grid [&_article>span]:place-items-center [&_article_div]:text-[#bfc2cf] [&_article_div]:text-[13px] [&_strong]:block [&_strong]:text-white [&_strong]:text-[25px] [&_strong]:mt-1.25 grid-cols-[repeat(4,1fr)] max-[900px]:grid-cols-[repeat(2,1fr)]'
        }
      >
        {(
          [
            ['Draft', 'draft', FileText],
            ['Scheduled', 'scheduled', CalendarDays],
            ['Running', 'running', Play],
            ['Completed', 'completed', Trophy],
          ] as const
        ).map(([label, status, Icon]) => (
          <article key={label}>
            <span>
              <Icon size={25} />
            </span>
            <div>
              {label}
              <strong>{records.filter((r) => r.status === status).length}</strong>
            </div>
          </article>
        ))}
      </div>
      <div
        className={
          'campaign-filter-line flex justify-between items-center gap-3 m-[30px_0_15px] [&_label]:flex [&_label]:items-center [&_label]:gap-2.5 [&_label]:border [&_label]:border-[#41404b] [&_label]:rounded-[9px] [&_label]:p-[10px_14px] [&_label]:text-[#b9bfce] [&_input]:bg-transparent [&_input]:border-0 [&_input]:text-white [&_input]:outline-0 [&_input]:w-67.5 [&_input]:[font:inherit] [&_input]:text-xs [&>div]:flex [&>div]:gap-1.75 [&>div]:flex-wrap [&_button]:border [&_button]:border-[#343842] [&_button]:bg-[#242830] [&_button]:text-[#bec1ce] [&_button]:p-[10px_16px] [&_button]:rounded-[30px] [&_button]:cursor-pointer [&_button.selected]:bg-[#623de8] [&_button.selected]:text-white [&_button.selected]:border-[#643cf1] max-[900px]:flex-wrap'
        }
      >
        <div>
          {['All', 'Draft', 'Scheduled', 'Running', 'Completed'].map((label) => (
            <button
              className={filter === label ? 'selected' : ''}
              key={label}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <label>
          <Search size={17} />
          <input
            placeholder="Search campaigns…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div
        className={
          'campaign-list-table border border-[#393945] rounded-xl bg-[#1d1e25] overflow-hidden max-[1250px]:overflow-x-auto'
        }
      >
        <div
          className={
            'campaign-list-header text-[#bdc0cd] text-xs bg-[#24242d] grid grid-cols-[2fr_.85fr_1.3fr_1fr_1fr_1.1fr] items-center gap-2 p-[16px_14px] max-[1250px]:min-w-240'
          }
        >
          <span>Campaign</span>
          <span>Status</span>
          <span>Voice agent</span>
          <span>Progress</span>
          <span>Scheduled for</span>
          <span>Actions</span>
        </div>
        {visible.map((row) => (
          <div
            className={
              'campaign-list-row border-t border-t-[#36363f] text-[#e7e5ed] text-xs [&_strong]:block [&_small]:block [&_small]:text-[#afb0c0] [&_small]:text-[11px] [&_small]:mt-1 [&>span:nth-child(3)]:flex [&>span:nth-child(3)]:items-center [&>span:nth-child(3)]:gap-1.25 grid grid-cols-[2fr_.85fr_1.3fr_1fr_1fr_1.1fr] items-center gap-2 p-[16px_14px] border-t border-t-[#363a42] [&>div>strong]:text-[13px] [&_.button]:text-[11px] [&_.button]:p-2.25 [&_.button]:whitespace-nowrap [&>span:nth-child(4)_strong]:text-[13px] max-[1250px]:min-w-240'
            }
            key={row._id}
          >
            <div>
              <strong>{row.title}</strong>
              <small>{row.data?.screen_44?.Purpose || 'Outbound AI voice calls'}</small>
            </div>
            <span>
              <em
                className={`campaign-status not-italic rounded-[20px] p-[6px_10px] text-[11px] whitespace-nowrap [&.completed]:text-[#48ddae] [&.completed]:bg-[#193c36] [&.running]:text-[#48ddae] [&.running]:bg-[#193c36] [&.draft]:text-[#ffd27d] [&.draft]:bg-[#493a24] [&.scheduled]:text-[#84b9ff] [&.scheduled]:bg-[#263a5c]${row.status}`}
              >
                ● {row.status}
              </em>
            </span>
            <span>
              <Headphones size={16} />
              {row.data?.screen_44?.['Voice agent'] || 'Select an agent'}
            </span>
            <span>
              <strong>
                {row.data?.stats?.initiated || 0} / {row.data?.stats?.eligible || 0}
              </strong>
              <small>simulated contacts</small>
            </span>
            <span>{row.data?.screen_47?.['Start date and time'] || '—'}</span>
            <span>
              <button
                className={
                  'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
                onClick={() => {
                  localStorage.setItem('chatbucket:campaign', row._id);
                  router.push(
                    row.status === 'completed'
                      ? '/campaigns/results'
                      : row.status === 'running'
                        ? '/campaigns/monitoring'
                        : '/campaigns/new/basics',
                  );
                }}
              >
                {['running', 'completed'].includes(row.status) ? 'View results' : 'Continue setup'}{' '}
                <ChevronRight size={15} />
              </button>
            </span>
          </div>
        ))}
        {visible.length === 0 && (
          <p className={'widget-empty p-7.5 text-center text-[#b5b5c4]'}>
            No campaigns in this filter.
          </p>
        )}
      </div>
      {drawer && (
        <div
          className={
            'widget-drawer-backdrop fixed inset-0 bg-[rgba(0,0,0,.52)] z-110 flex justify-end'
          }
          onClick={() => setDrawer(false)}
        >
          <aside
            className={
              'widget-create-drawer w-[min(530px,100vw)] h-screen overflow-auto bg-[#211f28] border-l border-l-[#4b435d] p-[28px_24px_100px] relative shadow-[-20px_0_70px_#0008] [&_h3]:mt-5 [&>.field]:m-[18px_0]'
            }
            onClick={(e) => e.stopPropagation()}
            aria-label="Create campaign"
          >
            <div
              className={
                'widget-drawer-heading flex gap-3.5 justify-between [&_h2]:text-[23px] [&_h2]:m-[0_0_7px] [&_p]:text-[#bcbccb] [&_p]:text-[13px] [&_p]:leading-[1.4] [&_p]:m-0 [&_button]:h-7.5 [&_button]:bg-none [&_button]:border-0 [&_button]:text-white [&_button]:cursor-pointer'
              }
            >
              <div>
                <h2>Create campaign</h2>
                <p>Choose an AI voice agent and set your goal.</p>
              </div>
              <button onClick={() => setDrawer(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div
              className={
                'widget-drawer-steps flex justify-between gap-1.25 border-b border-b-[#48434c] m-[25px_0] pb-7 [&_span]:flex [&_span]:flex-col [&_span]:items-center [&_span]:gap-1.75 [&_span]:text-center [&_span]:min-w-0 [&_span]:flex-1 [&_span]:text-[#b4b0c4] [&_span]:text-[10px] [&_b]:border [&_b]:border-[#636272] [&_b]:w-7.5 [&_b]:h-7.5 [&_b]:grid [&_b]:place-items-center [&_b]:rounded-full [&_b]:text-xs [&_b.current]:bg-[#6740df] [&_b.current]:border-0 [&_b.current]:text-white'
              }
            >
              {['Basics', 'Contacts', 'Capacity', 'Schedule', 'Review'].map((label, i) => (
                <span key={label}>
                  <b className={i === 0 ? 'current' : ''}>{i + 1}</b>
                  {label}
                </span>
              ))}
            </div>
            <div className={'field-stack grid gap-4.75'}>
              <label
                className={
                  'field grid gap-2 text-sm [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#454551] [&_textarea]:bg-[#202128] [&_textarea]:p-[12px_13px] [&_textarea]:text-[#f5f5f8] [&_textarea]:outline-0 [&_textarea]:text-sm [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#454551] [&_select]:bg-[#202128] [&_select]:p-[12px_13px] [&_select]:text-[#f5f5f8] [&_select]:outline-0 [&_select]:text-sm [&_textarea]:resize-y [&_textarea]:leading-normal [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] [&_textarea:focus]:border-[#a47aff] [&_textarea:focus]:shadow-[0_0_0_3px_#7646e323] [&_select:focus]:border-[#a47aff] [&_select:focus]:shadow-[0_0_0_3px_#7646e323] [&_small]:text-(--muted) [&_small]:text-xs'
                }
              >
                <span className={'field-label text-[#f0eff5] font-[540]'}>Campaign name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Customer follow-up campaign"
                />
              </label>
              <label
                className={
                  'field grid gap-2 text-sm [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#454551] [&_textarea]:bg-[#202128] [&_textarea]:p-[12px_13px] [&_textarea]:text-[#f5f5f8] [&_textarea]:outline-0 [&_textarea]:text-sm [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#454551] [&_select]:bg-[#202128] [&_select]:p-[12px_13px] [&_select]:text-[#f5f5f8] [&_select]:outline-0 [&_select]:text-sm [&_textarea]:resize-y [&_textarea]:leading-normal [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] [&_textarea:focus]:border-[#a47aff] [&_textarea:focus]:shadow-[0_0_0_3px_#7646e323] [&_select:focus]:border-[#a47aff] [&_select:focus]:shadow-[0_0_0_3px_#7646e323] [&_small]:text-(--muted) [&_small]:text-xs'
                }
              >
                <span className={'field-label text-[#f0eff5] font-[540]'}>Purpose</span>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="What is the reason for calling?"
                />
              </label>
              <label
                className={
                  'field grid gap-2 text-sm [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#454551] [&_textarea]:bg-[#202128] [&_textarea]:p-[12px_13px] [&_textarea]:text-[#f5f5f8] [&_textarea]:outline-0 [&_textarea]:text-sm [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#454551] [&_select]:bg-[#202128] [&_select]:p-[12px_13px] [&_select]:text-[#f5f5f8] [&_select]:outline-0 [&_select]:text-sm [&_textarea]:resize-y [&_textarea]:leading-normal [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] [&_textarea:focus]:border-[#a47aff] [&_textarea:focus]:shadow-[0_0_0_3px_#7646e323] [&_select:focus]:border-[#a47aff] [&_select:focus]:shadow-[0_0_0_3px_#7646e323] [&_small]:text-(--muted) [&_small]:text-xs'
                }
              >
                <span className={'field-label text-[#f0eff5] font-[540]'}>Voice agent</span>
                <select value={agent} onChange={(e) => setAgent(e.target.value)}>
                  <option value="">Select a ready agent</option>
                  {agents
                    .filter((a) => a.status === 'ready')
                    .map((a) => (
                      <option key={a._id}>{a.name}</option>
                    ))}
                </select>
              </label>
            </div>
            <p
              className={
                'widget-drawer-info border border-[#44414d] bg-[#302e38] rounded-lg p-3.25 text-[#c3c4d0] text-xs flex items-center gap-2.5'
              }
            >
              The demo does not place real calls. Consent and contact checks follow in the next
              steps.
            </p>
            {error && (
              <p
                className={
                  'flow-alert problem flex gap-2.5 items-center bg-[#173b34] border border-[#296a55] text-[#81e4b8] p-[13px_16px] rounded-[9px] m-[15px_0] text-sm [&.problem]:bg-[#402630] [&.problem]:border-[#a44c68] [&.problem]:text-[#ffb5c1]'
                }
                role="status"
              >
                {error}
              </p>
            )}
            <div
              className={
                'widget-drawer-footer sticky -bottom-25 bg-[#211f28] p-[18px_0] flex gap-2.25 justify-end border-t border-t-[#45424a] mt-8.75'
              }
            >
              <button
                className={
                  'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
                onClick={() => setDrawer(false)}
              >
                Cancel
              </button>
              <button
                className={
                  'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
                disabled={busy}
                onClick={create}
              >
                Continue to contacts <ChevronRight size={16} />
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
