import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="call-history"
      nextHref="/callbacks"
      previousHref="/dashboard"
      activeHref="/calls/history"
    />
  );
}
