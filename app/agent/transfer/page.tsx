import FlowScreen from '../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="transfer-call"
      nextHref="/agent/accept-transfer"
      previousHref="/agent/inbox"
      activeHref="/agent/transfer"
    />
  );
}
