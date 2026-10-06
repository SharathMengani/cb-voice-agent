import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="call-takeover"
      nextHref="/calls/history"
      previousHref="/dashboard"
      activeHref="/calls/live"
    />
  );
}
