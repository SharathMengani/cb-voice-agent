import Link from 'next/link';
import Shell from '../../components/Shell';
import { groups, screens } from '../../components/flow-data';
const first = [
  'Voice agents list',
  'Agent basics',
  'Voice & languages',
  'Knowledge & actions',
  'Conversation rules',
  'Test & save',
];
const pageLinks = [
  [
    '/voice-agents',
    '/voice-agents/new?step=0',
    '/voice-agents/new?step=1',
    '/voice-agents/new?step=2',
    '/voice-agents/new?step=3',
    '/voice-agents/new?step=4',
  ],
  [
    '/widgets/overview',
    '/widgets/setup/appearance',
    '/widgets/setup/greeting',
    '/widgets/setup/handoff',
    '/widgets/setup/availability',
    '/widgets/setup/publish',
  ],
  [
    '/dashboard',
    '/inbox',
    '/calls/live',
    '/calls/takeover',
    '/calls/history',
    '/callbacks',
    '/reviews',
    '/transfers',
  ],
  [
    '/agent/inbox',
    '/agent/incoming-call',
    '/agent/call-review',
    '/agent/live-call',
    '/agent/transfer',
    '/agent/accept-transfer',
    '/agent/call-outcome',
  ],
  [
    '/customer/call',
    '/customer/ai-conversation',
    '/customer/connecting',
    '/customer/human-conversation',
    '/customer/callback',
    '/customer/rating',
  ],
  [
    '/voice-agents/studio/instructions',
    '/voice-agents/studio/knowledge',
    '/voice-agents/studio/actions',
    '/voice-agents/studio/advanced',
    '/voice-agents/studio/quality',
    '/voice-agents/studio/versions',
    '/voice-agents/studio/inbound',
    '/analytics/voice-agents',
    '/customer/inbound-call',
  ],
  [
    '/campaigns',
    '/campaigns/new/basics',
    '/campaigns/new/contacts',
    '/campaigns/new/calling-settings',
    '/campaigns/new/schedule',
    '/campaigns/new/review',
    '/campaigns/monitoring',
    '/agent/outbound-handoff',
    '/campaigns/results',
  ],
];
export default function Page() {
  return (
    <Shell>
      <p className="eyebrow text-[#a782ff] text-[11px] tracking-[2px] font-bold m-[0_0_9px]">
        CHATBUCKET BUSINESS
      </p>
      <h1>Voice experience flow</h1>
      <p className="muted text-(--muted) m-0 leading-normal">
        Open any of the 51 views in the product flow. Compare opens its design reference beside the
        live page.
      </p>
      <div className="screen-index grid grid-cols-[repeat(2,1fr)] gap-4 mt-6.25 [&_.form-card_h2]:text-[19px] [&_.form-card_h2]:m-[0_0_16px] max-[850px]:grid-cols-1">
        {groups.map((group, groupIndex) => (
          <section
            className="form-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,#1d1e25,#1b1b22)] p-[22px_23px] border-[#363640]"
            key={group.name}
          >
            <h2>{group.name}</h2>
            <div className="screen-index-list grid gap-1 [&_a]:flex [&_a]:gap-3 [&_a]:items-center [&_a]:border-b [&_a]:border-b-(--line) [&_a]:p-[10px_3px] [&_a]:text-[#d6d3e4] [&_a]:text-sm [&_a:hover]:text-[#bd9bff] [&_span]:text-[#9b74ee] [&_span]:font-bold [&_.screen-index-row>a:first-child]:flex-1 [&_.screen-index-row>a:first-child]:min-w-0 [&_.screen-index-row>a:first-child]:border-0 [&_.compare-link]:text-xs [&_.compare-link]:flex-none [&_.compare-link]:text-[#bea0ff]">
              {Array.from({ length: group.last - group.first + 1 }, (_, i) => group.first + i).map(
                (n, pageIndex) => (
                  <div
                    className="screen-index-row flex items-center border-b border-b-(--line) gap-2.25"
                    key={n}
                  >
                    <Link href={pageLinks[groupIndex][pageIndex]}>
                      <span>{String(n).padStart(2, '0')}</span>
                      {n <= 6
                        ? first[n - 1]
                        : Object.values(screens).find((config) => config.reference === n).title}
                    </Link>
                    <Link
                      className="compare-link"
                      href={`/review/${n}?path=${encodeURIComponent(pageLinks[groupIndex][pageIndex])}`}
                    >
                      Compare
                    </Link>
                  </div>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </Shell>
  );
}
