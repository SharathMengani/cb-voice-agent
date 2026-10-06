import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="campaign-review"
      nextHref="/campaigns/monitoring"
      previousHref="/campaigns/new/schedule"
      activeHref="/campaigns/new/review"
    />
  );
}
