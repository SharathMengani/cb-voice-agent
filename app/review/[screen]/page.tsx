import Link from 'next/link';
import { notFound } from 'next/navigation';
import { screens } from '../../../components/flow-data';
const first = [
  'Voice agents list',
  'Agent basics',
  'Voice & languages',
  'Knowledge & actions',
  'Conversation rules',
  'Test & save',
];
export default async function Review({ params, searchParams }) {
  const { screen } = await params;
  const number = Number(screen);
  if (!Number.isInteger(number) || number < 1 || number > 51) notFound();
  const title =
    number <= 6
      ? first[number - 1]
      : Object.values(screens).find((config) => config.reference === number)?.title;
  const { path: route } = await searchParams;
  if (
    typeof route !== 'string' ||
    !route.startsWith('/') ||
    new URL(route, 'http://review.local').origin !== 'http://review.local'
  )
    notFound();
  return (
    <main
      className={
        'review-page p-[20px_24px] bg-[#14131b] min-h-screen [&_header]:flex [&_header]:items-center [&_header]:justify-between [&_header]:gap-3.5 [&_header]:mb-4.25 [&_header_h1]:text-[23px] [&_header_h1]:m-[3px_0_0] [&_header>div:last-child]:flex [&_header>div:last-child]:gap-2.5 [&>p]:text-[13px] [&>p]:text-[#aaa4ba] [&_.eyebrow]:text-[11px] max-[850px]:[&_header]:items-start max-[850px]:[&_header]:flex-col'
      }
    >
      <header>
        <div>
          <span
            className={'eyebrow text-[#a782ff] text-[11px] tracking-[2px] font-bold m-[0_0_9px]'}
          >
            VISUAL QA · SCREEN {String(number).padStart(2, '0')} / 51
          </span>
          <h1>{title}</h1>
        </div>
        <div>
          <Link
            className={
              'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
            }
            href="/screens"
          >
            All screens
          </Link>
          <Link
            className={
              'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
            }
            href={route}
          >
            Open live screen ↗
          </Link>
        </div>
      </header>
      <div
        className={
          'review-grid grid grid-cols-[1fr_1fr] gap-3 [&_section]:border [&_section]:border-[#3b364d] [&_section]:rounded-[10px] [&_section]:bg-[#1a1a24] [&_section]:overflow-hidden [&_h2]:text-[15px] [&_h2]:m-0 [&_h2]:p-[13px_16px] [&_h2]:border-b [&_h2]:border-b-[#3b364d] [&_img]:w-full [&_img]:h-auto [&_img]:block [&_iframe]:border-0 [&_iframe]:w-full [&_iframe]:h-[min(100vh,980px)] max-[850px]:grid-cols-1 max-[850px]:[&_iframe]:h-190'
        }
      >
        <section>
          <h2>Design reference</h2>
          <img src={`/reference/${number}`} alt={`${title} design reference`} />
        </section>
        <section>
          <h2>Live implementation</h2>
          <iframe title={`Live ${title}`} src={route} />
        </section>
      </div>
      <p>
        Compare typography, spacing, alignment and states at the same viewport. Demo login is
        required in the live pane.
      </p>
    </main>
  );
}
