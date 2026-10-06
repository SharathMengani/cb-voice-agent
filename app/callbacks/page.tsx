import FlowScreen from '../../components/FlowScreen';

export default function Page() {
  return (
    <FlowScreen
      view="callbacks"
      nextHref="/reviews"
      previousHref="/dashboard"
      activeHref="/callbacks"
    />
  );
}
