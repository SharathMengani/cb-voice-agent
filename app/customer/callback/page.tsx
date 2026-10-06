import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="customer-callback"
      nextHref="/customer/rating"
      previousHref="/agent/inbox"
      activeHref="/customer/callback"
    />
  );
}
