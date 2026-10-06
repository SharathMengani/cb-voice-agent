import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="widget-publish"
      nextHref="/dashboard"
      previousHref="/widgets/setup/availability"
      activeHref="/widgets"
    />
  );
}
