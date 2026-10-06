'use client';
import Link from 'next/link';
import {
  AudioLines,
  CalendarClock,
  ChevronDown,
  CircleHelp,
  Headphones,
  History,
  Inbox,
  LayoutDashboard,
  PanelsTopLeft,
  Phone,
  Repeat2,
  Settings2,
  Star,
  Users,
  Wallet,
  Workflow,
  Wrench,
} from 'lucide-react';

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/flow/13' },
  { label: 'Inbox', icon: Inbox, href: '/flow/14' },
  { label: 'Team', icon: Users, href: '/team' },
  { label: 'Live Calls', icon: Phone, href: '/flow/15' },
  { label: 'Callback Requests', icon: CalendarClock, href: '/flow/18' },
  { label: 'Reviews & Ratings', icon: Star, href: '/flow/19' },
  { label: 'History', icon: History, href: '/flow/17' },
  { label: 'Transfers', icon: Repeat2, href: '/flow/20' },
  { label: 'Conversational voice agent', icon: AudioLines, href: '/voice-agents' },
  { label: 'Voice Widgets', icon: PanelsTopLeft, href: '/widgets' },
  { label: 'Workflows', icon: Workflow, href: '/workflows' },
  { label: 'Tools', icon: Wrench, href: '/tools' },
  { label: 'AI Handoff', icon: Headphones, href: '/ai-handoff' },
  { label: 'Campaigns', icon: Repeat2, href: '/flow/43' },
  { label: 'Phone Numbers', icon: Phone, href: '/numbers' },
  { label: 'Call Routing', icon: Phone, href: '/routing' },
  { label: 'Analytics', icon: LayoutDashboard, href: '/flow/41' },
  { label: 'Settings', icon: Settings2, href: '/settings' },
];

const agentNavigation = [
  { label: 'Inbox', icon: Inbox, href: '/flow/21' },
  { label: 'My Calls', icon: Phone, href: '/flow/24' },
  { label: 'History', icon: History, href: '/flow/27' },
  { label: 'Transfers', icon: Repeat2, href: '/flow/26' },
  { label: 'Profile & Settings', icon: Settings2, href: '/flow/21' },
];

