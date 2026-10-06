'use client';
import { useState } from 'react';
import {
  AudioLines,
  BookOpen,
  CheckCircle2,
  CirclePlay,
  Megaphone,
  PhoneIncoming,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { apiFetch } from './api-client';

const explain = {
  dashboard: 'Add a sample inbound request to the live queue.',
  inbox: 'Create a new waiting caller with the issue entered on this page.',
  'call-history': 'Read the selected call’s recorded demo events.',
  'live-call': 'The controls update call ownership and outcome in this local demo.',
  'ai-conversation': 'Ask the demo AI a question; its sample FAQ is used to answer.',
  'agent-knowledge': 'Preview a keyword answer from the selected agent’s FAQ.',
  'inbound-call': 'Create a simulated inbound phone call without dialing a number.',
  'campaign-contacts': 'Inspect duplicate and invalid contacts before campaign launch.',
  'campaign-monitoring': 'Run a short campaign simulation and watch counters update.',
  'outbound-handoff': 'Join this sample AI-to-human handoff.',
};
const eligible = new Set([
  'dashboard',
  'inbox',
  'call-history',
  'live-call',
  'ai-conversation',
  'agent-knowledge',
  'inbound-call',
  'campaign-contacts',
  'campaign-monitoring',
  'outbound-handoff',
]);
export default function DemoControls({ view, record, form, agents, onUpdate }) {
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  if (!eligible.has(view)) return null;
  async function run() {
    setBusy(true);
    setResult('');
    try {
      let response;
      if (['dashboard', 'inbox', 'inbound-call'].includes(view))
        response = await apiFetch('/api/demo/calls/inbound', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caller: form['Caller name'] || 'New demo caller',
            issue: form['Issue summary'] || 'Please connect me to support',
            channel: view === 'inbound-call' ? 'phone' : 'web',
            department: form['Department'],
          }),
        });
      else if (['ai-conversation', 'agent-knowledge'].includes(view))
        response = await apiFetch('/api/demo/voice/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentName: form['Voice agent'] || agents[0]?.name,
            question:
              form['Your question'] || form['FAQ question'] || 'How do I install the widget?',
          }),
        });
      else if (view === 'campaign-contacts') {
        if (!record) throw Error('Create a campaign first');
        response = await apiFetch(`/api/demo/campaigns/${record._id}/eligibility`);
      } else if (view === 'campaign-monitoring') {
        if (!record) throw Error('Choose a scheduled campaign first');
        response = await apiFetch(`/api/demo/campaigns/${record._id}/run`, { method: 'POST' });
      } else if (['call-history', 'live-call', 'outbound-handoff'].includes(view)) {
        if (!record) throw Error('Choose a call first');
        response = await apiFetch(`/api/records/call/${record._id}`);
      }
      const value = await response.json();
      if (!response.ok) throw Error(value.error || 'Demo action could not be completed');
      if (['ai-conversation', 'agent-knowledge'].includes(view)) {
        setResult(value.answer);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(value.answer);
          utterance.lang = 'en-IN';
          utterance.rate = 0.94;
          window.speechSynthesis.speak(utterance);
        }
      } else if (view === 'campaign-contacts')
        setResult(
          `${value.uploaded} uploaded · ${value.eligible} eligible · ${value.excluded} excluded (${value.duplicates} duplicate).`,
        );
      else if (view === 'campaign-monitoring')
        setResult(`Campaign ${value.status}. Refreshing counters every few seconds.`);
      else if (['call-history', 'live-call', 'outbound-handoff'].includes(view))
        setResult(
          (value.data?.transcript || [])
            .map((item) => `${item.speaker}: ${item.text}`)
            .join('\n') || 'No transcript events yet.',
        );
      else
        setResult(
          `Demo ${view === 'inbound-call' ? 'phone' : 'web'} call created. Open the owner inbox or human agent workspace to continue.`,
        );
      await onUpdate();
    } catch (error) {
      setResult(error.message);
    } finally {
      setBusy(false);
    }
  }
  async function indexExcerpt() {
    setBusy(true);
    setResult('');
    try {
      const agent = agents.find((item) => item.name === form['Voice agent']);
      if (!agent) throw Error('Select a voice agent first.');
      const source = agent.knowledgeSources?.find((item) => item.status === 'configured');
      if (!source) throw Error('Save a website source first, then enter its demo excerpt.');
      const response = await apiFetch('/api/demo/knowledge/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent._id,
          sourceId: source._id || source.label,
          excerpt: form['Demo source excerpt'],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      setResult(
        `${source.label} · Demo excerpt indexed. Ask a related question to preview the answer. No site was crawled.`,
      );
    } catch (error) {
      setResult(error.message);
    } finally {
      setBusy(false);
    }
  }
  const labels = {
    dashboard: 'Create waiting call',
    inbox: 'Simulate incoming call',
    'call-history': 'Open transcript',
    'live-call': 'Show transcript',
    'ai-conversation': 'Ask demo AI',
    'agent-knowledge': 'Preview answer',
    'inbound-call': 'Simulate phone call',
    'campaign-contacts': 'Check eligibility',
    'campaign-monitoring': 'Run campaign demo',
    'outbound-handoff': 'View AI context',
  };
  return (
    <section
      className={
        'demo-control border border-[#645198] bg-[linear-gradient(110deg,#26213a,#211e2c)] p-[18px_20px] rounded-[11px] m-[18px_0] [&_h3]:m-[0_0_5px] [&_h3]:text-base [&_p]:text-[#c3bed0] [&_p]:text-[13px] [&_p]:leading-normal [&_p]:m-0 [&_.helper-text]:mt-2.5'
      }
    >
      <span
        className={
          'demo-control-tag inline-block text-[#c7a7ff] text-[11px] tracking-[.11em] font-bold mb-3'
        }
      >
        INTERACTIVE DEMO
      </span>
      <div
        className={
          'demo-control-content flex items-center gap-3.5 [&>div]:flex-1 max-[650px]:flex-wrap max-[650px]:[&_.button]:w-full'
        }
      >
        <span
          className={
            'heading-icon bg-[#362452] text-[#bf9aff] rounded-lg w-10.5 h-10.5 grid place-items-center flex-none'
          }
        >
          {['campaign-monitoring', 'campaign-contacts'].includes(view) ? (
            <Megaphone size={20} />
          ) : view === 'agent-knowledge' ? (
            <BookOpen size={20} />
          ) : (
            <AudioLines size={20} />
          )}
        </span>
        <div>
          <h3>{labels[view]}</h3>
          <p>{explain[view]}</p>
        </div>
        {view === 'agent-knowledge' && (
          <button
            className={
              'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
            }
            disabled={busy}
            onClick={indexExcerpt}
          >
            Index demo excerpt
          </button>
        )}
        <button
          className={
            'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
          }
          disabled={busy}
          onClick={run}
        >
          {busy ? 'Running…' : labels[view]}
        </button>
      </div>
      {result && (
        <pre
          className={
            'demo-result m-[17px_0_0] whitespace-pre-wrap leading-[1.6] text-[#d9d2eb] text-sm bg-[#1b1a29] p-3.75 border border-[#4e4067] rounded-[9px]'
          }
          role="status"
        >
          {result}
        </pre>
      )}
    </section>
  );
}
