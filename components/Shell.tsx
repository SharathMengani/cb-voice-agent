'use client';
import Link from 'next/link';
import {
  AudioLines, CalendarClock, ChevronDown, CircleHelp, Headphones, History,
  Inbox, LayoutDashboard, PanelsTopLeft, Phone, Repeat2, Settings2, Star,
  Users, Wallet, Workflow, Wrench
} from 'lucide-react';

const navigation = [
  { label:'Dashboard', icon:LayoutDashboard, href:'/flow/13' },
  { label:'Inbox', icon:Inbox, href:'/flow/14' },
  { label:'Team', icon:Users, href:'/team' },
  { label:'Live Calls', icon:Phone, href:'/flow/15' },
  { label:'Callback Requests', icon:CalendarClock, href:'/flow/18' },
  { label:'Reviews & Ratings', icon:Star, href:'/flow/19' },
  { label:'History', icon:History, href:'/flow/17' },
  { label:'Transfers', icon:Repeat2, href:'/flow/20' },
  { label:'Conversational voice agent', icon:AudioLines, href:'/voice-agents' },
  { label:'Voice Widgets', icon:PanelsTopLeft, href:'/widgets' },
  { label:'Workflows', icon:Workflow, href:'/workflows' },
  { label:'Tools', icon:Wrench, href:'/tools' },
  { label:'AI Handoff', icon:Headphones, href:'/ai-handoff' },
  { label:'Campaigns', icon:Repeat2, href:'/flow/43' },
  { label:'Phone Numbers', icon:Phone, href:'/numbers' },
  { label:'Call Routing', icon:Phone, href:'/routing' },
  { label:'Analytics', icon:LayoutDashboard, href:'/flow/41' },
  { label:'Settings', icon:Settings2, href:'/settings' }
];

const agentNavigation = [
  { label:'Inbox', icon:Inbox, href:'/flow/21' },
  { label:'My Calls', icon:Phone, href:'/flow/24' },
  { label:'History', icon:History, href:'/flow/27' },
  { label:'Transfers', icon:Repeat2, href:'/flow/26' },
  { label:'Profile & Settings', icon:Settings2, href:'/flow/21' }
];

