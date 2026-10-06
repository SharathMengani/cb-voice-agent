import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="connecting"
      nextHref="/customer/human-conversation"
      previousHref="/agent/inbox"
      activeHref="/customer/connecting"
    />
  );
}
