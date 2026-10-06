import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="widget-availability"
      nextHref="/widgets/setup/publish"
      previousHref="/widgets/setup/handoff"
      activeHref="/widgets"
    />
  );
}
