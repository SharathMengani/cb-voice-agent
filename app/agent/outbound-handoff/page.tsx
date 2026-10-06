import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="outbound-handoff"
      nextHref="/campaigns/results"
      previousHref="/campaigns/monitoring"
      activeHref="/agent/outbound-handoff"
    />
  );
}
