import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="campaign-schedule"
      nextHref="/campaigns/new/review"
      previousHref="/campaigns/new/calling-settings"
      activeHref="/campaigns/new/schedule"
    />
  );
}
