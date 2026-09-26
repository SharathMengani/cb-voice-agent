'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowRight,AudioLines,CalendarDays,GitBranch,Globe2,PhoneForwarded,PhoneOff,Plus,Search,Webhook} from 'lucide-react';
import Shell from './Shell';
import {apiFetch} from './api-client';
export const catalog=[
 {type:'api',title:'API Request',description:'Prepare requests to a secure external API',icon:Globe2,accent:'blue'},
 {type:'transfer',title:'Transfer call',description:'Choose a voice agent and pass along a summary',icon:PhoneForwarded,accent:'green'},
 {type:'hangup',title:'Hang up',description:'Close a conversation with a message',icon:PhoneOff,accent:'rose'},
 {type:'webhook',title:'Received webhook',description:'Map data from an incoming event',icon:Webhook,accent:'teal'},
 {type:'handoff',title:'AI handoff',description:'Pass context to the human support queue',icon:GitBranch,accent:'orange'},
 {type:'datetime',title:'Date & time',description:'Format current time for the caller',icon:CalendarDays,accent:'purple'}
];
export default function ToolCatalog(){
 const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[query,setQuery]=useState(''),[error,setError]=useState('');
 useEffect(()=>{let active=true;apiFetch('/api/tools').then(async r=>{const data=await r.json();if(!r.ok)throw Error(data.error||'Could not load tools.');if(active)setItems(data)}).catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);
 const filtered=items.filter(item=>`${item.title} ${item.data.type}`.toLowerCase().includes(query.toLowerCase()));
 return <Shell active="/tools"><div className="tl-page"><div className="tl-header"><div><span className="tl-kicker">BUILD / TOOLS</span><h1>Tools</h1><p>Configure a tool once, then attach it to a voice workflow. Preview safely before use.</p></div><Link className="tl-primary" href="/workflows">Open workflows <ArrowRight size={16}/></Link></div><div className="tl-catalog">{catalog.map(item=>{const Icon=item.icon;return <Link href={`/tools/new/${item.type}`} className="tl-card" key={item.type}><span className={`tl-icon ${item.accent}`}><Icon size={23}/></span><strong>{item.title}</strong><small>{item.description}</small><span className="tl-card-add"><Plus size={16}/> Configure</span></Link>})}</div><div className="tl-section-head"><div><h2>Workspace tools <span>{items.length}</span></h2><p>Only ready tools can be attached to a workflow.</p></div><div className="tl-search"><Search size={17}/><input aria-label="Search tools" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tools…"/></div></div>{error&&<div role="alert" className="tl-error">{error}</div>}{loading?<div className="tl-empty">Loading tools…</div>:filtered.length?<div className="tl-list">{filtered.map(item=>{const kind=catalog.find(c=>c.type===item.data.type),Icon=kind?.icon||AudioLines;return <Link key={item._id} href={`/tools/${item._id}`} className="tl-list-row"><span className={`tl-icon ${kind?.accent||'purple'}`}><Icon size={18}/></span><span><strong>{item.title}</strong><small>{kind?.title||item.data.type} · Updated {new Date(item.updatedAt).toLocaleDateString('en-IN')}</small></span><em className={item.status}>{item.status==='ready'?'Ready':'Draft'}</em><ArrowRight size={17}/></Link>})}</div>:<div className="tl-empty"><AudioLines size={29}/><strong>{query?'No matching tools':'No tools configured yet'}</strong><p>{query?'Try a different search.':'Choose a tool above to start configuring your workspace.'}</p></div>}<p className="tl-note">Configuration preview only. External requests, incoming webhooks and live call controls need their provider integrations.</p></div></Shell>
}
