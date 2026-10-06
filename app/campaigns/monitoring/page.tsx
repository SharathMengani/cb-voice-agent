import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="campaign-monitoring"
      nextHref="/agent/outbound-handoff"
      previousHref="/campaigns/new/review"
      activeHref="/campaigns/monitoring"
    />
  );
}
