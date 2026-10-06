import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="agent-inbox"
      nextHref="/agent/incoming-call"
      previousHref="/agent/inbox"
      activeHref="/agent/inbox"
    />
  );
}
