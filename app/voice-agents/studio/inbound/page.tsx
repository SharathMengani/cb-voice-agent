import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="inbound-routing"
      nextHref="/analytics/voice-agents"
      previousHref="/voice-agents/studio/versions"
      activeHref="/voice-agents"
    />
  );
}
