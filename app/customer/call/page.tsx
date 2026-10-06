import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="customer-call"
      nextHref="/customer/ai-conversation"
      previousHref="/agent/inbox"
      activeHref="/customer/call"
    />
  );
}
