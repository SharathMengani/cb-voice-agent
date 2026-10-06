import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="inbound-call"
      nextHref="/campaigns"
      previousHref="/analytics/voice-agents"
      activeHref="/customer/inbound-call"
    />
  );
}
