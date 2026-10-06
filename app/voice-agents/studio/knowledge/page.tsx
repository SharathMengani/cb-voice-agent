import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="agent-knowledge"
      nextHref="/voice-agents/studio/actions"
      previousHref="/voice-agents/studio/instructions"
      activeHref="/voice-agents"
    />
  );
}
