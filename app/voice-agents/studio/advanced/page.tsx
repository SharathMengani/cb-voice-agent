import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="agent-advanced"
      nextHref="/voice-agents/studio/quality"
      previousHref="/voice-agents/studio/actions"
      activeHref="/voice-agents"
    />
  );
}
