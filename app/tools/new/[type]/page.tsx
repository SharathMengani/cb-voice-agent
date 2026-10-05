import {notFound} from 'next/navigation';
import ToolEditor from '../../../../components/ToolEditor';
const types=new Set(['api','transfer','hangup','webhook','handoff','datetime']);
export default async function Page({params}){const {type}=await params;if(!types.has(type))notFound();return <ToolEditor type={type}/>}
