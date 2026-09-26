'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AudioLines, Bot, CalendarClock, ChevronDown, CircleHelp, History, Inbox, LayoutDashboard, MessageCircle, PanelsTopLeft, Phone, Repeat2, Settings2, Star, Users, Wallet, Workflow, Wrench, Headphones } from 'lucide-react';
import { apiFetch } from './api-client';

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/flow/13' },
  { label: 'Inbox', icon: Inbox, href: '/flow/14' },
  { label: 'Team', icon: Users, href: '/team' },
  { label: 'Live Calls', icon: Phone, href: '/flow/15' },
  { label: 'Callback Requests', icon: CalendarClock, href: '/flow/18' },
  { label: 'Reviews & Ratings', icon: Star, href: '/flow/19' },
  { label: 'History', icon: History, href: '/flow/17' },
  { label: 'Transfers', icon: Repeat2, href: '/flow/20' },
  { label: 'Conversational voice agent', icon: AudioLines, href: '/voice-agents' },
  { label: 'Voice Widgets', icon: PanelsTopLeft, href: '/widgets' },
  { label: 'Workflows', icon: Workflow, href: '/workflows' },
  { label: 'Tools', icon: Wrench, href: '/tools' },
  { label: 'AI Handoff', icon: Headphones, href: '/ai-handoff' },
  { label: 'Campaigns', icon: Repeat2, href: '/flow/43' },
  { label: 'Phone Numbers', icon: Phone, href: '/numbers' },
  { label: 'Call Routing', icon: Phone, href: '/routing' },
  { label: 'Analytics', icon: LayoutDashboard, href: '/flow/41' },
  { label: 'Settings', icon: Settings2, href: '/settings' }
];
const agentNavigation = [
  { label: 'Inbox', icon: Inbox, href: '/flow/21' },
  { label: 'My Calls', icon: Phone, href: '/flow/24' },
  { label: 'History', icon: History, href: '/flow/27' },
  { label: 'Transfers', icon: Repeat2, href: '/flow/26' },
  { label: 'Profile & Settings', icon: Settings2, href: '/flow/21' }
];
export default function Shell({ children, workspace = 'owner', active }) {
  const router=useRouter();
  const [user,setUser]=useState(null);
  const [checking,setChecking]=useState(true);
  useEffect(()=>{
    apiFetch('/api/auth/me').then(async response=>{if(!response.ok)throw Error('Login required');return response.json()}).then(profile=>{setUser(profile);if(profile.role==='agent'&&workspace==='owner')router.replace('/flow/21')}).catch(()=>router.replace('/login')).finally(()=>setChecking(false));
  },[router,workspace]);
  async function logout(){await apiFetch('/api/auth/logout',{method:'POST'});router.push('/login');router.refresh()}
  if(checking||user?.role==='agent'&&workspace==='owner')return <div className="auth-loading">Opening workspace…</div>;
  const items = workspace === 'agent' ? agentNavigation : navigation;
  return <div className="app-shell"><aside className="sidebar"><Link href="/voice-agents" className="brand"><span className="brand-mark">••<small>⌁</small></span><span><strong>Chat Bucket</strong><em>Business</em></span></Link><nav aria-label="Main navigation" className="side-links">{items.map(({ label, icon: Icon, href }) => href ? <Link className={`nav-item ${active === href || (active?.startsWith('/workflows') && href === '/workflows') || (!active && href === '/voice-agents') ? 'selected' : ''}`} key={label} href={href}><Icon size={20}/><span>{label}</span></Link> : <span title="This workspace is outside the voice flow" className="nav-item upcoming" key={label}><Icon size={20}/><span>{label}</span></span>)}</nav><div className="side-bottom"><CircleHelp size={19}/> Support <span>↗</span></div></aside><div className="main-shell"><header className="topbar"><span className="topbar-context">{user?.organizationId==='acme-support'?'Acme Support':user?.organizationId==='second-merchant'?'Second Merchant':user?.organizationId||'Workspace'} <ChevronDown size={15}/></span><div className="topbar-right">{process.env.NEXT_PUBLIC_DEMO_MODE==='true'&&<span className="demo-pill">DEMO</span>}<div className="workspace-switch"><Link href="/flow/13" className={workspace === 'owner' ? 'active' : ''}>Owner workspace</Link><Link href="/flow/21" className={workspace === 'agent' ? 'active' : ''}>Human Agent</Link></div><span className="credit-pill"><Wallet size={17}/> 204,264.084 Credits</span><span className="header-divider"/><span className="avatar">{workspace === 'agent' ? 'P' : 'S'}</span><span className="owner">{user?.name||(workspace === 'agent' ? 'Priya Sharma' : 'Sharath')} <small>{workspace === 'agent' ? 'Human agent' : 'Owner'}</small></span><button className="logout" onClick={logout}>Sign out</button></div></header><main className="page-content">{children}</main></div></div>;
}
