import { notFound } from 'next/navigation';
import WorkflowDetail from '../../../../components/WorkflowDetail';
const views = new Set(['node', 'condition', 'validate', 'test', 'versions']);
export default async function Page({ params, searchParams }) {
  const { id, view } = await params;
  if (!views.has(view)) notFound();
  const query = await searchParams;
  return (
    <WorkflowDetail id={id} view={view} nodeId={typeof query.node === 'string' ? query.node : ''} />
  );
}
