'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Workflow, Search, ArrowRight, GitBranch } from 'lucide-react';
import Shell from './Shell';
import { apiFetch } from './api-client';
export default function WorkflowList() {
  const [items, setItems] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [filter, setFilter] = useState('');
  useEffect(() => {
    let active = true;
    apiFetch('/api/workflows')
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw Error(data.error || 'Could not load workflows.');
        if (active) setItems(data);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const visible = items.filter((item) =>
    `${item.title} ${item.status}`.toLowerCase().includes(filter.toLowerCase()),
  );
  return (
    <Shell active="/workflows">
      <div
        className={
          'wf-page max-w-400 m-[0_auto] text-[#f7f4fe] p-[8px_8px_55px] [&_*]:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_p]:leading-normal [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_textarea]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] [&_a]:no-underline max-[580px]:p-[4px_0_35px] max-[580px]:[&_h1]:text-[25px]'
        }
      >
        <div
          className={
            'wf-heading flex justify-between items-center gap-5 mb-6.5 [&_p:last-child]:text-[#bcb6cb] max-[900px]:items-start max-[900px]:flex-col max-[580px]:[&>.wf-primary]:w-full'
          }
        >
          <div>
            <p
              className={
                'wf-eyebrow text-[11px] font-bold tracking-[.11em] text-[#a88ff5] m-0 uppercase'
              }
            >
              BUILD / WORKFLOWS
            </p>
            <h1>Workflows</h1>
            <p>Map what happens before, during and after an AI voice conversation.</p>
          </div>
          <Link
            className={
              'wf-primary inline-flex justify-center items-center gap-2 rounded-[9px] p-[11px_15px] text-[13px] font-bold whitespace-nowrap text-white! bg-[#8057e8] border border-[#9773ef] [&:hover]:bg-[#906bf0]'
            }
            href="/workflows/new"
          >
            <Plus size={18} /> Create workflow
          </Link>
        </div>
        <div
          className={
            'wf-summary grid grid-cols-3 gap-3.5 mb-5 [&>div]:border [&>div]:border-[#3d3948] [&>div]:bg-[#1f2029] [&>div]:rounded-[14px] [&>div]:p-5 [&_strong]:block [&_span]:block [&_strong]:text-[26px] [&_span]:text-[#b6b0c2] [&_span]:text-xs [&_span]:mt-1 max-[580px]:gap-1.75 max-[580px]:[&>div]:p-3 max-[580px]:[&_strong]:text-xl max-[580px]:[&_span]:text-[10px]'
          }
        >
          <div>
            <strong>{items.length}</strong>
            <span>Total workflows</span>
          </div>
          <div>
            <strong>{items.filter((x) => x.status === 'published').length}</strong>
            <span>Published</span>
          </div>
          <div>
            <strong>{items.filter((x) => x.status === 'draft').length}</strong>
            <span>Drafts</span>
          </div>
        </div>
        <div
          className={
            'wf-search flex items-center gap-2.5 border border-[#484251] rounded-[9px] bg-[#282731] p-[10px_13px] max-w-106.25 mb-4.5 text-[#b8adca] [&_input]:bg-transparent [&_input]:border-0 [&_input]:outline-none [&_input]:text-white [&_input]:w-full'
          }
        >
          <Search size={18} />
          <input
            aria-label="Search workflows"
            placeholder="Search workflows…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        {error && (
          <p
            className={
              'wf-error flex gap-2.25 items-center p-[11px_13px] rounded-[9px] m-[12px_0] bg-[#512b3c] border border-[#89516b] text-[#ffb7c8] text-[13px]'
            }
            role="alert"
          >
            {error}
          </p>
        )}
        {loading ? (
          <div
            className={
              'wf-empty border border-[#3d3948] bg-[#1f2029] rounded-[14px] text-center p-[65px_20px] text-[#bbb4c7] [&_strong]:block [&_strong]:text-white [&_strong]:m-[12px_0_0] [&_.wf-primary]:mt-3'
            }
          >
            Loading workflows…
          </div>
        ) : visible.length ? (
          <div
            className={
              'wf-list border border-[#3d3948] bg-[#1f2029] rounded-[14px] overflow-hidden'
            }
          >
            {visible.map((item) => (
              <Link
                key={item._id}
                href={`/workflows/${item._id}`}
                className={
                  'wf-list-row flex items-center gap-4.25 p-[17px_20px] text-[#f6f3fc] border-b border-b-[#35323e] [&:last-child]:border-0 [&:hover]:bg-[#292537] max-[580px]:p-3 max-[580px]:gap-2.25 max-[580px]:flex-wrap max-[580px]:[&>.wf-pill]:ml-13.25'
                }
              >
                <span
                  className={
                    'wf-list-icon grid place-items-center w-11.5 h-11.5 flex-none rounded-xl bg-[#372858] text-[#b891ff]'
                  }
                >
                  <Workflow size={22} />
                </span>
                <span
                  className={
                    'wf-list-name flex-1 min-w-0 [&_strong]:block [&_small]:block [&_small]:text-[#bcb4c7] [&_small]:mt-1.5 [&_small]:text-xs max-[580px]:basis-[70%]'
                  }
                >
                  <strong>{item.title}</strong>
                  <small>
                    {item.data?.draft?.trigger === 'outbound' ? 'Outbound' : 'Inbound'} ·{' '}
                    {(item.data?.draft?.nodes || []).length} nodes · Updated{' '}
                    {new Date(item.updatedAt).toLocaleDateString('en-IN')}
                  </small>
                </span>
                <span
                  className={`wf-pill inline-block rounded-[50px] p-[6px_11px] text-[11px] text-[#d2b8ff] bg-[#46335d] [&.published]:text-[#83eac7] [&.published]:bg-[#174638]${item.status}`}
                >
                  {item.status === 'published'
                    ? `Published v${item.data?.versions?.length || 1}`
                    : 'Draft'}
                </span>
                <ArrowRight size={19} />
              </Link>
            ))}
          </div>
        ) : (
          <div
            className={
              'wf-empty border border-[#3d3948] bg-[#1f2029] rounded-[14px] text-center p-[65px_20px] text-[#bbb4c7] [&_strong]:block [&_strong]:text-white [&_strong]:m-[12px_0_0] [&_.wf-primary]:mt-3'
            }
          >
            <GitBranch size={32} />
            <strong>{filter ? 'No matching workflows' : 'No workflows yet'}</strong>
            <p>
              {filter
                ? 'Try another search.'
                : 'Create a flow to connect your voice agent, decisions and call outcome.'}
            </p>
            {!filter && (
              <Link
                className={
                  'wf-primary inline-flex justify-center items-center gap-2 rounded-[9px] p-[11px_15px] text-[13px] font-bold whitespace-nowrap text-white! bg-[#8057e8] border border-[#9773ef] [&:hover]:bg-[#906bf0]'
                }
                href="/workflows/new"
              >
                Create first workflow
              </Link>
            )}
          </div>
        )}
        <p className={'wf-demo-note text-[#bcb6cb] text-xs mt-4.5'}>
          Preview mode: workflow tests do not place phone calls or execute external tools.
        </p>
      </div>
    </Shell>
  );
}
