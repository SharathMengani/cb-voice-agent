import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="widget-greeting"
      nextHref="/widgets/setup/handoff"
      previousHref="/widgets/setup/appearance"
      activeHref="/widgets"
    />
  );
}
