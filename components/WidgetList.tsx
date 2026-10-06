'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  AudioLines,
  Check,
  ChevronRight,
  Code2,
  Edit3,
  ExternalLink,
  Headphones,
  Info,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { apiFetch } from './api-client';

export default function WidgetList({ records, agents, onUpdate }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [agentId, setAgentId] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const visible = records.filter(
    (r) =>
      (filter === 'All' || r.status === (filter === 'Live' ? 'published' : 'draft')) &&
      `${r.title} ${r.data?.screen_7?.['Voice agent'] || ''}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  function openNew() {
    setName('');
    setAgentId(agents.find((agent) => agent.status === 'ready')?._id || '');
    setError('');
    setOpen(true);
  }
  async function create() {
    const agent = agents.find((item) => item._id === agentId);
    if (!name.trim()) return setError('Enter a widget name.');
    if (!agent || agent.status !== 'ready') return setError('Select a saved, ready voice agent.');
    setBusy(true);
    setError('');
    try {
      const response = await apiFetch('/api/records/widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: name.trim(),
          data: { screen_7: { 'Widget name': name.trim(), 'Voice agent': agent.name } },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'Could not create widget.');
      localStorage.setItem('chatbucket:widget', data._id);
      await onUpdate();
      router.push('/flow/8');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={'widget-list-screen text-[#f8f6ff] max-w-387.5 m-auto'}>
      <div className="widget-main-list">
        <div
          className={
            'widget-list-title flex justify-between items-center gap-3.75 mb-6.25 [&_h1]:text-3xl [&_h1]:tracking-[-.04em] [&_h1]:m-[0_0_7px] [&_p]:text-[#adb2c4] [&_p]:m-0 max-[900px]:flex-wrap'
          }
        >
          <div>
            <h1>Voice Widgets</h1>
            <p>Put voice conversations on your website.</p>
          </div>
          <button
            className={
              'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,_#7c49f5,_#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
            }
            onClick={openNew}
          >
            <Plus size={18} /> Create widget
          </button>
        </div>
        <div
          className={
            'widget-summary-cards grid grid-cols-[repeat(3,_1fr)] gap-3.75 m-[30px_0] max-[900px]:grid-cols-[repeat(2,_1fr)]'
          }
        >
          {[
            ['Live', records.filter((r) => r.status === 'published').length, AudioLines],
            ['Draft', records.filter((r) => r.status === 'draft').length, Code2],
            ['Calls this week', 'Demo', Activity],
          ].map(([label, value, Icon]) => (
            <div
              className={
                'widget-summary-card border border-[#3d3b49] bg-[#1e1e25] rounded-[11px] p-5 flex gap-5 items-center min-h-25 [&>span]:bg-[#3b2e5b] [&>span]:rounded-[10px] [&>span]:text-[#ad7bff] [&>span]:w-13.5 [&>span]:h-13.5 [&>span]:grid [&>span]:place-items-center [&_div]:text-[#bfc2cf] [&_div]:text-[13px] [&_strong]:block [&_strong]:text-white [&_strong]:text-[25px] [&_strong]:mt-1.25'
              }
              key={label}
            >
              <span>
                <Icon size={27} />
              </span>
              <div>
                {label}
                <strong>{value}</strong>
              </div>
            </div>
          ))}
        </div>
        <div
          className={
            'widget-list-tools flex justify-between items-center gap-3 m-[30px_0_15px] [&_label]:flex [&_label]:items-center [&_label]:gap-2.5 [&_label]:border [&_label]:border-[#41404b] [&_label]:rounded-[9px] [&_label]:p-[10px_14px] [&_label]:text-[#b9bfce] [&_input]:bg-transparent [&_input]:border-0 [&_input]:text-white [&_input]:outline-0 [&_input]:w-67.5 [&_input]:[font:inherit] [&_input]:text-xs [&_select]:bg-[#23232b] [&_select]:text-white [&_select]:border [&_select]:border-[#44434e] [&_select]:rounded-lg [&_select]:p-2.75 max-[900px]:flex-wrap'
          }
        >
          <label>
            <Search size={19} />
            <input
              placeholder="Search voice widgets…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter widgets by status"
          >
            <option>All</option>
            <option>Live</option>
            <option>Draft</option>
          </select>
        </div>
        <div
          className={
            'widget-table border border-[#393945] rounded-xl bg-[#1d1e25] overflow-hidden max-[1250px]:overflow-x-auto'
          }
        >
          <div
            className={
              'widget-table-head grid grid-cols-[2fr_1.25fr_1.55fr_.7fr_1fr_.7fr] items-center gap-2 p-[17px_15px] text-[#bdc0cd] text-xs bg-[#24242d] max-[1250px]:min-w-227.5'
            }
          >
            <span>Widget</span>
            <span>Website</span>
            <span>Connected agent</span>
            <span>Status</span>
            <span>Last activity</span>
            <span>Actions</span>
          </div>
          {visible.map((item) => (
            <div
              className={
                'widget-table-row grid grid-cols-[2fr_1.25fr_1.55fr_.7fr_1fr_.7fr] items-center gap-2 p-[17px_15px] border-t border-t-[#36363f] text-[#e7e5ed] text-xs [&>span:nth-child(3)]:flex [&>span:nth-child(3)]:items-center [&>span:nth-child(3)]:gap-1.25 [&_em]:not-italic [&_em]:rounded-[20px] [&_em]:p-[6px_10px] [&_em]:text-[11px] [&_em]:whitespace-nowrap [&_em.live]:text-[#48ddae] [&_em.live]:bg-[#193c36] [&_em.draft]:text-[#ffd27d] [&_em.draft]:bg-[#493a24] [&_button]:inline-flex [&_button]:items-center [&_button]:gap-1.25 [&_button]:bg-[#282832] [&_button]:text-white [&_button]:border [&_button]:border-[#454552] [&_button]:rounded-[7px] [&_button]:p-2 [&_button]:cursor-pointer [&_button]:text-[11px] max-[1250px]:min-w-227.5'
              }
              key={item._id}
            >
              <span
                className={
                  'widget-cell-name flex items-center gap-2.5 [&>span:last-child]:min-w-0 [&_strong]:block [&_small]:block [&_small]:text-[#afb0c0] [&_small]:text-[11px] [&_small]:mt-1'
                }
              >
                <span
                  className={
                    'widget-cell-icon w-11 h-11 shrink-0 grid place-items-center rounded-[7px] text-[#a773ff] bg-[#34294f]'
                  }
                >
                  <AudioLines size={23} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>Voice support on your website</small>
                </span>
              </span>
              <span>{item.data?.screen_11?.['Allowed website URL'] || 'Not set'}</span>
              <span>
                <Headphones size={18} />
                {item.data?.screen_7?.['Voice agent'] || 'Choose agent'}
              </span>
              <span>
                <em className={item.status === 'published' ? 'live' : 'draft'}>
                  ● {item.status === 'published' ? 'Live' : 'Draft'}
                </em>
              </span>
              <span>
                {new Date(item.updatedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
              <span>
                <button
                  onClick={() => {
                    localStorage.setItem('chatbucket:widget', item._id);
                    router.push('/flow/8');
                  }}
                >
                  <Edit3 size={15} /> Edit
                </button>
              </span>
            </div>
          ))}
          {visible.length === 0 && (
            <p className={'widget-empty p-7.5 text-center text-[#b5b5c4]'}>
              No widgets match this search. Create a voice widget to continue.
            </p>
          )}
        </div>
      </div>
      {open && (
        <div
          className={
            'widget-drawer-backdrop fixed inset-0 bg-[rgba(0,_0,_0,_.52)] z-[110] flex justify-end'
          }
          onClick={() => setOpen(false)}
        >
          <aside
            className={
              'widget-create-drawer w-[min(530px,_100vw)] h-screen overflow-auto bg-[#211f28] border-l border-l-[#4b435d] p-[28px_24px_100px] relative shadow-[-20px_0_70px_#0008] [&_h3]:mt-5 [&>.field]:m-[18px_0]'
            }
            onClick={(e) => e.stopPropagation()}
            aria-label="Create Voice Widget"
          >
            <div
              className={
                'widget-drawer-heading flex gap-3.5 justify-between [&_h2]:text-[23px] [&_h2]:m-[0_0_7px] [&_p]:text-[#bcbccb] [&_p]:text-[13px] [&_p]:leading-[1.4] [&_p]:m-0 [&_button]:h-7.5 [&_button]:bg-none [&_button]:border-0 [&_button]:text-white [&_button]:cursor-pointer'
              }
            >
              <div>
                <h2>Create Voice Widget</h2>
                <p>Connect a saved voice agent to a website.</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div
              className={
                'widget-drawer-steps flex justify-between gap-1.25 border-b border-b-[#48434c] m-[25px_0] pb-7 [&_span]:flex [&_span]:flex-col [&_span]:items-center [&_span]:gap-1.75 [&_span]:text-center [&_span]:min-w-0 [&_span]:flex-1 [&_span]:text-[#b4b0c4] [&_span]:text-[10px] [&_b]:border [&_b]:border-[#636272] [&_b]:w-7.5 [&_b]:h-7.5 [&_b]:grid [&_b]:place-items-center [&_b]:rounded-full [&_b]:text-xs [&_b.current]:bg-[#6740df] [&_b.current]:border-0 [&_b.current]:text-white'
              }
            >
              {['Agent', 'Appearance', 'Conversation', 'Website & hours', 'Test & install'].map(
                (label, i) => (
                  <span key={label}>
                    <b className={i === 0 ? 'current' : ''}>{i + 1}</b>
                    {label}
                  </span>
                ),
              )}
            </div>
            <h3>Select a voice agent</h3>
            <p className={'muted text-(--muted) m-0 leading-normal'}>
              Choose a ready agent to connect to this widget.
            </p>
            <label
              className={
                'field grid gap-2 text-sm [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#454551] [&_textarea]:bg-[#202128] [&_textarea]:p-[12px_13px] [&_textarea]:text-[#f5f5f8] [&_textarea]:outline-0 [&_textarea]:text-sm [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#454551] [&_select]:bg-[#202128] [&_select]:p-[12px_13px] [&_select]:text-[#f5f5f8] [&_select]:outline-0 [&_select]:text-sm [&_textarea]:resize-y [&_textarea]:leading-normal [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] [&_textarea:focus]:border-[#a47aff] [&_textarea:focus]:shadow-[0_0_0_3px_#7646e323] [&_select:focus]:border-[#a47aff] [&_select:focus]:shadow-[0_0_0_3px_#7646e323] [&_small]:text-(--muted) [&_small]:text-xs'
              }
            >
              <span className={'field-label text-[#f0eff5] font-[540]'}>Widget name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Website Voice Support"
              />
            </label>
            <p className={'field-label text-[#f0eff5] font-[540]'}>Voice agent</p>
            <div
              className={
                'agent-choice-list grid gap-2 m-[10px_0_18px] [&_button]:flex [&_button]:gap-2.25 [&_button]:items-center [&_button]:w-full [&_button]:text-left [&_button]:bg-[#25242c] [&_button]:border [&_button]:border-[#454251] [&_button]:rounded-lg [&_button]:text-[#f7f4ff] [&_button]:p-2.5 [&_button]:cursor-pointer [&_button.active]:border-[#9766ff] [&_button.active]:bg-[#342647] [&_button:disabled]:opacity-50 [&_button:disabled]:cursor-not-allowed [&_button>span:first-child]:bg-[#433064] [&_button>span:first-child]:text-[#c6a5ff] [&_button>span:first-child]:grid [&_button>span:first-child]:place-items-center [&_button>span:first-child]:w-9.75 [&_button>span:first-child]:h-9.75 [&_button>span:first-child]:rounded-lg [&_button>span:nth-child(2)]:flex-1 [&_button>span:nth-child(2)]:min-w-0 [&_strong]:block [&_small]:block [&_small]:text-[10px] [&_small]:text-[#aaaabd] [&_small]:overflow-hidden [&_small]:text-ellipsis [&_small]:whitespace-nowrap [&_em]:text-[10px] [&_em]:text-[#4ddba6] [&_em]:not-italic [&_b]:border [&_b]:border-[#8b72c6] [&_b]:rounded-full [&_b]:w-5 [&_b]:h-5 [&_b]:grid [&_b]:place-items-center'
              }
            >
              {agents.map((agent) => (
                <button
                  key={agent._id}
                  className={agentId === agent._id ? 'active' : ''}
                  onClick={() => setAgentId(agent._id)}
                  disabled={agent.status !== 'ready'}
                >
                  <span>
                    <Headphones size={20} />
                  </span>
                  <span>
                    <strong>{agent.name}</strong>
                    <small>
                      {agent.voice} · {(agent.languages || []).join(', ')}
                    </small>
                  </span>
                  <em>{agent.status === 'ready' ? '● Ready' : 'Draft'}</em>
                  <b>{agentId === agent._id ? <Check size={16} /> : ''}</b>
                </button>
              ))}
            </div>
            <p
              className={
                'widget-drawer-info border border-[#44414d] bg-[#302e38] rounded-lg p-3.25 text-[#c3c4d0] text-xs flex items-center gap-2.5'
              }
            >
              <Info size={17} /> An agent must be saved and ready before it can be connected.
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
                'widget-drawer-footer sticky bottom--25 bg-[#211f28] p-[18px_0] flex gap-2.25 justify-end border-t border-t-[#45424a] mt-8.75'
              }
            >
              <button
                className={
                  'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,_#7c49f5,_#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className={
                  'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,_#7c49f5,_#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
                disabled={busy}
                onClick={create}
              >
                {busy ? 'Creating…' : 'Continue to appearance'} <ChevronRight size={16} />
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
