import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="incoming-call"
      nextHref="/agent/call-review"
      previousHref="/agent/inbox"
      activeHref="/agent/incoming-call"
    />
  );
}
