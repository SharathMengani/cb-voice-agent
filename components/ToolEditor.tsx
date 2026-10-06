'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, FlaskConical, Save, ShieldCheck } from 'lucide-react';
import Shell from './Shell';
import { apiFetch } from './api-client';
import { catalog } from './ToolCatalog';
const starter = {
  api: { url: '', method: 'GET', timeout: 15, requestBody: '' },
  transfer: { targetAgentId: '', summaryTemplate: 'Caller requested a different voice agent.' },
  hangup: { closingMessage: 'Thank you for calling.' },
  webhook: { eventName: 'customer.created', payloadExample: '{}' },
  handoff: {
    department: 'Support',
    reason: 'The caller asked for a person.',
    fallback: 'callback',
  },
  datetime: { timezone: 'Asia/Kolkata', format: 'date-and-time' },
};
function Field({ label, children, hint = '' }) {
  return (
    <label
      className={
        'tl-field flex flex-col gap-2 text-[13px] text-[#e9e3f0] font-[650] m-[19px_0] [&_small]:text-[#aaa3b5] [&_small]:text-[11px] [&_small]:font-normal [&_input]:w-full [&_input]:border [&_input]:border-[#554a5d] [&_input]:rounded-lg [&_input]:bg-[#2b2934] [&_input]:text-white [&_input]:outline-0 [&_input]:p-[11px_12px] [&_input]:min-w-0 [&_input]:resize-y [&_select]:w-full [&_select]:border [&_select]:border-[#554a5d] [&_select]:rounded-lg [&_select]:bg-[#2b2934] [&_select]:text-white [&_select]:outline-0 [&_select]:p-[11px_12px] [&_select]:min-w-0 [&_select]:resize-y [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[#554a5d] [&_textarea]:rounded-lg [&_textarea]:bg-[#2b2934] [&_textarea]:text-white [&_textarea]:outline-0 [&_textarea]:p-[11px_12px] [&_textarea]:min-w-0 [&_textarea]:resize-y [&_:is(input,select,textarea):focus]:border-[#aa83f1]'
      }
    >
      {label}
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
const title = {
  api: 'API Request',
  transfer: 'Transfer call',
  hangup: 'Hang up',
  webhook: 'Received webhook',
  handoff: 'AI handoff',
  datetime: 'Date & time',
};
export default function ToolEditor({ type = 'api', id = '' }) {
  const router = useRouter(),
    [form, setForm] = useState({ name: title[type] || '', config: starter[type] || {} }),
    [record, setRecord] = useState(null),
    [agents, setAgents] = useState([]),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(Boolean(id)),
    [error, setError] = useState(''),
    [issues, setIssues] = useState([]),
    [preview, setPreview] = useState(''),
    [dirty, setDirty] = useState(false),
    [notice, setNotice] = useState('');
  useEffect(() => {
    let active = true;
    const urls = id ? [`/api/tools/${id}`, '/api/voice-agents'] : ['/api/voice-agents'];
    Promise.all(urls.map((url) => apiFetch(url)))
      .then(async (responses) => {
        const results = await Promise.all(responses.map((r) => r.json()));
        for (let i = 0; i < responses.length; i++)
          if (!responses[i].ok) throw Error(results[i].error || 'Could not load tool.');
        if (active) {
          if (id) {
            setRecord(results[0]);
            setForm({ name: results[0].title, config: results[0].data.config });
            setAgents(results[1]);
          } else setAgents(results[0]);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);
  const activeType = record?.data?.type || type;
  const item = catalog.find((x) => x.type === activeType);
  function change(key, value) {
    setDirty(true);
    setForm((old) => ({ ...old, config: { ...old.config, [key]: value } }));
    setPreview('');
    setNotice('');
  }
  async function persist(status) {
    setBusy(true);
    setError('');
    setIssues([]);
    setNotice('');
    try {
      const response = await apiFetch(id ? `/api/tools/${id}` : '/api/tools', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          id
            ? { title: form.name, config: form.config, revision: record.data.revision, status }
            : { title: form.name, type: activeType },
        ),
      });
      const data = await response.json();
      if (!response.ok) {
        setIssues(data.issues || []);
        throw Error(data.error || 'Could not save tool.');
      }
      if (!id) {
        router.push(`/tools/${data._id}`);
        return;
      }
      setRecord(data);
      setForm({ name: data.title, config: data.data.config });
      setDirty(false);
      setPreview('');
      setNotice(status === 'ready' ? 'Tool ready to attach to a workflow.' : 'Draft saved.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function test() {
    if (!id) return setError('Save this tool first, then preview it.');
    setBusy(true);
    setError('');
    setIssues([]);
    try {
      const response = await apiFetch(`/api/tools/${id}/test`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) {
        setIssues(data.issues || []);
        throw Error(data.error || 'Preview failed.');
      }
      setPreview(data.detail);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (!item)
    return (
      <Shell active="/tools">
        <div
          className={
            'tl-page tl-error max-w-390 m-[0_auto] p-[8px_8px_55px] text-[#f7f4fc] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_8px] [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_textarea]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_a]:no-underline max-[680px]:p-[4px_0_30px] max-[680px]:[&_h1]:text-[25px] m-[11px_0] p-[11px_12px] rounded-lg bg-[#522e3c] border border-[#825066] text-[#ffc0d0] text-xs'
          }
        >
          Unknown tool type. <Link href="/tools">Open tools</Link>
        </div>
      </Shell>
    );
  return (
    <Shell active="/tools">
      <div
        className={
          'tl-page tl-editor max-w-390 m-[0_auto] p-[8px_8px_55px] text-[#f7f4fc] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_8px] [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_textarea]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_a]:no-underline max-[680px]:p-[4px_0_30px] max-[680px]:[&_h1]:text-[25px] max-w-305'
        }
      >
        <Link
          href="/tools"
          className={'tl-back inline-flex items-center gap-1.75 text-[#baa4e2] text-[13px] mb-5'}
        >
          <ArrowLeft size={16} /> All tools
        </Link>
        {loading ? (
          <div
            className={
              'tl-empty bg-[#20212a] border border-[#413c49] rounded-[13px] p-15 text-center text-[#bdb6c6] [&_strong]:block [&_strong]:m-[10px_auto] [&_strong]:text-[#d6c3fb] [&_svg]:block [&_svg]:m-[10px_auto] [&_svg]:text-[#d6c3fb]'
            }
          >
            Loading tool…
          </div>
        ) : (
          <>
            <div
              className={
                'tl-header flex items-center justify-between gap-5 mb-5.75 [&_p]:text-[13px] [&_p]:text-[#bab4c4] [&_p]:leading-normal max-[680px]:items-start max-[680px]:flex-col'
              }
            >
              <div>
                <span className={'tl-kicker text-[11px] font-bold tracking-[.11em] text-[#b390f7]'}>
                  TOOLS / {item.title.toUpperCase()}
                </span>
                <h1>
                  {id ? 'Configure' : 'New'} {item.title}
                </h1>
                <p>{item.description}</p>
              </div>
              <span
                className={`tl-status rounded-[50px] p-[6px_10px] bg-[#51405e] text-[#d7b9f5] text-[11px] not-italic capitalize [&.ready]:bg-[#205341] [&.ready]:text-[#9ae9c7]${record?.status || 'draft'}`}
              >
                {record?.status === 'ready' ? 'Ready' : 'Draft'}
              </span>
            </div>
            <div
              className={
                'tl-edit-grid grid grid-cols-[minmax(0,1.5fr)_minmax(280px,.9fr)] gap-4 items-start max-[680px]:grid-cols-1'
              }
            >
              <section
                className={
                  'tl-panel bg-[#20212a] border border-[#413c49] rounded-[13px] p-6.25 max-[680px]:p-4.25'
                }
              >
                <h2>Configuration</h2>
                <Field label="Tool name">
                  <input
                    maxLength={120}
                    value={form.name}
                    onChange={(e) => {
                      setDirty(true);
                      setForm((f) => ({ ...f, name: e.target.value }));
                    }}
                    placeholder="Name this tool"
                  />
                </Field>
                {activeType === 'api' && (
                  <>
                    <div
                      className={'tl-row grid grid-cols-[1fr_1fr] gap-3 max-[680px]:grid-cols-1'}
                    >
                      <Field label="Method">
                        <select
                          value={form.config.method || 'GET'}
                          onChange={(e) => change('method', e.target.value)}
                        >
                          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Timeout (seconds)">
                        <input
                          type="number"
                          min="1"
                          max="60"
                          value={form.config.timeout || 15}
                          onChange={(e) => change('timeout', Number(e.target.value))}
                        />
                      </Field>
                    </div>
                    <Field label="HTTPS endpoint">
                      <input
                        type="url"
                        value={form.config.url || ''}
                        onChange={(e) => change('url', e.target.value)}
                        placeholder="https://api.example.com/customer"
                      />
                    </Field>
                    <Field label="Sample JSON body">
                      <textarea
                        rows={5}
                        maxLength={2000}
                        value={form.config.requestBody || ''}
                        onChange={(e) => change('requestBody', e.target.value)}
                        placeholder='{"customerId":"{{caller.id}}"}'
                      />
                    </Field>
                    <p className={'tl-hint text-xs text-[#b7adc2] leading-normal'}>
                      No credentials are stored here. A future provider runtime must add secure
                      secrets and request controls.
                    </p>
                  </>
                )}
                {activeType === 'transfer' && (
                  <>
                    <Field label="Transfer to voice agent">
                      <select
                        value={form.config.targetAgentId || ''}
                        onChange={(e) => change('targetAgentId', e.target.value)}
                      >
                        <option value="">Select a ready agent</option>
                        {agents
                          .filter((a) => a.status === 'ready')
                          .map((a) => (
                            <option key={a._id} value={a._id}>
                              {a.name}
                            </option>
                          ))}
                      </select>
                    </Field>
                    <Field label="Summary to pass along">
                      <textarea
                        rows={5}
                        value={form.config.summaryTemplate || ''}
                        onChange={(e) => change('summaryTemplate', e.target.value)}
                      />
                    </Field>
                  </>
                )}
                {activeType === 'hangup' && (
                  <Field label="Closing message">
                    <textarea
                      rows={5}
                      value={form.config.closingMessage || ''}
                      onChange={(e) => change('closingMessage', e.target.value)}
                    />
                  </Field>
                )}
                {activeType === 'webhook' && (
                  <>
                    <Field label="Incoming event name">
                      <input
                        value={form.config.eventName || ''}
                        onChange={(e) => change('eventName', e.target.value)}
                        placeholder="customer.created"
                      />
                    </Field>
                    <Field label="Example JSON payload">
                      <textarea
                        rows={7}
                        maxLength={2000}
                        value={form.config.payloadExample || ''}
                        onChange={(e) => change('payloadExample', e.target.value)}
                      />
                    </Field>
                    <p className={'tl-hint text-xs text-[#b7adc2] leading-normal'}>
                      This demo previews the event mapping. It does not open a public webhook
                      endpoint.
                    </p>
                  </>
                )}
                {activeType === 'handoff' && (
                  <>
                    <Field label="Human team / department">
                      <input
                        value={form.config.department || ''}
                        onChange={(e) => change('department', e.target.value)}
                      />
                    </Field>
                    <Field label="Reason shown to the human agent">
                      <textarea
                        rows={4}
                        value={form.config.reason || ''}
                        onChange={(e) => change('reason', e.target.value)}
                      />
                    </Field>
                    <Field label="If nobody is available">
                      <select
                        value={form.config.fallback || 'callback'}
                        onChange={(e) => change('fallback', e.target.value)}
                      >
                        <option value="callback">Offer callback</option>
                        <option value="end">End politely</option>
                      </select>
                    </Field>
                    <Link
                      className={
                        'tl-text-link inline-flex items-center gap-1.5 text-[#c8aaff] text-xs'
                      }
                      href="/ai-handoff"
                    >
                      Open AI Handoff queue <ArrowRight size={15} />
                    </Link>
                  </>
                )}
                {activeType === 'datetime' && (
                  <>
                    <Field label="Time zone">
                      <select
                        value={form.config.timezone || 'Asia/Kolkata'}
                        onChange={(e) => change('timezone', e.target.value)}
                      >
                        {['Asia/Kolkata', 'UTC', 'America/New_York', 'Europe/London'].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Say">
                      <select
                        value={form.config.format || 'date-and-time'}
                        onChange={(e) => change('format', e.target.value)}
                      >
                        <option value="date-and-time">Date and time</option>
                        <option value="date">Date only</option>
                        <option value="time">Time only</option>
                      </select>
                    </Field>
                  </>
                )}
                {error && (
                  <div
                    className={
                      'tl-error m-[11px_0] p-[11px_12px] rounded-lg bg-[#522e3c] border border-[#825066] text-[#ffc0d0] text-xs'
                    }
                    role="alert"
                  >
                    {error}
                  </div>
                )}
                {issues.map((issue, i) => (
                  <div
                    className={
                      'tl-error m-[11px_0] p-[11px_12px] rounded-lg bg-[#522e3c] border border-[#825066] text-[#ffc0d0] text-xs'
                    }
                    key={i}
                  >
                    {issue}
                  </div>
                ))}
                {notice && (
                  <div
                    className={
                      'tl-success m-[11px_0] p-[11px_12px] rounded-lg bg-[#522e3c] border border-[#825066] text-[#ffc0d0] text-xs bg-[#214b3d] border-[#427966] text-[#a9eed0] flex gap-1.75 items-center'
                    }
                    role="status"
                  >
                    <Check size={16} />
                    {notice}
                  </div>
                )}
                <div className={'tl-actions flex gap-2.5 justify-end flex-wrap mt-6.25'}>
                  <button
                    className={
                      'tl-secondary inline-flex items-center justify-center gap-2 rounded-[9px] font-bold text-[13px] p-[10px_15px] border border-[#9d76f2] text-white! bg-[#8057e8] whitespace-nowrap text-[#eee7f7]! bg-[#2c2935] border-[#554a61] [&:hover]:bg-[#393244]'
                    }
                    disabled={busy || !form.name.trim()}
                    onClick={() => persist('draft')}
                  >
                    <Save size={16} /> {busy ? 'Working…' : 'Save draft'}
                  </button>
                  <button
                    className={
                      'tl-primary inline-flex items-center justify-center gap-2 rounded-[9px] font-bold text-[13px] p-[10px_15px] border border-[#9d76f2] text-white! bg-[#8057e8] whitespace-nowrap [&:hover]:bg-[#916cf3]'
                    }
                    disabled={busy || !form.name.trim() || !id}
                    onClick={() => persist('ready')}
                  >
                    <ShieldCheck size={16} /> Mark ready
                  </button>
                </div>
                {!id && (
                  <p className={'tl-hint text-xs text-[#b7adc2] leading-normal'}>
                    Create a draft first; then fill in and mark it ready.
                  </p>
                )}
              </section>
              <aside
                className={
                  'tl-panel tl-side bg-[#20212a] border border-[#413c49] rounded-[13px] p-6.25 max-[680px]:p-4.25 [&>p]:text-[13px] [&>p]:text-[#bab4c4] [&>p]:leading-normal [&>h2]:mt-3.75'
                }
              >
                <span
                  className={`tl-icon w-10.75 h-10.75 flex-none rounded-[11px] grid place-items-center bg-[#413052] text-[#bf9bff] [&.blue]:bg-[#263968] [&.blue]:text-[#93b8ff] [&.green]:bg-[#1e5242] [&.green]:text-[#88e8b4] [&.rose]:bg-[#543344] [&.rose]:text-[#ff99ae] [&.teal]:bg-[#245551] [&.teal]:text-[#87dfd6] [&.orange]:bg-[#5c4230] [&.orange]:text-[#ffc386] [&.purple]:bg-[#4a3466] [&.purple]:text-[#d4a4ff]${item.accent}`}
                >
                  <item.icon size={25} />
                </span>
                <h2>Test this setup</h2>
                <p>
                  Preview the configured behavior without contacting outside services or placing a
                  call.
                </p>
                <button
                  className={
                    'tl-secondary inline-flex items-center justify-center gap-2 rounded-[9px] font-bold text-[13px] p-[10px_15px] border border-[#9d76f2] text-white! bg-[#8057e8] whitespace-nowrap text-[#eee7f7]! bg-[#2c2935] border-[#554a61] [&:hover]:bg-[#393244]'
                  }
                  onClick={test}
                  disabled={busy || !id || dirty}
                >
                  <FlaskConical size={17} /> Preview configuration
                </button>
                {dirty && id && (
                  <p className={'tl-hint text-xs text-[#b7adc2] leading-normal'}>
                    Save changes before previewing.
                  </p>
                )}
                {preview && (
                  <div
                    className={
                      'tl-preview mt-4.5 border border-[#695494] bg-[#332a45] rounded-lg p-3.25 text-xs leading-[1.6] wrap-break-word'
                    }
                    role="status"
                  >
                    {preview}
                  </div>
                )}
                <div
                  className={
                    'tl-tip mt-8.75 border-t border-t-[#4b4354] pt-5 [&_p]:text-[#bcb6c5] [&_p]:text-xs [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.5 [&_a]:text-[#c8aaff] [&_a]:text-xs'
                  }
                >
                  <strong>Connect to a workflow</strong>
                  <p>Ready tools are selectable inside a Conversation node.</p>
                  <Link href="/workflows">
                    Go to workflows <ArrowRight size={15} />
                  </Link>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
