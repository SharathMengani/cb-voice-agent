'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  AudioLines,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Headphones,
  Info,
  Mic,
  Phone,
  PhoneCall,
  Play,
  Plus,
  Radio,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Users,
  Volume2,
} from 'lucide-react';
import Shell from './Shell';
import { groups, screens } from './flow-data';
import { apiFetch } from './api-client';
import DemoControls from './DemoControls';
import CustomerWidget from './CustomerWidget';
import OwnerOverview from './OwnerOverview';
import OwnerWorkspace from './OwnerWorkspace';
import AgentInbox from './AgentInbox';
import LiveCallConsole from './LiveCallConsole';
import CampaignDashboard from './CampaignDashboard';
import IncomingCallPopup from './IncomingCallPopup';
import WidgetList from './WidgetList';
import CampaignList from './CampaignList';
import WidgetSetup from './WidgetSetup';
import CallReview from './CallReview';
import TransferPanel from './TransferPanel';
import TransferAccept from './TransferAccept';
import CallOutcome from './CallOutcome';
import AgentStudio from './AgentStudio';
import CampaignWizard from './CampaignWizard';
import OutboundHandoff from './OutboundHandoff';

const API = '';
const nextNumber = (number) => (number < 51 ? number + 1 : 43);
const workflowNext = (number) => ({ 24: 27, 26: 24 })[number] || nextNumber(number);
const groupFor = (number) => groups.find((g) => number >= g.first && number <= g.last);
const navigationFor = (number) =>
  ({
    14: '/flow/14',
    15: '/flow/15',
    16: '/flow/15',
    17: '/flow/17',
    18: '/flow/18',
    19: '/flow/19',
    20: '/flow/20',
    22: '/flow/21',
    23: '/flow/21',
    25: '/flow/26',
    26: '/flow/26',
    27: '/flow/27',
    40: '/flow/40',
    41: '/flow/41',
  })[number] ||
  (number >= 43
    ? '/flow/43'
    : number >= 34
      ? '/voice-agents'
      : number >= 21
        ? '/flow/21'
        : number >= 13
          ? '/flow/13'
          : '/flow/7');
const defaults = {
  'Widget name': 'Website Voice Support',
  'Voice agent': 'Website Support',
  'Campaign name': 'September Renewal Outreach',
  Greeting: 'Welcome to Acme Support. How can I help you today?',
  'Concurrent campaign calls': '5',
  'Reserved inbound slots': '2',
  'Calls per second': '1',
  'Maximum retries': '1',
  Rating: '5',
};
const initialForm = (config) =>
  Object.fromEntries(
    (config.fields || [])
      .filter((field) => defaults[field.label] !== undefined)
      .map((field) => [field.label, defaults[field.label]]),
  );
const friendlyStatus = {
  'transfer-pending': 'Transfer pending',
  'follow-up': 'Follow-up',
  human: 'Human connected',
  waiting: 'Waiting for human',
  ready: 'Ready',
  draft: 'Draft',
  published: 'Published',
  ended: 'Ended',
  running: 'Running',
  scheduled: 'Scheduled',
};

