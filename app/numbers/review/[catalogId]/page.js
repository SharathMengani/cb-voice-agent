import {NumberReview} from '../../../../components/NumberPages';
export default async function Page({params}){const {catalogId}=await params;return <NumberReview catalogId={catalogId}/>}
