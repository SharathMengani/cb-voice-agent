import Link from 'next/link';
import { notFound } from 'next/navigation';
import { screens } from '../../../components/flow-data';
const first=['Voice agents list','Agent basics','Voice & languages','Knowledge & actions','Conversation rules','Test & save'];
export default async function Review({params}){
  const {screen}=await params;const number=Number(screen);if(!Number.isInteger(number)||number<1||number>51)notFound();
  const title=number<=6?first[number-1]:screens[number]?.title;
  const route=number===1?'/voice-agents':number<=6?`/voice-agents/new?step=${number-2}`:`/flow/${number}`;
  return <main className="review-page"><header><div><span className="eyebrow">VISUAL QA · SCREEN {String(number).padStart(2,'0')} / 51</span><h1>{title}</h1></div><div><Link className="button secondary" href="/screens">All screens</Link><Link className="button primary" href={route}>Open live screen ↗</Link></div></header><div className="review-grid"><section><h2>Design reference</h2><img src={`/reference/${number}`} alt={`${title} design reference`}/></section><section><h2>Live implementation</h2><iframe title={`Live ${title}`} src={route}/></section></div><p>Compare typography, spacing, alignment and states at the same viewport. Demo login is required in the live pane.</p></main>;
}
