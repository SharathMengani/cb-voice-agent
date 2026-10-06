import FlowScreen from '../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="dashboard"
      nextHref="/inbox"
      previousHref="/dashboard"
      activeHref="/dashboard"
    />
  );
}
