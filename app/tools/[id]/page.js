import ToolEditor from '../../../components/ToolEditor';
export default async function Page({params}){const {id}=await params;return <ToolEditor id={id}/>}
