import { WidgetDomains } from '../../../../components/WidgetPages';
export default async function Page({ params }) {
  const { id } = await params;
  return <WidgetDomains id={id} />;
}
