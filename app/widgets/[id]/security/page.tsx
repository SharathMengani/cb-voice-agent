import { WidgetSecurity } from '../../../../components/WidgetPages';
export default async function Page({ params }) {
  const { id } = await params;
  return <WidgetSecurity id={id} />;
}
