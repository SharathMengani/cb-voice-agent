import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="agent-actions"
      nextHref="/voice-agents/studio/advanced"
      previousHref="/voice-agents/studio/knowledge"
      activeHref="/voice-agents"
    />
  );
}
