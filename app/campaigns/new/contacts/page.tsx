import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="campaign-contacts"
      nextHref="/campaigns/new/calling-settings"
      previousHref="/campaigns/new/basics"
      activeHref="/campaigns/new/contacts"
    />
  );
}
