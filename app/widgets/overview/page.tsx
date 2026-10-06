import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="widgets"
      nextHref="/widgets/setup/appearance"
      previousHref="/dashboard"
      activeHref="/widgets/overview"
    />
  );
}
