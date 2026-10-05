import {WidgetVerify} from '../../../../../components/WidgetPages';
export default async function Page({params}){const {id,domainId}=await params;return <WidgetVerify id={id} domainId={domainId}/>}
