'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  GitBranch,
  MessageSquare,
  MousePointer2,
  Play,
  Plus,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  Workflow,
  X,
} from 'lucide-react';
import Shell from './Shell';
import { apiFetch } from './api-client';

const names = {
  start: 'Start',
  conversation: 'Conversation',
  condition: 'Condition',
  wait: 'Wait',
  end: 'End call',
};
const icons = {
  start: Play,
  conversation: MessageSquare,
  condition: GitBranch,
  wait: Clock3,
  end: Send,
};
const randomId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
export default function WorkflowDetail({ id, view, nodeId = '' }) {
  const router = useRouter(),
    [record, setRecord] = useState(null),
    [draft, setDraft] = useState(null),
    [agents, setAgents] = useState([]),
    [tools, setTools] = useState([]),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [dirty, setDirty] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState(''),
    [issues, setIssues] = useState(null),
    [result, setResult] = useState(null),
    [input, setInput] = useState({ intent: 'support', language: 'English', callerType: 'new' }),
    [connection, setConnection] = useState({ source: '', target: '', label: 'next' });
  const drag = useRef(null);
  useEffect(() => {
    let active = true;
    Promise.all([
      apiFetch(`/api/workflows/${id}`),
      apiFetch('/api/voice-agents'),
      apiFetch('/api/tools'),
    ])
      .then(async ([w, a, t]) => {
        const workflow = await w.json(),
          agentList = await a.json(),
          toolList = await t.json();
        if (!w.ok) throw Error(workflow.error || 'Could not load workflow.');
        if (!a.ok) throw Error(agentList.error || 'Could not load voice agents.');
        if (!t.ok) throw Error(toolList.error || 'Could not load tools.');
        if (active) {
          setRecord(workflow);
          setDraft(workflow.data.draft);
          setAgents(agentList);
          setTools(toolList);
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
  const selected =
    draft?.nodes.find((n) => n.id === nodeId) ||
    (view === 'condition'
      ? draft?.nodes.find((n) => n.type === 'condition')
      : draft?.nodes.find((n) => n.type === 'conversation'));
  const path = (v) => (v === 'canvas' ? `/workflows/${id}` : `/workflows/${id}/${v}`);
  const update = (fn) => {
    setDraft((old) => fn(old));
    setDirty(true);
    setIssues(null);
    setNotice('');
  };
  const updateNode = (node, change) =>
    update((old) => ({
      ...old,
      nodes: old.nodes.map((n) =>
        n.id === node.id
          ? {
              ...n,
              ...change,
              config: change.config ? { ...n.config, ...change.config } : n.config,
            }
          : n,
      ),
    }));
  async function save(nextDraft = draft) {
    if (!nextDraft || !record) return null;
    setBusy(true);
    setError('');
    try {
      const response = await apiFetch(`/api/workflows/${id}/draft`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revision: record.data.revision, draft: nextDraft }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'Could not save.');
      setRecord(data);
      setDraft(data.data.draft);
      setDirty(false);
      setNotice('Draft saved.');
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setBusy(false);
    }
  }
  async function action(kind) {
    setBusy(true);
    setError('');
    setNotice('');
    let current = record;
    if (dirty) {
      current = await save();
      if (!current) {
        setBusy(false);
        return;
      }
    }
    try {
      const endpoint = kind === 'validate' ? 'validate' : kind === 'test' ? 'simulate' : 'publish';
      const response = await apiFetch(
        `/api/workflows/${id}/${endpoint}`,
        kind === 'validate'
          ? {}
          : {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(kind === 'test' ? input : { revision: current.data.revision }),
            },
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.issues) setIssues(data.issues);
        throw Error(data.error || 'Could not complete action.');
      }
      if (kind === 'validate') {
        setIssues(data.issues);
        setNotice(data.valid ? 'Ready to test and publish.' : 'Fix the items below.');
      }
      if (kind === 'test') {
        setResult(data);
        setNotice('Preview completed. No call was placed.');
      }
      if (kind === 'publish') {
        setRecord(data);
        setNotice(`Version ${data.data.versions.length} published.`);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function addNode(type) {
    const node = {
      id: randomId(),
      type,
      x: 100 + (draft.nodes.length % 4) * 250,
      y: 140 + Math.floor(draft.nodes.length / 4) * 190,
      config:
        type === 'conversation'
          ? { agentId: '', prompt: 'How can I help you?', toolIds: [] }
          : type === 'condition'
            ? { field: 'intent', operator: 'equals', value: '' }
            : type === 'wait'
              ? { seconds: 15 }
              : type === 'end'
                ? { message: 'Thank you for calling.' }
                : {},
    };
    const next = { ...draft, nodes: [...draft.nodes, node] };
    const saved = await save(next);
    if (saved)
      router.push(
        type === 'condition'
          ? `${path('condition')}?node=${node.id}`
          : `${path('node')}?node=${node.id}`,
      );
  }
  async function removeNode(node) {
    if (node.type === 'start') return;
    const next = {
      ...draft,
      nodes: draft.nodes.filter((n) => n.id !== node.id),
      edges: draft.edges.filter((e) => e.source !== node.id && e.target !== node.id),
    };
    const saved = await save(next);
    if (saved) router.push(path('canvas'));
  }
  function addEdge() {
    if (!connection.source || !connection.target || connection.source === connection.target)
      return setError('Choose two different nodes.');
    const source = draft.nodes.find((n) => n.id === connection.source),
      label = source?.type === 'condition' ? connection.label : 'next';
    if (draft.edges.some((e) => e.source === connection.source && e.label === label))
      return setError(`That node already has a ${label} connection. Remove it first.`);
    update((old) => ({
      ...old,
      edges: [
        ...old.edges,
        { id: randomId(), source: connection.source, target: connection.target, label },
      ],
    }));
    setError('');
  }
  function startDrag(event, node) {
    if (event.button !== 0 || event.target.closest('button,a,input,select')) return;
    event.preventDefault();
    drag.current = {
      id: node.id,
      startX: event.clientX,
      startY: event.clientY,
      x: node.x,
      y: node.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event) {
    if (!drag.current) return;
    const d = drag.current;
    update((old) => ({
      ...old,
      nodes: old.nodes.map((n) =>
        n.id === d.id
          ? {
              ...n,
              x: Math.max(0, Math.min(1800, d.x + event.clientX - d.startX)),
              y: Math.max(0, Math.min(1100, d.y + event.clientY - d.startY)),
            }
          : n,
      ),
    }));
  }
  const readyAgents = useMemo(() => agents.filter((a) => a.status === 'ready'), [agents]);
  async function navigate(event, href) {
    if (!dirty) return;
    event.preventDefault();
    const saved = await save();
    if (saved) router.push(href);
  }
  if (loading)
    return (
      <Shell active="/workflows">
        <div
          className={
            'wf-page wf-empty max-w-400 m-[0_auto] text-[#f7f4fe] p-[8px_8px_55px] [&_*]:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_p]:leading-normal [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_textarea]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] [&_a]:no-underline max-[580px]:p-[4px_0_35px] max-[580px]:[&_h1]:text-[25px] border border-[#3d3948] bg-[#1f2029] rounded-[14px] text-center p-[65px_20px] text-[#bbb4c7] [&_strong]:block [&_strong]:text-white [&_strong]:m-[12px_0_0] [&_.wf-primary]:mt-3'
          }
        >
          Loading workflow…
        </div>
      </Shell>
    );
  if (!draft)
    return (
      <Shell active="/workflows">
        <div
          className={
            'wf-page max-w-400 m-[0_auto] text-[#f7f4fe] p-[8px_8px_55px] [&_*]:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_p]:leading-normal [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_textarea]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] [&_a]:no-underline max-[580px]:p-[4px_0_35px] max-[580px]:[&_h1]:text-[25px]'
          }
        >
          <Link
            href="/workflows"
            className={'wf-back inline-flex items-center gap-1.75 text-[#baa6e6] text-[13px] mb-4'}
          >
            ← Workflows
          </Link>
          <p
            className={
              'wf-error flex gap-2.25 items-center p-[11px_13px] rounded-[9px] m-[12px_0] bg-[#512b3c] border border-[#89516b] text-[#ffb7c8] text-[13px]'
            }
          >
            {error || 'Workflow not found.'}
          </p>
        </div>
      </Shell>
    );
  const tabs = [
    ['canvas', 'Canvas'],
    ['node', 'Node settings'],
    ['condition', 'Conditions'],
    ['validate', 'Validate'],
    ['test', 'Test run'],
    ['versions', 'Versions'],
  ];
  return (
    <Shell active="/workflows">
      <div
        className={
          'wf-page max-w-400 m-[0_auto] text-[#f7f4fe] p-[8px_8px_55px] [&_*]:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_p]:leading-normal [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_textarea]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] [&_a]:no-underline max-[580px]:p-[4px_0_35px] max-[580px]:[&_h1]:text-[25px]'
        }
      >
        <div
          className={
            'wf-top flex justify-between items-center gap-5 mb-3.5 max-[900px]:items-start max-[900px]:flex-col'
          }
        >
          <div>
            <Link
              href="/workflows"
              onClick={(e) => navigate(e, '/workflows')}
              className={
                'wf-back inline-flex items-center gap-1.75 text-[#baa6e6] text-[13px] mb-4'
              }
            >
              <ArrowLeft size={16} /> Workflows
            </Link>
            <p
              className={
                'wf-eyebrow text-[11px] font-bold tracking-[.11em] text-[#a88ff5] m-0 uppercase'
              }
            >
              {draft.trigger.toUpperCase()} WORKFLOW · {record.status.toUpperCase()}
              {dirty ? ' · UNSAVED CHANGES' : ''}
            </p>
            <h1>{draft.name}</h1>
          </div>
          <div
            className={
              'wf-top-actions flex gap-2.5 max-[900px]:w-full max-[580px]:[&>a]:flex-1 max-[580px]:[&>a]:text-[11px] max-[580px]:[&>button]:flex-1 max-[580px]:[&>button]:text-[11px]'
            }
          >
            <button
              className={
                'wf-secondary inline-flex justify-center items-center gap-2 rounded-[9px] p-[11px_15px] text-[13px] font-bold whitespace-nowrap text-[#eee8fa]! bg-[#292734] border border-[#514a60] [&:hover]:bg-[#373249]'
              }
              onClick={() => save()}
              disabled={busy || !dirty}
            >
              <Save size={16} />
              {busy ? 'Working…' : 'Save draft'}
            </button>
            <Link
              className={
                'wf-primary inline-flex justify-center items-center gap-2 rounded-[9px] p-[11px_15px] text-[13px] font-bold whitespace-nowrap text-white! bg-[#8057e8] border border-[#9773ef] [&:hover]:bg-[#906bf0]'
              }
              href={path('versions')}
              onClick={(e) => navigate(e, path('versions'))}
            >
              Review & publish <ChevronRight size={16} />
            </Link>
          </div>
        </div>
        <div
          className={
            'wf-tabs flex gap-1.25 overflow-auto border-b border-b-[#40394a] mb-4.5 [&_a]:text-[#bab1c8] [&_a]:whitespace-nowrap [&_a]:p-[12px_16px] [&_a]:border-b-[2px_solid_transparent] [&_a]:text-[13px] [&_a.active]:text-[#f2e9ff] [&_a.active]:border-[#9c74f1]'
          }
        >
          {tabs.map(([key, label]) => (
            <Link
              key={key}
              className={view === key ? 'active' : ''}
              href={path(key)}
              onClick={(e) => navigate(e, path(key))}
            >
              {label}
            </Link>
          ))}
        </div>
        {error && (
          <div
            role="alert"
            className={
              'wf-error flex gap-2.25 items-center p-[11px_13px] rounded-[9px] m-[12px_0] bg-[#512b3c] border border-[#89516b] text-[#ffb7c8] text-[13px]'
            }
          >
            <CircleAlert size={17} />
            {error}
          </div>
        )}
        {notice && (
          <div
            role="status"
            className={
              'wf-notice flex gap-2.25 items-center p-[11px_13px] rounded-[9px] m-[12px_0] bg-[#512b3c] border border-[#89516b] text-[#ffb7c8] text-[13px] bg-[#17473d] border-[#36816b] text-[#a3f0d2]'
            }
          >
            <Check size={17} />
            {notice}
          </div>
        )}
        {view === 'canvas' && (
          <>
            <div
              className={
                'wf-canvas-toolbar flex justify-between items-center gap-5 [&_span]:text-[#bcb6cb] mb-3.25 [&_strong]:block [&_span]:block [&_span]:text-xs [&_span]:mt-0.75 max-[900px]:items-start max-[900px]:flex-col'
              }
            >
              <div>
                <strong>Flow canvas</strong>
                <span>Drag nodes to arrange them. Connect each step below.</span>
              </div>
              <div
                className={
                  'wf-add flex gap-1.5 flex-wrap [&_button]:inline-flex [&_button]:items-center [&_button]:gap-1.25 [&_button]:border [&_button]:border-[#514a61] [&_button]:rounded-lg [&_button]:text-[#e5dcf4] [&_button]:bg-[#2d2938] [&_button]:p-[8px_10px] [&_button]:text-xs'
                }
              >
                {[
                  ['conversation', 'Conversation'],
                  ['condition', 'Condition'],
                  ['wait', 'Wait'],
                  ['end', 'End call'],
                ].map(([type, label]) => (
                  <button key={type} onClick={() => addNode(type)}>
                    <Plus size={15} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div
              className={
                'wf-canvas-scroll h-[min(67vh,_680px)] min-h-110 overflow-auto border border-[#494052] rounded-[14px] bg-[#14151b] [scrollbar-color:#655478_#1b1921] max-[900px]:h-130'
              }
            >
              <div
                className={
                  'wf-canvas relative w-500 h-300 bg-[radial-gradient(#514856_1px,_transparent_1px)] bg-[length:22px_22px]'
                }
              >
                <svg
                  aria-hidden="true"
                  className={'wf-connections absolute inset-0 pointer-events-none'}
                  width="2000"
                  height="1200"
                >
                  {draft.edges.map((edge) => {
                    const from = draft.nodes.find((n) => n.id === edge.source),
                      to = draft.nodes.find((n) => n.id === edge.target);
                    if (!from || !to) return null;
                    const x1 = from.x + 232,
                      y1 = from.y + 62,
                      x2 = to.x,
                      y2 = to.y + 62;
                    return (
                      <g key={edge.id}>
                        <path
                          d={`M${x1} ${y1} C${x1 + 85} ${y1},${x2 - 85} ${y2},${x2} ${y2}`}
                          stroke={
                            edge.label === 'match'
                              ? '#30c8a3'
                              : edge.label === 'no-match'
                                ? '#f582a3'
                                : '#9679e7'
                          }
                          strokeWidth="3"
                          fill="none"
                        />
                        <circle cx={x2} cy={y2} r="5" fill="#9679e7" />
                        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 10} fill="#bfb4d7" fontSize="13">
                          {edge.label === 'next' ? '' : edge.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                {draft.nodes.map((node) => {
                  const Icon = icons[node.type] || Workflow;
                  return (
                    <article
                      key={node.id}
                      className={`wf-node absolute w-58 min-h-31 rounded-[13px] border border-[#7551e4] bg-[#342475] shadow-[0_15px_24px_#0005] text-white p-3.25 touch-none select-none cursor-grab [&:active]:cursor-grabbing [&.start]:bg-[#215c4b] [&.start]:border-[#368971] [&.condition]:bg-[#533469] [&.condition]:border-[#a963cf] [&.wait]:bg-[#63492b] [&.wait]:border-[#be8d4d] [&.end]:bg-[#653348] [&.end]:border-[#be6584] [&_p]:min-h-8 [&_p]:text-[#f1eaf9] [&_p]:leading-[1.35] [&_p]:text-xs [&_p]:m-[10px_0] [&_p]:overflow-hidden [&_p]:[display:-webkit-box] [&_p]:[-webkit-line-clamp:2] [&_p]:[-webkit-box-orient:vertical] [&_a]:inline-flex [&_a]:items-center [&_a]:gap-0.75 [&_a]:text-white [&_a]:text-xs [&_a]:font-[650]${node.type}`}
                      style={{ left: node.x, top: node.y }}
                      onPointerDown={(e) => startDrag(e, node)}
                      onPointerMove={moveDrag}
                      onPointerUp={() => {
                        drag.current = null;
                      }}
                    >
                      <div
                        className={
                          'wf-node-head flex items-center gap-2.25 [&>span]:grid [&>span]:place-items-center [&>span]:w-7.5 [&>span]:h-7.5 [&>span]:rounded-[9px] [&>span]:bg-[#ffffff25] [&_strong]:flex-1 [&_strong]:text-[13px]'
                        }
                      >
                        <span>
                          <Icon size={18} />
                        </span>
                        <strong>{names[node.type]}</strong>
                        <MousePointer2 size={14} />
                      </div>
                      <p>
                        {node.type === 'conversation'
                          ? node.config.prompt || 'Add a greeting'
                          : node.type === 'condition'
                            ? `${node.config.field} equals ${node.config.value || '…'}`
                            : node.type === 'wait'
                              ? `Pause ${node.config.seconds}s`
                              : node.type === 'end'
                                ? node.config.message
                                : 'The call enters this workflow'}
                      </p>
                      <Link
                        onClick={(e) =>
                          navigate(
                            e,
                            node.type === 'condition'
                              ? `${path('condition')}?node=${node.id}`
                              : `${path('node')}?node=${node.id}`,
                          )
                        }
                        href={
                          node.type === 'condition'
                            ? `${path('condition')}?node=${node.id}`
                            : `${path('node')}?node=${node.id}`
                        }
                      >
                        Configure <ChevronRight size={14} />
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
            <div
              className={
                'wf-panel wf-connections-panel [&>p]:text-[#bcb6cb] border border-[#3d3948] bg-[#1f2029] rounded-[14px] p-5.5 min-w-0 max-[580px]:p-4.25 mt-3.75 [&>div>p]:text-xs'
              }
            >
              <div>
                <h2>Connections</h2>
                <p>
                  Choose the source, branch and destination. Every branch needs a path to End call.
                </p>
              </div>
              <div
                className={
                  'wf-connect-form [&_select]:w-full [&_select]:border [&_select]:border-[#504a5a] [&_select]:bg-[#282732] [&_select]:rounded-[9px] [&_select]:text-white [&_select]:p-3 [&_select]:outline-0 [&_select]:min-w-0 [&_select:focus]:border-[#aa83fd] grid grid-cols-[1fr_140px_1fr_auto] gap-2.5 items-end [&_label]:flex [&_label]:flex-col [&_label]:gap-1.75 [&_label]:text-xs [&_label]:text-[#bbb3c4] [&_select]:p-2.5 max-[900px]:grid-cols-[1fr_1fr] max-[580px]:grid-cols-1'
                }
              >
                <label>
                  From
                  <select
                    value={connection.source}
                    onChange={(e) => setConnection((c) => ({ ...c, source: e.target.value }))}
                  >
                    <option value="">Choose node</option>
                    {draft.nodes
                      .filter((n) => n.type !== 'end')
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          {names[n.type]} · {n.id.slice(0, 5)}
                        </option>
                      ))}
                  </select>
                </label>
                <label>
                  Branch
                  <select
                    value={connection.label}
                    onChange={(e) => setConnection((c) => ({ ...c, label: e.target.value }))}
                  >
                    <option value="next">Next</option>
                    {draft.nodes.find((n) => n.id === connection.source)?.type === 'condition' && (
                      <>
                        <option value="match">Match</option>
                        <option value="no-match">No match</option>
                      </>
                    )}
                  </select>
                </label>
                <label>
                  To
                  <select
                    value={connection.target}
                    onChange={(e) => setConnection((c) => ({ ...c, target: e.target.value }))}
                  >
                    <option value="">Choose node</option>
                    {draft.nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {names[n.type]} · {n.id.slice(0, 5)}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className={
                    'wf-secondary inline-flex justify-center items-center gap-2 rounded-[9px] p-[11px_15px] text-[13px] font-bold whitespace-nowrap text-[#eee8fa]! bg-[#292734] border border-[#514a60] [&:hover]:bg-[#373249]'
                  }
                  onClick={addEdge}
                >
                  Connect
                </button>
              </div>
              <div
                className={
                  'wf-edge-list flex gap-2 flex-wrap mt-3.75 [&>div]:flex [&>div]:gap-2 [&>div]:items-center [&>div]:border [&>div]:border-[#484052] [&>div]:bg-[#282632] [&>div]:p-[6px_9px] [&>div]:rounded-lg [&>div]:text-[11px] [&_small]:text-[#b996f4] [&_button]:border-0 [&_button]:bg-none [&_button]:text-[#dbbbd2]'
                }
              >
                {draft.edges.map((e) => (
                  <div key={e.id}>
                    <span>
                      {names[draft.nodes.find((n) => n.id === e.source)?.type] || 'Missing'} →{' '}
                      {names[draft.nodes.find((n) => n.id === e.target)?.type] || 'Missing'}{' '}
                      <small>{e.label}</small>
                    </span>
                    <button
                      onClick={() =>
                        update((old) => ({ ...old, edges: old.edges.filter((x) => x.id !== e.id) }))
                      }
                      aria-label="Remove connection"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {(view === 'node' || view === 'condition') && (
          <div
            className={
              'wf-editor-grid grid grid-cols-[minmax(250px,_.8fr)_minmax(0,_1.45fr)] gap-4 items-start max-[900px]:grid-cols-1'
            }
          >
            <section
              className={
                'wf-panel [&>p]:text-[#bcb6cb] border border-[#3d3948] bg-[#1f2029] rounded-[14px] p-5.5 min-w-0 max-[580px]:p-4.25'
              }
            >
              <h2>{view === 'condition' ? 'Condition rules' : 'Node settings'}</h2>
              <p>Select a node and configure what it does during a call.</p>
              <div
                className={
                  'wf-node-picker flex flex-col gap-1.75 mt-4.5 [&_a]:flex [&_a]:justify-between [&_a]:bg-[#2a2833] [&_a]:text-[#e7e1f1] [&_a]:border [&_a]:border-[#433c4b] [&_a]:rounded-lg [&_a]:p-3 [&_a.active]:bg-[#382b52] [&_a.active]:border-[#9e77ee] [&_small]:text-[#aa9cb9]'
                }
              >
                {draft.nodes
                  .filter((n) =>
                    view === 'condition' ? n.type === 'condition' : n.type !== 'condition',
                  )
                  .map((n) => (
                    <Link
                      key={n.id}
                      className={selected?.id === n.id ? 'active' : ''}
                      href={`${path(view)}?node=${n.id}`}
                      onClick={(e) => navigate(e, `${path(view)}?node=${n.id}`)}
                    >
                      {names[n.type]} <small>{n.id.slice(0, 5)}</small>
                    </Link>
                  ))}
              </div>
              {view === 'condition' && !draft.nodes.some((n) => n.type === 'condition') && (
                <button
                  className={
                    'wf-secondary inline-flex justify-center items-center gap-2 rounded-[9px] p-[11px_15px] text-[13px] font-bold whitespace-nowrap text-[#eee8fa]! bg-[#292734] border border-[#514a60] [&:hover]:bg-[#373249]'
                  }
                  onClick={() => addNode('condition')}
                >
                  <Plus size={16} /> Add condition
                </button>
              )}
            </section>
            <section
              className={
                'wf-panel wf-config [&>p]:text-[#bcb6cb] border border-[#3d3948] bg-[#1f2029] rounded-[14px] p-5.5 min-w-0 max-[580px]:p-4.25 p-6.75'
              }
            >
              {selected ? (
                <>
                  <div className={'wf-config-title flex justify-between gap-3.75'}>
                    <div>
                      <p
                        className={
                          'wf-eyebrow text-[11px] font-bold tracking-[.11em] text-[#a88ff5] m-0 uppercase'
                        }
                      >
                        {selected.id.slice(0, 8)}
                      </p>
                      <h2>{names[selected.type]}</h2>
                    </div>
                    {selected.type !== 'start' && (
                      <button
                        aria-label="Remove node"
                        className={
                          'wf-danger flex items-center gap-1.5 self-start border border-[#985272] rounded-lg bg-[#512d40] text-[#ffc3d3] p-2.25'
                        }
                        onClick={() => removeNode(selected)}
                      >
                        <Trash2 size={18} /> Remove
                      </button>
                    )}
                  </div>
                  {selected.type === 'start' && (
                    <p>
                      The flow begins when a {draft.trigger} call is routed to it. Connect Start to
                      a Conversation node.
                    </p>
                  )}
                  {selected.type === 'conversation' && (
                    <>
                      <label
                        className={
                          'wf-field flex flex-col gap-2.25 text-[#e5e0ee] text-[13px] font-[650] m-[18px_0] [&_input]:w-full [&_input]:border [&_input]:border-[#504a5a] [&_input]:bg-[#282732] [&_input]:rounded-[9px] [&_input]:text-white [&_input]:p-3 [&_input]:outline-0 [&_input]:min-w-0 [&_select]:w-full [&_select]:border [&_select]:border-[#504a5a] [&_select]:bg-[#282732] [&_select]:rounded-[9px] [&_select]:text-white [&_select]:p-3 [&_select]:outline-0 [&_select]:min-w-0 [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[#504a5a] [&_textarea]:bg-[#282732] [&_textarea]:rounded-[9px] [&_textarea]:text-white [&_textarea]:p-3 [&_textarea]:outline-0 [&_textarea]:min-w-0 [&_input:focus]:border-[#aa83fd] [&_textarea:focus]:border-[#aa83fd] [&_select:focus]:border-[#aa83fd]'
                        }
                      >
                        Voice agent
                        <select
                          value={selected.config.agentId || ''}
                          onChange={(e) =>
                            updateNode(selected, { config: { agentId: e.target.value } })
                          }
                        >
                          <option value="">Choose a ready agent</option>
                          {readyAgents.map((agent) => (
                            <option key={agent._id} value={agent._id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label
                        className={
                          'wf-field flex flex-col gap-2.25 text-[#e5e0ee] text-[13px] font-[650] m-[18px_0] [&_input]:w-full [&_input]:border [&_input]:border-[#504a5a] [&_input]:bg-[#282732] [&_input]:rounded-[9px] [&_input]:text-white [&_input]:p-3 [&_input]:outline-0 [&_input]:min-w-0 [&_select]:w-full [&_select]:border [&_select]:border-[#504a5a] [&_select]:bg-[#282732] [&_select]:rounded-[9px] [&_select]:text-white [&_select]:p-3 [&_select]:outline-0 [&_select]:min-w-0 [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[#504a5a] [&_textarea]:bg-[#282732] [&_textarea]:rounded-[9px] [&_textarea]:text-white [&_textarea]:p-3 [&_textarea]:outline-0 [&_textarea]:min-w-0 [&_input:focus]:border-[#aa83fd] [&_textarea:focus]:border-[#aa83fd] [&_select:focus]:border-[#aa83fd]'
                        }
                      >
                        Opening prompt
                        <textarea
                          rows={5}
                          maxLength={800}
                          value={selected.config.prompt || ''}
                          onChange={(e) =>
                            updateNode(selected, { config: { prompt: e.target.value } })
                          }
                        />
                      </label>
                      <div
                        className={
                          'wf-tool-attach m-[20px_0] bg-[#282634] border border-[#514660] rounded-[9px] p-3.5 [&_strong]:text-[13px] [&_p]:text-xs [&_p]:text-[#b9b1c7] [&_p]:m-[4px_0_12px] [&_label]:flex [&_label]:items-center [&_label]:gap-2 [&_label]:text-xs [&_label]:p-[6px_0] [&_label_input]:accent-[#9162ea] [&_small]:text-[#b1a4c5] [&_a]:text-xs [&_a]:text-[#bf9aff]'
                        }
                      >
                        <strong>Available tools</strong>
                        <p>Attach ready tools to this conversation step.</p>
                        {tools
                          .filter((tool) => tool.status === 'ready')
                          .map((tool) => (
                            <label key={tool._id}>
                              <input
                                type="checkbox"
                                checked={(selected.config.toolIds || []).includes(tool._id)}
                                onChange={(e) =>
                                  updateNode(selected, {
                                    config: {
                                      toolIds: e.target.checked
                                        ? [...(selected.config.toolIds || []), tool._id]
                                        : (selected.config.toolIds || []).filter(
                                            (id) => id !== tool._id,
                                          ),
                                    },
                                  })
                                }
                              />
                              {tool.title} <small>{tool.data.type}</small>
                            </label>
                          ))}
                        {!tools.some((tool) => tool.status === 'ready') && (
                          <Link href="/tools">Set up a tool →</Link>
                        )}
                      </div>
                      <p className={'wf-hint text-xs text-[#ada6ba]!'}>
                        Voice output is simulated in Batch 1. The selected agent must be ready
                        before publish.
                      </p>
                    </>
                  )}
                  {selected.type === 'condition' && (
                    <>
                      <label
                        className={
                          'wf-field flex flex-col gap-2.25 text-[#e5e0ee] text-[13px] font-[650] m-[18px_0] [&_input]:w-full [&_input]:border [&_input]:border-[#504a5a] [&_input]:bg-[#282732] [&_input]:rounded-[9px] [&_input]:text-white [&_input]:p-3 [&_input]:outline-0 [&_input]:min-w-0 [&_select]:w-full [&_select]:border [&_select]:border-[#504a5a] [&_select]:bg-[#282732] [&_select]:rounded-[9px] [&_select]:text-white [&_select]:p-3 [&_select]:outline-0 [&_select]:min-w-0 [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[#504a5a] [&_textarea]:bg-[#282732] [&_textarea]:rounded-[9px] [&_textarea]:text-white [&_textarea]:p-3 [&_textarea]:outline-0 [&_textarea]:min-w-0 [&_input:focus]:border-[#aa83fd] [&_textarea:focus]:border-[#aa83fd] [&_select:focus]:border-[#aa83fd]'
                        }
                      >
                        Check field
                        <select
                          value={selected.config.field || 'intent'}
                          onChange={(e) =>
                            updateNode(selected, { config: { field: e.target.value } })
                          }
                        >
                          <option value="intent">Caller intent</option>
                          <option value="language">Language</option>
                          <option value="callerType">Caller type</option>
                        </select>
                      </label>
                      <label
                        className={
                          'wf-field flex flex-col gap-2.25 text-[#e5e0ee] text-[13px] font-[650] m-[18px_0] [&_input]:w-full [&_input]:border [&_input]:border-[#504a5a] [&_input]:bg-[#282732] [&_input]:rounded-[9px] [&_input]:text-white [&_input]:p-3 [&_input]:outline-0 [&_input]:min-w-0 [&_select]:w-full [&_select]:border [&_select]:border-[#504a5a] [&_select]:bg-[#282732] [&_select]:rounded-[9px] [&_select]:text-white [&_select]:p-3 [&_select]:outline-0 [&_select]:min-w-0 [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[#504a5a] [&_textarea]:bg-[#282732] [&_textarea]:rounded-[9px] [&_textarea]:text-white [&_textarea]:p-3 [&_textarea]:outline-0 [&_textarea]:min-w-0 [&_input:focus]:border-[#aa83fd] [&_textarea:focus]:border-[#aa83fd] [&_select:focus]:border-[#aa83fd]'
                        }
                      >
                        Equals
                        <input
                          maxLength={100}
                          value={selected.config.value || ''}
                          onChange={(e) =>
                            updateNode(selected, { config: { value: e.target.value } })
                          }
                          placeholder="For example, sales"
                        />
                      </label>
                      <p className={'wf-hint text-xs text-[#ada6ba]!'}>
                        Connect this node's Match and No match branches on the canvas. Test data
                        chooses the branch.
                      </p>
                    </>
                  )}
                  {selected.type === 'wait' && (
                    <label
                      className={
                        'wf-field flex flex-col gap-2.25 text-[#e5e0ee] text-[13px] font-[650] m-[18px_0] [&_input]:w-full [&_input]:border [&_input]:border-[#504a5a] [&_input]:bg-[#282732] [&_input]:rounded-[9px] [&_input]:text-white [&_input]:p-3 [&_input]:outline-0 [&_input]:min-w-0 [&_select]:w-full [&_select]:border [&_select]:border-[#504a5a] [&_select]:bg-[#282732] [&_select]:rounded-[9px] [&_select]:text-white [&_select]:p-3 [&_select]:outline-0 [&_select]:min-w-0 [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[#504a5a] [&_textarea]:bg-[#282732] [&_textarea]:rounded-[9px] [&_textarea]:text-white [&_textarea]:p-3 [&_textarea]:outline-0 [&_textarea]:min-w-0 [&_input:focus]:border-[#aa83fd] [&_textarea:focus]:border-[#aa83fd] [&_select:focus]:border-[#aa83fd]'
                      }
                    >
                      Wait (seconds)
                      <input
                        type="number"
                        min="1"
                        max="3600"
                        value={selected.config.seconds || 1}
                        onChange={(e) =>
                          updateNode(selected, { config: { seconds: Number(e.target.value) } })
                        }
                      />
                    </label>
                  )}
                  {selected.type === 'end' && (
                    <label
                      className={
                        'wf-field flex flex-col gap-2.25 text-[#e5e0ee] text-[13px] font-[650] m-[18px_0] [&_input]:w-full [&_input]:border [&_input]:border-[#504a5a] [&_input]:bg-[#282732] [&_input]:rounded-[9px] [&_input]:text-white [&_input]:p-3 [&_input]:outline-0 [&_input]:min-w-0 [&_select]:w-full [&_select]:border [&_select]:border-[#504a5a] [&_select]:bg-[#282732] [&_select]:rounded-[9px] [&_select]:text-white [&_select]:p-3 [&_select]:outline-0 [&_select]:min-w-0 [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[#504a5a] [&_textarea]:bg-[#282732] [&_textarea]:rounded-[9px] [&_textarea]:text-white [&_textarea]:p-3 [&_textarea]:outline-0 [&_textarea]:min-w-0 [&_input:focus]:border-[#aa83fd] [&_textarea:focus]:border-[#aa83fd] [&_select:focus]:border-[#aa83fd]'
                      }
                    >
                      Closing message
                      <textarea
                        rows={4}
                        maxLength={300}
                        value={selected.config.message || ''}
                        onChange={(e) =>
                          updateNode(selected, { config: { message: e.target.value } })
                        }
                      />
                    </label>
                  )}
                  <button
                    className={
                      'wf-primary inline-flex justify-center items-center gap-2 rounded-[9px] p-[11px_15px] text-[13px] font-bold whitespace-nowrap text-white! bg-[#8057e8] border border-[#9773ef] [&:hover]:bg-[#906bf0]'
                    }
                    onClick={() => save()}
                    disabled={busy || !dirty}
                  >
                    Save node settings
                  </button>
                </>
              ) : (
                <div
                  className={
                    'wf-empty border border-[#3d3948] bg-[#1f2029] rounded-[14px] text-center p-[65px_20px] text-[#bbb4c7] [&_strong]:block [&_strong]:text-white [&_strong]:m-[12px_0_0] [&_.wf-primary]:mt-3'
                  }
                >
                  Select or add a node to configure it.
                </div>
              )}
            </section>
          </div>
        )}
        {view === 'validate' && (
          <div
            className={
              'wf-panel wf-stage [&>p]:text-[#bcb6cb] border border-[#3d3948] bg-[#1f2029] rounded-[14px] p-5.5 min-w-0 max-[580px]:p-4.25 max-w-195 p-10 [&>svg]:text-[#aa85fa] [&_.wf-secondary]:m-[20px_0] max-[580px]:p-6'
            }
          >
            <ShieldCheck size={28} />
            <h2>Validate workflow</h2>
            <p>Check routes, branches and agent readiness before testing or publishing.</p>
            <button
              className={
                'wf-primary inline-flex justify-center items-center gap-2 rounded-[9px] p-[11px_15px] text-[13px] font-bold whitespace-nowrap text-white! bg-[#8057e8] border border-[#9773ef] [&:hover]:bg-[#906bf0]'
              }
              onClick={() => action('validate')}
              disabled={busy}
            >
              {busy ? 'Checking…' : 'Run validation'}
            </button>
            {issues && (
              <div
                className={
                  'wf-checks mt-5 [&>div]:flex [&>div]:gap-2.25 [&>div]:p-2.75 [&>div]:rounded-lg [&>div]:m-[6px_0] [&_.issue]:bg-[#512d3c] [&_.issue]:text-[#ffbacc] [&_.passed]:bg-[#245540] [&_.passed]:text-[#a3f2d0]'
                }
              >
                {issues.length ? (
                  issues.map((issue, i) => (
                    <div key={i} className={'issue'}>
                      <CircleAlert size={18} />
                      {issue}
                    </div>
                  ))
                ) : (
                  <div className={'passed'}>
                    <Check size={18} /> All checks passed.
                  </div>
                )}
              </div>
            )}
            <Link
              href={path('test')}
              onClick={(e) => navigate(e, path('test'))}
              className={
                'wf-secondary inline-flex justify-center items-center gap-2 rounded-[9px] p-[11px_15px] text-[13px] font-bold whitespace-nowrap text-[#eee8fa]! bg-[#292734] border border-[#514a60] [&:hover]:bg-[#373249]'
              }
            >
              Open test run <ChevronRight size={16} />
            </Link>
          </div>
        )}
        {view === 'test' && (
          <div
            className={
              'wf-editor-grid grid grid-cols-[minmax(250px,_.8fr)_minmax(0,_1.45fr)] gap-4 items-start max-[900px]:grid-cols-1'
            }
          >
            <section
              className={
                'wf-panel wf-config [&>p]:text-[#bcb6cb] border border-[#3d3948] bg-[#1f2029] rounded-[14px] p-5.5 min-w-0 max-[580px]:p-4.25 p-6.75'
              }
            >
              <p
                className={
                  'wf-eyebrow text-[11px] font-bold tracking-[.11em] text-[#a88ff5] m-0 uppercase'
                }
              >
                DETERMINISTIC DEMO
              </p>
              <h2>Test a call path</h2>
              <p>
                Enter sample caller data. Wait steps are skipped; voice and external tools are not
                executed.
              </p>
              {[
                ['intent', 'Caller intent'],
                ['language', 'Language'],
                ['callerType', 'Caller type'],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className={
                    'wf-field flex flex-col gap-2.25 text-[#e5e0ee] text-[13px] font-[650] m-[18px_0] [&_input]:w-full [&_input]:border [&_input]:border-[#504a5a] [&_input]:bg-[#282732] [&_input]:rounded-[9px] [&_input]:text-white [&_input]:p-3 [&_input]:outline-0 [&_input]:min-w-0 [&_select]:w-full [&_select]:border [&_select]:border-[#504a5a] [&_select]:bg-[#282732] [&_select]:rounded-[9px] [&_select]:text-white [&_select]:p-3 [&_select]:outline-0 [&_select]:min-w-0 [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[#504a5a] [&_textarea]:bg-[#282732] [&_textarea]:rounded-[9px] [&_textarea]:text-white [&_textarea]:p-3 [&_textarea]:outline-0 [&_textarea]:min-w-0 [&_input:focus]:border-[#aa83fd] [&_textarea:focus]:border-[#aa83fd] [&_select:focus]:border-[#aa83fd]'
                  }
                >
                  {label}
                  <input
                    value={input[key]}
                    onChange={(e) => setInput((old) => ({ ...old, [key]: e.target.value }))}
                  />
                </label>
              ))}
              <button
                className={
                  'wf-primary inline-flex justify-center items-center gap-2 rounded-[9px] p-[11px_15px] text-[13px] font-bold whitespace-nowrap text-white! bg-[#8057e8] border border-[#9773ef] [&:hover]:bg-[#906bf0]'
                }
                onClick={() => action('test')}
                disabled={busy}
              >
                <Play size={17} /> {busy ? 'Running…' : 'Run test'}
              </button>
            </section>
            <section
              className={
                'wf-panel wf-config [&>p]:text-[#bcb6cb] border border-[#3d3948] bg-[#1f2029] rounded-[14px] p-5.5 min-w-0 max-[580px]:p-4.25 p-6.75'
              }
            >
              <h2>Path taken</h2>
              {result ? (
                <ol
                  className={
                    'wf-steps p-0 list-none [&_li]:flex [&_li]:gap-3.25 [&_li]:items-start [&_li]:m-[17px_0] [&_li>span]:bg-[#7651cb] [&_li>span]:text-white [&_li>span]:rounded-full [&_li>span]:w-7.25 [&_li>span]:h-7.25 [&_li>span]:grid [&_li>span]:place-items-center [&_li>span]:flex-none [&_p]:m-[3px_0] [&_p]:text-[#bfb8ca]'
                  }
                >
                  {result.steps.map((step, i) => (
                    <li key={`${step.nodeId}-${i}`}>
                      <span>{i + 1}</span>
                      <div>
                        <strong>{names[step.type]}</strong>
                        <p>{step.title}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className={'wf-muted text-[#bcb6cb]'}>
                  Run a test to see the selected branch and call steps.
                </p>
              )}
            </section>
          </div>
        )}
        {view === 'versions' && (
          <div
            className={
              'wf-editor-grid grid grid-cols-[minmax(250px,_.8fr)_minmax(0,_1.45fr)] gap-4 items-start max-[900px]:grid-cols-1'
            }
          >
            <section
              className={
                'wf-panel wf-config [&>p]:text-[#bcb6cb] border border-[#3d3948] bg-[#1f2029] rounded-[14px] p-5.5 min-w-0 max-[580px]:p-4.25 p-6.75'
              }
            >
              <p
                className={
                  'wf-eyebrow text-[11px] font-bold tracking-[.11em] text-[#a88ff5] m-0 uppercase'
                }
              >
                REVIEW / PUBLISH
              </p>
              <h2>Publish a version</h2>
              <p>
                Publish freezes the current draft as a new version. Future edits stay in the draft
                until you publish again.
              </p>
              <div
                className={
                  'wf-version-summary grid grid-cols-[repeat(3,_1fr)] gap-2 m-[23px_0] [&>div]:border [&>div]:border-[#51485d] [&>div]:rounded-[9px] [&>div]:p-3.5 [&_span]:block [&_strong]:block [&_span]:text-[#bbb4c6] [&_span]:text-[11px] [&_strong]:text-[15px] [&_strong]:mt-1.25 max-[580px]:grid-cols-[1fr_1fr]'
                }
              >
                <div>
                  <span>Current</span>
                  <strong>
                    {record.status === 'published'
                      ? `Published v${record.data.versions.length}`
                      : 'Draft only'}
                  </strong>
                </div>
                <div>
                  <span>Nodes</span>
                  <strong>{draft.nodes.length}</strong>
                </div>
                <div>
                  <span>Connections</span>
                  <strong>{draft.edges.length}</strong>
                </div>
              </div>
              <button
                className={
                  'wf-primary inline-flex justify-center items-center gap-2 rounded-[9px] p-[11px_15px] text-[13px] font-bold whitespace-nowrap text-white! bg-[#8057e8] border border-[#9773ef] [&:hover]:bg-[#906bf0]'
                }
                onClick={() => action('publish')}
                disabled={busy}
              >
                <Send size={17} />
                {busy
                  ? 'Publishing…'
                  : `Publish version ${(record.data.versions || []).length + 1}`}
              </button>
              <p className={'wf-hint text-xs text-[#ada6ba]'}>
                Publishing! in this demo does not attach a phone number or place a call.
              </p>
              {issues?.map((issue, i) => (
                <div
                  className={
                    'wf-error flex gap-2.25 items-center p-[11px_13px] rounded-[9px] m-[12px_0] bg-[#512b3c] border border-[#89516b] text-[#ffb7c8] text-[13px]'
                  }
                  key={i}
                >
                  {issue}
                </div>
              ))}
            </section>
            <section
              className={
                'wf-panel wf-config [&>p]:text-[#bcb6cb] border border-[#3d3948] bg-[#1f2029] rounded-[14px] p-5.5 min-w-0 max-[580px]:p-4.25 p-6.75'
              }
            >
              <h2>Version history</h2>
              {record.data.versions?.length ? (
                <div
                  className={
                    'wf-history [&>div]:flex [&>div]:items-center [&>div]:gap-2.25 [&>div]:p-[14px_0] [&>div]:border-b [&>div]:border-b-[#413c4b] [&_strong]:flex-1 [&_small]:text-[#b6aec4] max-[580px]:[&>div]:flex-wrap max-[580px]:[&_small]:basis-full'
                  }
                >
                  {[...record.data.versions].reverse().map((v) => (
                    <div key={v.number}>
                      <span
                        className={
                          'wf-pill published inline-block rounded-[50px] p-[6px_11px] text-[11px] text-[#d2b8ff] bg-[#46335d] [&.published]:text-[#83eac7] [&.published]:bg-[#174638]'
                        }
                      >
                        v{v.number}
                      </span>
                      <strong>{v.draft.name}</strong>
                      <small>
                        {new Date(v.publishedAt).toLocaleString('en-IN')} · {v.draft.nodes.length}{' '}
                        nodes
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={'wf-muted text-[#bcb6cb]'}>
                  No published versions yet. Validate and test before publishing.
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </Shell>
  );
}
