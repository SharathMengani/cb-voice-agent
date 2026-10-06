import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="call-review"
      nextHref="/agent/live-call"
      previousHref="/agent/inbox"
      activeHref="/agent/call-review"
    />
  );
}
