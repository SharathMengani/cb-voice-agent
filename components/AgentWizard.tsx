'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  BookOpen,
  Check,
  CircleHelp,
  FileText,
  Globe,
  Headphones,
  Info,
  Mic,
  Play,
  Plus,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
} from 'lucide-react';
import Shell from './Shell';
import { apiFetch } from './api-client';

const API = '';
const STEPS = ['Basics', 'Voice', 'Knowledge', 'Behavior', 'Test'];
const languageChoices = [
  'English (India)',
  'Hindi',
  'Telugu',
  'Tamil',
  'Kannada',
  'Malayalam',
  'Marathi',
];
const starter = {
  name: '',
  purpose: '',
  role: 'Customer support',
  company: 'Acme Support',
  instructions: '',
  languages: ['English (India)'],
  fallbackLanguage: 'English (India)',
  detectCallerLanguage: true,
  voice: 'Aarav',
  speakingSpeed: 'Natural',
  knowledgeSources: [],
  actions: { accountLookup: false, supportTicket: false },
  greeting: 'Welcome to Acme Support. How can I help you today?',
  style: 'Concise and helpful',
  unanswered: 'Ask to connect with a person',
  endOfCall: 'Summarize the outcome',
  silenceSeconds: 8,
  maxCallMinutes: 15,
  confirmTicket: true,
  status: 'draft',
};

