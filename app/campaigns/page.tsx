import FlowScreen from '../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="campaigns"
      nextHref="/campaigns/new/basics"
      previousHref="/customer/inbound-call"
      activeHref="/campaigns"
    />
  );
}
