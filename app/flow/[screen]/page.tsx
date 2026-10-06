import { notFound } from 'next/navigation';
import FlowScreen from '../../../components/FlowScreen';
import { screens } from '../../../components/flow-data';
export function generateStaticParams() {
  return Object.keys(screens).map((screen) => ({ screen }));
}
export default async function Page({ params }) {
  const { screen } = await params;
  if (!screens[screen]) notFound();
  return <FlowScreen number={Number(screen)} />;
}
