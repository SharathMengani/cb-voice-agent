import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="widget-appearance"
      nextHref="/widgets/setup/greeting"
      previousHref="/widgets/overview"
      activeHref="/widgets"
    />
  );
}
