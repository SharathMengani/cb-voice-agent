import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="campaign-results"
      nextHref="/campaigns"
      previousHref="/agent/outbound-handoff"
      activeHref="/campaigns/results"
    />
  );
}
