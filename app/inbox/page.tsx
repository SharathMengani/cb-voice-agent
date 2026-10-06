import FlowScreen from '../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen view="inbox" nextHref="/calls/live" previousHref="/dashboard" activeHref="/inbox" />
  );
}
