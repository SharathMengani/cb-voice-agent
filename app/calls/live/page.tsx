import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="live-calls"
      nextHref="/calls/takeover"
      previousHref="/dashboard"
      activeHref="/calls/live"
    />
  );
}
