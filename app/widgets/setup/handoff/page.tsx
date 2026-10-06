import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="widget-handoff"
      nextHref="/widgets/setup/availability"
      previousHref="/widgets/setup/greeting"
      activeHref="/widgets"
    />
  );
}
