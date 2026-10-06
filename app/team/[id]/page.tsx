import { TeamMember } from '../../../components/TeamPages';
export default async function Page({ params }) {
  const { id } = await params;
  return <TeamMember id={id} />;
}
