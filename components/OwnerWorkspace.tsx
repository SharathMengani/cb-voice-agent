'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, AudioLines, CheckCircle2, Clock3, Headphones, PhoneIncoming, Repeat2, Search, Star, UserRound } from 'lucide-react';
import { apiFetch } from './api-client';

const statusText={waiting:'Waiting for human',human:'Human connected','transfer-pending':'Transfer pending',ended:'Completed',requested:'New request',assigned:'Assigned',completed:'Completed',submitted:'Submitted'};
const groups={14:['Incoming voice requests','Review customer context before an owner or agent accepts the handoff.'],15:['Live call monitoring','See live ownership and waiting requests across your team.'],16:['Owner call takeover','Accept a waiting call or take responsibility for an active conversation.'],17:['Call history & transcript','Review completed calls, outcome notes and transcript events.'],18:['Callback requests','Assign a follow-up and keep its status visible to the team.'],19:['Reviews & ratings','Read feedback submitted after customer calls.'],20:['Transfers','Track calls offered to another department or agent.']};

function details(item,number){
  if(number===18)return [['Phone',item.data?.screen_32?.['Phone number']||item.data?.screen_18?.['Phone number']||'Not given'],['Request',item.data?.screen_32?.['How can we help?']||item.data?.screen_18?.Reason||'No details'],['Preferred time',item.data?.screen_32?.['Preferred time']||'Not specified']];
  if(number===19)return [['Rating',`${item.data?.screen_33?.Rating||'—'} / 5`],['Feedback',item.data?.screen_33?.['Your feedback']||'No written feedback']];
  return [['Department',item.data?.screen_14?.Department||'Customer Support'],['Request',item.data?.screen_14?.['Issue summary']||'No summary available'],['Assigned to',item.data?.assignedAgent||'Unassigned'],['Source',item.data?.source==='phone'?'Phone':'Website']];
}

