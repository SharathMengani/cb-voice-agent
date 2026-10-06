import WorkflowDetail from '../../../components/WorkflowDetail';
export default async function Page({ params }) {
  const { id } = await params;
  return <WorkflowDetail id={id} view="canvas" />;
}