function Field({ label, children, hint = '' }) {
  return (
    <label
      className={
        'field grid gap-2 text-sm [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#454551] [&_textarea]:bg-[#202128] [&_textarea]:p-[12px_13px] [&_textarea]:text-[#f5f5f8] [&_textarea]:outline-0 [&_textarea]:text-sm [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#454551] [&_select]:bg-[#202128] [&_select]:p-[12px_13px] [&_select]:text-[#f5f5f8] [&_select]:outline-0 [&_select]:text-sm [&_textarea]:resize-y [&_textarea]:leading-normal [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] [&_textarea:focus]:border-[#a47aff] [&_textarea:focus]:shadow-[0_0_0_3px_#7646e323] [&_select:focus]:border-[#a47aff] [&_select:focus]:shadow-[0_0_0_3px_#7646e323] [&_small]:text-(--muted) [&_small]:text-xs'
      }
    >
      <span className={'field-label text-[#f0eff5] font-[540]'}>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
function Switch({ checked, onChange, label }) {
  return (
    <label
      className={
        "switch-row border-b border-b-(--line) min-h-13.5 flex items-center justify-between gap-3 text-sm cursor-pointer [&_input]:absolute [&_input]:opacity-[0] [&_input]:pointer-events-none [&_i]:inline-block [&_i]:relative [&_i]:rounded-[20px] [&_i]:h-6 [&_i]:w-10.5 [&_i]:bg-[#53525e] [&_i]:flex-none [&_i:after]:content-[''] [&_i:after]:absolute [&_i:after]:w-4.5 [&_i:after]:h-4.5 [&_i:after]:top-0.75 [&_i:after]:left-0.75 [&_i:after]:rounded-full [&_i:after]:bg-white [&_i:after]:transition-transform [&_i:after]:duration-200 [&_input:checked+i]:bg-(--purple) [&_input:checked+i:after]:translate-x-4.5 focus-within:outline-2 focus-within:outline-[#a57cff]"
      }
    >
      <span>{label}</span>
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
      />
      <i aria-hidden="true" />
    </label>
  );
}
function Card({ title, subtitle = '', children, icon: Icon = null }) {
  return (
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
        {Icon && (
          <span
            className={
              'heading-icon bg-[#362452] text-[#bf9aff] rounded-lg w-10.5 h-10.5 grid place-items-center flex-none'
            }
          >
            <Icon size={21} />
          </span>
        )}
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function AgentWizard({ id = '' }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [agentId, setAgentId] = useState(id || null);
  const [agent, setAgent] = useState(starter);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [sourceKind, setSourceKind] = useState('website');
  const [sourceLabel, setSourceLabel] = useState('');
  const [sampleText, setSampleText] = useState('');
  const [sampleResponse, setSampleResponse] = useState('');
  const set = (key, value) => setAgent((current) => ({ ...current, [key]: value }));
  useEffect(() => {
    const requested = Number(new URLSearchParams(window.location.search).get('step'));
    if (Number.isInteger(requested) && requested >= 0 && requested <= 4) setStep(requested);
  }, []);
  useEffect(() => {
    if (!id) return;
    apiFetch(`${API}/api/voice-agents/${id}`)
      .then(async (r) => {
        if (!r.ok) throw Error('Unable to load this agent.');
        return r.json();
      })
      .then((v) => setAgent({ ...starter, ...v, actions: { ...starter.actions, ...v.actions } }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);
  async function persist(complete = false) {
    if (!agent.name.trim()) {
      setError('Enter an agent name in Basics before saving.');
      setStep(0);
      return false;
    }
    setError('');
    setNotice('');
    setSaving(true);
    try {
      const endpoint = agentId ? `${API}/api/voice-agents/${agentId}` : `${API}/api/voice-agents`;
      const response = await apiFetch(endpoint, {
        method: agentId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.error || 'Could not save this agent.');
      setAgentId(result._id);
      if (complete) {
        const readyResponse = await apiFetch(`${API}/api/voice-agents/${result._id}/complete`, {
          method: 'POST',
        });
        const ready = await readyResponse.json();
        if (!readyResponse.ok) throw Error(ready.error || 'Could not complete this agent.');
        router.push('/voice-agents');
      } else {
        setNotice('Draft saved.');
        if (!id) window.history.replaceState(null, '', `/voice-agents/${result._id}/edit`);
      }
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setSaving(false);
    }
  }
  async function next() {
    if (step === 0 && !agent.name.trim()) {
      setError('Agent name is required.');
      return;
    }
    if (step < 4) {
      if (!(await persist())) return;
      setStep(step + 1);
      setNotice('');
    }
  }
  function addSource() {
    if (!sourceLabel.trim()) return;
    const text = sourceLabel.trim();
    set('knowledgeSources', [
      ...agent.knowledgeSources,
      {
        label: text,
        kind: sourceKind,
        ...(sourceKind === 'website' ? { url: text } : { content: text }),
        status: ['website', 'document'].includes(sourceKind) ? 'configured' : 'ready',
      },
    ]);
    setSourceLabel('');
  }
  function toggleLanguage(language) {
    const exists = agent.languages.includes(language);
    if (exists && agent.languages.length <= 1) return;
    const languages = exists
      ? agent.languages.filter((l) => l !== language)
      : [...agent.languages, language];
    setAgent((current) => ({
      ...current,
      languages,
      fallbackLanguage: languages.includes(current.fallbackLanguage)
        ? current.fallbackLanguage
        : languages[0],
    }));
  }
  function speak(text) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        agent.fallbackLanguage === 'Telugu'
          ? 'te-IN'
          : agent.fallbackLanguage === 'Hindi'
            ? 'hi-IN'
            : 'en-IN';
      utterance.rate =
        agent.speakingSpeed === 'Fast' ? 1.13 : agent.speakingSpeed === 'Slow' ? 0.85 : 0.98;
      window.speechSynthesis.speak(utterance);
    } else setError('Browser speech playback is unavailable.');
  }
  async function previewAnswer(question = sampleText) {
    if (!question.trim()) return;
    try {
      if (!agentId) {
        setSampleResponse('Save a draft first so the demo engine can read your knowledge sources.');
        return;
      }
      const response = await apiFetch('/api/demo/voice/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, question }),
      });
      const value = await response.json();
      if (!response.ok) throw Error(value.error || 'Preview failed');
      setSampleResponse(value.answer);
      speak(value.answer);
    } catch (error) {
      setSampleResponse(error.message);
    }
  }
  async function runDemoTest() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      await previewAnswer(sampleText.trim() || 'How do I install the widget?');
    } catch {
      setSampleResponse(
        'Microphone permission was denied. You can still type a question below to test the FAQ answer.',
      );
    }
  }
  if (loading)
    return (
      <Shell>
        <p className={'loading p-15 text-(--muted)'}>Loading voice agent…</p>
      </Shell>
    );
  return (
    <Shell>
      <Link
        href="/voice-agents"
        className={'back-link inline-flex items-center gap-2.25 text-[#b9a3fc] text-sm mb-4.5'}
      >
        <ArrowLeft size={17} /> Back to voice agents
      </Link>
      <div
        className={
          'wizard-heading flex items-center justify-between gap-6 mb-6.25 [&_h1]:text-4xl [&_h1]:tracking-[-.8px] [&_h1]:m-[0_0_8px] max-[800px]:[&_h1]:text-[25px] max-[600px]:items-start [&_h1]:font-[690] [&_h1]:tracking-[-.038em]'
        }
      >
        <div>
          <p className={'eyebrow text-[#a782ff] text-[11px] tracking-[2px] font-bold m-[0_0_9px]'}>
            VOICE AGENT SETUP
          </p>
          <h1>{agentId ? agent.name || 'Edit voice agent' : 'Create your voice agent'}</h1>
          <p className={'muted text-(--muted) m-0 leading-normal'}>
            Set up an AI voice agent for natural phone and web conversations.
          </p>
        </div>
        <span
          className={
            'status draft inline-flex rounded-[25px] p-[7px_12px] text-[13px] [&.ready]:text-[#5de5b8] [&.ready]:bg-[#133b32] [&.ready]:border [&.ready]:border-[#215544] [&.draft]:text-[#ffd17d] [&.draft]:bg-[#4a351a] [&.draft]:border [&.draft]:border-[#765020]'
          }
        >
          ● {agent.status === 'ready' ? 'Ready' : 'Draft'}
        </span>
      </div>
      <div
        className={
          "steps flex items-start justify-between gap-1.25 relative m-[33px_50px_36px] [&::before]:content-[''] [&::before]:absolute [&::before]:h-0.5 [&::before]:bg-[#40404a] [&::before]:left-[5%] [&::before]:right-[5%] [&::before]:top-4.5 max-[800px]:m-[25px_0] max-[800px]:gap-0 max-[800px]:[&::before]:left-[7%] max-[800px]:[&::before]:right-[7%] max-[600px]:m-[26px_0]"
        }
        aria-label="Voice agent setup steps"
      >
        {STEPS.map((label, index) => (
          <button
            className={`step relative z-1 flex items-center flex-col gap-2.25 min-w-26 text-(--muted) bg-transparent border-0 [&_span]:border [&_span]:border-[#50505c] [&_span]:bg-[#272830] [&_span]:grid [&_span]:place-items-center [&_span]:w-9.25 [&_span]:h-9.25 [&_span]:rounded-full [&_span]:text-white [&_span]:text-[15px] [&.current_span]:bg-(--purple) [&.current_span]:border-[#a37eff] [&.current_span]:shadow-[0_0_0_5px_#6a3fe423] [&.complete_span]:bg-(--purple) [&.complete_span]:border-[#a37eff] [&.complete_span]:shadow-[0_0_0_5px_#6a3fe423] [&.current_strong]:text-white [&.complete_strong]:text-white [&_strong]:text-sm [&_strong]:font-medium max-[800px]:min-w-13.75 max-[800px]:[&_strong]:text-[11px] max-[600px]:[&_strong]:hidden max-[600px]:min-w-10${index === step ? 'current' : ''}${index < step ? 'complete' : ''}`}
            key={label}
            onClick={() => setStep(index)}
          >
            <span>{index < step ? <Check size={18} /> : index + 1}</span>
            <strong>{label}</strong>
          </button>
        ))}
      </div>
      {error && (
        <p
          className={
            'form-feedback error border border-[currentColor] rounded-lg p-[12px_15px] text-sm mb-3.75 text-[#ff8f99]!'
          }
          role="alert"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          className={
            'form-feedback success border border-[currentColor] rounded-lg p-[12px_15px] text-sm mb-3.75 text-[#68e0ba]'
          }
          role="status"
        >
          {notice}
        </p>
      )}
      {step === 0 && (
        <div
          className={
            'wizard-columns grid grid-cols-[1.1fr_.9fr] gap-4.5 items-start max-[800px]:grid-cols-1'
          }
        >
          <Card title="Agent basics" subtitle="Give your agent a clear identity and purpose.">
            <div className={'field-stack grid gap-4.75'}>
              <Field label="Agent name *">
                <input
                  value={agent.name}
                  onChange={(e) => set('name', e.target.value)}
                  maxLength={90}
                  placeholder="Website Support"
                />
              </Field>
              <Field label="Purpose">
                <textarea
                  rows={3}
                  value={agent.purpose}
                  onChange={(e) => set('purpose', e.target.value)}
                  placeholder="Answer support calls and connect customers to a person when needed."
                />
              </Field>
              <Field label="Agent role">
                <select value={agent.role} onChange={(e) => set('role', e.target.value)}>
                  <option>Customer support</option>
                  <option>Sales enquiries</option>
                  <option>Appointment scheduling</option>
                  <option>Custom</option>
                </select>
              </Field>
              <Field label="Company">
                <input value={agent.company} onChange={(e) => set('company', e.target.value)} />
              </Field>
              <Field label="Instructions">
                <textarea
                  rows={3}
                  value={agent.instructions}
                  onChange={(e) => set('instructions', e.target.value)}
                  placeholder="Help customers with setup, pricing and account questions. Escalate unresolved issues."
                />
              </Field>
            </div>
          </Card>
          <Card
            title="Voice agent preview"
            subtitle="See how your agent will introduce itself and respond."
          >
            <div
              className={
                'preview-chat border border-[#454052] rounded-[15px] min-h-119.75 p-7.75 bg-[radial-gradient(circle_at_50%_38%,#30234a,#1b1b25_55%)] text-center [&_h3]:m-[22px_0_5px] [&_h3]:text-[21px] [&_p]:text-(--muted) [&_p]:m-[0_0_28px]'
              }
            >
              <span
                className={
                  'preview-orb grid place-items-center rounded-full bg-[linear-gradient(140deg,#ab78ff,#5c30e1)] shadow-[0_0_0_11px_#6b43ca24] m-[0_auto] text-white h-20.25 w-20.25'
                }
              >
                <AudioLines size={36} />
              </span>
              <h3>{agent.name || 'Your voice agent'}</h3>
              <p>{agent.company || 'Your company'}</p>
              <div
                className={
                  'bubble max-w-[85%] text-left bg-[#2b2b37] border border-[#3d3d49] p-[13px_17px] rounded-xl m-[14px_0_0_auto] leading-normal text-sm [&.reply]:bg-[#5234ae] [&.reply]:border-[#6140d6] [&.reply]:ml-auto [&.reply]:max-w-[70%]'
                }
              >
                {agent.greeting}
              </div>
              <div
                className={
                  'bubble reply max-w-[85%] text-left bg-[#2b2b37] border border-[#3d3d49] p-[13px_17px] rounded-xl m-[14px_0_0_auto] leading-normal text-sm [&.reply]:bg-[#5234ae] [&.reply]:border-[#6140d6] [&.reply]:ml-auto [&.reply]:max-w-[70%]'
                }
              >
                I need help with my account setup.
              </div>
              <div
                className={
                  'preview-input mt-9.5 flex justify-between items-center text-[#8d8d9e] border border-[#3d3b48] p-[12px_14px] rounded-3xl text-sm'
                }
              >
                Sample conversation preview <Send size={17} />
              </div>
            </div>
          </Card>
        </div>
      )}
      {step === 1 && (
        <div
          className={
            'wizard-columns grid grid-cols-[1.1fr_.9fr] gap-4.5 items-start max-[800px]:grid-cols-1'
          }
        >
          <div className={'column-stack grid gap-4.25'}>
            <Card
              icon={Globe}
              title="Language coverage"
              subtitle="Choose the languages your voice agent can speak."
            >
              <div className={'language-options flex flex-wrap gap-2.25'}>
                {languageChoices.map((language) => (
                  <button
                    key={language}
                    className={`language-choice border border-[#464652] bg-[#292832] text-[#e3dfed] p-[10px_12px] rounded-lg flex gap-1.75 items-center [&.chosen]:border-[#8753f9] [&.chosen]:bg-[#332645]${agent.languages.includes(language) ? 'chosen' : ''}`}
                    onClick={() => toggleLanguage(language)}
                  >
                    {agent.languages.includes(language) ? <Check size={17} /> : <Plus size={17} />}{' '}
                    {language}
                  </button>
                ))}
              </div>
              <div className={'subtle-divider h-px bg-(--line) m-[20px_0]'} />
              <Field label="Fallback language">
                <select
                  value={agent.fallbackLanguage}
                  onChange={(e) => set('fallbackLanguage', e.target.value)}
                >
                  {agent.languages.map((language) => (
                    <option key={language}>{language}</option>
                  ))}
                </select>
              </Field>
            </Card>
            <Card icon={Mic} title="Voice identity" subtitle="Choose a voice and a speaking speed.">
              {['Aarav', 'Maya'].map((voice) => (
                <label
                  key={voice}
                  className={`voice-option [&.chosen]:border-[#8753f9] [&.chosen]:bg-[#332645] border border-(--line) rounded-lg p-3 m-[11px_0] flex items-center gap-3 cursor-pointer [&_input]:accent-[#7847ec] [&_strong]:block [&_small]:block [&_small]:text-(--muted) [&_small]:mt-1${agent.voice === voice ? 'chosen' : ''}`}
                >
                  <input
                    type="radio"
                    name="voice"
                    checked={agent.voice === voice}
                    onChange={() => set('voice', voice)}
                  />
                  <span
                    className={
                      'voice-play bg-[#454152] grid place-items-center h-8.75 w-8.75 rounded-full'
                    }
                  >
                    <Play size={18} />
                  </span>
                  <span>
                    <strong>{voice}</strong>
                    <small>{voice === 'Aarav' ? 'Warm & clear' : 'Calm & friendly'}</small>
                  </span>
                  <span className={'voice-option-end ml-auto text-(--muted) text-xs'}>
                    Voice option
                  </span>
                </label>
              ))}
              <Field label="Speaking speed">
                <select
                  value={agent.speakingSpeed}
                  onChange={(e) => set('speakingSpeed', e.target.value)}
                >
                  <option>Slow</option>
                  <option>Natural</option>
                  <option>Fast</option>
                </select>
              </Field>
            </Card>
          </div>
          <Card
            icon={Headphones}
            title="Voice preview"
            subtitle="Selected voice and language settings."
          >
            <div
              className={
                'voice-preview-box border border-(--line) rounded-[10px] p-5.75 bg-[#22222b] [&_.bubble]:m-[0_auto_24px]'
              }
            >
              <div
                className={
                  'bubble max-w-[85%] text-left bg-[#2b2b37] border border-[#3d3d49] p-[13px_17px] rounded-xl m-[14px_0_0_auto] leading-normal text-sm [&.reply]:bg-[#5234ae] [&.reply]:border-[#6140d6] [&.reply]:ml-auto [&.reply]:max-w-[70%]'
                }
              >
                Hello! How can I help you today?
              </div>
              <div
                className={
                  'wave-line flex items-center justify-evenly text-[#a778ff] [&_span]:text-[13px] [&_span]:text-(--muted)'
                }
              >
                <AudioLines size={47} />
                <span>
                  {agent.voice} · {agent.speakingSpeed}
                </span>
              </div>
            </div>
            <div
              className={
                'callout flex gap-2.75 items-start bg-[#29243b] text-[#d2c2f5] border border-[#493b69] rounded-[9px] p-3.75 m-[19px_0] text-sm leading-normal [&_svg]:flex-none'
              }
            >
              <Info size={19} /> Caller language can be detected automatically. This is a settings
              preview; voice samples are available when audio service is connected.
            </div>
            <Switch
              label="Detect caller language"
              checked={agent.detectCallerLanguage}
              onChange={(v) => set('detectCallerLanguage', v)}
            />
          </Card>
        </div>
      )}
      {step === 2 && (
        <div
          className={
            'wizard-columns grid grid-cols-[1.1fr_.9fr] gap-4.5 items-start max-[800px]:grid-cols-1'
          }
        >
          <Card
            icon={BookOpen}
            title="Give your agent the right knowledge"
            subtitle="Add sources the agent can use to answer questions."
          >
            <div
              className={
                'source-tiles grid grid-cols-[repeat(4,1fr)] gap-2.25 max-[1100px]:grid-cols-[repeat(2,1fr)]'
              }
            >
              {(
                [
                  ['website', 'Website', Globe],
                  ['document', 'Document', FileText],
                  ['faq', 'FAQs', CircleHelp],
                  ['business', 'Business details', Info],
                ] as const
              ).map(([kind, label, Icon]) => (
                <button
                  className={`source-tile [&.chosen]:border-[#8753f9] [&.chosen]:bg-[#332645] flex flex-col gap-3 items-start text-left min-h-24 p-3.25 text-[#eeeaf7] bg-[#23232c] border border-(--line) rounded-[9px] text-[13px] [&_svg]:text-[#a77af8]${sourceKind === kind ? 'chosen' : ''}`}
                  key={kind}
                  onClick={() => setSourceKind(kind)}
                >
                  <Icon size={21} />
                  <strong>{label}</strong>
                </button>
              ))}
            </div>
            <div
              className={
                'source-add [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] flex gap-2 m-[17px_0] [&_input]:min-w-0 max-[600px]:flex-col'
              }
            >
              <input
                value={sourceLabel}
                onChange={(e) => setSourceLabel(e.target.value)}
                placeholder={
                  sourceKind === 'website'
                    ? 'https://example.com/help'
                    : sourceKind === 'faq'
                      ? 'Question and answer (text)'
                      : sourceKind === 'document'
                        ? 'Document name (file uploads in next phase)'
                        : 'Business information'
                }
                aria-label="Knowledge source"
              />
              <button
                className={
                  'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
                onClick={addSource}
              >
                <Plus size={17} /> Add source
              </button>
            </div>
            <p className={'helper-text text-[#a4a1b4] text-xs leading-[1.6] m-[8px_0]'}>
              Source labels are saved now. URL crawling, document upload and retrieval indexing are
              added with the AI integration.
            </p>
            <h3 className={'section-label text-[15px] m-[25px_0_11px]'}>Added knowledge sources</h3>
            <div
              className={
                'source-list border border-(--line) rounded-lg min-h-12 p-[0_12px] [&>.muted]:p-3.25'
              }
            >
              {agent.knowledgeSources.length ? (
                agent.knowledgeSources.map((source, index) => (
                  <div
                    className={
                      'source-row flex items-center gap-2.5 min-h-11.75 border-b border-b-(--line) text-[13px] last:border-0 [&>span:first-child]:overflow-hidden [&>span:first-child]:text-ellipsis [&>span:first-child]:whitespace-nowrap [&>span:first-child]:flex-1 [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[#b8a8cd]'
                    }
                    key={`${source.label}-${index}`}
                  >
                    <span>{source.label}</span>
                    <span
                      className={
                        'pill inline-block p-[6px_10px] text-xs bg-[#282833] text-[#d4d1e2] border border-[#393943] rounded-[30px]'
                      }
                    >
                      {source.kind}
                    </span>
                    <button
                      aria-label={`Remove ${source.label}`}
                      onClick={() =>
                        set(
                          'knowledgeSources',
                          agent.knowledgeSources.filter((_, i) => i !== index),
                        )
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))
              ) : (
                <p className={'muted text-(--muted) m-0 leading-normal'}>No sources added yet.</p>
              )}
            </div>
            <h3 className={'section-label text-[15px] m-[25px_0_11px]'}>Actions</h3>
            <Switch
              label="Look up account status"
              checked={agent.actions.accountLookup}
              onChange={(v) => set('actions', { ...agent.actions, accountLookup: v })}
            />
            <Switch
              label="Create support ticket"
              checked={agent.actions.supportTicket}
              onChange={(v) => set('actions', { ...agent.actions, supportTicket: v })}
            />
            <p className={'helper-text text-[#a4a1b4] text-xs leading-[1.6] m-[8px_0]'}>
              Action switches store intent. They cannot perform account lookups or create tickets
              until secure integrations are configured.
            </p>
          </Card>
          <Card
            icon={Sparkles}
            title="Test an answer"
            subtitle="Preview your configured knowledge settings."
          >
            <div
              className={
                'test-panel [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] grid gap-3.5'
              }
            >
              <input
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                placeholder="How do I install the widget?"
                aria-label="Sample question"
              />
              <button
                className={
                  'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
                onClick={() => previewAnswer()}
              >
                Preview answer settings
              </button>
              {sampleResponse && (
                <p
                  className={
                    'callout flex gap-2.75 items-start bg-[#29243b] text-[#d2c2f5] border border-[#493b69] rounded-[9px] p-3.75 m-[19px_0] text-sm leading-normal [&_svg]:flex-none'
                  }
                >
                  {sampleResponse}
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
      {step === 3 && (
        <div
          className={
            'wizard-columns grid grid-cols-[1.1fr_.9fr] gap-4.5 items-start max-[800px]:grid-cols-1'
          }
        >
          <Card
            icon={Mic}
            title="Shape the call conversation"
            subtitle="Configure how the agent speaks and handles edge cases."
          >
            <div className={'field-stack grid gap-4.75'}>
              <Field label="Greeting">
                <input
                  value={agent.greeting}
                  maxLength={400}
                  onChange={(e) => set('greeting', e.target.value)}
                />
              </Field>
              <div
                className={
                  'field grid gap-2 text-sm [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#454551] [&_textarea]:bg-[#202128] [&_textarea]:p-[12px_13px] [&_textarea]:text-[#f5f5f8] [&_textarea]:outline-0 [&_textarea]:text-sm [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#454551] [&_select]:bg-[#202128] [&_select]:p-[12px_13px] [&_select]:text-[#f5f5f8] [&_select]:outline-0 [&_select]:text-sm [&_textarea]:resize-y [&_textarea]:leading-normal [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] [&_textarea:focus]:border-[#a47aff] [&_textarea:focus]:shadow-[0_0_0_3px_#7646e323] [&_select:focus]:border-[#a47aff] [&_select:focus]:shadow-[0_0_0_3px_#7646e323] [&_small]:text-(--muted) [&_small]:text-xs'
                }
              >
                <span className={'field-label text-[#f0eff5] font-[540]'}>Conversation style</span>
                <div
                  className={
                    'radio-choices flex gap-5 [&_label]:flex [&_label]:items-center [&_label]:gap-2 [&_input]:accent-(--purple)'
                  }
                >
                  {['Concise and helpful', 'Detailed'].map((style) => (
                    <label key={style}>
                      <input
                        type="radio"
                        checked={agent.style === style}
                        onChange={() => set('style', style)}
                      />
                      {style}
                    </label>
                  ))}
                </div>
              </div>
              <Field label="When the agent cannot answer">
                <select
                  value={agent.unanswered}
                  onChange={(e) => set('unanswered', e.target.value)}
                >
                  <option>Ask to connect with a person</option>
                  <option>Offer a callback</option>
                  <option>End politely</option>
                </select>
              </Field>
              <Field label="End of call">
                <select value={agent.endOfCall} onChange={(e) => set('endOfCall', e.target.value)}>
                  <option>Summarize the outcome</option>
                  <option>End without a summary</option>
                </select>
              </Field>
            </div>
          </Card>
          <div className={'column-stack grid gap-4.25'}>
            <Card
              icon={ShieldCheck}
              title="Call safeguards"
              subtitle="Set limits and fallbacks for a good caller experience."
            >
              <div className={'field-stack grid gap-4.75'}>
                <Field label="Silence prompt after (seconds)">
                  <input
                    type="number"
                    min="3"
                    max="30"
                    value={agent.silenceSeconds}
                    onChange={(e) => set('silenceSeconds', Number(e.target.value))}
                  />
                </Field>
                <Field label="Maximum call length (minutes)">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={agent.maxCallMinutes}
                    onChange={(e) => set('maxCallMinutes', Number(e.target.value))}
                  />
                </Field>
                <Switch
                  label="Confirm before creating a ticket"
                  checked={agent.confirmTicket}
                  onChange={(v) => set('confirmTicket', v)}
                />
              </div>
            </Card>
            <Card
              icon={UserRound}
              title="Human handoff"
              subtitle="When a caller asks for a person or AI cannot resolve the issue."
            >
              <p className={'muted text-(--muted) m-0 leading-normal'}>
                Routing, business hours and callback options are configured in the Voice Widget.
                Saving an agent does not publish a calling endpoint.
              </p>
            </Card>
          </div>
        </div>
      )}
      {step === 4 && (
        <div
          className={
            'wizard-columns grid grid-cols-[1.1fr_.9fr] gap-4.5 items-start max-[800px]:grid-cols-1'
          }
        >
          <Card
            icon={AudioLines}
            title="Test and save your voice agent"
            subtitle="Review the setup before connecting it to a Voice Widget."
          >
            <div
              className={
                'test-hero [&_h3]:m-[22px_0_5px] [&_h3]:text-[21px] [&_p]:text-(--muted) [&_p]:m-[0_0_28px] text-center bg-[#211d2e] rounded-xl border border-[#3e3656] p-[44px_22px] [&_.status]:m-[0_0_22px] [&_.button]:flex [&_.button]:m-[0_auto_12px]'
              }
            >
              <span
                className={
                  'test-orb grid place-items-center rounded-full bg-[linear-gradient(140deg,#ab78ff,#5c30e1)] shadow-[0_0_0_11px_#6b43ca24] m-[0_auto] text-white h-30 w-30'
                }
              >
                <AudioLines size={51} />
              </span>
              <h3>{agent.name || 'Your voice agent'}</h3>
              <p>{agent.company}</p>
              <span
                className={
                  'status ready inline-flex rounded-[25px] p-[7px_12px] text-[13px] [&.ready]:text-[#5de5b8] [&.ready]:bg-[#133b32] [&.ready]:border [&.ready]:border-[#215544] [&.draft]:text-[#ffd17d] [&.draft]:bg-[#4a351a] [&.draft]:border [&.draft]:border-[#765020]'
                }
              >
                ● Configuration ready
              </span>
              <button
                className={
                  'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
                onClick={runDemoTest}
              >
                <Mic size={18} /> Start demo test call
              </button>
              <p className={'helper-text text-[#a4a1b4] text-xs leading-[1.6] m-[8px_0]'}>
                Uses browser speech and local FAQ responses. No real provider call.
              </p>
            </div>
          </Card>
          <div className={'column-stack grid gap-4.25'}>
            <Card title="Readiness checklist" subtitle="Review the settings that will be saved.">
              <div className="checklist">
                {[
                  ['Basics', `${agent.company} · ${agent.name || 'Name needed'}`],
                  ['Voice', `${agent.languages.join(', ')} · ${agent.voice}`],
                  ['Knowledge', `${agent.knowledgeSources.length} sources configured`],
                  ['Conversation rules', `${agent.style} · ${agent.maxCallMinutes} min max`],
                  ['Human handoff', 'Set up later in Voice Widget'],
                ].map(([title, detail], index) => (
                  <div
                    key={title}
                    className={
                      'check-item flex items-center gap-3.5 p-[13px_6px] border-t border-t-(--line) [&_strong]:block [&_small]:block [&_small]:mt-1 [&_small]:text-(--muted)'
                    }
                  >
                    <span
                      className={
                        index === 4
                          ? 'check-info grid place-items-center rounded-full w-7.25 h-7.25 bg-[#175341] text-[#5aebbb] flex-none bg-[#253b5c] text-[#68aaff]'
                          : 'check-icon grid place-items-center rounded-full w-7.25 h-7.25 bg-[#175341] text-[#5aebbb] flex-none'
                      }
                    >
                      {index === 4 ? <Info size={17} /> : <Check size={17} />}
                    </span>
                    <span>
                      <strong>{title}</strong>
                      <small>{detail}</small>
                    </span>
                  </div>
                ))}
              </div>
            </Card>
            <Card icon={Info} title="How it works">
              <p className={'muted text-(--muted) m-0 leading-normal'}>
                Saving this agent keeps it in your workspace. Connect it to a Voice Widget to
                publish it on your website.
              </p>
            </Card>
          </div>
        </div>
      )}
      {step === 1 && (
        <div
          className={
            'demo-control border border-[#645198] bg-[linear-gradient(110deg,#26213a,#211e2c)] p-[18px_20px] rounded-[11px] m-[18px_0] [&_h3]:m-[0_0_5px] [&_h3]:text-base [&_p]:text-[#c3bed0] [&_p]:text-[13px] [&_p]:leading-normal [&_p]:m-0 [&_.helper-text]:mt-2.5'
          }
        >
          <span
            className={
              'demo-control-tag inline-block text-[#c7a7ff] text-[11px] tracking-[.11em] font-bold mb-3'
            }
          >
            BROWSER AUDIO PREVIEW
          </span>
          <button
            className={
              'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
            }
            onClick={() => speak('Hello! How can I help you today?')}
          >
            <Play size={16} /> Hear greeting in your browser
          </button>
          <span className={'helper-text text-[#a4a1b4] text-xs leading-[1.6] m-[8px_0]'}>
            Device TTS preview; Aarav/Maya branded voices require Paluku TTS integration.
          </span>
        </div>
      )}
      {step === 4 && (
        <div
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
          <h3>Try a sample question</h3>
          <div
            className={
              'demo-question flex gap-2.25 [&_input]:flex-1 [&_input]:min-w-0 [&_input]:p-[11px_13px] [&_input]:text-white [&_input]:bg-[#1d1c2a] [&_input]:border [&_input]:border-[#4b435e] [&_input]:rounded-lg max-[650px]:flex-col'
            }
          >
            <input
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder="How do I install the widget?"
              aria-label="Demo question"
            />
            <button
              className={
                'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
              }
              onClick={() => previewAnswer()}
            >
              Ask demo agent
            </button>
          </div>
          {sampleResponse && (
            <p
              className={
                'demo-result m-[17px_0_0] whitespace-pre-wrap leading-[1.6] text-[#d9d2eb] text-sm bg-[#1b1a29] p-3.75 border border-[#4e4067] rounded-[9px]'
              }
            >
              {sampleResponse}
            </p>
          )}
          <p className={'helper-text text-[#a4a1b4] text-xs leading-[1.6] m-[8px_0]'}>
            Demo answers use local FAQ keyword matching and browser audio. No real call is placed.
          </p>
        </div>
      )}
      <div
        className={
          'wizard-footer flex justify-between items-center mt-4.75 pt-3.75 border-t border-t-(--line)'
        }
      >
        <div>
          {step > 0 && (
            <button
              className={
                'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
              }
              onClick={() => {
                setStep(step - 1);
                setError('');
              }}
            >
              <ArrowLeft size={17} /> Previous
            </button>
          )}
        </div>
        <div
          className={
            'footer-actions flex gap-2.75 max-[600px]:flex-wrap max-[600px]:justify-end max-[600px]:[&_.button]:text-xs max-[600px]:[&_.button]:p-[0_9px]'
          }
        >
          <button
            disabled={saving}
            onClick={() => persist()}
            className={
              'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
            }
          >
            <Save size={17} />
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          {step < 4 ? (
            <button
              className={
                'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
              }
              onClick={next}
            >
              Continue to {STEPS[step + 1].toLowerCase()} <ArrowRight size={18} />
            </button>
          ) : (
            <button
              disabled={saving}
              onClick={() => persist(true)}
              className={
                'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
              }
            >
              Save voice agent <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </Shell>
  );
}
