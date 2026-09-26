'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AudioLines, FilePenLine, Plus, Radio, Search, Sparkles, X } from 'lucide-react';
import Shell from './Shell';
import { apiFetch } from './api-client';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export default function VoiceAgentsList() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [showTip, setShowTip] = useState(true);
  useEffect(() => { apiFetch(`${API}/api/voice-agents`).then(async res => { if (!res.ok) throw Error('Unable to load voice agents. Check that the API is running.'); return res.json(); }).then(setAgents).catch(e => setError(e.message)).finally(() => setLoading(false)); }, []);
  const shown = useMemo(() => agents.filter(a => (filter === 'All' || (filter === 'Ready' ? a.status === 'ready' : a.status === 'draft')) && (a.name || '').toLowerCase().includes(query.toLowerCase())), [agents, filter, query]);
  return <Shell><div className="page-heading"><div><p className="eyebrow">VOICE AGENTS</p><h1>Voice agents</h1><p className="muted">Build agents that answer and resolve customer calls.</p></div><Link className="button primary" href="/voice-agents/new"><Plus size={20}/> Create voice agent</Link></div>
    <div className="stats-grid"><div className="stat-card"><span className="stat-icon purple"><AudioLines/></span><div><span>Total agents</span><strong>{agents.length}</strong></div></div><div className="stat-card"><span className="stat-icon green"><Radio/></span><div><span>Ready agents</span><strong>{agents.filter(a => a.status === 'ready').length}</strong></div></div><div className="stat-card"><span className="stat-icon amber"><FilePenLine/></span><div><span>Draft agents</span><strong>{agents.filter(a => a.status === 'draft').length}</strong></div></div></div>
    {showTip && <div className="info-banner"><span className="banner-symbol"><AudioLines size={32}/></span><div><strong>Connect a voice agent to a Voice Widget to make it available on your site.</strong><p>Once your agent is ready, attach it to a Voice Widget and add it to your website.</p></div><button aria-label="Dismiss tip" onClick={() => setShowTip(false)} className="icon-button"><X size={18}/></button></div>}
    <div className="toolbar"><div className="segmented">{['All','Ready','Draft'].map(v => <button key={v} className={filter === v ? 'active' : ''} onClick={() => setFilter(v)}>{v}</button>)}</div><label className="search"><Search size={19}/><input placeholder="Search voice agents..." aria-label="Search voice agents" value={query} onChange={e => setQuery(e.target.value)}/></label></div>
    <div className="table-card"><div className="table-scroll"><table><thead><tr><th>Agent</th><th>Purpose</th><th>Languages</th><th>Status</th><th>Last updated</th><th>Action</th></tr></thead><tbody>{shown.map(agent => <tr key={agent._id}><td><div className="agent-cell"><span className="mini-wave"><AudioLines size={21}/></span><div><strong>{agent.name}</strong><small>{agent.company || 'Acme Support'}</small></div></div></td><td>{agent.role}</td><td><div className="language-pills">{agent.languages?.slice(0,2).map(l => <span className="pill" key={l}>{l}</span>)}{agent.languages?.length > 2 && <span className="pill">+{agent.languages.length - 2}</span>}</div></td><td><span className={`status ${agent.status === 'ready' ? 'ready' : 'draft'}`}>● {agent.status === 'ready' ? 'Ready' : 'Draft'}</span></td><td>{new Date(agent.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td><td><Link className="button subtle small" href={`/voice-agents/${agent._id}/edit`}>Edit</Link></td></tr>)}</tbody></table></div>{loading && <div className="table-message">Loading agents…</div>}{error && <div role="alert" className="table-message error">{error}</div>}{!loading && !error && shown.length === 0 && <div className="empty-state"><Sparkles size={24}/><strong>{query || filter !== 'All' ? 'No agents match your search' : 'No voice agents yet'}</strong><p>{query || filter !== 'All' ? 'Try a different search or filter.' : 'Create your first voice agent to start configuring calls.'}</p>{!query && filter === 'All' && <Link className="button primary" href="/voice-agents/new">Create voice agent</Link>}</div>}</div>
  </Shell>;
}
