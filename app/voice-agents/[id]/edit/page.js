import AgentWizard from '../../../../components/AgentWizard';
export default async function Page({ params }) { const { id } = await params; return <AgentWizard id={id}/>; }
