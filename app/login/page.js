'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AudioLines, ArrowRight, LockKeyhole, UserRound } from 'lucide-react';
import { apiFetch } from '../../components/api-client';

const demos = [
  { label:'Owner workspace',username:'owner@demo.chatbucket',password:'DemoOwner!2026',path:'/flow/13',initial:'S' },
  { label:'Human Agent workspace',username:'agent@demo.chatbucket',password:'DemoAgent!2026',path:'/flow/21',initial:'P' }
];
export default function Login() {
  const router = useRouter();
  const [choice,setChoice]=useState(0);
  const [username,setUsername]=useState(demos[0].username);
  const [password,setPassword]=useState(demos[0].password);
  const [error,setError]=useState('');
  const [pending,setPending]=useState(false);
  function choose(i){setChoice(i);setUsername(demos[i].username);setPassword(demos[i].password);setError('');}
  async function submit(event){event.preventDefault();setPending(true);setError('');try{const response=await apiFetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});const result=await response.json();if(!response.ok)throw Error(result.error||'Sign in failed');router.push(result.role==='agent'?'/flow/21':'/flow/13');router.refresh();}catch(e){setError(e.message)}finally{setPending(false)}}
  return <main className="login-layout"><section className="login-intro"><span className="login-brand"><span className="brand-mark">••<small>⌁</small></span> Chat Bucket <small>Business</small></span><span className="eyebrow">VOICE WORKSPACE · DEMO</span><h1>One workspace for every conversation.</h1><p>Configure voice agents, publish widgets and follow a call from the first AI response to the human handoff.</p><div className="login-steps"><span>01 · Voice Agent</span><span>02 · Website or phone</span><span>03 · Human team</span></div></section><section className="login-panel"><div className="login-card"><span className="heading-icon"><LockKeyhole size={22}/></span><h2>Sign in to ChatBucket</h2><p>This local demo contains sample data. Choose a role to explore the 51-screen flow.</p><div className="login-roles">{demos.map((user,i)=><button type="button" className={choice===i?'selected':''} onClick={()=>choose(i)} key={user.label}><span className="avatar">{user.initial}</span><strong>{user.label}</strong></button>)}</div><form onSubmit={submit} className="field-stack"><label className="field"><span className="field-label">User ID</span><input required autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)}/></label><label className="field"><span className="field-label">Password</span><input required autoComplete="current-password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p className="form-feedback error" role="alert">{error}</p>}<button disabled={pending} className="button primary" type="submit">{pending?'Signing in…':'Open workspace'}<ArrowRight size={18}/></button></form><p className="login-note"><UserRound size={16}/> Demo credentials are local examples. Replace the identity adapter before deploying.</p></div></section></main>;
}