export default function Shell({ children, workspace = 'owner', active = '' }) {
  const items = workspace === 'agent' ? agentNavigation : navigation;
  const user = workspace === 'agent' ? 'Priya Sharma' : 'Sharath';
  return (
    <div className={'app-shell flex min-h-screen max-[800px]:block'}>
      <aside
        className={
          'sidebar w-67.5 flex-none flex flex-col border-r border-r-[#30313b] bg-[linear-gradient(160deg,#1a1a21,#17171e_48%,#21172d)] sticky top-0 h-screen max-[1100px]:w-56 max-[800px]:static max-[800px]:w-auto max-[800px]:h-auto max-[800px]:block'
        }
      >
        <Link
          href="/voice-agents"
          className={
            'brand h-19.5 flex items-center gap-2.75 p-[0_29px] border-b border-b-(--line) [&_strong]:block [&_strong]:text-[24px] [&_strong]:tracking-[-.6px] [&_strong]:whitespace-nowrap [&_em]:block [&_em]:not-italic [&_em]:text-sm [&_em]:text-[#aeb0c2] [&_em]:-mt-0.75 max-[1100px]:p-[0_16px] max-[1100px]:[&_strong]:text-xl max-[800px]:h-15.5'
          }
        >
          <span
            className={
              'brand-mark flex w-10.75 h-10.75 rounded-full bg-[#f7f7ff] text-[#14151d] justify-center items-center tracking-[-1px] text-xl relative font-[bold] [&_small]:absolute [&_small]:-right-1.25 [&_small]:-bottom-1.75 [&_small]:text-[#fafaff] [&_small]:text-xl'
            }
          >
            CB
          </span>
          <span>
            <strong>Chat Bucket</strong>
            <em>Business</em>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className={
            'side-links flex flex-col gap-1.5 p-[29px_12px] max-[800px]:flex-row max-[800px]:overflow-auto max-[800px]:p-2'
          }
        >
          {items.map(({ label, icon: Icon, href }) => (
            <Link
              className={`nav-item min-h-12.75 flex gap-4 items-center p-[0_15px] text-[#d8d7e5] text-sm rounded-lg [&.selected]:bg-[linear-gradient(100deg,#3a2864,#5a38a8)] [&.selected]:text-white [&.selected]:shadow-[inset_3px_0_#956dff] [&.upcoming]:opacity-[.76] [&.upcoming]:cursor-default [&_svg]:flex-none max-[800px]:whitespace-nowrap max-[800px]:min-h-10 max-[800px]:p-[0_10px] max-[800px]:text-xs max-[800px]:[&.upcoming]:hidden ${active === href || (active?.startsWith('/workflows') && href === '/workflows') || (!active && href === '/voice-agents') ? 'selected' : ''}`}
              key={label}
              href={href}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div
          className={
            'side-bottom m-[auto_20px_23px] pt-5.5 border-t border-t-(--line) flex items-center gap-2.5 text-(--muted) text-sm [&_span]:ml-auto max-[800px]:hidden'
          }
        >
          <CircleHelp size={19} /> Support <span>+</span>
        </div>
      </aside>
      <div className={'main-shell min-w-0 flex-1'}>
        <header
          className={
            'topbar h-19.5 border-b border-b-(--line) flex items-center justify-between p-[0_34px] max-[800px]:h-13.5 max-[800px]:p-[0_14px]'
          }
        >
          <span
            className={
              'topbar-context text-[#a3a3b3] text-sm flex items-center gap-2 max-[800px]:hidden'
            }
          >
            Acme Support <ChevronDown size={15} />
          </span>
          <div
            className={
              'topbar-right flex items-center gap-3.75 text-sm max-[600px]:w-full max-[600px]:[&_.avatar]:hidden'
            }
          >
            <span
              className={
                'demo-pill text-[11px] font-bold tracking-[.7px] p-[6px_8px] rounded-[5px] border border-[#815ce1] text-[#e9deff] bg-[#4a3280]'
              }
            >
              LOCAL DEMO
            </span>
            <div
              className={
                'workspace-switch flex p-0.75 border border-[#3f3d4c] rounded-lg [&_a]:p-[7px_9px] [&_a]:text-[#aca9bb] [&_a]:text-xs [&_a]:rounded-md [&_a]:whitespace-nowrap [&_a.active]:text-white [&_a.active]:bg-[#523289] max-[1140px]:[&_a]:text-[11px] max-[600px]:mr-auto'
              }
            >
              <Link
                href="/flow/13"
                className={
                  workspace ===
                  'owner font-semibold [&_small]:block [&_small]:text-(--muted) [&_small]:text-xs [&_small]:font-normal max-[800px]:hidden'
                    ? 'active'
                    : ''
                }
              >
                Owner workspace
              </Link>
              <Link href="/flow/21" className={workspace === 'agent' ? 'active' : ''}>
                Human Agent
              </Link>
            </div>
            <span
              className={
                'credit-pill border border-(--line) rounded-[30px] p-[9px_15px] flex gap-2.25 items-center whitespace-nowrap max-[800px]:text-[11px] max-[1140px]:hidden'
              }
            >
              <Wallet size={17} /> 204,264.084 Credits
            </span>
            <span className={'header-divider h-6.25 w-px bg-(--line) max-[600px]:hidden'} />
            <span
              className={
                'avatar grid place-items-center w-9.5 h-9.5 rounded-full bg-[linear-gradient(130deg,#8e59ff,#4c28c4)]'
              }
            >
              {workspace === 'agent' ? 'P' : 'S'}
            </span>
            <span
              className={
                'owner font-semibold [&_small]:block [&_small]:text-(--muted) [&_small]:text-xs [&_small]:font-normal max-[800px]:hidden'
              }
            >
              {user}
              <small>{workspace === 'agent' ? 'Human agent' : 'Owner'}</small>
            </span>
          </div>
        </header>
        <main
          className={
            'page-content p-[31px_32px_64px] max-w-400 m-auto max-[1100px]:p-[27px_20px] max-[800px]:p-[23px_14px] leading-[1.45]'
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
