import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="campaign-basics"
      nextHref="/campaigns/new/contacts"
      previousHref="/campaigns"
      activeHref="/campaigns/new/basics"
    />
  );
}