function ConfigField({ field, value, onChange, agents }) {
  const props = {
    value: value ?? defaults[field.label] ?? '',
    onChange: (event) =>
      onChange(field.type === 'switch' ? event.target.checked : event.target.value),
  };
  if (field.type === 'switch')
    return (
      <label
        className={
          "switch-row border-b border-b-(--line) min-h-13.5 flex items-center justify-between gap-3 text-sm cursor-pointer [&_input]:absolute [&_input]:opacity-[0] [&_input]:pointer-events-none [&_i]:inline-block [&_i]:relative [&_i]:rounded-[20px] [&_i]:h-6 [&_i]:w-10.5 [&_i]:bg-[#53525e] [&_i]:flex-none [&_i:after]:content-[''] [&_i:after]:absolute [&_i:after]:w-4.5 [&_i:after]:h-4.5 [&_i:after]:top-0.75 [&_i:after]:left-0.75 [&_i:after]:rounded-full [&_i:after]:bg-white [&_i:after]:transition-transform [&_i:after]:duration-200 [&_input:checked+i]:bg-(--purple) [&_input:checked+i:after]:translate-x-4.5 focus-within:outline-2 focus-within:outline-[#a57cff]"
        }
      >
        <span>{field.label}</span>
        <input type="checkbox" checked={Boolean(value)} onChange={props.onChange} />
        <i />
      </label>
    );
  if (field.type === 'textarea')
    return (
      <label
        className={
          'field grid gap-2 text-sm [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#454551] [&_textarea]:bg-[#202128] [&_textarea]:p-[12px_13px] [&_textarea]:text-[#f5f5f8] [&_textarea]:outline-0 [&_textarea]:text-sm [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#454551] [&_select]:bg-[#202128] [&_select]:p-[12px_13px] [&_select]:text-[#f5f5f8] [&_select]:outline-0 [&_select]:text-sm [&_textarea]:resize-y [&_textarea]:leading-normal [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] [&_textarea:focus]:border-[#a47aff] [&_textarea:focus]:shadow-[0_0_0_3px_#7646e323] [&_select:focus]:border-[#a47aff] [&_select:focus]:shadow-[0_0_0_3px_#7646e323] [&_small]:text-(--muted) [&_small]:text-xs'
        }
      >
        <span className={'field-label text-[#f0eff5] font-[540]'}>{field.label}</span>
        <textarea
          rows={field.label.includes('Contacts') ? 7 : 4}
          {...props}
          placeholder={field.label}
        />
      </label>
    );
  if (field.type === 'select' || field.type === 'agent')
    return (
      <label
        className={
          'field grid gap-2 text-sm [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#454551] [&_textarea]:bg-[#202128] [&_textarea]:p-[12px_13px] [&_textarea]:text-[#f5f5f8] [&_textarea]:outline-0 [&_textarea]:text-sm [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#454551] [&_select]:bg-[#202128] [&_select]:p-[12px_13px] [&_select]:text-[#f5f5f8] [&_select]:outline-0 [&_select]:text-sm [&_textarea]:resize-y [&_textarea]:leading-normal [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] [&_textarea:focus]:border-[#a47aff] [&_textarea:focus]:shadow-[0_0_0_3px_#7646e323] [&_select:focus]:border-[#a47aff] [&_select:focus]:shadow-[0_0_0_3px_#7646e323] [&_small]:text-(--muted) [&_small]:text-xs'
        }
      >
        <span className={'field-label text-[#f0eff5] font-[540]'}>{field.label}</span>
        <select {...props}>
          <option value="">Select {field.label.toLowerCase()}</option>
          {(field.type === 'agent' ? agents.map((a) => a.name) : field.options).map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
    );
  return (
    <label
      className={
        'field grid gap-2 text-sm [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#454551] [&_textarea]:bg-[#202128] [&_textarea]:p-[12px_13px] [&_textarea]:text-[#f5f5f8] [&_textarea]:outline-0 [&_textarea]:text-sm [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#454551] [&_select]:bg-[#202128] [&_select]:p-[12px_13px] [&_select]:text-[#f5f5f8] [&_select]:outline-0 [&_select]:text-sm [&_textarea]:resize-y [&_textarea]:leading-normal [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] [&_textarea:focus]:border-[#a47aff] [&_textarea:focus]:shadow-[0_0_0_3px_#7646e323] [&_select:focus]:border-[#a47aff] [&_select:focus]:shadow-[0_0_0_3px_#7646e323] [&_small]:text-(--muted) [&_small]:text-xs'
      }
    >
      <span className={'field-label text-[#f0eff5] font-[540]'}>{field.label}</span>
      <input type={field.type || 'text'} {...props} placeholder={field.label} />
    </label>
  );
}

export default function FlowScreen({ number }) {
  const config = screens[number];
  const group = groupFor(number);
  const router = useRouter();
  const [records, setRecords] = useState([]);
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState<Record<string, any>>({});
  const [selection, setSelection] = useState('');
  const [feedback, setFeedback] = useState('');
  const [working, setWorking] = useState(false);
  const [microphone, setMicrophone] = useState(false);
  const [search, setSearch] = useState('');
  const [showSnippet, setShowSnippet] = useState(false);
  const [embedOrigin, setEmbedOrigin] = useState('http://localhost:3000');
  const [widgetToken, setWidgetToken] = useState('');
  const [widgetId, setWidgetId] = useState('');
  const preferred = number === 26 ? 'transfer-pending' : number === 27 ? 'ended' : null;
  const record = preferred
    ? records.find((r) => r._id === selection && r.status === preferred) ||
      records.find((r) => r.status === preferred) ||
      records[0]
    : records.find((r) => r._id === selection) || records[0];
  const groupStart = group.first;
  const workspace = number >= 21 && number <= 27 ? 'agent' : 'owner';
  useEffect(() => {
    setFeedback('');
    setShowSnippet(false);
    setForm(initialForm(config));
    setEmbedOrigin(window.location.origin);
    let cancelled = false;
    if (config.type === 'customer') {
      const id = new URLSearchParams(window.location.search).get('widget') || '';
      setWidgetId(id);
      const key = `chatbucket:widget-session:${id}`;
      const queryOrigin = new URLSearchParams(window.location.search).get('origin');
      if (window.parent !== window && queryOrigin)
        sessionStorage.setItem(`chatbucket:widget-origin:${id}`, queryOrigin);
      const parentOrigin =
        queryOrigin ||
        sessionStorage.getItem(`chatbucket:widget-origin:${id}`) ||
        (document.referrer ? new URL(document.referrer).origin : window.location.origin);
      async function applyToken(token) {
        if (cancelled) return;
        sessionStorage.setItem(key, token);
        setWidgetToken(token);
        const callId = sessionStorage.getItem(`chatbucket:customer-call:${id}`);
        if (callId) {
          const response = await apiFetch(`/api/demo/widget/calls/${callId}`, {
            headers: { 'X-Widget-Session': token },
          });
          if (response.ok) {
            const call = await response.json();
            if (!cancelled) {
              setRecords([call]);
              setSelection(call._id);
            }
          }
        }
      }
      function message(event) {
        if (
          event.source !== window.parent ||
          event.origin !== parentOrigin ||
          event.data?.type !== 'chatbucket:widget-session' ||
          event.data.widgetId !== id ||
          typeof event.data.token !== 'string'
        )
          return;
        applyToken(event.data.token).catch((e) => {
          if (!cancelled) setFeedback(e.message);
        });
      }
      window.addEventListener('message', message);
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'chatbucket:widget-ready', widgetId: id }, parentOrigin);
      } else {
        const token = sessionStorage.getItem(key);
        if (token) {
          applyToken(token).catch(() => sessionStorage.removeItem(key));
          return () => {
            cancelled = true;
            window.removeEventListener('message', message);
          };
        }
        apiFetch('/api/demo/widget/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ widgetId: id }),
        })
          .then(async (response) => {
            const data = await response.json();
            if (!response.ok) throw Error(data.error || 'Widget unavailable.');
            return applyToken(data.token);
          })
          .catch((error) => {
            if (!cancelled) setFeedback(error.message);
          });
      }
      return () => {
        cancelled = true;
        window.removeEventListener('message', message);
      };
    }
    Promise.all([
      apiFetch(`${API}/api/records/${config.kind}`),
      apiFetch(`${API}/api/voice-agents`),
    ])
      .then(async ([items, agentResult]) => {
        if (!items.ok || !agentResult.ok)
          throw Error('Cannot load workspace data. Start the demo server or configured services.');
        const [entries, agentItems] = await Promise.all([items.json(), agentResult.json()]);
        if (cancelled) return;
        setRecords(entries);
        setAgents(agentItems);
        const stored =
          typeof window !== 'undefined' ? localStorage.getItem(`chatbucket:${config.kind}`) : null;
        const active = entries.find((entry) => entry._id === stored) || entries[0];
        setSelection(active?._id || '');
        const settings = active?.data?.[`screen_${number}`] || initialForm(config);
        setForm(
          config.kind === 'agent' && number >= 34 && number <= 39
            ? { 'Voice agent': agentItems[0]?.name || '', ...settings }
            : settings,
        );
      })
      .catch((e) => {
        if (!cancelled) setFeedback(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [number, config.kind]);
  useEffect(() => {
    if (config.type === 'customer') {
      if (!widgetToken || !record?._id) return;
      const timer = window.setInterval(async () => {
        if (document.visibilityState !== 'visible') return;
        try {
          const response = await apiFetch(`/api/demo/widget/calls/${record._id}`, {
            headers: { 'X-Widget-Session': widgetToken },
          });
          if (response.ok) setRecords([await response.json()]);
        } catch {}
      }, 4000);
      return () => window.clearInterval(timer);
    }
    if (!['call', 'campaign'].includes(config.kind)) return;
    let inFlight = false;
    const timer = window.setInterval(
      async () => {
        if (document.visibilityState !== 'visible' || inFlight) return;
        inFlight = true;
        try {
          const response = await apiFetch(`${API}/api/records/${config.kind}`);
          if (response.ok) setRecords(await response.json());
        } catch {
        } finally {
          inFlight = false;
        }
      },
      config.kind === 'call' ? 4000 : 8000,
    );
    return () => window.clearInterval(timer);
  }, [config.kind, config.type, widgetToken, record?._id]);
  function choose(entry) {
    setSelection(entry._id);
    setForm(entry.data?.[`screen_${number}`] || {});
    localStorage.setItem(`chatbucket:${config.kind}`, entry._id);
  }
  async function refresh() {
    const result = await apiFetch(`${API}/api/records/${config.kind}`);
    if (result.ok) setRecords(await result.json());
  }
  async function save({ advance = false, status }: { advance?: boolean; status?: string } = {}) {
    setWorking(true);
    setFeedback('');
    try {
      if (config.type === 'customer') {
        if (!widgetToken) throw Error('Widget is loading. Try again.');
        const response = await apiFetch('/api/demo/widget/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Widget-Session': widgetToken },
          body: JSON.stringify({
            kind: number === 32 ? 'callback' : 'rating',
            form: { ...form, ...(number === 33 && !form.Rating ? { Rating: '5' } : {}) },
          }),
        });
        const result = await response.json();
        if (!response.ok) throw Error(result.error || 'Could not save.');
        setFeedback(number === 32 ? 'Callback requested.' : 'Rating submitted.');
        return;
      }
      if (config.kind === 'agent' && !agents.some((agent) => agent.name === form['Voice agent']))
        throw Error('Select an existing voice agent first.');
      let target = [32, 33].includes(number) ? null : record;
      if (!target) {
        const title = String(
          form['Widget name'] ||
            form['Campaign name'] ||
            form['Caller name'] ||
            form['Your name'] ||
            (config.kind === 'call' ? 'Website voice request' : config.title),
        );
        const created = await apiFetch(`${API}/api/records/${config.kind}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, data: { [`screen_${number}`]: form } }),
        });
        const result = await created.json();
        if (!created.ok) throw Error(result.error || 'Could not create record.');
        target = result;
        setRecords((current) => [result, ...current]);
        setSelection(result._id);
        localStorage.setItem(`chatbucket:${config.kind}`, result._id);
      } else {
        const response = await apiFetch(`${API}/api/records/${config.kind}/${target._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              [`screen_${number}`]: form,
              ...(number === 23 ? { assignedAgent: 'Priya Sharma' } : {}),
              ...(number === 26
                ? {
                    assignedAgent:
                      target.data?.screen_25?.['Transfer to agent'] || 'Receiving specialist',
                  }
                : {}),
            },
            ...(status && target.status !== status ? { status } : {}),
          }),
        });
        const updated = await response.json();
        if (!response.ok) throw Error(updated.error || 'Could not save changes.');
        target = updated;
        setRecords((current) => current.map((r) => (r._id === updated._id ? updated : r)));
      }
      if (status && target.status !== status) {
        const response = await apiFetch(`${API}/api/records/${config.kind}/${target._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        const updated = await response.json();
        if (!response.ok) throw Error(updated.error || 'Could not update status.');
        target = updated;
        setRecords((current) => current.map((r) => (r._id === updated._id ? updated : r)));
      }
      if (config.kind === 'widget' && status === 'published') setShowSnippet(true);
      if (config.kind === 'agent' && number >= 34 && number <= 37) {
        const voiceAgent = agents.find((agent) => agent.name === form['Voice agent']);
        let patch = {};
        if (number === 34)
          patch = {
            instructions: [form['Agent instructions'], form['System prompt']]
              .filter(Boolean)
              .join('\n\n'),
            ...(form['Opening statement'] ? { greeting: form['Opening statement'] } : {}),
          };
        if (number === 35) {
          const sources = [...(voiceAgent.knowledgeSources || [])];
          if (
            form['Website URL'] &&
            !sources.some(
              (source) => source.kind === 'website' && source.url === form['Website URL'],
            )
          )
            sources.push({
              label: form['Website URL'],
              kind: 'website',
              url: form['Website URL'],
              status: 'configured',
            });
          if (form['FAQ question'] && form['FAQ answer']) {
            const existing = sources.find(
              (source) => source.kind === 'faq' && source.label === form['FAQ question'],
            );
            if (existing) {
              existing.content = form['FAQ answer'];
              existing.status = 'ready';
            } else
              sources.push({
                label: form['FAQ question'],
                kind: 'faq',
                content: form['FAQ answer'],
                status: 'ready',
              });
          }
          patch = { knowledgeSources: sources };
        }
        if (number === 36)
          patch = {
            actions: {
              accountLookup: Boolean(form['Account lookup']),
              supportTicket: Boolean(form['Ticket creation']),
            },
            confirmTicket: Boolean(form['Require confirmation']),
          };
        if (number === 37)
          patch = {
            ...(form['Speaking speed'] ? { speakingSpeed: form['Speaking speed'] } : {}),
            ...(form['Silence prompt (seconds)']
              ? { silenceSeconds: Number(form['Silence prompt (seconds)']) }
              : {}),
            ...(form['Fallback language'] ? { fallbackLanguage: form['Fallback language'] } : {}),
          };
        const applied = await apiFetch(`${API}/api/voice-agents/${voiceAgent._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
        const updated = await applied.json();
        if (!applied.ok) throw Error(updated.error || 'Agent update failed.');
        setAgents((current) =>
          current.map((agent) => (agent._id === updated._id ? updated : agent)),
        );
      }
      setFeedback(
        `${config.title} saved${status ? ` · ${friendlyStatus[status] || status}` : ''}.`,
      );
      if (advance) router.push(`/flow/${workflowNext(number)}`);
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setWorking(false);
    }
  }
  const customerPath = (value) => {
    const origin =
      typeof window !== 'undefined' && widgetId
        ? sessionStorage.getItem(`chatbucket:widget-origin:${widgetId}`)
        : '';
    return `/flow/${value}${widgetId ? `?widget=${encodeURIComponent(widgetId)}${origin ? `&origin=${encodeURIComponent(origin)}` : ''}` : ''}`;
  };
  async function requestMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicrophone(true);
      setFeedback('Microphone access granted for this browser.');
      router.push(customerPath(29));
    } catch {
      setFeedback('Microphone access was not granted. Check browser permission to continue.');
    }
  }
  async function primary() {
    if (number === 28) return requestMic();
    if (number === 30) {
      if (record?.status === 'human') return router.push(customerPath(31));
      return setFeedback('Still waiting for an agent. You can leave a callback request below.');
    }
    if (number === 31 && record?.status !== 'human')
      return setFeedback(
        'The human agent has not joined yet. You can return to the waiting screen.',
      );
    if (number === 42) return router.push('/flow/40');
    if (number === 51) return router.push('/flow/43');
    if (number === 32 || number === 33) return save();
    if (number === 29) {
      setWorking(true);
      try {
        if (!widgetToken) throw Error('Widget is loading. Try again.');
        const response = await apiFetch('/api/demo/widget/calls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Widget-Session': widgetToken },
          body: JSON.stringify({
            caller: 'Website visitor',
            issue: form['Your question'] || 'I want to speak to a person',
          }),
        });
        const call = await response.json();
        if (!response.ok) throw Error(call.error || 'Could not start the demo request');
        sessionStorage.setItem(`chatbucket:customer-call:${widgetId}`, call._id);
        router.push(customerPath(30));
      } catch (error) {
        setFeedback(error.message);
      } finally {
        setWorking(false);
      }
      return;
    }
    if (number === 7 || number === 43) return save({ advance: true });
    if ([13, 14, 15, 17, 19, 20, 21, 22, 49].includes(number))
      return router.push(`/flow/${nextNumber(number)}`);
    const status = config.transition || (number === 12 ? 'published' : undefined);
    await save({ advance: number !== 12, status });
  }
  const visibleRecords = records.filter((item) =>
    `${item.title} ${item.status}`.toLowerCase().includes(search.toLowerCase()),
  );
  const body = (
    <>
      <div
        className={
          'flow-breadcrumb flex items-center gap-2 text-[#aaa8bb] text-[13px] mb-4 [&_a]:text-[#b59cff]'
        }
      >
        <Link
          href={
            number >= 43
              ? '/flow/43'
              : number >= 34
                ? '/voice-agents'
                : number >= 21
                  ? '/flow/21'
                  : number >= 13
                    ? '/flow/13'
                    : '/flow/7'
          }
        >
          ←{' '}
          {number >= 43
            ? 'Campaigns'
            : number >= 34
              ? 'Voice agents'
              : number >= 21
                ? 'Inbox'
                : number >= 13
                  ? 'Voice overview'
                  : 'Voice Widgets'}
        </Link>
      </div>
      <div
        className={
          'flow-heading flex items-center justify-between gap-5 [&_h1]:text-3xl [&_h1]:m-[0_0_8px] [&_h1]:tracking-[-.5px] max-[650px]:[&_h1]:text-[25px] [&_h1]:font-[690] [&_h1]:tracking-[-.038em]'
        }
      >
        <div>
          <p className={'eyebrow text-[#a782ff] text-[11px] tracking-[2px] font-bold m-[0_0_9px]'}>
            {group.name.toUpperCase()}
          </p>
          <h1>{config.title}</h1>
          <p className={'muted text-(--muted) m-0 leading-normal'}>{config.caption}</p>
        </div>
        {record && (
          <span
            className={`status inline-flex rounded-[25px] p-[7px_12px] text-[13px] [&.ready]:text-[#5de5b8] [&.ready]:bg-[#133b32] [&.ready]:border [&.ready]:border-[#215544] [&.draft]:text-[#ffd17d] [&.draft]:bg-[#4a351a] [&.draft]:border [&.draft]:border-[#765020]${['published', 'human', 'ready', 'running'].includes(record.status) ? 'ready' : 'draft'}`}
          >
            ● {friendlyStatus[record.status] || record.status}
          </span>
        )}
      </div>
      {((number >= 34 && number <= 39) || (number >= 44 && number <= 48)) && (
        <div
          className={
            'flow-steps flex gap-2 overflow-x-auto m-[24px_0] [scrollbar-color:#5d4b7a_#24232e] [&_a]:flex [&_a]:flex-col [&_a]:gap-1.5 [&_a]:flex-none [&_a]:min-w-30 [&_a]:max-w-41.25 [&_a]:text-[#b0aabe] [&_a]:p-3 [&_a]:border [&_a]:border-(--line) [&_a]:rounded-[9px] [&_a]:bg-[#1c1b24] [&_a]:font-bold [&_a]:text-[13px] [&_a_span]:font-normal [&_a_span]:whitespace-nowrap [&_a_span]:text-ellipsis [&_a_span]:overflow-hidden [&_a.active]:bg-[#49317c] [&_a.active]:border-[#9e75fa] [&_a.active]:text-white max-[650px]:[&_a]:min-w-22.5'
          }
        >
          {Array.from({ length: number <= 39 ? 6 : 5 }, (_, i) => i + (number <= 39 ? 34 : 44)).map(
            (n) => (
              <Link className={n === number ? 'active' : ''} key={n} href={`/flow/${n}`}>
                {String(n - (number <= 39 ? 33 : 43)).padStart(2, '0')}
                <span>{screens[n].title}</span>
              </Link>
            ),
          )}
        </div>
      )}
      {feedback && (
        <div
          role="status"
          className={`flow-alert flex gap-2.5 items-center bg-[#173b34] border border-[#296a55] text-[#81e4b8] p-[13px_16px] rounded-[9px] m-[15px_0] text-sm [&.problem]:bg-[#402630] [&.problem]:border-[#a44c68] [&.problem]:text-[#ffb5c1]${/cannot|error|not |could not|still waiting|not granted/i.test(feedback) ? 'problem' : ''}`}
        >
          <Info size={18} />
          {feedback}
        </div>
      )}
      {config.type === 'dashboard' ? (
        <div className="dashboard-view">
          <div
            className={
              'dashboard-stats grid grid-cols-4 gap-3 mb-4 [&_.stat-card]:gap-3 [&_.stat-card]:p-3.75 [&_.stat-card]:min-h-25.5 [&_.stat-icon]:w-12.5 [&_.stat-icon]:h-12.5 [&_.stat-card_strong]:text-[23px] max-[1100px]:grid-cols-[repeat(2,1fr)] max-[650px]:grid-cols-[repeat(2,1fr)] max-[650px]:[&_.stat-card]:min-h-17.5 max-[650px]:[&_.stat-icon]:w-9 max-[650px]:[&_.stat-icon]:h-9 max-[650px]:[&_.stat-card_strong]:text-lg'
            }
          >
            {(config.metrics || []).map((label, index) => (
              <div
                className={
                  'stat-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,#1d1e25,#1b1b22)] p-5 flex items-center gap-5 min-h-27.75 [&_span:not(.stat-icon)]:block [&_span:not(.stat-icon)]:text-sm [&_span:not(.stat-icon)]:text-(--muted) [&_span:not(.stat-icon)]:mb-1.75 [&_strong]:block [&_strong]:text-[29px] max-[800px]:p-3 max-[800px]:gap-2 max-[800px]:[&_strong]:text-[22px] max-[800px]:[&_span:not(.stat-icon)]:text-[11px] max-[600px]:min-h-16.25'
                }
                key={label}
              >
                <span
                  className={`stat-icon h-15 w-15 grid place-items-center rounded-[11px] [&.purple]:text-[#ad82ff] [&.purple]:bg-[#35274e] [&.green]:text-(--green) [&.green]:bg-[#1b413b] [&.amber]:text-(--amber) [&.amber]:bg-[#403222] max-[800px]:w-9 max-[800px]:h-9${['purple', 'amber', 'green', 'purple'][index % 4]}`}
                >
                  {index % 2 ? <Phone size={23} /> : <Activity size={23} />}
                </span>
                <div>
                  <span>{label}</span>
                  <strong>
                    {number === 49
                      ? ([
                          record?.data?.stats?.eligible,
                          record?.data?.stats?.initiated,
                          record?.data?.stats?.connected,
                          record?.data?.stats?.queued,
                        ][index] ?? 0)
                      : number === 13 && index === 1
                        ? records.filter((r) => r.status === 'waiting').length
                        : records.filter((r) =>
                            index === 0
                              ? true
                              : index === 1
                                ? r.status === 'human' || r.status === 'completed'
                                : r.status === 'waiting',
                          ).length}
                  </strong>
                </div>
              </div>
            ))}
          </div>
          <div
            className={
              'flow-grid grid grid-cols-[minmax(0,1.25fr)_minmax(310px,.75fr)] gap-4 items-start [&>.form-card]:min-h-82.5 max-[850px]:grid-cols-1'
            }
          >
            <section
              className={
                'form-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,#1d1e25,#1b1b22)] p-[22px_23px] border-[#363640]'
              }
            >
              <div
                className={
                  'card-header flex items-center gap-3.25 mb-5 [&_h2]:m-0 [&_h2]:text-xl [&_h2]:tracking-[-.3px] [&_p]:text-(--muted) [&_p]:text-sm [&_p]:m-[7px_0_0] max-[600px]:[&_h2]:text-lg'
                }
              >
                <span
                  className={
                    'heading-icon bg-[#362452] text-[#bf9aff] rounded-lg w-10.5 h-10.5 grid place-items-center flex-none'
                  }
                >
                  <Activity size={20} />
                </span>
                <div>
                  <h2>Recent activity</h2>
                  <p>Latest updates in this workspace</p>
                </div>
              </div>
              {records.length ? (
                <RecordList
                  records={records.slice(0, 6)}
                  onSelect={choose}
                  selected={record?._id}
                />
              ) : (
                <EmptyState kind={config.kind} />
              )}
            </section>
            <section
              className={
                'form-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,#1d1e25,#1b1b22)] p-[22px_23px] border-[#363640]'
              }
            >
              <div
                className={
                  'card-header flex items-center gap-3.25 mb-5 [&_h2]:m-0 [&_h2]:text-xl [&_h2]:tracking-[-.3px] [&_p]:text-(--muted) [&_p]:text-sm [&_p]:m-[7px_0_0] max-[600px]:[&_h2]:text-lg'
                }
              >
                <span
                  className={
                    'heading-icon bg-[#362452] text-[#bf9aff] rounded-lg w-10.5 h-10.5 grid place-items-center flex-none'
                  }
                >
                  <Users size={20} />
                </span>
                <div>
                  <h2>
                    {number === 13
                      ? 'Team availability'
                      : number === 49
                        ? 'Campaign status'
                        : 'Activity summary'}
                  </h2>
                  <p>Current workspace snapshot</p>
                </div>
              </div>
              <div
                className={
                  'summary-ring flex flex-col items-center justify-center w-40.25 h-40.25 m-[24px_auto] rounded-full border-[19px_solid_#4fc99d] border-l-[#6540de] border-t-[#628bf8] [&_strong]:text-[27px] [&_span]:text-[#a9a5ba] [&_span]:text-xs'
                }
              >
                <strong>{records.length}</strong>
                <span>records</span>
              </div>
              <div
                className={
                  'legend-row flex justify-between items-center gap-3.75 p-[14px_0] border-b border-b-(--line) text-sm [&>span]:text-[#a3a1b2]'
                }
              >
                <span>● Open</span>
                <strong>
                  {records.filter((r) => !['ended', 'completed'].includes(r.status)).length}
                </strong>
              </div>
              <div
                className={
                  'legend-row flex justify-between items-center gap-3.75 p-[14px_0] border-b border-b-(--line) text-sm [&>span]:text-[#a3a1b2]'
                }
              >
                <span>● Completed</span>
                <strong>
                  {records.filter((r) => ['ended', 'completed'].includes(r.status)).length}
                </strong>
              </div>
            </section>
          </div>
        </div>
      ) : null}
      {config.type === 'list' ? (
        <div
          className={
            'flow-grid grid grid-cols-[minmax(0,1.25fr)_minmax(310px,.75fr)] gap-4 items-start [&>.form-card]:min-h-82.5 max-[850px]:grid-cols-1'
          }
        >
          <section
            className={
              'form-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,#1d1e25,#1b1b22)] p-[22px_23px] border-[#363640]'
            }
          >
            <div
              className={
                'list-head flex justify-between gap-3.75 items-center mb-5 [&_h2]:text-[19px] [&_h2]:m-[0_0_5px]'
              }
            >
              <div>
                <h2>
                  {config.kind === 'campaign'
                    ? 'Campaigns'
                    : config.kind === 'widget'
                      ? 'Voice Widgets'
                      : 'Recent requests'}
                </h2>
                <p className={'muted text-(--muted) m-0 leading-normal'}>
                  {visibleRecords.length} records
                </p>
              </div>
              <label
                className={
                  'search flex items-center gap-2.5 border border-(--line) rounded-lg p-[0_14px] text-(--muted) min-w-62.5 h-10.75 [&_input]:w-full [&_input]:border-0 [&_input]:outline-0 [&_input]:bg-transparent [&_input]:text-white [&_input]:text-sm max-[600px]:min-w-0'
                }
              >
                <Search size={17} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  aria-label="Search records"
                />
              </label>
            </div>
            {visibleRecords.length ? (
              <RecordList records={visibleRecords} onSelect={choose} selected={record?._id} />
            ) : (
              <EmptyState kind={config.kind} />
            )}
          </section>
          <section
            className={
              'form-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,#1d1e25,#1b1b22)] p-[22px_23px] border-[#363640]'
            }
          >
            <div
              className={
                'card-header flex items-center gap-3.25 mb-5 [&_h2]:m-0 [&_h2]:text-xl [&_h2]:tracking-[-.3px] [&_p]:text-(--muted) [&_p]:text-sm [&_p]:m-[7px_0_0] max-[600px]:[&_h2]:text-lg'
              }
            >
              <span
                className={
                  'heading-icon bg-[#362452] text-[#bf9aff] rounded-lg w-10.5 h-10.5 grid place-items-center flex-none'
                }
              >
                <Plus size={20} />
              </span>
              <div>
                <h2>{record ? 'Selected record' : `New ${config.kind}`}</h2>
                <p>
                  {record ? 'Review details or add an entry' : 'Fill in the details to get started'}
                </p>
              </div>
            </div>
            <DataFields fields={config.fields} form={form} setForm={setForm} agents={agents} />
            {record && (
              <p className={'helper-text text-[#a4a1b4] text-xs leading-[1.6] m-[8px_0]'}>
                Selected: {record.title}
              </p>
            )}
          </section>
        </div>
      ) : null}
      {['setup', 'studio', 'campaign'].includes(config.type) ? (
        <div
          className={
            'flow-grid grid grid-cols-[minmax(0,1.25fr)_minmax(310px,.75fr)] gap-4 items-start [&>.form-card]:min-h-82.5 max-[850px]:grid-cols-1'
          }
        >
          <section
            className={
              'form-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,#1d1e25,#1b1b22)] p-[22px_23px] border-[#363640]'
            }
          >
            <div
              className={
                'card-header flex items-center gap-3.25 mb-5 [&_h2]:m-0 [&_h2]:text-xl [&_h2]:tracking-[-.3px] [&_p]:text-(--muted) [&_p]:text-sm [&_p]:m-[7px_0_0] max-[600px]:[&_h2]:text-lg'
              }
            >
              <span
                className={
                  'heading-icon bg-[#362452] text-[#bf9aff] rounded-lg w-10.5 h-10.5 grid place-items-center flex-none'
                }
              >
                {config.kind === 'campaign' ? (
                  <PhoneCall size={20} />
                ) : config.kind === 'agent' ? (
                  <AudioLines size={20} />
                ) : (
                  <Settings2 size={20} />
                )}
              </span>
              <div>
                <h2>{config.title}</h2>
                <p>Settings for {record?.title || config.kind}</p>
              </div>
            </div>
            <DataFields fields={config.fields} form={form} setForm={setForm} agents={agents} />
            {number === 12 && (showSnippet || record?.status === 'published') && (
              <div
                className={
                  'install-snippet grid gap-2.5 mt-6.25 text-[#c9c2df] [&_code]:whitespace-normal [&_code]:break-all [&_code]:border [&_code]:border-[#6951a6] [&_code]:bg-[#241b39] [&_code]:p-3 [&_code]:rounded-lg [&_small]:text-[#a7a2b5]'
                }
              >
                <strong>Website embed · demo</strong>
                <code>{`<script src="${embedOrigin}/chatbucket-voice.js" data-widget-id="${record?._id || 'WIDGET_ID'}"></script>`}</code>
                <button
                  className={
                    'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                  }
                  onClick={() =>
                    navigator.clipboard
                      .writeText(
                        `<script src="${embedOrigin}/chatbucket-voice.js" data-widget-id="${record?._id || 'WIDGET_ID'}"></script>`,
                      )
                      .then(() => setFeedback('Embed code copied.'))
                  }
                >
                  Copy code
                </button>
                <small>
                  This installs a demo widget. Configure a verified domain and live call provider
                  before production.
                </small>
              </div>
            )}
          </section>
          <section
            className={
              'form-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,#1d1e25,#1b1b22)] p-[22px_23px] border-[#363640]'
            }
          >
            <div
              className={
                'card-header flex items-center gap-3.25 mb-5 [&_h2]:m-0 [&_h2]:text-xl [&_h2]:tracking-[-.3px] [&_p]:text-(--muted) [&_p]:text-sm [&_p]:m-[7px_0_0] max-[600px]:[&_h2]:text-lg'
              }
            >
              <span
                className={
                  'heading-icon bg-[#362452] text-[#bf9aff] rounded-lg w-10.5 h-10.5 grid place-items-center flex-none'
                }
              >
                <ShieldCheck size={20} />
              </span>
              <div>
                <h2>{number === 48 ? 'Launch checklist' : 'Live preview'}</h2>
                <p>Saved settings and prerequisites</p>
              </div>
            </div>
            <div
              className={
                'flow-preview text-center rounded-xl bg-[radial-gradient(circle,#382659,#22222b_62%)] p-[28px_10px] [&_h3]:m-[17px_0_6px] [&>span]:text-[#beb3d3] [&>span]:text-[13px]'
              }
            >
              <div
                className={
                  'flow-preview-orb grid place-items-center text-[#e5dbff] bg-[#6945d5] rounded-full w-19.25 h-19.25 m-[0_auto]'
                }
              >
                <AudioLines size={35} />
              </div>
              <h3>
                {record?.title || form['Campaign name'] || form['Widget name'] || 'Acme Support'}
              </h3>
              <span>
                {config.kind === 'campaign'
                  ? 'Outbound voice campaign'
                  : config.kind === 'widget'
                    ? 'Website voice widget'
                    : config.kind === 'phone-route'
                      ? 'Inbound phone calls'
                      : 'AI voice agent'}
              </span>
            </div>
            <div
              className={
                'details-rows mt-3 [&>div]:flex [&>div]:justify-between [&>div]:items-center [&>div]:gap-3.75 [&>div]:p-[14px_0] [&>div]:border-b [&>div]:border-b-(--line) [&>div]:text-sm [&>div_span]:text-[#ada9bc] [&>div_strong]:text-right [&>div_strong]:max-w-[58%] [&>div_strong]:font-medium'
              }
            >
              <div>
                <span>Status</span>
                <strong>{record?.status || 'Not saved'}</strong>
              </div>
              <div>
                <span>Voice agents</span>
                <strong>{agents.length}</strong>
              </div>
              <div>
                <span>Setup step</span>
                <strong>{number} / 51</strong>
              </div>
            </div>
            {number === 48 && (
              <p
                className={
                  'callout flex gap-2.75 items-start bg-[#29243b] text-[#d2c2f5] border border-[#493b69] rounded-[9px] p-3.75 m-[19px_0] text-sm leading-normal [&_svg]:flex-none'
                }
              >
                <CircleAlert size={19} /> Scheduling saves this campaign. Calling starts only when a
                verified dialer is connected.
              </p>
            )}
          </section>
        </div>
      ) : null}
      {config.type === 'call' ? (
        <div
          className={
            'flow-grid grid grid-cols-[minmax(0,1.25fr)_minmax(310px,.75fr)] gap-4 items-start [&>.form-card]:min-h-82.5 max-[850px]:grid-cols-1'
          }
        >
          <section
            className={
              'form-card call-stage border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,#1d1e25,#1b1b22)] p-[22px_23px] border-[#363640] text-center [&_h2]:text-[23px] [&_h2]:m-2.5 [&>p]:text-[#bdb8ce]'
            }
          >
            <div
              className={
                'call-orb grid place-items-center w-36.25 h-36.25 m-[30px_auto_19px] rounded-full bg-[radial-gradient(circle,#8b63fd,#5433b6)] shadow-[0_0_0_19px_#7b54fa22] text-white'
              }
            >
              <Headphones size={54} />
            </div>
            <h2>{record?.title || 'Website voice request'}</h2>
            <p>
              {record ? friendlyStatus[record.status] || record.status : 'No call selected yet'}
            </p>
            <div
              className={
                'call-control-row flex justify-center gap-4 m-[30px_0] [&_span]:border [&_span]:border-(--line) [&_span]:p-3 [&_span]:rounded-[30px] [&_span]:text-[#c8bfe0] [&_span]:flex [&_span]:items-center [&_span]:gap-2 [&_span]:text-[13px] max-[650px]:gap-1 max-[650px]:flex-wrap'
              }
            >
              <span>
                <Mic size={19} /> Microphone
              </span>
              <span>
                <Volume2 size={19} /> Speaker
              </span>
              <span>
                <Clock3 size={19} /> Call timer
              </span>
            </div>
            <div
              className={
                'call-notice flex items-start text-left gap-3 bg-[#282336] border border-[#4c3d67] p-3.75 rounded-[9px] text-[#d0c4e1] text-[13px] leading-normal [&_svg]:flex-none'
              }
            >
              <Info size={20} /> Voice media and real-time audio require a connected
              WebRTC/telephony service. Call ownership and outcomes can be configured here.
            </div>
          </section>
          <section
            className={
              'form-card border border-(--line) rounded-[10px] bg-[linear-gradient(155deg,#1d1e25,#1b1b22)] p-[22px_23px] border-[#363640]'
            }
          >
            <div
              className={
                'card-header flex items-center gap-3.25 mb-5 [&_h2]:m-0 [&_h2]:text-xl [&_h2]:tracking-[-.3px] [&_p]:text-(--muted) [&_p]:text-sm [&_p]:m-[7px_0_0] max-[600px]:[&_h2]:text-lg'
              }
            >
              <span
                className={
                  'heading-icon bg-[#362452] text-[#bf9aff] rounded-lg w-10.5 h-10.5 grid place-items-center flex-none'
                }
              >
                <Sparkles size={20} />
              </span>
              <div>
                <h2>AI conversation context</h2>
                <p>Details passed with the human request</p>
              </div>
            </div>
            <div
              className={
                'details-rows mt-3 [&>div]:flex [&>div]:justify-between [&>div]:items-center [&>div]:gap-3.75 [&>div]:p-[14px_0] [&>div]:border-b [&>div]:border-b-(--line) [&>div]:text-sm [&>div_span]:text-[#ada9bc] [&>div_strong]:text-right [&>div_strong]:max-w-[58%] [&>div_strong]:font-medium'
              }
            >
              <div>
                <span>Caller</span>
                <strong>{record?.title || 'Not selected'}</strong>
              </div>
              <div>
                <span>Department</span>
                <strong>{record?.data?.screen_14?.['Department'] || 'Technical Support'}</strong>
              </div>
              <div>
                <span>Request</span>
                <strong>
                  {record?.data?.screen_14?.['Issue summary'] || 'No summary recorded'}
                </strong>
              </div>
              <div>
                <span>Ownership</span>
                <strong>{record?.status === 'human' ? 'Human agent' : 'AI / queue'}</strong>
              </div>
            </div>
            <DataFields fields={config.fields} form={form} setForm={setForm} agents={agents} />
          </section>
        </div>
      ) : null}
      {config.type === 'customer' ? (
        <div
          className={
            'customer-card bg-[linear-gradient(150deg,#fff,#f0edfc)] text-[#202033] rounded-[22px] max-w-115 p-8.25 min-h-90 m-[25px_auto] text-center shadow-[0_24px_68px_#09091688] [&_h2]:text-[24px] [&_h2]:m-[9px_0] [&>p]:text-[#5b5b71] [&>p]:leading-[1.6] [&_.field]:text-left [&_.field-label]:text-[#353447] [&_.field_input]:bg-white [&_.field_input]:text-[#202033] [&_.field_input]:border-[#cbc5dc] [&_.field_textarea]:bg-white [&_.field_textarea]:text-[#202033] [&_.field_textarea]:border-[#cbc5dc] [&_.field_select]:bg-white [&_.field_select]:text-[#202033] [&_.field_select]:border-[#cbc5dc] [&_.bubble]:text-[#f5f2ff] [&_.callout]:text-[#443465] max-[650px]:p-5.25'
          }
        >
          <div
            className={
              'customer-orb grid place-items-center w-20.5 h-20.5 rounded-full bg-[linear-gradient(140deg,#a282ff,#5329de)] text-white m-[0_auto_22px]'
            }
          >
            <AudioLines size={44} />
          </div>
          <span className={'customer-company text-[#673ee6] text-[13px] font-bold'}>
            Acme Support
          </span>
          <h2>{config.title}</h2>
          <p>{config.caption}</p>
          {number === 29 && (
            <div
              className={
                'bubble max-w-[85%] text-left bg-[#2b2b37] border border-[#3d3d49] p-[13px_17px] rounded-xl m-[14px_0_0_auto] leading-normal text-sm [&.reply]:bg-[#5234ae] [&.reply]:border-[#6140d6] [&.reply]:ml-auto [&.reply]:max-w-[70%]'
              }
            >
              Hello, welcome to Acme Support. How can I help you?
            </div>
          )}
          {number === 30 && (
            <div
              className={
                'callout flex gap-2.75 items-start bg-[#29243b] text-[#d2c2f5] border border-[#493b69] rounded-[9px] p-3.75 m-[19px_0] text-sm leading-normal [&_svg]:flex-none'
              }
            >
              <Clock3 size={18} /> Waiting for an available person. You can request a callback if
              you prefer.
            </div>
          )}
          {number === 31 && (
            <div
              className={
                'callout flex gap-2.75 items-start bg-[#29243b] text-[#d2c2f5] border border-[#493b69] rounded-[9px] p-3.75 m-[19px_0] text-sm leading-normal [&_svg]:flex-none'
              }
            >
              <UserRound size={18} />{' '}
              {record?.status === 'human'
                ? 'Priya Sharma joined the call.'
                : 'Waiting for an agent to accept the call.'}
            </div>
          )}
          {number === 42 && (
            <div
              className={
                'callout flex gap-2.75 items-start bg-[#29243b] text-[#d2c2f5] border border-[#493b69] rounded-[9px] p-3.75 m-[19px_0] text-sm leading-normal [&_svg]:flex-none'
              }
            >
              <Phone size={18} /> Business phone calls require a connected inbound provider and an
              active route.
            </div>
          )}
          <DataFields fields={config.fields} form={form} setForm={setForm} agents={agents} />
          {number === 28 && (
            <p className={'helper-text text-[#a4a1b4] text-xs leading-[1.6] m-[8px_0]'}>
              Your browser will ask for microphone permission. Access stops if you close the call.
            </p>
          )}
          {number === 30 && (
            <Link
              className={
                'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
              }
              href="/flow/32"
            >
              Leave a callback request
            </Link>
          )}
        </div>
      ) : null}
      {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
        <DemoControls
          number={number}
          record={record}
          form={form}
          agents={agents}
          onUpdate={refresh}
        />
      )}
      {config.hints?.length ? (
        <div
          className={
            'hints m-[15px_0] [&_p]:flex [&_p]:gap-2.25 [&_p]:items-start [&_p]:text-[13px] [&_p]:text-[#afadbd] [&_svg]:text-[#b793fc] [&_svg]:flex-none'
          }
        >
          {config.hints.map((hint) => (
            <p key={hint}>
              <Info size={17} />
              {hint}
            </p>
          ))}
        </div>
      ) : null}
      <div
        className={
          'flow-footer flex justify-between gap-3.75 items-center p-[16px_0] border-t border-t-(--line) mt-6.25 max-[650px]:items-start max-[650px]:flex-col'
        }
      >
        <Link
          href={
            number >= 44
              ? number === 44
                ? '/flow/43'
                : `/flow/${number - 1}`
              : number >= 34
                ? number === 34
                  ? '/voice-agents'
                  : `/flow/${number - 1}`
                : number >= 21
                  ? '/flow/21'
                  : '/flow/13'
          }
          className={
            'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
          }
        >
          <ArrowLeft size={17} /> Back
        </Link>
        <div
          className={
            'flow-footer-actions flex gap-2.25 flex-wrap max-[650px]:w-full max-[650px]:justify-end'
          }
        >
          {![13, 14, 15, 17, 19, 20, 21, 22, 43, 49].includes(number) &&
            number !== 28 &&
            number !== 30 &&
            number !== 42 &&
            number !== 51 && (
              <button
                className={
                  'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
                onClick={() => save()}
                disabled={working}
              >
                Save changes
              </button>
            )}
          <button
            className={
              'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
            }
            onClick={primary}
            disabled={working}
          >
            {working ? 'Saving…' : config.cta} <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </>
  );
  if (config.type === 'customer')
    return (
      <CustomerWidget
        number={number}
        config={config}
        record={record}
        form={form}
        setForm={setForm}
        onPrimary={primary}
        onSave={save}
        feedback={feedback}
        working={working}
        widgetToken={widgetToken}
        widgetId={widgetId}
      />
    );
  if (number === 13)
    return (
      <Shell workspace="owner" active="/flow/13">
        <OwnerOverview records={records} onSelect={choose} onUpdate={refresh} />
      </Shell>
    );
  if (number >= 14 && number <= 20)
    return (
      <Shell workspace="owner" active={navigationFor(number)}>
        <OwnerWorkspace
          number={number}
          records={records}
          selected={record}
          onSelect={choose}
          onUpdate={refresh}
        />
      </Shell>
    );
  if (number === 21)
    return (
      <Shell workspace="agent" active="/flow/21">
        <AgentInbox records={records} selected={record} onSelect={choose} />
      </Shell>
    );
  if (number === 7)
    return (
      <Shell workspace="owner" active="/flow/7">
        <WidgetList records={records} agents={agents} onUpdate={refresh} />
      </Shell>
    );
  if (number === 43)
    return (
      <Shell workspace="owner" active="/flow/43">
        <CampaignList records={records} agents={agents} onUpdate={refresh} />
      </Shell>
    );
  if (number >= 8 && number <= 12)
    return (
      <Shell workspace="owner" active="/flow/7">
        <WidgetSetup
          number={number}
          config={config}
          form={form}
          setForm={setForm}
          record={record}
          agents={agents}
          feedback={feedback}
          working={working}
          onSave={save}
          embedOrigin={embedOrigin}
        />
      </Shell>
    );
  if (number === 22)
    return (
      <Shell workspace="agent" active="/flow/24">
        <IncomingCallPopup records={records} selected={record} onUpdate={refresh} />
      </Shell>
    );
  if (number === 23)
    return (
      <Shell workspace="agent" active="/flow/21">
        <CallReview records={records} selected={record} onSelect={choose} onUpdate={refresh} />
      </Shell>
    );
  if (number === 24)
    return (
      <Shell workspace="agent" active="/flow/24">
        <LiveCallConsole records={records} selected={record} onSelect={choose} onUpdate={refresh} />
      </Shell>
    );
  if (number === 25)
    return (
      <Shell workspace="agent" active="/flow/26">
        <LiveCallConsole
          records={records}
          selected={record}
          onSelect={choose}
          onUpdate={refresh}
          rightPanel={
            <TransferPanel
              form={form}
              setForm={setForm}
              feedback={feedback}
              working={working}
              onTransfer={() => save({ advance: true, status: 'transfer-pending' })}
            />
          }
        />
      </Shell>
    );
  if (number === 26)
    return (
      <Shell workspace="agent" active="/flow/26">
        <TransferAccept
          records={records}
          selected={record}
          onSelect={choose}
          feedback={feedback}
          working={working}
          onAccept={() => save({ advance: true, status: 'human' })}
        />
      </Shell>
    );
  if (number === 27)
    return (
      <Shell workspace="agent" active="/flow/27">
        <CallOutcome
          records={records}
          selected={record}
          onSelect={choose}
          form={form}
          setForm={setForm}
          feedback={feedback}
          working={working}
          onSave={() => save()}
        />
      </Shell>
    );
  if (number === 49 || number === 51)
    return (
      <Shell workspace="owner" active="/flow/43">
        <CampaignDashboard
          number={number}
          records={records}
          selected={record}
          onSelect={choose}
          onUpdate={refresh}
        />
      </Shell>
    );
  if (number >= 34 && number <= 41)
    return (
      <Shell workspace="owner" active={navigationFor(number)}>
        <AgentStudio
          number={number}
          config={config}
          form={form}
          setForm={setForm}
          agents={agents}
          records={records}
          record={record}
          feedback={feedback}
          working={working}
          onSave={save}
          onUpdate={refresh}
        />
      </Shell>
    );
  if (number >= 44 && number <= 48)
    return (
      <Shell workspace="owner" active="/flow/43">
        <CampaignWizard
          number={number}
          config={config}
          form={form}
          setForm={setForm}
          agents={agents}
          record={record}
          feedback={feedback}
          working={working}
          onSave={save}
        />
      </Shell>
    );
  if (number === 50)
    return (
      <Shell workspace="agent" active="/flow/21">
        <OutboundHandoff records={records} selected={record} onSelect={choose} onUpdate={refresh} />
      </Shell>
    );
  return (
    <Shell workspace={workspace} active={navigationFor(number)}>
      {body}
    </Shell>
  );
}

