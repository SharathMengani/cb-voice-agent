'use client';
import { usePathname } from 'next/navigation';

import { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  AudioLines,
  BookOpen,
  Check,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FileText,
  Headphones,
  Mic2,
  Phone,
  Play,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { apiFetch } from './api-client';
import DemoControls from './DemoControls';

const tabs = [
  ['Overview', '/voice-agents'],
  ['Instructions', '/voice-agents/studio/instructions'],
  ['Knowledge', '/voice-agents/studio/knowledge'],
  ['Actions', '/voice-agents/studio/actions'],
  ['Advanced', '/voice-agents/studio/advanced'],
  ['Quality', '/voice-agents/studio/quality'],
  ['Versions', '/voice-agents/studio/versions'],
  ['Inbound', '/voice-agents/studio/inbound'],
  ['Performance', '/analytics/voice-agents'],
];
const title = {
  'agent-instructions': 'Agent instructions & prompt',
  'agent-knowledge': 'Knowledge sources',
  'agent-actions': 'Actions & integrations',
  'agent-advanced': 'Advanced voice behaviour',
  'agent-quality': 'Call data & quality rules',
  'agent-versions': 'Test, publish & versions',
  'inbound-routing': 'Phone number & inbound routing',
  'agent-performance': 'Voice agent performance',
};
function Field({ field, value, onChange, agents }) {
  const base = {
    value: value ?? '',
    onChange: (e) => onChange(field.type === 'switch' ? e.target.checked : e.target.value),
  };
  if (field.type === 'switch')
    return (
      <label
        className={
          'studio-toggle flex items-center justify-between p-[12px_0] border-b border-b-[#363846] text-[#eee] text-sm gap-3 [&_input]:accent-[#7944f8] [&_input]:w-4.75 [&_input]:h-4.75'
        }
      >
        <span>{field.label}</span>
        <input type="checkbox" checked={Boolean(value)} onChange={base.onChange} />
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
        <select {...base}>
          <option value="">Select {field.label.toLowerCase()}</option>
          {(field.type === 'agent' ? agents.map((item) => item.name) : field.options).map(
            (option) => (
              <option key={option}>{option}</option>
            ),
          )}
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
      {field.type === 'textarea' ? (
        <textarea {...base} rows={field.label.includes('instructions') ? 6 : 3} />
      ) : (
        <input {...base} type={field.type || 'text'} />
      )}
    </label>
  );
}
function Card({ icon: Icon, heading, sub, children }) {
  return (
    <section
      className={
        'studio-card bg-[linear-gradient(145deg,#1e1f27,#1a1c24)] border border-[#3c3d48] rounded-[11px] p-5.25 mb-4.25 min-w-0'
      }
    >
      <div
        className={
          'studio-card-head flex items-center gap-2.75 mb-4.75 [&>span]:w-10 [&>span]:h-10 [&>span]:bg-[#33254e] [&>span]:text-[#bb91fc] [&>span]:rounded-[9px] [&>span]:grid [&>span]:place-items-center [&_h2]:m-[0_0_4px] [&_h2]:text-[19px] [&_p]:m-0 [&_p]:text-[#acafc1] [&_p]:text-[13px] [&_p]:leading-normal'
        }
      >
        <span>
          <Icon size={21} />
        </span>
        <div>
          <h2>{heading}</h2>
          {sub && <p>{sub}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function AgentStudio({
  previousHref,
  view,
  config,
  form,
  setForm,
  agents,
  records,
  record,
  feedback,
  working,
  onSave,
  onUpdate,
}) {
  const pathname = usePathname();
  const [question, setQuestion] = useState('How do I install the widget?');
  const [answer, setAnswer] = useState('');
  const [testing, setTesting] = useState(false);
  const selected = agents.find((item) => item.name === form['Voice agent']) || agents[0];
  const update = (label, value) => setForm((current) => ({ ...current, [label]: value }));
  const renderFields = (fields) =>
    fields.map((field) => (
      <Field
        key={field.label}
        field={field}
        value={form[field.label]}
        onChange={(value) => update(field.label, value)}
        agents={agents}
      />
    ));
  async function test() {
    setTesting(true);
    try {
      const response = await apiFetch('/api/demo/voice/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: selected?._id, question }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      setAnswer(data.answer);
    } catch (error) {
      setAnswer(error.message);
    } finally {
      setTesting(false);
    }
  }
  const save = () => onSave({ advance: false });
  const next = () =>
    onSave({
      advance: view !== 'agent-performance',
      status: view === 'inbound-routing' ? 'active' : undefined,
    });
  const performance = view === 'agent-performance';
  return (
    <div className={'studio-page max-w-362.5 m-auto'}>
      <Link
        href="/voice-agents"
        className={
          'studio-back inline-flex items-center gap-2.5 text-[#c8c9d8] text-sm m-[6px_0_19px]'
        }
      >
        <ArrowLeft size={17} /> Back to voice agents
      </Link>
      <div
        className={
          'studio-identity flex items-center gap-4.25 mb-4.75 min-h-16.25 [&>div]:flex-1 [&>div]:min-w-0 [&_h1]:text-[27px] [&_h1]:leading-[1.2] [&_h1]:tracking-[-.03em] [&_h1]:m-[0_0_5px] [&_p]:text-[#b9b9cb] [&_p]:m-0 [&_p]:text-sm [&_.status]:mr-2 max-[750px]:flex-wrap max-[750px]:[&>.button]:w-full'
        }
      >
        <span
          className={
            'studio-identity-icon grid place-items-center w-15.5 h-15.5 rounded-[11px] bg-[linear-gradient(135deg,#553197,#30234c)] text-[#d2b6ff] flex-none'
          }
        >
          <Headphones size={27} />
        </span>
        <div>
          <h1>
            {performance ? 'Voice agent performance · demo' : selected?.name || 'Website Support'}
          </h1>
          <p>
            {selected?.company || 'Acme Support'} · {selected?.purpose || 'AI voice support'}
          </p>
        </div>
        <span
          className={`status inline-flex rounded-[25px] p-[7px_12px] text-[13px] [&.ready]:text-[#5de5b8] [&.ready]:bg-[#133b32] [&.ready]:border [&.ready]:border-[#215544] [&.draft]:text-[#ffd17d] [&.draft]:bg-[#4a351a] [&.draft]:border [&.draft]:border-[#765020]${selected?.status === 'ready' ? 'ready' : 'draft'}`}
        >
          ● {selected?.status || 'Draft'}
        </span>
        {!performance && (
          <button
            className={
              'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
            }
            disabled={working}
            onClick={save}
          >
            <Save size={17} /> Save draft
          </button>
        )}
      </div>
      <nav
        className={
          'studio-nav flex items-center gap-1.25 border-b border-b-[#383a46] overflow-x-auto mb-5 [&_a]:whitespace-nowrap [&_a]:p-[16px_18px] [&_a]:text-[#c2c2d1] [&_a]:border-b-[3px_solid_transparent] [&_a]:text-sm [&_a:hover]:text-white [&_a.active]:text-white [&_a.active]:border-[#9964fc]'
        }
        aria-label="Voice agent settings"
      >
        {tabs.map(([name, href]) => (
          <Link key={name} href={href} className={href === pathname ? 'active' : ''}>
            {name}
          </Link>
        ))}
      </nav>
      <div
        className={
          'studio-intro flex items-center justify-between m-[15px_0_21px] [&_h2]:m-[0_0_5px] [&_h2]:text-[26px] [&_h2]:tracking-[-.028em] [&_p]:m-0 [&_p]:text-[#b4b5c6] [&_p]:text-sm'
        }
      >
        <div>
          <h2>{title[view]}</h2>
          <p>
            {performance
              ? 'Workspace sample calls are not attributed to an individual AI agent.'
              : config.caption}
          </p>
        </div>
        {view === 'agent-versions' && (
          <span
            className={
              'status draft inline-flex rounded-[25px] p-[7px_12px] text-[13px] [&.ready]:text-[#5de5b8] [&.ready]:bg-[#133b32] [&.ready]:border [&.ready]:border-[#215544] [&.draft]:text-[#ffd17d] [&.draft]:bg-[#4a351a] [&.draft]:border [&.draft]:border-[#765020]'
            }
          >
            Draft version
          </span>
        )}
      </div>
      {feedback && (
        <p
          role="status"
          className={
            'flow-alert flex gap-2.5 items-center bg-[#173b34] border border-[#296a55] text-[#81e4b8] p-[13px_16px] rounded-[9px] m-[15px_0] text-sm [&.problem]:bg-[#402630] [&.problem]:border-[#a44c68] [&.problem]:text-[#ffb5c1]'
          }
        >
          {feedback}
        </p>
      )}
      {view === 'agent-instructions' && (
        <div
          className={
            'studio-columns grid grid-cols-[minmax(0,1.05fr)_minmax(340px,.8fr)] gap-4.25 items-start [&>div]:min-w-0 max-[1150px]:grid-cols-1'
          }
        >
          <div>
            <Card
              icon={Mic2}
              heading="Opening statement"
              sub="The first thing your assistant says when a call starts."
            >
              <div
                className={
                  'studio-form grid gap-3.75 [&_.field]:grid [&_.field]:gap-1.75 [&_.field_input]:w-full [&_.field_input]:bg-[#1c1e26] [&_.field_input]:border [&_.field_input]:border-[#454651] [&_.field_input]:rounded-lg [&_.field_input]:text-[#f9f8ff] [&_.field_input]:p-[12px_13px] [&_.field_input]:min-h-11 [&_.field_input]:resize-y [&_.field_textarea]:w-full [&_.field_textarea]:bg-[#1c1e26] [&_.field_textarea]:border [&_.field_textarea]:border-[#454651] [&_.field_textarea]:rounded-lg [&_.field_textarea]:text-[#f9f8ff] [&_.field_textarea]:p-[12px_13px] [&_.field_textarea]:min-h-11 [&_.field_textarea]:resize-y [&_.field_select]:w-full [&_.field_select]:bg-[#1c1e26] [&_.field_select]:border [&_.field_select]:border-[#454651] [&_.field_select]:rounded-lg [&_.field_select]:text-[#f9f8ff] [&_.field_select]:p-[12px_13px] [&_.field_select]:min-h-11 [&_.field_select]:resize-y [&_.field-label]:text-sm'
                }
              >
                {renderFields(config.fields.filter((f) => f.label === 'Voice agent'))}
                <label
                  className={
                    'field grid gap-2 text-sm [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#454551] [&_textarea]:bg-[#202128] [&_textarea]:p-[12px_13px] [&_textarea]:text-[#f5f5f8] [&_textarea]:outline-0 [&_textarea]:text-sm [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#454551] [&_select]:bg-[#202128] [&_select]:p-[12px_13px] [&_select]:text-[#f5f5f8] [&_select]:outline-0 [&_select]:text-sm [&_textarea]:resize-y [&_textarea]:leading-normal [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] [&_textarea:focus]:border-[#a47aff] [&_textarea:focus]:shadow-[0_0_0_3px_#7646e323] [&_select:focus]:border-[#a47aff] [&_select:focus]:shadow-[0_0_0_3px_#7646e323] [&_small]:text-(--muted) [&_small]:text-xs'
                  }
                >
                  <span className={'field-label text-[#f0eff5] font-[540]'}>Opening statement</span>
                  <textarea
                    rows={3}
                    value={form['Opening statement'] ?? selected?.greeting ?? ''}
                    onChange={(e) => update('Opening statement', e.target.value)}
                  />
                </label>
                <div
                  className={
                    'studio-help border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal'
                  }
                >
                  Bot speaks first · available only in the demo preview
                </div>
              </div>
            </Card>
            <Card
              icon={FileText}
              heading="System instructions"
              sub="Define role, goals, boundaries and human handoff."
            >
              <div
                className={
                  'studio-form grid gap-3.75 [&_.field]:grid [&_.field]:gap-1.75 [&_.field_input]:w-full [&_.field_input]:bg-[#1c1e26] [&_.field_input]:border [&_.field_input]:border-[#454651] [&_.field_input]:rounded-lg [&_.field_input]:text-[#f9f8ff] [&_.field_input]:p-[12px_13px] [&_.field_input]:min-h-11 [&_.field_input]:resize-y [&_.field_textarea]:w-full [&_.field_textarea]:bg-[#1c1e26] [&_.field_textarea]:border [&_.field_textarea]:border-[#454651] [&_.field_textarea]:rounded-lg [&_.field_textarea]:text-[#f9f8ff] [&_.field_textarea]:p-[12px_13px] [&_.field_textarea]:min-h-11 [&_.field_textarea]:resize-y [&_.field_select]:w-full [&_.field_select]:bg-[#1c1e26] [&_.field_select]:border [&_.field_select]:border-[#454651] [&_.field_select]:rounded-lg [&_.field_select]:text-[#f9f8ff] [&_.field_select]:p-[12px_13px] [&_.field_select]:min-h-11 [&_.field_select]:resize-y [&_.field-label]:text-sm'
                }
              >
                {renderFields(config.fields.filter((f) => f.label !== 'Voice agent'))}
              </div>
            </Card>
          </div>
          <Card
            icon={Sparkles}
            heading="Test your agent’s instructions"
            sub="Ask a sample question to preview the FAQ response."
          >
            <div
              className={
                'studio-sample p-3.5 rounded-[10px] bg-[#252633] [&_span]:text-[#b0acc3] [&_span]:text-[13px] [&_p]:p-[12px_14px] [&_p]:border [&_p]:border-[#434454] [&_p]:rounded-[9px] [&_p]:m-[8px_0_16px] [&_p]:text-sm [&_p]:leading-normal'
              }
            >
              <span>Customer</span>
              <p>{question}</p>
              <span>{selected?.name || 'AI'} · preview</span>
              <p
                className={
                  'studio-sample-answer text-[#e2d5ff] bg-[#28233e] border border-[#574576] rounded-[9px] p-3.5 leading-[1.55] text-sm whitespace-pre-wrap'
                }
              >
                {answer || 'Ask a question to see how the configured knowledge responds.'}
              </p>
            </div>
            <div
              className={
                'studio-question flex gap-2.25 m-[15px_0] [&_input]:min-w-0 [&_input]:flex-1 [&_input]:bg-[#1d1e27] [&_input]:border [&_input]:border-[#454653] [&_input]:rounded-lg [&_input]:p-[11px_13px] [&_input]:text-white'
              }
            >
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                aria-label="Test question"
              />
              <button
                className={
                  'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
                disabled={testing}
                onClick={test}
              >
                {testing ? 'Testing…' : 'Test prompt'} <ArrowRight size={15} />
              </button>
            </div>
            <div
              className={
                'studio-help border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal'
              }
            >
              FAQ keyword preview; live spoken AI needs the voice provider.
            </div>
          </Card>
        </div>
      )}
      {view === 'agent-knowledge' && (
        <div
          className={
            'studio-columns grid grid-cols-[minmax(0,1.05fr)_minmax(340px,.8fr)] gap-4.25 items-start [&>div]:min-w-0 max-[1150px]:grid-cols-1'
          }
        >
          <div>
            <Card
              icon={BookOpen}
              heading="Knowledge sources"
              sub="Manage information that your agent can use to answer callers."
            >
              <div
                className={
                  'studio-form grid gap-3.75 [&_.field]:grid [&_.field]:gap-1.75 [&_.field_input]:w-full [&_.field_input]:bg-[#1c1e26] [&_.field_input]:border [&_.field_input]:border-[#454651] [&_.field_input]:rounded-lg [&_.field_input]:text-[#f9f8ff] [&_.field_input]:p-[12px_13px] [&_.field_input]:min-h-11 [&_.field_input]:resize-y [&_.field_textarea]:w-full [&_.field_textarea]:bg-[#1c1e26] [&_.field_textarea]:border [&_.field_textarea]:border-[#454651] [&_.field_textarea]:rounded-lg [&_.field_textarea]:text-[#f9f8ff] [&_.field_textarea]:p-[12px_13px] [&_.field_textarea]:min-h-11 [&_.field_textarea]:resize-y [&_.field_select]:w-full [&_.field_select]:bg-[#1c1e26] [&_.field_select]:border [&_.field_select]:border-[#454651] [&_.field_select]:rounded-lg [&_.field_select]:text-[#f9f8ff] [&_.field_select]:p-[12px_13px] [&_.field_select]:min-h-11 [&_.field_select]:resize-y [&_.field-label]:text-sm'
                }
              >
                {renderFields(config.fields)}
              </div>
              <div className={'studio-source-list [&_h3]:text-[15px] [&_h3]:m-[22px_0_10px]'}>
                <h3>Added sources</h3>
                {selected?.knowledgeSources?.map((source, i) => (
                  <div
                    className={
                      'studio-source flex items-center gap-2.75 border-t border-t-[#383a48] p-[14px_2px] text-[#ba97fc] [&_span]:flex-1 [&_span]:min-w-0 [&_strong]:block [&_strong]:text-[#f1eff9] [&_strong]:text-sm [&_small]:block [&_small]:text-[#f1eff9] [&_small]:text-sm [&_small]:text-[#a8aabc] [&_small]:text-xs [&_small]:mt-1 [&_em]:text-xs [&_em]:not-italic [&_em]:text-[#e9bf73] [&_em.ready]:text-[#46d9ae]'
                    }
                    key={source._id || i}
                  >
                    <FileText size={20} />
                    <span>
                      <strong>{source.label}</strong>
                      <small>{source.kind || 'Document'}</small>
                    </span>
                    <em className={source.status === 'ready' ? 'ready' : ''}>
                      {source.status || 'Configured'}
                    </em>
                  </div>
                ))}
                {!selected?.knowledgeSources?.length && (
                  <p>No sources yet. Add a FAQ or website URL.</p>
                )}
              </div>
            </Card>
          </div>
          <div>
            <Card
              icon={Sparkles}
              heading="Test a question"
              sub="Check which source your agent uses."
            >
              <div
                className={
                  'studio-question flex gap-2.25 m-[15px_0] [&_input]:min-w-0 [&_input]:flex-1 [&_input]:bg-[#1d1e27] [&_input]:border [&_input]:border-[#454653] [&_input]:rounded-lg [&_input]:p-[11px_13px] [&_input]:text-white'
                }
              >
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  aria-label="Knowledge test question"
                />
                <button
                  className={
                    'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                  }
                  onClick={test}
                  disabled={testing}
                >
                  Ask
                </button>
              </div>
              <p
                className={
                  'studio-sample-answer text-[#e2d5ff] bg-[#28233e] border border-[#574576] rounded-[9px] p-3.5 leading-[1.55] text-sm whitespace-pre-wrap'
                }
                role="status"
              >
                {answer || 'Enter a question and ask the demo agent.'}
              </p>
            </Card>
            <DemoControls
              view="agent-knowledge"
              record={record}
              form={form}
              agents={agents}
              onUpdate={onUpdate}
            />
          </div>
        </div>
      )}
      {view === 'agent-actions' && (
        <div
          className={
            'studio-columns grid grid-cols-[minmax(0,1.05fr)_minmax(340px,.8fr)] gap-4.25 items-start [&>div]:min-w-0 max-[1150px]:grid-cols-1'
          }
        >
          <div>
            <Card
              icon={ShieldCheck}
              heading="Actions & integrations"
              sub="Choose what the agent is allowed to do during calls."
            >
              <div
                className={
                  'studio-action flex items-center gap-2.75 border-t border-t-[#383a48] p-[14px_2px] text-[#ba97fc] [&_div]:flex-1 [&_div]:min-w-0 [&_strong]:block [&_strong]:text-[#f1eff9] [&_strong]:text-sm [&_small]:block [&_small]:text-[#f1eff9] [&_small]:text-sm [&_small]:text-[#a8aabc] [&_small]:text-xs [&_small]:mt-1 [&>span]:text-xs [&>span]:not-italic [&>span]:text-[#e9bf73]'
                }
              >
                <Phone size={19} />
                <div>
                  <strong>Transfer to a human</strong>
                  <small>Route callers to the support team when needed.</small>
                </div>
                <span>Configured in Voice Widget</span>
              </div>
              <div
                className={
                  'studio-form grid gap-3.75 [&_.field]:grid [&_.field]:gap-1.75 [&_.field_input]:w-full [&_.field_input]:bg-[#1c1e26] [&_.field_input]:border [&_.field_input]:border-[#454651] [&_.field_input]:rounded-lg [&_.field_input]:text-[#f9f8ff] [&_.field_input]:p-[12px_13px] [&_.field_input]:min-h-11 [&_.field_input]:resize-y [&_.field_textarea]:w-full [&_.field_textarea]:bg-[#1c1e26] [&_.field_textarea]:border [&_.field_textarea]:border-[#454651] [&_.field_textarea]:rounded-lg [&_.field_textarea]:text-[#f9f8ff] [&_.field_textarea]:p-[12px_13px] [&_.field_textarea]:min-h-11 [&_.field_textarea]:resize-y [&_.field_select]:w-full [&_.field_select]:bg-[#1c1e26] [&_.field_select]:border [&_.field_select]:border-[#454651] [&_.field_select]:rounded-lg [&_.field_select]:text-[#f9f8ff] [&_.field_select]:p-[12px_13px] [&_.field_select]:min-h-11 [&_.field_select]:resize-y [&_.field-label]:text-sm'
                }
              >
                {renderFields(config.fields)}
              </div>
            </Card>
          </div>
          <Card
            icon={Activity}
            heading="Configure an action"
            sub="External account and ticket actions need verified server credentials."
          >
            <div
              className={
                'studio-notice border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal'
              }
            >
              The demo stores action settings. It does not call your account system or create live
              tickets.
            </div>
            <div
              className={
                'studio-details [&>div]:flex [&>div]:items-start [&>div]:justify-between [&>div]:gap-3.75 [&>div]:border-b [&>div]:border-b-[#373944] [&>div]:p-[12px_0] [&>div]:text-sm [&_strong]:text-right [&_strong]:wrap-anywhere [&_strong]:max-w-[65%] [&_span]:text-[#afb1c5]'
              }
            >
              <div>
                <span>Current agent</span>
                <strong>{selected?.name || 'Select agent'}</strong>
              </div>
              <div>
                <span>Account lookup</span>
                <strong>{form['Account lookup'] ? 'Enabled · needs connection' : 'Off'}</strong>
              </div>
              <div>
                <span>Ticket creation</span>
                <strong>{form['Ticket creation'] ? 'Enabled · needs connection' : 'Off'}</strong>
              </div>
            </div>
          </Card>
        </div>
      )}
      {view === 'agent-advanced' && (
        <div
          className={
            'studio-columns grid grid-cols-[minmax(0,1.05fr)_minmax(340px,.8fr)] gap-4.25 items-start [&>div]:min-w-0 max-[1150px]:grid-cols-1'
          }
        >
          <Card
            icon={Volume2}
            heading="Advanced voice behaviour"
            sub="Control interruptions, silence and fallback language."
          >
            <div
              className={
                'studio-form grid gap-3.75 [&_.field]:grid [&_.field]:gap-1.75 [&_.field_input]:w-full [&_.field_input]:bg-[#1c1e26] [&_.field_input]:border [&_.field_input]:border-[#454651] [&_.field_input]:rounded-lg [&_.field_input]:text-[#f9f8ff] [&_.field_input]:p-[12px_13px] [&_.field_input]:min-h-11 [&_.field_input]:resize-y [&_.field_textarea]:w-full [&_.field_textarea]:bg-[#1c1e26] [&_.field_textarea]:border [&_.field_textarea]:border-[#454651] [&_.field_textarea]:rounded-lg [&_.field_textarea]:text-[#f9f8ff] [&_.field_textarea]:p-[12px_13px] [&_.field_textarea]:min-h-11 [&_.field_textarea]:resize-y [&_.field_select]:w-full [&_.field_select]:bg-[#1c1e26] [&_.field_select]:border [&_.field_select]:border-[#454651] [&_.field_select]:rounded-lg [&_.field_select]:text-[#f9f8ff] [&_.field_select]:p-[12px_13px] [&_.field_select]:min-h-11 [&_.field_select]:resize-y [&_.field-label]:text-sm'
              }
            >
              {renderFields(config.fields)}
            </div>
            <div
              className={
                'studio-notice border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal'
              }
            >
              A real provider decides the actual silence detection and interruption timing.
            </div>
          </Card>
          <Card
            icon={AudioLines}
            heading="Simulation preview"
            sub="See an example of your configured response flow."
          >
            <div
              className={
                'studio-timeline [&_p]:p-[10px_0] [&_p]:border-b [&_p]:border-b-[#343641] [&_p]:text-[#c8c8d7] [&_p]:leading-normal [&_p]:text-sm [&_b]:text-[#ba9bfb] [&_b]:mr-2.25'
              }
            >
              <p>
                <b>1</b> Caller speaks in{' '}
                {form['Fallback language'] || selected?.fallbackLanguage || 'English (India)'}
              </p>
              <p>
                <b>2</b> Assistant checks the knowledge source
              </p>
              <p>
                <b>3</b> If unresolved, request human handoff
              </p>
            </div>
            <button
              className={
                'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
              }
              onClick={test}
            >
              <Play size={16} /> Preview response
            </button>
            {answer && (
              <p
                className={
                  'studio-sample-answer text-[#e2d5ff] bg-[#28233e] border border-[#574576] rounded-[9px] p-3.5 leading-[1.55] text-sm whitespace-pre-wrap'
                }
              >
                {answer}
              </p>
            )}
          </Card>
        </div>
      )}
      {view === 'agent-quality' && (
        <div
          className={
            'studio-columns grid grid-cols-[minmax(0,1.05fr)_minmax(340px,.8fr)] gap-4.25 items-start [&>div]:min-w-0 max-[1150px]:grid-cols-1'
          }
        >
          <Card
            icon={FileText}
            heading="Call data & quality rules"
            sub="Choose which caller information and call artifacts are stored."
          >
            <div
              className={
                'studio-form grid gap-3.75 [&_.field]:grid [&_.field]:gap-1.75 [&_.field_input]:w-full [&_.field_input]:bg-[#1c1e26] [&_.field_input]:border [&_.field_input]:border-[#454651] [&_.field_input]:rounded-lg [&_.field_input]:text-[#f9f8ff] [&_.field_input]:p-[12px_13px] [&_.field_input]:min-h-11 [&_.field_input]:resize-y [&_.field_textarea]:w-full [&_.field_textarea]:bg-[#1c1e26] [&_.field_textarea]:border [&_.field_textarea]:border-[#454651] [&_.field_textarea]:rounded-lg [&_.field_textarea]:text-[#f9f8ff] [&_.field_textarea]:p-[12px_13px] [&_.field_textarea]:min-h-11 [&_.field_textarea]:resize-y [&_.field_select]:w-full [&_.field_select]:bg-[#1c1e26] [&_.field_select]:border [&_.field_select]:border-[#454651] [&_.field_select]:rounded-lg [&_.field_select]:text-[#f9f8ff] [&_.field_select]:p-[12px_13px] [&_.field_select]:min-h-11 [&_.field_select]:resize-y [&_.field-label]:text-sm'
              }
            >
              {renderFields(config.fields)}
            </div>
            <div
              className={
                'studio-notice border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal'
              }
            >
              Storage preferences apply to the demo record. Configure consent, retention and
              deletion before live calls.
            </div>
          </Card>
          <Card
            icon={ShieldCheck}
            heading="Conversation quality criteria"
            sub="Review handoff and outcome completeness."
          >
            <div
              className={
                'studio-timeline [&_p]:p-[10px_0] [&_p]:border-b [&_p]:border-b-[#343641] [&_p]:text-[#c8c8d7] [&_p]:leading-normal [&_p]:text-sm [&_b]:text-[#ba9bfb] [&_b]:mr-2.25'
              }
            >
              <p>
                <b>✓</b> Ask for consent before saving caller details
              </p>
              <p>
                <b>✓</b> Escalate unresolved requests
              </p>
              <p>
                <b>✓</b> Save a post-call outcome
              </p>
            </div>
            <div
              className={
                'studio-help border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal'
              }
            >
              Only local preview rules are available until a QA service is connected.
            </div>
          </Card>
        </div>
      )}
      {view === 'agent-versions' && (
        <div
          className={
            'studio-columns grid grid-cols-[minmax(0,1.05fr)_minmax(340px,.8fr)] gap-4.25 items-start [&>div]:min-w-0 max-[1150px]:grid-cols-1'
          }
        >
          <Card
            icon={CheckCircle2}
            heading="Draft v3 is ready to test"
            sub="Review changes before saving a new draft."
          >
            <div
              className={
                'studio-checklist [&>div]:flex [&>div]:items-center [&>div]:gap-2.5 [&>div]:border-b [&>div]:border-b-[#343643] [&>div]:p-[12px_0] [&_svg]:text-[#47cda5] [&_span]:flex-1'
              }
            >
              {[
                ['Prompt', selected?.instructions],
                ['Knowledge', `${selected?.knowledgeSources?.length || 0} sources`],
                ['Actions', selected?.actions ? 'Configured' : 'Not configured'],
                ['Voice', selected?.voice],
                ['Human handoff', 'Configure in Voice Widget'],
              ].map(([label, value]) => (
                <div key={label}>
                  <Check size={18} />
                  <span>{label}</span>
                  <strong>{value ? 'Ready' : 'Review'}</strong>
                </div>
              ))}
            </div>
            <div
              className={
                'studio-form grid gap-3.75 [&_.field]:grid [&_.field]:gap-1.75 [&_.field_input]:w-full [&_.field_input]:bg-[#1c1e26] [&_.field_input]:border [&_.field_input]:border-[#454651] [&_.field_input]:rounded-lg [&_.field_input]:text-[#f9f8ff] [&_.field_input]:p-[12px_13px] [&_.field_input]:min-h-11 [&_.field_input]:resize-y [&_.field_textarea]:w-full [&_.field_textarea]:bg-[#1c1e26] [&_.field_textarea]:border [&_.field_textarea]:border-[#454651] [&_.field_textarea]:rounded-lg [&_.field_textarea]:text-[#f9f8ff] [&_.field_textarea]:p-[12px_13px] [&_.field_textarea]:min-h-11 [&_.field_textarea]:resize-y [&_.field_select]:w-full [&_.field_select]:bg-[#1c1e26] [&_.field_select]:border [&_.field_select]:border-[#454651] [&_.field_select]:rounded-lg [&_.field_select]:text-[#f9f8ff] [&_.field_select]:p-[12px_13px] [&_.field_select]:min-h-11 [&_.field_select]:resize-y [&_.field-label]:text-sm'
              }
            >
              {renderFields(config.fields)}
            </div>
          </Card>
          <Card
            icon={Mic2}
            heading="Test call console"
            sub="Preview answer and handoff with simulated audio."
          >
            <div
              className={
                'studio-question flex gap-2.25 m-[15px_0] [&_input]:min-w-0 [&_input]:flex-1 [&_input]:bg-[#1d1e27] [&_input]:border [&_input]:border-[#454653] [&_input]:rounded-lg [&_input]:p-[11px_13px] [&_input]:text-white'
              }
            >
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                aria-label="Test call question"
              />
              <button
                className={
                  'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
                onClick={test}
                disabled={testing}
              >
                Start test
              </button>
            </div>
            <p
              className={
                'studio-sample-answer text-[#e2d5ff] bg-[#28233e] border border-[#574576] rounded-[9px] p-3.5 leading-[1.55] text-sm whitespace-pre-wrap'
              }
            >
              {answer || 'The test stays in your browser; no phone number is dialed.'}
            </p>
            <div
              className={
                'studio-notice border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal'
              }
            >
              Save draft keeps the current live widget unchanged.
            </div>
          </Card>
        </div>
      )}
      {view === 'inbound-routing' && (
        <div
          className={
            'studio-columns grid grid-cols-[minmax(0,1.05fr)_minmax(340px,.8fr)] gap-4.25 items-start [&>div]:min-w-0 max-[1150px]:grid-cols-1'
          }
        >
          <Card
            icon={Phone}
            heading="Connect an inbound number"
            sub="Choose the business number and voice agent for incoming calls."
          >
            <div
              className={
                'studio-form grid gap-3.75 [&_.field]:grid [&_.field]:gap-1.75 [&_.field_input]:w-full [&_.field_input]:bg-[#1c1e26] [&_.field_input]:border [&_.field_input]:border-[#454651] [&_.field_input]:rounded-lg [&_.field_input]:text-[#f9f8ff] [&_.field_input]:p-[12px_13px] [&_.field_input]:min-h-11 [&_.field_input]:resize-y [&_.field_textarea]:w-full [&_.field_textarea]:bg-[#1c1e26] [&_.field_textarea]:border [&_.field_textarea]:border-[#454651] [&_.field_textarea]:rounded-lg [&_.field_textarea]:text-[#f9f8ff] [&_.field_textarea]:p-[12px_13px] [&_.field_textarea]:min-h-11 [&_.field_textarea]:resize-y [&_.field_select]:w-full [&_.field_select]:bg-[#1c1e26] [&_.field_select]:border [&_.field_select]:border-[#454651] [&_.field_select]:rounded-lg [&_.field_select]:text-[#f9f8ff] [&_.field_select]:p-[12px_13px] [&_.field_select]:min-h-11 [&_.field_select]:resize-y [&_.field-label]:text-sm'
              }
            >
              {renderFields(config.fields)}
            </div>
            <div
              className={
                'studio-notice border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal'
              }
            >
              This route stays in demo mode until a telephony provider verifies the number and sends
              signed call webhooks.
            </div>
          </Card>
          <Card
            icon={Activity}
            heading="Call path"
            sub="Preview the customer journey when a provider is connected."
          >
            <div
              className={
                'studio-timeline [&_p]:p-[10px_0] [&_p]:border-b [&_p]:border-b-[#343641] [&_p]:text-[#c8c8d7] [&_p]:leading-normal [&_p]:text-sm [&_b]:text-[#ba9bfb] [&_b]:mr-2.25'
              }
            >
              <p>
                <b>1</b> Caller dials {form['Business phone number'] || '+91 business number'}
              </p>
              <p>
                <b>2</b> {form.Agent || selected?.name || 'Voice agent'} greets them
              </p>
              <p>
                <b>3</b> AI requests a human if necessary
              </p>
              <p>
                <b>4</b> An unavailable team offers callback
              </p>
            </div>
            <DemoControls
              view="inbound-call"
              record={record}
              form={form}
              agents={agents}
              onUpdate={onUpdate}
            />
          </Card>
        </div>
      )}
      {view === 'agent-performance' && (
        <>
          <div
            className={
              'studio-performance grid grid-cols-[repeat(4,1fr)] gap-3.25 mb-4.5 [&>div]:bg-[#22232c] [&>div]:border [&>div]:border-[#383945] [&>div]:rounded-[10px] [&>div]:p-4.75 [&>div]:grid [&>div]:gap-1.5 [&_svg]:text-[#bb94fa] [&_span]:text-[13px] [&_span]:text-[#aeb0c3] [&_strong]:text-[27px] max-[750px]:grid-cols-[repeat(2,1fr)]'
            }
          >
            {[
              ['Total calls', records.length, Phone],
              ['Human handoffs', records.filter((r) => r.data?.assignedAgent).length, Headphones],
              ['Completed', records.filter((r) => r.status === 'ended').length, CheckCircle2],
              ['Waiting', records.filter((r) => r.status === 'waiting').length, Clock3],
            ].map(([label, value, Icon]) => (
              <div key={label}>
                <Icon size={22} />
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div
            className={
              'studio-columns grid grid-cols-[minmax(0,1.05fr)_minmax(340px,.8fr)] gap-4.25 items-start [&>div]:min-w-0 max-[1150px]:grid-cols-1'
            }
          >
            <Card icon={Activity} heading="Call volume" sub="Demo calls in this workspace.">
              <div
                className={
                  'studio-chart h-55 flex items-end justify-around gap-2 p-3.75 bg-[linear-gradient(0deg,#2c2247,#20202a)] rounded-[9px] [&_span]:bg-[linear-gradient(#a07afd,#5435ba)] [&_span]:w-[7%] [&_span]:rounded-[5px_5px_0_0]'
                }
              >
                {[4, 7, 5, 9, 8, 12, 11, 15, 13, 16, 14, 18].map((n, i) => (
                  <span key={i} style={{ height: `${n * 4}%` }} />
                ))}
              </div>
            </Card>
            <Card
              icon={Phone}
              heading="Recent calls"
              sub="Open history to review transcript and outcome."
            >
              {records.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className={
                    'studio-source flex items-center gap-2.75 border-t border-t-[#383a48] p-[14px_2px] text-[#ba97fc] [&_span]:flex-1 [&_span]:min-w-0 [&_strong]:block [&_strong]:text-[#f1eff9] [&_strong]:text-sm [&_small]:block [&_small]:text-[#f1eff9] [&_small]:text-sm [&_small]:text-[#a8aabc] [&_small]:text-xs [&_small]:mt-1 [&_em]:text-xs [&_em]:not-italic [&_em]:text-[#e9bf73] [&_em.ready]:text-[#46d9ae]'
                  }
                >
                  <Phone size={18} />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.data?.screen_14?.['Issue summary'] || 'Voice request'}</small>
                  </span>
                  <em>{item.status}</em>
                </div>
              ))}
              <Link
                className={
                  'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
                href="/calls/history"
              >
                View call history
              </Link>
            </Card>
          </div>
        </>
      )}
      {!performance && (
        <footer
          className={
            'studio-footer border-t border-t-[#3b3c47] flex items-center justify-between mt-6 pt-4.25 gap-3 [&>div]:flex [&>div]:gap-2.5'
          }
        >
          <Link
            className={
              'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
            }
            href={previousHref}
          >
            <ArrowLeft size={16} /> Previous
          </Link>
          <div>
            <button
              className={
                'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
              }
              disabled={working}
              onClick={save}
            >
              Save draft
            </button>
            <button
              className={
                'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
              }
              disabled={working}
              onClick={next}
            >
              {working
                ? 'Saving…'
                : view === 'inbound-routing'
                  ? 'Save inbound route'
                  : view === 'agent-versions'
                    ? 'Save draft version'
                    : 'Save & continue'}{' '}
              <ArrowRight size={16} />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
