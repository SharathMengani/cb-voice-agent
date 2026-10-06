'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AudioLines, FilePenLine, Plus, Radio, Search, Sparkles, X } from 'lucide-react';
import Shell from './Shell';
import { apiFetch } from './api-client';

const API = '';
export default function VoiceAgentsList() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [showTip, setShowTip] = useState(true);
  useEffect(() => {
    apiFetch(`${API}/api/voice-agents`)
      .then(async (res) => {
        if (!res.ok) throw Error('Unable to load voice agents.');
        return res.json();
      })
      .then(setAgents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const shown = useMemo(
    () =>
      agents.filter(
        (a) =>
          (filter === 'All' ||
            (filter === 'Ready' ? a.status === 'ready' : a.status === 'draft')) &&
          (a.name || '').toLowerCase().includes(query.toLowerCase()),
      ),
    [agents, filter, query],
  );
  return (
    <Shell>
      <div
        className={
          'page-heading flex items-center justify-between gap-6 mb-6.25 [&_h1]:text-4xl [&_h1]:tracking-[-.8px] [&_h1]:m-[0_0_8px] [&_p.muted]:text-(--muted) [&_p.muted]:m-0 [&_p.muted]:leading-normal max-[800px]:[&_h1]:text-[25px] max-[600px]:items-start max-[600px]:flex-col [&_h1]:font-[690] [&_h1]:tracking-[-.038em]'
        }
      >
        <div>
          <p className={'eyebrow text-[#a782ff] text-[11px] tracking-[2px] font-bold m-[0_0_9px]'}>
            VOICE AGENTS
          </p>
          <h1>Voice agents</h1>
          <p className={'muted text-(--muted) m-0 leading-normal'}>
            Build agents that answer and resolve customer calls.
          </p>
        </div>
        <Link
          className={
            'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,_#7c49f5,_#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
          }
          href="/voice-agents/new"
        >
          <Plus size={20} /> Create voice agent
        </Link>
      </div>
      <div
        className={
          'stats-grid grid grid-cols-3 gap-4 m-[20px_0] max-[800px]:grid-cols-[repeat(3,_1fr)] max-[800px]:gap-2 max-[600px]:grid-cols-1'
        }
      >
        <div
          className={
            'stat-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,_#1d1e25,_#1b1b22)] p-5 flex items-center gap-5 min-h-27.75 [&_span:not(.stat-icon)]:block [&_span:not(.stat-icon)]:text-sm [&_span:not(.stat-icon)]:text-(--muted) [&_span:not(.stat-icon)]:mb-1.75 [&_strong]:block [&_strong]:text-[29px] max-[800px]:p-3 max-[800px]:gap-2 max-[800px]:[&_strong]:text-[22px] max-[800px]:[&_span:not(.stat-icon)]:text-[11px] max-[600px]:min-h-16.25'
          }
        >
          <span
            className={
              'stat-icon purple h-15 w-15 grid place-items-center rounded-[11px] [&.purple]:text-[#ad82ff] [&.purple]:bg-[#35274e] [&.green]:text-(--green) [&.green]:bg-[#1b413b] [&.amber]:text-(--amber) [&.amber]:bg-[#403222] max-[800px]:w-9 max-[800px]:h-9'
            }
          >
            <AudioLines />
          </span>
          <div>
            <span>Total agents</span>
            <strong>{agents.length}</strong>
          </div>
        </div>
        <div
          className={
            'stat-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,_#1d1e25,_#1b1b22)] p-5 flex items-center gap-5 min-h-27.75 [&_span:not(.stat-icon)]:block [&_span:not(.stat-icon)]:text-sm [&_span:not(.stat-icon)]:text-(--muted) [&_span:not(.stat-icon)]:mb-1.75 [&_strong]:block [&_strong]:text-[29px] max-[800px]:p-3 max-[800px]:gap-2 max-[800px]:[&_strong]:text-[22px] max-[800px]:[&_span:not(.stat-icon)]:text-[11px] max-[600px]:min-h-16.25'
          }
        >
          <span
            className={
              'stat-icon green h-15 w-15 grid place-items-center rounded-[11px] [&.purple]:text-[#ad82ff] [&.purple]:bg-[#35274e] [&.green]:text-(--green) [&.green]:bg-[#1b413b] [&.amber]:text-(--amber) [&.amber]:bg-[#403222] max-[800px]:w-9 max-[800px]:h-9'
            }
          >
            <Radio />
          </span>
          <div>
            <span>Ready agents</span>
            <strong>{agents.filter((a) => a.status === 'ready').length}</strong>
          </div>
        </div>
        <div
          className={
            'stat-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,_#1d1e25,_#1b1b22)] p-5 flex items-center gap-5 min-h-27.75 [&_span:not(.stat-icon)]:block [&_span:not(.stat-icon)]:text-sm [&_span:not(.stat-icon)]:text-(--muted) [&_span:not(.stat-icon)]:mb-1.75 [&_strong]:block [&_strong]:text-[29px] max-[800px]:p-3 max-[800px]:gap-2 max-[800px]:[&_strong]:text-[22px] max-[800px]:[&_span:not(.stat-icon)]:text-[11px] max-[600px]:min-h-16.25'
          }
        >
          <span
            className={
              'stat-icon amber h-15 w-15 grid place-items-center rounded-[11px] [&.purple]:text-[#ad82ff] [&.purple]:bg-[#35274e] [&.green]:text-(--green) [&.green]:bg-[#1b413b] [&.amber]:text-(--amber) [&.amber]:bg-[#403222] max-[800px]:w-9 max-[800px]:h-9'
            }
          >
            <FilePenLine />
          </span>
          <div>
            <span>Draft agents</span>
            <strong>{agents.filter((a) => a.status === 'draft').length}</strong>
          </div>
        </div>
      </div>
      {showTip && (
        <div
          className={
            'info-banner border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,_#1d1e25,_#1b1b22)] m-[21px_0] min-h-29 flex items-center gap-5.75 p-[22px_25px] bg-[linear-gradient(100deg,_#22202d,_#201e28)] [&_strong]:text-[17px] [&_p]:text-(--muted) [&_p]:m-[9px_0_0] [&_p]:text-sm max-[600px]:items-start max-[600px]:p-4 max-[600px]:[&_strong]:text-sm'
          }
        >
          <span
            className={
              'banner-symbol bg-[linear-gradient(130deg,_#693be9,_#432c80)] rounded-[13px] w-16.5 h-16.5 grid place-items-center text-[#e0d0ff] flex-none max-[600px]:w-10 max-[600px]:h-10'
            }
          >
            <AudioLines size={32} />
          </span>
          <div>
            <strong>
              Connect a voice agent to a Voice Widget to make it available on your site.
            </strong>
            <p>Once your agent is ready, attach it to a Voice Widget and add it to your website.</p>
          </div>
          <button
            aria-label="Dismiss tip"
            onClick={() => setShowTip(false)}
            className={'icon-button self-start ml-auto text-(--muted) bg-none border-0'}
          >
            <X size={18} />
          </button>
        </div>
      )}
      <div
        className={
          'toolbar flex justify-between items-center gap-5 m-[23px_0_15px] max-[600px]:flex-col max-[600px]:items-stretch'
        }
      >
        <div
          className={
            'segmented inline-flex border border-(--line) rounded-lg overflow-hidden [&_button]:h-10 [&_button]:min-w-19 [&_button]:bg-transparent [&_button]:border-0 [&_button]:border-r [&_button]:border-r-(--line) [&_button]:text-(--muted) [&_button:last-child]:border-r-0 [&_button.active]:bg-(--purple) [&_button.active]:text-white'
          }
        >
          {['All', 'Ready', 'Draft'].map((v) => (
            <button key={v} className={filter === v ? 'active' : ''} onClick={() => setFilter(v)}>
              {v}
            </button>
          ))}
        </div>
        <label
          className={
            'search flex items-center gap-2.5 border border-(--line) rounded-lg p-[0_14px] text-(--muted) min-w-62.5 h-10.75 [&_input]:w-full [&_input]:border-0 [&_input]:outline-0 [&_input]:bg-transparent [&_input]:text-white [&_input]:text-sm max-[600px]:min-w-0'
          }
        >
          <Search size={19} />
          <input
            placeholder="Search voice agents..."
            aria-label="Search voice agents"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div
        className={
          'table-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,_#1d1e25,_#1b1b22)] overflow-hidden'
        }
      >
        <div className={'table-scroll overflow-auto'}>
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Purpose</th>
                <th>Languages</th>
                <th>Status</th>
                <th>Last updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((agent) => (
                <tr key={agent._id}>
                  <td>
                    <div
                      className={
                        'agent-cell flex items-center gap-3.25 [&_strong]:block [&_small]:block [&_small]:mt-1.25 [&_small]:text-(--muted)'
                      }
                    >
                      <span
                        className={
                          'mini-wave bg-[#32244a] text-[#ae81ff] p-2.75 rounded-[9px] grid place-items-center'
                        }
                      >
                        <AudioLines size={21} />
                      </span>
                      <div>
                        <strong>{agent.name}</strong>
                        <small>{agent.company || 'Acme Support'}</small>
                      </div>
                    </div>
                  </td>
                  <td>{agent.role}</td>
                  <td>
                    <div className={'language-pills flex gap-1.25 flex-wrap'}>
                      {agent.languages?.slice(0, 2).map((l) => (
                        <span
                          className={
                            'pill inline-block p-[6px_10px] text-xs bg-[#282833] text-[#d4d1e2] border border-[#393943] rounded-[30px]'
                          }
                          key={l}
                        >
                          {l}
                        </span>
                      ))}
                      {agent.languages?.length > 2 && (
                        <span
                          className={
                            'pill inline-block p-[6px_10px] text-xs bg-[#282833] text-[#d4d1e2] border border-[#393943] rounded-[30px]'
                          }
                        >
                          +{agent.languages.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status inline-flex rounded-[25px] p-[7px_12px] text-[13px] [&.ready]:text-[#5de5b8] [&.ready]:bg-[#133b32] [&.ready]:border [&.ready]:border-[#215544] [&.draft]:text-[#ffd17d] [&.draft]:bg-[#4a351a] [&.draft]:border [&.draft]:border-[#765020]${agent.status === 'ready' ? 'ready' : 'draft'}`}
                    >
                      ● {agent.status === 'ready' ? 'Ready' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    {new Date(agent.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    <Link
                      className={
                        'button subtle small inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,_#7c49f5,_#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                      }
                      href={`/voice-agents/${agent._id}/edit`}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && (
          <div className={'table-message text-center p-8 text-(--muted)'}>Loading agents…</div>
        )}
        {error && (
          <div
            role="alert"
            className={'table-message error text-center p-8 text-(--muted) text-[#ff8f99]!'}
          >
            {error}
          </div>
        )}
        {!loading && !error && shown.length === 0 && (
          <div
            className={
              'empty-state text-center p-8 text-(--muted) p-[52px_20px] [&_svg]:text-[#aa83ff] [&_strong]:block [&_strong]:m-3 [&_strong]:text-white [&_strong]:text-lg [&_p]:m-[0_0_22px] [&_.button]:m-auto'
            }
          >
            <Sparkles size={24} />
            <strong>
              {query || filter !== 'All' ? 'No agents match your search' : 'No voice agents yet'}
            </strong>
            <p>
              {query || filter !== 'All'
                ? 'Try a different search or filter.'
                : 'Create your first voice agent to start configuring calls.'}
            </p>
            {!query && filter === 'All' && (
              <Link
                className={
                  'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,_#7c49f5,_#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
                href="/voice-agents/new"
              >
                Create voice agent
              </Link>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}
