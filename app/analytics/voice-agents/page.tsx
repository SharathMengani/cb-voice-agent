import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="agent-performance"
      nextHref="/customer/inbound-call"
      previousHref="/voice-agents/studio/inbound"
      activeHref="/analytics/voice-agents"
    />
  );
}