export default function Shell({children,workspace='owner',active=''}) {
  const items=workspace==='agent'?agentNavigation:navigation;
  const user=workspace==='agent'?'Priya Sharma':'Sharath';
  return <div className={"app-shell [display:flex] [min-height:100vh] max-[800px]:[display:block]"}>
    <aside className={"sidebar [width:270px] [flex:none] [display:flex] [flex-direction:column] [border-right:1px_solid_#30313b] [background:linear-gradient(160deg,_#1a1a21,_#17171e_48%,_#21172d)] [position:sticky] [top:0] [height:100vh] max-[1100px]:[width:224px] max-[800px]:[position:static] max-[800px]:[width:auto] max-[800px]:[height:auto] max-[800px]:[display:block]"}>
      <Link href="/voice-agents" className={"brand [height:78px] [display:flex] [align-items:center] [gap:11px] [padding:0_29px] [border-bottom:1px_solid_var(--line)] [&_strong]:[display:block] [&_strong]:[font-size:24px] [&_strong]:[letter-spacing:-.6px] [&_strong]:[white-space:nowrap] [&_em]:[display:block] [&_em]:[font-style:normal] [&_em]:[font-size:14px] [&_em]:[color:#aeb0c2] [&_em]:[margin-top:-3px] max-[1100px]:[padding:0_16px] max-[1100px]:[&_strong]:[font-size:20px] max-[800px]:[height:62px]"}><span className={"brand-mark [display:flex] [width:43px] [height:43px] [border-radius:50%] [background:#f7f7ff] [color:#14151d] [justify-content:center] [align-items:center] [letter-spacing:-1px] [font-size:20px] [position:relative] [font-weight:bold] [&_small]:[position:absolute] [&_small]:[right:-5px] [&_small]:[bottom:-7px] [&_small]:[color:#fafaff] [&_small]:[font-size:20px]"}>CB</span><span><strong>Chat Bucket</strong><em>Business</em></span></Link>
      <nav aria-label="Main navigation" className={"side-links [display:flex] [flex-direction:column] [gap:6px] [padding:29px_12px] max-[800px]:[flex-direction:row] max-[800px]:[overflow:auto] max-[800px]:[padding:8px]"}>{items.map(({label,icon:Icon,href})=><Link className={(`nav-item [min-height:51px] [display:flex] [gap:16px] [align-items:center] [padding:0_15px] [color:#d8d7e5] [font-size:14px] [border-radius:8px] [&.selected]:[background:linear-gradient(100deg,_#3a2864,_#5a38a8)] [&.selected]:[color:#fff] [&.selected]:[box-shadow:inset_3px_0_#956dff] [&.upcoming]:[opacity:.76] [&.upcoming]:[cursor:default] [&_svg]:[flex:none] max-[800px]:[white-space:nowrap] max-[800px]:[min-height:40px] max-[800px]:[padding:0_10px] max-[800px]:[font-size:12px] max-[800px]:[&.upcoming]:[display:none] ${active===href||(active?.startsWith('/workflows')&&href==='/workflows')||(!active&&href==='/voice-agents')?'selected':''}`)} key={label} href={href}><Icon size={20}/><span>{label}</span></Link>)}</nav>
      <div className={"side-bottom [margin:auto_20px_23px] [padding-top:22px] [border-top:1px_solid_var(--line)] [display:flex] [align-items:center] [gap:10px] [color:var(--muted)] [font-size:14px] [&_span]:[margin-left:auto] max-[800px]:[display:none]"}><CircleHelp size={19}/> Support <span>+</span></div>
    </aside>
    <div className={"main-shell [min-width:0] [flex:1]"}>
      <header className={"topbar [height:78px] [border-bottom:1px_solid_var(--line)] [display:flex] [align-items:center] [justify-content:space-between] [padding:0_34px] max-[800px]:[height:54px] max-[800px]:[padding:0_14px]"}>
        <span className={"topbar-context [color:#a3a3b3] [font-size:14px] [display:flex] [align-items:center] [gap:8px] max-[800px]:[display:none]"}>Acme Support <ChevronDown size={15}/></span>
        <div className={"topbar-right [display:flex] [align-items:center] [gap:15px] [font-size:14px] max-[600px]:[width:100%] max-[600px]:[&_.avatar]:[display:none]"}>
          <span className={"demo-pill [font-size:11px] [font-weight:700] [letter-spacing:.7px] [padding:6px_8px] [border-radius:5px] [border:1px_solid_#815ce1] [color:#e9deff] [background:#4a3280]"}>LOCAL DEMO</span>
          <div className={"workspace-switch [display:flex] [padding:3px] [border:1px_solid_#3f3d4c] [border-radius:8px] [&_a]:[padding:7px_9px] [&_a]:[color:#aca9bb] [&_a]:[font-size:12px] [&_a]:[border-radius:6px] [&_a]:[white-space:nowrap] [&_a.active]:[color:#fff] [&_a.active]:[background:#523289] max-[1140px]:[&_a]:[font-size:11px] max-[600px]:[margin-right:auto]"}><Link href="/flow/13" className={(workspace==='owner [font-weight:600] [&_small]:[display:block] [&_small]:[color:var(--muted)] [&_small]:[font-size:12px] [&_small]:[font-weight:400] max-[800px]:[display:none]'?'active':'')}>Owner workspace</Link><Link href="/flow/21" className={(workspace==='agent'?'active':'')}>Human Agent</Link></div>
          <span className={"credit-pill [border:1px_solid_var(--line)] [border-radius:30px] [padding:9px_15px] [display:flex] [gap:9px] [align-items:center] [white-space:nowrap] max-[800px]:[font-size:11px] max-[1140px]:[display:none]"}><Wallet size={17}/> 204,264.084 Credits</span>
          <span className={"header-divider [height:25px] [width:1px] [background:var(--line)] max-[600px]:[display:none]"}/><span className={"avatar [display:grid] [place-items:center] [width:38px] [height:38px] [border-radius:50%] [background:linear-gradient(130deg,_#8e59ff,_#4c28c4)]"}>{workspace==='agent'?'P':'S'}</span>
          <span className={"owner [font-weight:600] [&_small]:[display:block] [&_small]:[color:var(--muted)] [&_small]:[font-size:12px] [&_small]:[font-weight:400] max-[800px]:[display:none]"}>{user}<small>{workspace==='agent'?'Human agent':'Owner'}</small></span>
        </div>
      </header>
      <main className={"page-content [padding:31px_32px_64px] [max-width:1600px] [margin:auto] max-[1100px]:[padding:27px_20px] max-[800px]:[padding:23px_14px] [line-height:1.45]"}>{children}</main>
    </div>
  </div>;
}
