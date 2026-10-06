import FlowScreen from '../../../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="campaign-calling-settings"
      nextHref="/campaigns/new/schedule"
      previousHref="/campaigns/new/contacts"
      activeHref="/campaigns/new/calling-settings"
    />
  );
}
