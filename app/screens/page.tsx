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
        {groups.map((group) => (
          <section
            className="form-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,#1d1e25,#1b1b22)] p-[22px_23px] border-[#363640]"
            key={group.name}
          >
            <h2>{group.name}</h2>
            <div className="screen-index-list grid gap-1 [&_a]:flex [&_a]:gap-3 [&_a]:items-center [&_a]:border-b [&_a]:border-b-(--line) [&_a]:p-[10px_3px] [&_a]:text-[#d6d3e4] [&_a]:text-sm [&_a:hover]:text-[#bd9bff] [&_span]:text-[#9b74ee] [&_span]:font-bold [&_.screen-index-row>a:first-child]:flex-1 [&_.screen-index-row>a:first-child]:min-w-0 [&_.screen-index-row>a:first-child]:border-0 [&_.compare-link]:text-xs [&_.compare-link]:flex-none [&_.compare-link]:text-[#bea0ff]">
              {Array.from({ length: group.last - group.first + 1 }, (_, i) => group.first + i).map(
                (n) => (
                  <div
                    className="screen-index-row flex items-center border-b border-b-(--line) gap-2.25"
                    key={n}
                  >
                    <Link
                      href={
                        n === 1
                          ? '/voice-agents'
                          : n < 7
                            ? `/voice-agents/new?step=${n - 2}`
                            : `/flow/${n}`
                      }
                    >
                      <span>{String(n).padStart(2, '0')}</span>
                      {n <= 6 ? first[n - 1] : screens[n].title}
                    </Link>
                    <Link className="compare-link" href={`/review/${n}`}>
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
