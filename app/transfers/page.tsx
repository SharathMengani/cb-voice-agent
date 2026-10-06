import FlowScreen from '../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="transfers"
      nextHref="/agent/inbox"
      previousHref="/dashboard"
      activeHref="/transfers"
    />
  );
}
