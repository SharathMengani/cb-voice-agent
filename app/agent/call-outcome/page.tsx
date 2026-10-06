import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="call-outcome"
      nextHref="/customer/call"
      previousHref="/agent/inbox"
      activeHref="/agent/call-outcome"
    />
  );
}