function DataFields({ fields = [], form, setForm, agents }) {
  if (!fields.length) return null;
  return (
    <div className={'field-stack flow-fields grid gap-4.75 mt-4'}>
      {fields.map((field) => (
        <ConfigField
          key={field.label}
          field={field}
          value={form[field.label]}
          agents={agents}
          onChange={(value) => setForm((current) => ({ ...current, [field.label]: value }))}
        />
      ))}
    </div>
  );
}
function RecordList({ records, selected, onSelect }) {
  return (
    <div className={'record-list grid gap-2'}>
      {records.map((record) => (
        <button
          key={record._id}
          className={`record-item w-full p-2.75 border border-(--line) rounded-[9px] flex items-center gap-3 bg-[#23232c] text-[#f4f1f8] text-left [&.chosen]:border-[#9668ef] [&.chosen]:bg-[#30283d] [&_.status]:text-[11px]${selected === record._id ? 'chosen' : ''}`}
          onClick={() => onSelect(record)}
        >
          <span
            className={
              'record-icon grid place-items-center text-[#b997fb] rounded-lg bg-[#322345] w-9.75 h-9.75 flex-none'
            }
          >
            <AudioLines size={21} />
          </span>
          <span
            className={
              'record-title flex-1 min-w-0 [&_strong]:block [&_strong]:text-ellipsis [&_strong]:whitespace-nowrap [&_strong]:overflow-hidden [&_small]:block [&_small]:text-ellipsis [&_small]:whitespace-nowrap [&_small]:overflow-hidden [&_small]:text-[#a8a6b6] [&_small]:mt-1.25'
            }
          >
            <strong>{record.title}</strong>
            <small>
              {new Date(record.updatedAt).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </small>
          </span>
          <span
            className={`status inline-flex rounded-[25px] p-[7px_12px] text-[13px] [&.ready]:text-[#5de5b8] [&.ready]:bg-[#133b32] [&.ready]:border [&.ready]:border-[#215544] [&.draft]:text-[#ffd17d] [&.draft]:bg-[#4a351a] [&.draft]:border [&.draft]:border-[#765020]${['human', 'published', 'running', 'completed'].includes(record.status) ? 'ready' : 'draft'}`}
          >
            {friendlyStatus[record.status] || record.status}
          </span>
          <ChevronRight size={16} />
        </button>
      ))}
    </div>
  );
}
function EmptyState({ kind }) {
  return (
    <div
      className={
        'flow-empty grid justify-items-center text-center p-[54px_10px] text-[#9f9cb0] [&_svg]:text-[#ac85f6] [&_strong]:text-white [&_strong]:m-[15px_0_7px] [&_p]:m-0'
      }
    >
      <AudioLines size={34} />
      <strong>No {kind} records yet</strong>
      <p>Save a new entry to start this flow.</p>
    </div>
  );
}
