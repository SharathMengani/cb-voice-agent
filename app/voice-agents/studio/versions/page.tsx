import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="agent-versions"
      nextHref="/voice-agents/studio/inbound"
      previousHref="/voice-agents/studio/quality"
      activeHref="/voice-agents"
    />
  );
}