export default function OwnerWorkspace({number,records,selected,onSelect,onUpdate}){
  const router=useRouter();
  const [search,setSearch]=useState('');
  const [feedback,setFeedback]=useState('');
  const [working,setWorking]=useState(false);
  const [assignedAgent,setAssignedAgent]=useState('Priya Sharma');
  const visible=useMemo(()=>records.filter(item=>{
    if(number===14)return item.status==='waiting';
    if(number===15)return ['waiting','human','transfer-pending'].includes(item.status);
    if(number===16)return ['waiting','human','transfer-pending'].includes(item.status);
    if(number===17)return item.status==='ended';
    if(number===20)return item.status==='transfer-pending'||Boolean(item.data?.screen_25);
    return true;
  }).filter(item=>`${item.title} ${item.status} ${item.data?.screen_14?.['Issue summary']||''}`.toLowerCase().includes(search.toLowerCase())),[records,number,search]);
  const active=visible.find(item=>item._id===selected?._id)||visible[0];
  const waiting=records.filter(item=>item.status==='waiting').length;
  const humans=records.filter(item=>item.status==='human').length;
  const finished=records.filter(item=>item.status==='ended').length;

  async function patch(item,status,data={}){
    setWorking(true);setFeedback('');
    try{
      const response=await apiFetch(`/api/records/${number===18?'callback':'call'}/${item._id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({...(status&&status!==item.status?{status}:{}),data})});
      const result=await response.json();
      if(!response.ok)throw Error(result.error||'Update failed.');
      await onUpdate();
      if(number===16)router.push('/flow/24');
      else setFeedback(number===18?`Callback assigned to ${assignedAgent}.`:'Call assigned to the owner.');
    }catch(error){setFeedback(error.message)}finally{setWorking(false)}
  }
  const [title,subtitle]=groups[number];
  return <div className="owner-workspace">
    <div className="flow-breadcrumb"><Link href="/flow/13">← Voice overview</Link><span> / {title}</span></div>
    <header className="owner-workspace-heading"><div><p className="eyebrow">OWNER WORKSPACE · VOICE</p><h1>{title}</h1><p className="muted">{subtitle}</p></div><span className="date-chip">Acme Support · Demo</span></header>
    <div className="owner-workspace-stats"><div><span><PhoneIncoming size={19}/></span><small>Waiting requests</small><strong>{number===18||number===19? '—':waiting}</strong></div><div><span><Headphones size={19}/></span><small>{number===18?'Unassigned callbacks':number===19?'Feedback received':'Live human calls'}</small><strong>{number===18?records.filter(r=>r.status==='requested').length:number===19?records.length:humans}</strong></div><div><span><CheckCircle2 size={19}/></span><small>{number===18?'Completed callbacks':number===19?'Five-star reviews':'Completed calls'}</small><strong>{number===18?records.filter(r=>r.status==='completed').length:number===19?records.filter(r=>r.data?.screen_33?.Rating==='5').length:finished}</strong></div></div>
    {feedback&&<div role="status" className="flow-alert">{feedback}</div>}
    <div className="owner-workspace-grid"><section className="form-card owner-workspace-list"><div className="owner-workspace-list-head"><div><h2>{number===17?'Completed calls':number===20?'Transfer activity':number===19?'Customer reviews':number===18?'Follow-up queue':'Current calls'}</h2><p>{visible.length} shown · latest first</p></div><label><Search size={17}/><input value={search} onChange={event=>setSearch(event.target.value)} placeholder="Search by caller or issue" aria-label="Search records"/></label></div><div className="owner-workspace-items">{visible.map(item=><button key={item._id} className={`owner-workspace-item ${active?._id===item._id?'selected':''}`} onClick={()=>onSelect(item)}><span className="owner-workspace-avatar">{item.title.split(' ').slice(0,2).map(part=>part[0]).join('').toUpperCase()}</span><span><strong>{item.title}</strong><small>{number===19?item.data?.screen_33?.['Your feedback']||'No written feedback':item.data?.screen_14?.['Issue summary']||item.data?.screen_32?.['How can we help?']||'Review details'}</small></span><em>{statusText[item.status]||item.status}</em></button>)}{!visible.length&&<div className="owner-workspace-empty"><AudioLines size={28}/><strong>No matching records</strong><p>Try another search or return when new activity arrives.</p></div>}</div></section><aside className="form-card owner-workspace-detail"><div className="owner-workspace-detail-head"><span>{number===19?<Star/>:number===20?<Repeat2/>:number===18?<Clock3/>:<UserRound/>}</span><div><h2>{active?.title||'Select a record'}</h2><p>{active?statusText[active.status]||active.status:'Details appear here'}</p></div></div>{active&&<><div className="details-rows">{details(active,number).map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>{number===17&&<div className="owner-workspace-transcript"><h3>Conversation transcript</h3>{active.data?.transcript?.length?active.data.transcript.map((line,index)=><p key={index}><b>{line.speaker}</b> · {line.text}</p>):<p>No transcript was recorded for this demo call.</p>}<h3>Outcome</h3><p>{active.data?.screen_27?.Summary||active.data?.outcome||'No outcome note saved.'}</p></div>}{number===20&&<div className="owner-workspace-transcript"><h3>Transfer note</h3><p>{active.data?.screen_25?.['Reason for transfer']||'No transfer note recorded.'}</p><p>Destination: {active.data?.screen_25?.['Transfer to agent']||active.data?.screen_25?.['Transfer to department']||'Not specified'}</p></div>}{number===18&&active.status!=='completed'&&<div className="owner-workspace-actions"><label className="field"><span className="field-label">Assign to</span><select value={assignedAgent} onChange={event=>setAssignedAgent(event.target.value)}><option>Priya Sharma</option><option>Ravi Kumar</option><option>Sharath</option></select></label><button className="button primary" disabled={working} onClick={()=>patch(active,'assigned',{assignedAgent})}>{working?'Saving…':'Assign callback'} <ArrowRight size={17}/></button></div>}{number===16&&<div className="owner-workspace-actions"><p>Accepting a waiting call connects the owner in the demo and pauses AI responses.</p><button className="button primary" disabled={working} onClick={()=>patch(active,'human',{assignedAgent:'Sharath'})}>{working?'Connecting…':'Take over this call'} <ArrowRight size={17}/></button></div>}{number===14&&<div className="owner-workspace-actions"><Link className="button primary" href="/flow/16" onClick={()=>onSelect(active)}>Review & accept <ArrowRight size={17}/></Link></div>}{number===15&&<div className="owner-workspace-actions"><p>Listening and live media require a connected call provider. Ownership is shown from the saved call state.</p><Link className="button secondary" href="/flow/16" onClick={()=>onSelect(active)}>Owner takeover <ArrowRight size={17}/></Link></div>}{number===20&&active.status==='transfer-pending'&&<div className="owner-workspace-actions"><Link className="button primary" href="/flow/26" onClick={()=>onSelect(active)}>Review transfer <ArrowRight size={17}/></Link></div>}</>}</aside></div>
  </div>;
}
