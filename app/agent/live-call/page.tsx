import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="live-call"
      nextHref="/agent/call-outcome"
      previousHref="/agent/inbox"
      activeHref="/agent/live-call"
    />
  );
}
