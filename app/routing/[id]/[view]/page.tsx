import {notFound} from 'next/navigation';
import {RoutingDetail} from '../../../../components/RoutingPages';
const views=new Set(['hours','after-hours','test','capacity','readiness']);
export default async function Page({params}){const {id,view}=await params;if(!views.has(view))notFound();return <RoutingDetail id={id} view={view}/>}
