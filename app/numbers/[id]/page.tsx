import {NumberRouting} from '../../../components/NumberPages';
export default async function Page({params}){const {id}=await params;return <NumberRouting id={id}/>}
