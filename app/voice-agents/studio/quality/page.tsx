import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="agent-quality"
      nextHref="/voice-agents/studio/versions"
      previousHref="/voice-agents/studio/advanced"
      activeHref="/voice-agents"
    />
  );
}
