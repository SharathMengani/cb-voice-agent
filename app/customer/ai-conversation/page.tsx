import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="ai-conversation"
      nextHref="/customer/connecting"
      previousHref="/agent/inbox"
      activeHref="/customer/ai-conversation"
    />
  );
}
