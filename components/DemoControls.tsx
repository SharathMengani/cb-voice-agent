'use client';
import { useState } from 'react';
import { AudioLines, BookOpen, CheckCircle2, CirclePlay, Megaphone, PhoneIncoming, Sparkles, Volume2 } from 'lucide-react';
import { apiFetch } from './api-client';

const explain = {13:'Add a sample inbound request to the live queue.',14:'Create a new waiting caller with the issue entered on this page.',17:'Read the selected call’s recorded demo events.',24:'The controls update call ownership and outcome in this local demo.',29:'Ask the demo AI a question; its sample FAQ is used to answer.',35:'Preview a keyword answer from the selected agent’s FAQ.',42:'Create a simulated inbound phone call without dialing a number.',45:'Inspect duplicate and invalid contacts before campaign launch.',49:'Run a short campaign simulation and watch counters update.',50:'Join this sample AI-to-human handoff.'};
const eligible = new Set([13,14,17,24,29,35,42,45,49,50]);
export default function DemoControls({number,record,form,agents,onUpdate}){
  const [result,setResult]=useState('');
  const [busy,setBusy]=useState(false);
  if(!eligible.has(number))return null;
  async function run(){setBusy(true);setResult('');try{
    let response;
    if([13,14,42].includes(number)) response=await apiFetch('/api/demo/calls/inbound',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({caller:form['Caller name']||'New demo caller',issue:form['Issue summary']||'Please connect me to support',channel:number===42?'phone':'web',department:form['Department']})});
    else if([29,35].includes(number))response=await apiFetch('/api/demo/voice/answer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({agentName:form['Voice agent']||agents[0]?.name,question:form['Your question']||form['FAQ question']||'How do I install the widget?'})});
    else if(number===45){if(!record)throw Error('Create a campaign first');response=await apiFetch(`/api/demo/campaigns/${record._id}/eligibility`)}
    else if(number===49){if(!record)throw Error('Choose a scheduled campaign first');response=await apiFetch(`/api/demo/campaigns/${record._id}/run`,{method:'POST'})}
    else if([17,24,50].includes(number)){if(!record)throw Error('Choose a call first');response=await apiFetch(`/api/records/call/${record._id}`)}
    const value=await response.json();if(!response.ok)throw Error(value.error||'Demo action could not be completed');
    if([29,35].includes(number)){setResult(value.answer);if(typeof window!=='undefined'&&'speechSynthesis'in window){window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(value.answer);utterance.lang='en-IN';utterance.rate=.94;window.speechSynthesis.speak(utterance)}}
    else if(number===45)setResult(`${value.uploaded} uploaded · ${value.eligible} eligible · ${value.excluded} excluded (${value.duplicates} duplicate).`);
    else if(number===49)setResult(`Campaign ${value.status}. Refreshing counters every few seconds.`);
    else if([17,24,50].includes(number))setResult((value.data?.transcript||[]).map(item=>`${item.speaker}: ${item.text}`).join('\n')||'No transcript events yet.');
    else setResult(`Demo ${number===42?'phone':'web'} call created. Open the owner inbox or human agent workspace to continue.`);
    await onUpdate();
  }catch(error){setResult(error.message)}finally{setBusy(false)}}
  async function indexExcerpt(){setBusy(true);setResult('');try{const agent=agents.find(item=>item.name===form['Voice agent']);if(!agent)throw Error('Select a voice agent first.');const source=agent.knowledgeSources?.find(item=>item.status==='configured');if(!source)throw Error('Save a website source first, then enter its demo excerpt.');const response=await apiFetch('/api/demo/knowledge/index',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({agentId:agent._id,sourceId:source._id||source.label,excerpt:form['Demo source excerpt']})});const data=await response.json();if(!response.ok)throw Error(data.error);setResult(`${source.label} · Demo excerpt indexed. Ask a related question to preview the answer. No site was crawled.`)}catch(error){setResult(error.message)}finally{setBusy(false)}}
  const labels={13:'Create waiting call',14:'Simulate incoming call',17:'Open transcript',24:'Show transcript',29:'Ask demo AI',35:'Preview answer',42:'Simulate phone call',45:'Check eligibility',49:'Run campaign demo',50:'View AI context'};
  return <section className="demo-control"><span className="demo-control-tag">INTERACTIVE DEMO</span><div className="demo-control-content"><span className="heading-icon">{[49,45].includes(number)?<Megaphone size={20}/>:number===35?<BookOpen size={20}/>:<AudioLines size={20}/>}</span><div><h3>{labels[number]}</h3><p>{explain[number]}</p></div>{number===35&&<button className="button secondary" disabled={busy} onClick={indexExcerpt}>Index demo excerpt</button>}<button className="button secondary" disabled={busy} onClick={run}>{busy?'Running…':labels[number]}</button></div>{result&&<pre className="demo-result" role="status">{result}</pre>}</section>;
}
