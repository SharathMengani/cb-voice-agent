'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  AudioLines,
  CalendarDays,
  GitBranch,
  Globe2,
  PhoneForwarded,
  PhoneOff,
  Plus,
  Search,
  Webhook,
} from 'lucide-react';
import Shell from './Shell';
import { apiFetch } from './api-client';
export const catalog = [
  {
    type: 'api',
    title: 'API Request',
    description: 'Prepare requests to a secure external API',
    icon: Globe2,
    accent: 'blue',
  },
  {
    type: 'transfer',
    title: 'Transfer call',
    description: 'Choose a voice agent and pass along a summary',
    icon: PhoneForwarded,
    accent: 'green',
  },
  {
    type: 'hangup',
    title: 'Hang up',
    description: 'Close a conversation with a message',
    icon: PhoneOff,
    accent: 'rose',
  },
  {
    type: 'webhook',
    title: 'Received webhook',
    description: 'Map data from an incoming event',
    icon: Webhook,
    accent: 'teal',
  },
  {
    type: 'handoff',
    title: 'AI handoff',
    description: 'Pass context to the human support queue',
    icon: GitBranch,
    accent: 'orange',
  },
  {
    type: 'datetime',
    title: 'Date & time',
    description: 'Format current time for the caller',
    icon: CalendarDays,
    accent: 'purple',
  },
];
export default function ToolCatalog() {
  const [items, setItems] = useState([]),
    [loading, setLoading] = useState(true),
    [query, setQuery] = useState(''),
    [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    apiFetch('/api/tools')
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw Error(data.error || 'Could not load tools.');
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
  const filtered = items.filter((item) =>
    `${item.title} ${item.data.type}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Shell active="/tools">
      <div
        className={
          'tl-page max-w-390 m-[0_auto] p-[8px_8px_55px] text-[#f7f4fc] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_8px] [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_textarea]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_a]:no-underline max-[680px]:p-[4px_0_30px] max-[680px]:[&_h1]:text-[25px]'
        }
      >
        <div
          className={
            'tl-header flex items-center justify-between gap-5 mb-5.75 [&_p]:text-[13px] [&_p]:text-[#bab4c4] [&_p]:leading-normal max-[680px]:items-start max-[680px]:flex-col'
          }
        >
          <div>
            <span className={'tl-kicker text-[11px] font-bold tracking-[.11em] text-[#b390f7]'}>
              BUILD / TOOLS
            </span>
            <h1>Tools</h1>
            <p>
              Configure a tool once, then attach it to a voice workflow. Preview safely before use.
            </p>
          </div>
          <Link
            className={
              'tl-primary inline-flex items-center justify-center gap-2 rounded-[9px] font-bold text-[13px] p-[10px_15px] border border-[#9d76f2] text-white! bg-[#8057e8] whitespace-nowrap [&:hover]:bg-[#916cf3]'
            }
            href="/workflows"
          >
            Open workflows <ArrowRight size={16} />
          </Link>
        </div>
        <div
          className={
            'tl-catalog grid grid-cols-3 gap-3.25 mb-9 max-[1000px]:grid-cols-[repeat(2,1fr)] max-[680px]:grid-cols-1'
          }
        >
          {catalog.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                href={`/tools/new/${item.type}`}
                className={
                  'tl-card bg-[#20212a] border border-[#413c49] rounded-[13px] flex flex-col items-start gap-2.5 min-h-45.25 text-[#f5f0fa] p-4.5 transition-[background,border] duration-150 [&:hover]:border-[#9a71e9] [&:hover]:bg-[#2a2536] [&_strong]:text-sm [&_small]:text-[#bfb8c9] [&_small]:text-xs [&_small]:leading-[1.4] max-[680px]:min-h-37.5'
                }
                key={item.type}
              >
                <span
                  className={`tl-icon w-10.75 h-10.75 flex-none rounded-[11px] grid place-items-center bg-[#413052] text-[#bf9bff] [&.blue]:bg-[#263968] [&.blue]:text-[#93b8ff] [&.green]:bg-[#1e5242] [&.green]:text-[#88e8b4] [&.rose]:bg-[#543344] [&.rose]:text-[#ff99ae] [&.teal]:bg-[#245551] [&.teal]:text-[#87dfd6] [&.orange]:bg-[#5c4230] [&.orange]:text-[#ffc386] [&.purple]:bg-[#4a3466] [&.purple]:text-[#d4a4ff]${item.accent}`}
                >
                  <Icon size={23} />
                </span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
                <span
                  className={
                    'tl-card-add mt-auto flex gap-1.25 items-center text-[#bb9bff] text-xs font-[650]'
                  }
                >
                  <Plus size={16} /> Configure
                </span>
              </Link>
            );
          })}
        </div>
        <div
          className={
            'tl-section-head flex items-center justify-between gap-5 mb-5.75 [&_p]:text-[13px] [&_p]:text-[#bab4c4] [&_p]:leading-normal [&_h2_span]:text-[11px] [&_h2_span]:p-[3px_7px] [&_h2_span]:bg-[#46335c] [&_h2_span]:text-[#cbb5fb] [&_h2_span]:rounded-[50px] [&_p]:m-0 max-[680px]:items-start max-[680px]:flex-col'
          }
        >
          <div>
            <h2>
              Workspace tools <span>{items.length}</span>
            </h2>
            <p>Only ready tools can be attached to a workflow.</p>
          </div>
          <div
            className={
              'tl-search flex gap-1.75 items-center text-[#b8adc6] bg-[#292832] border border-[#4d4558] rounded-lg p-[8px_11px] [&_input]:w-50 [&_input]:border-0 [&_input]:outline-0 [&_input]:text-white [&_input]:bg-none [&_input]:text-[13px] max-[680px]:w-full max-[680px]:[&_input]:w-full'
            }
          >
            <Search size={17} />
            <input
              aria-label="Search tools"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools…"
            />
          </div>
        </div>
        {error && (
          <div
            role="alert"
            className={
              'tl-error m-[11px_0] p-[11px_12px] rounded-lg bg-[#522e3c] border border-[#825066] text-[#ffc0d0] text-xs'
            }
          >
            {error}
          </div>
        )}
        {loading ? (
          <div
            className={
              'tl-empty bg-[#20212a] border border-[#413c49] rounded-[13px] p-15 text-center text-[#bdb6c6] [&_strong]:block [&_strong]:m-[10px_auto] [&_strong]:text-[#d6c3fb] [&_svg]:block [&_svg]:m-[10px_auto] [&_svg]:text-[#d6c3fb]'
            }
          >
            Loading tools…
          </div>
        ) : filtered.length ? (
          <div
            className={
              'tl-list bg-[#20212a] border border-[#413c49] rounded-[13px] overflow-hidden'
            }
          >
            {filtered.map((item) => {
              const kind = catalog.find((c) => c.type === item.data.type),
                Icon = kind?.icon || AudioLines;
              return (
                <Link
                  key={item._id}
                  href={`/tools/${item._id}`}
                  className={
                    'tl-list-row flex items-center gap-3.5 text-[#f4f0f9] p-[13px_17px] border-b border-b-[#393641] last:border-0 [&:hover]:bg-[#2c2738] [&>span:nth-child(2)]:flex-1 [&_strong]:block [&_small]:block [&_small]:text-[11px] [&_small]:text-[#b8afc2] [&_small]:mt-1.25 [&_em]:rounded-[50px] [&_em]:p-[6px_10px] [&_em]:bg-[#51405e] [&_em]:text-[#d7b9f5] [&_em]:text-[11px] [&_em]:not-italic [&_em]:capitalize [&_em.ready]:bg-[#205341] [&_em.ready]:text-[#9ae9c7] max-[680px]:gap-2 max-[680px]:[&>span:nth-child(2)]:min-w-0 max-[680px]:[&_em]:text-[10px]'
                  }
                >
                  <span
                    className={`tl-icon w-10.75 h-10.75 flex-none rounded-[11px] grid place-items-center bg-[#413052] text-[#bf9bff] [&.blue]:bg-[#263968] [&.blue]:text-[#93b8ff] [&.green]:bg-[#1e5242] [&.green]:text-[#88e8b4] [&.rose]:bg-[#543344] [&.rose]:text-[#ff99ae] [&.teal]:bg-[#245551] [&.teal]:text-[#87dfd6] [&.orange]:bg-[#5c4230] [&.orange]:text-[#ffc386] [&.purple]:bg-[#4a3466] [&.purple]:text-[#d4a4ff]${kind?.accent || 'purple'}`}
                  >
                    <Icon size={18} />
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>
                      {kind?.title || item.data.type} · Updated{' '}
                      {new Date(item.updatedAt).toLocaleDateString('en-IN')}
                    </small>
                  </span>
                  <em className={`${item.status} [&]:text-[#ff8f99]!`}>
                    {item.status === 'ready' ? 'Ready' : 'Draft'}
                  </em>
                  <ArrowRight size={17} />
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            className={
              'tl-empty bg-[#20212a] border border-[#413c49] rounded-[13px] p-15 text-center text-[#bdb6c6] [&_strong]:block [&_strong]:m-[10px_auto] [&_strong]:text-[#d6c3fb] [&_svg]:block [&_svg]:m-[10px_auto] [&_svg]:text-[#d6c3fb]'
            }
          >
            <AudioLines size={29} />
            <strong>{query ? 'No matching tools' : 'No tools configured yet'}</strong>
            <p>
              {query
                ? 'Try a different search.'
                : 'Choose a tool above to start configuring your workspace.'}
            </p>
          </div>
        )}
        <p className={'tl-note text-[13px] text-[#bab4c4] leading-normal text-[11px] mt-4'}>
          Configuration preview only. External requests, incoming webhooks and live call controls
          need their provider integrations.
        </p>
      </div>
    </Shell>
  );
}
