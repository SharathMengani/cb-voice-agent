import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="human-conversation"
      nextHref="/customer/callback"
      previousHref="/agent/inbox"
      activeHref="/customer/human-conversation"
    />
  );
}
