import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="agent-instructions"
      nextHref="/voice-agents/studio/knowledge"
      previousHref="/voice-agents"
      activeHref="/voice-agents"
    />
  );
}
