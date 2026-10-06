import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="call-rating"
      nextHref="/voice-agents/studio/instructions"
      previousHref="/agent/inbox"
      activeHref="/customer/rating"
    />
  );
}
