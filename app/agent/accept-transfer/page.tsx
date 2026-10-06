import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="accept-transfer"
      nextHref="/agent/live-call"
      previousHref="/agent/inbox"
      activeHref="/agent/accept-transfer"
    />
  );
}
