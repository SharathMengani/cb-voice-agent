import FlowScreen from '../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="reviews"
      nextHref="/transfers"
      previousHref="/dashboard"
      activeHref="/reviews"
    />
  );
}
