'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  ChevronRight,
  Clock3,
  GitBranch,
  PhoneForwarded,
  Play,
  Plus,
  Save,
  ShieldCheck,
  Signal,
  TriangleAlert,
} from 'lucide-react';
import Shell from './Shell';
import { apiFetch } from './api-client';
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function Field({ label, children, hint = '' }) {
  return (
    <label
      className={
        'rt-field flex flex-col gap-2 m-[18px_0] text-[#e8e0ee] text-[13px] font-[650] [&_input]:bg-[#2c2935] [&_input]:border [&_input]:border-[#594d62] [&_input]:text-white [&_input]:p-[11px_12px] [&_input]:rounded-[9px] [&_input]:outline-0 [&_input]:w-full [&_input]:min-w-0 [&_select]:bg-[#2c2935] [&_select]:border [&_select]:border-[#594d62] [&_select]:text-white [&_select]:p-[11px_12px] [&_select]:rounded-[9px] [&_select]:outline-0 [&_select]:w-full [&_select]:min-w-0 [&_textarea]:bg-[#2c2935] [&_textarea]:border [&_textarea]:border-[#594d62] [&_textarea]:text-white [&_textarea]:p-[11px_12px] [&_textarea]:rounded-[9px] [&_textarea]:outline-0 [&_textarea]:w-full [&_textarea]:min-w-0 [&_:is(input,select,textarea):focus]:border-[#ad84fa] [&_small]:text-[#bcb1c5] [&_small]:text-[11px] [&_small]:font-normal'
      }
    >
      {label}
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
function Alert({ error, notice = '' }) {
  return (
    <>
      {error && (
        <div
          className={
            'rt-error border border-[#89546e] bg-[#512e3d] text-[#ffc3d1] rounded-lg p-2.75 m-[12px_0] text-xs'
          }
          role="alert"
        >
          {error}
        </div>
      )}
      {notice && (
        <div
          className={
            'rt-success border border-[#89546e] bg-[#512e3d] text-[#ffc3d1] rounded-lg p-2.75 m-[12px_0] text-xs flex items-center gap-2 border-[#427e69] bg-[#214c3e] text-[#abead1]'
          }
          role="status"
        >
          <Check size={16} />
          {notice}
        </div>
      )}
    </>
  );
}
export function RoutingList() {
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    apiFetch('/api/routing')
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw Error(data.error || 'Could not load routes.');
        if (active) setRows(data);
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
  }, []);
  return (
    <Shell active="/routing">
      <div
        className={
          'rt-page max-w-375 m-[0_auto] p-[8px_8px_55px] text-[#f7f3fb] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_a]:no-underline [&_button]:[font:inherit] [&_input]:[font:inherit] [&_textarea]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] max-[640px]:p-[4px_0_35px] max-[640px]:[&_h1]:text-[25px]'
        }
      >
        <div
          className={
            'rt-head flex items-center justify-between gap-4.5 mb-5 [&_p]:text-[#bcb3c5] [&_p]:text-[13px] [&_p]:leading-normal max-[640px]:items-start max-[640px]:flex-col'
          }
        >
          <div>
            <span className={'rt-kicker text-[11px] font-bold tracking-[.11em] text-[#ba96f7]'}>
              DEPLOY / CALL ROUTING
            </span>
            <h1>Call routing</h1>
            <p>Plan where an incoming call goes during and outside your working hours.</p>
          </div>
          <Link
            className={
              'rt-primary inline-flex gap-2 items-center justify-center p-[10px_15px] rounded-[9px] border border-[#9c79ef] bg-[#8057e8] text-white! text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#926bf2]'
            }
            href="/routing/new"
          >
            <Plus size={17} /> New route
          </Link>
        </div>
        <div
          className={
            'rt-intro border border-[#443d4d] bg-[#20212a] rounded-[13px] flex gap-3.25 items-center p-4.75 m-[16px_0_25px] bg-[#30283f] [&>svg]:text-[#be99f8] [&>svg]:flex-none [&_strong]:block [&_small]:block [&_small]:text-xs [&_small]:text-[#c2b7cf] [&_small]:mt-1 [&_small]:leading-[1.4]'
          }
        >
          <PhoneForwarded size={25} />
          <span>
            <strong>Existing business number?</strong>
            <small>
              Set up a route and give the forwarding instructions to your telephony provider. This
              demo does not change carrier settings.
            </small>
          </span>
        </div>
        <Alert error={error} />
        {loading ? (
          <div
            className={
              'rt-panel border border-[#443d4d] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[640px]:p-4.25'
            }
          >
            Loading routes…
          </div>
        ) : rows.length ? (
          <div
            className={
              'rt-list border border-[#443d4d] bg-[#20212a] rounded-[13px] overflow-hidden [&>a]:flex [&>a]:items-center [&>a]:gap-3.5 [&>a]:p-[15px_18px] [&>a]:text-[#f4edfa] [&>a]:border-b [&>a]:border-b-[#3b3545] [&>a:last-child]:border-0 [&>a:hover]:bg-[#30293c] [&>a>span:nth-child(2)]:flex-1 [&>a>span:nth-child(2)]:min-w-0 [&_strong]:block [&_small]:block [&_small]:text-[11px] [&_small]:text-[#beb5c7] [&_small]:mt-1.25 max-[640px]:[&>a]:gap-2 max-[640px]:[&>a]:p-3 max-[640px]:[&_small]:overflow-hidden max-[640px]:[&_small]:text-ellipsis max-[640px]:[&_small]:whitespace-nowrap'
            }
          >
            {rows.map((row) => (
              <Link href={`/routing/${row._id}`} key={row._id}>
                <span
                  className={
                    'rt-icon w-10.5 h-10.5 grid place-items-center flex-none rounded-[10px] bg-[#4a356b] text-[#d2a9ff]'
                  }
                >
                  <GitBranch size={20} />
                </span>
                <span>
                  <strong>{row.title}</strong>
                  <small>
                    {row.data.numberLabel} ·{' '}
                    {row.data.source === 'existing' ? 'Existing number' : 'Demo reservation'} ·
                    Draft
                  </small>
                </span>
                <span
                  className={
                    'rt-pill inline-block p-[6px_10px] rounded-[50px] text-[#f2d3a7] bg-[#61452b] text-[11px] capitalize'
                  }
                >
                  Not live
                </span>
                <ArrowRight size={17} />
              </Link>
            ))}
          </div>
        ) : (
          <div
            className={
              'rt-empty border border-[#443d4d] bg-[#20212a] rounded-[13px] text-center p-[60px_20px] text-[#c0b5c9] [&_svg]:text-[#b996f3] [&_.rt-primary]:mt-3'
            }
          >
            <GitBranch size={32} />
            <h2>No call routes</h2>
            <p>
              Create a route, choose an agent, then preview office hours and after-hours behavior.
            </p>
            <Link
              className={
                'rt-primary inline-flex gap-2 items-center justify-center p-[10px_15px] rounded-[9px] border border-[#9c79ef] bg-[#8057e8] text-white! text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#926bf2]'
              }
              href="/routing/new"
            >
              Create route
            </Link>
          </div>
        )}
      </div>
    </Shell>
  );
}
export function RoutingCreate() {
  const router = useRouter(),
    [name, setName] = useState(''),
    [source, setSource] = useState('existing'),
    [numberLabel, setNumberLabel] = useState(''),
    [numberId, setNumberId] = useState(''),
    [numbers, setNumbers] = useState([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  useEffect(() => {
    apiFetch('/api/numbers')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setNumbers(data);
      })
      .catch(() => {});
  }, []);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const r = await apiFetch('/api/routing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, source, numberLabel, numberId }),
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error || 'Could not create route.');
      router.push(`/routing/${data._id}`);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }
  return (
    <Shell active="/routing">
      <div
        className={
          'rt-page rt-narrow max-w-375 m-[0_auto] p-[8px_8px_55px] text-[#f7f3fb] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_a]:no-underline [&_button]:[font:inherit] [&_input]:[font:inherit] [&_textarea]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] max-[640px]:p-[4px_0_35px] max-[640px]:[&_h1]:text-[25px] max-w-212.5'
        }
      >
        <Link
          href="/routing"
          className={'rt-back inline-flex items-center gap-1.75 text-[#bb9beb] text-[13px] mb-4.5'}
        >
          <ArrowLeft size={16} /> Call routing
        </Link>
        <span className={'rt-kicker text-[11px] font-bold tracking-[.11em] text-[#ba96f7]'}>
          STEP 1 / NUMBER SOURCE
        </span>
        <h1>New inbound route</h1>
        <p className={'rt-subtitle text-[#bcb3c5] text-[13px] leading-normal'}>
          Add a number you already own or select a masked demo reservation. Carrier forwarding needs
          separate confirmation.
        </p>
        <form
          className={
            'rt-panel border border-[#443d4d] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[640px]:p-4.25'
          }
          onSubmit={submit}
        >
          <Field label="Route name">
            <input
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Support line"
            />
          </Field>
          <div
            className={
              'rt-source grid grid-cols-[1fr_1fr] gap-2.75 m-[24px_0] [&_button]:flex [&_button]:flex-col [&_button]:gap-2.25 [&_button]:items-start [&_button]:border [&_button]:border-[#4e4658] [&_button]:bg-[#2c2934] [&_button]:text-[#eee7f4] [&_button]:rounded-[9px] [&_button]:p-4.25 [&_button]:text-left [&_button.active]:border-[#aa83f1] [&_button.active]:bg-[#3b2c52] [&_button_svg]:text-[#bc9af1] [&_button_small]:text-[#b5adbf] [&_button_small]:text-[11px] max-[640px]:grid-cols-1 max-[640px]:[&_button]:p-3.5'
            }
          >
            <button
              type="button"
              className={source === 'existing' ? 'active' : ''}
              onClick={() => setSource('existing')}
            >
              <PhoneForwarded size={19} />
              <strong>Existing number</strong>
              <small>Forward from your provider later</small>
            </button>
            <button
              type="button"
              className={source === 'demo-number' ? 'active' : ''}
              onClick={() => setSource('demo-number')}
            >
              <Signal size={19} />
              <strong>Demo reservation</strong>
              <small>Use a masked number for setup</small>
            </button>
          </div>
          {source === 'existing' ? (
            <Field
              label="Business phone number"
              hint="E.164 format with country code, for example +919876543210. Ownership is not verified here."
            >
              <input
                type="tel"
                value={numberLabel}
                onChange={(e) => setNumberLabel(e.target.value)}
                placeholder="+919876543210"
              />
            </Field>
          ) : (
            <Field label="Reserved demo number">
              <select value={numberId} onChange={(e) => setNumberId(e.target.value)}>
                <option value="">Choose reserved number</option>
                {numbers.map((n) => (
                  <option key={n._id} value={n._id}>
                    {n.title} · {n.data.region}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Alert error={error} />
          <div className={'rt-actions flex justify-end gap-2.5 flex-wrap mt-6.25'}>
            <button
              className={
                'rt-primary inline-flex gap-2 items-center justify-center p-[10px_15px] rounded-[9px] border border-[#9c79ef] bg-[#8057e8] text-white! text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#926bf2]'
              }
              disabled={busy || !name.trim()}
            >
              {busy ? 'Creating…' : 'Create routing draft'} <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
const tabs = [
  ['overview', 'Overview'],
  ['hours', 'Working hours'],
  ['after-hours', 'After-hours'],
  ['test', 'Sample call'],
  ['capacity', 'Capacity'],
  ['readiness', 'Launch checklist'],
];
function routeHref(id, view) {
  return view === 'overview' ? `/routing/${id}` : `/routing/${id}/${view}`;
}
const localNow = () => {
  const date = new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
export function RoutingDetail({ id, view = 'overview' }) {
  const router = useRouter(),
    [row, setRow] = useState(null),
    [form, setForm] = useState(null),
    [agents, setAgents] = useState([]),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [dirty, setDirty] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState(''),
    [sampleAt, setSampleAt] = useState(localNow),
    [sample, setSample] = useState(null),
    [capacityInput, setCapacityInput] = useState({
      callsPerDay: 1000,
      averageMinutes: 3,
      busyHours: 8,
      peakMultiplier: 3,
    }),
    [capacity, setCapacity] = useState(null),
    [readiness, setReadiness] = useState(null);
  useEffect(() => {
    let active = true;
    Promise.all([apiFetch(`/api/routing/${id}`), apiFetch('/api/voice-agents')])
      .then(async ([r, a]) => {
        const [route, agents] = await Promise.all([r.json(), a.json()]);
        if (!r.ok) throw Error(route.error || 'Could not load route.');
        if (!a.ok) throw Error(agents.error || 'Could not load agents.');
        if (active) {
          setRow(route);
          setForm({ name: route.title, config: route.data.config });
          setAgents(agents);
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
  function change(key, value) {
    setForm((old) => ({ ...old, config: { ...old.config, [key]: value } }));
    setDirty(true);
    setNotice('');
  }
  async function save() {
    if (!row || !form) return null;
    setBusy(true);
    setError('');
    try {
      const r = await apiFetch(`/api/routing/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revision: row.data.revision, ...form }),
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error || 'Could not save route.');
      setRow(data);
      setForm({ name: data.title, config: data.data.config });
      setDirty(false);
      setNotice('Routing draft saved.');
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setBusy(false);
    }
  }
  async function navigate(event, href) {
    if (!dirty) return;
    event.preventDefault();
    if (await save()) router.push(href);
  }
  async function action(type) {
    setBusy(true);
    setError('');
    setNotice('');
    const current = dirty ? await save() : row;
    if (!current) {
      setBusy(false);
      return;
    }
    try {
      const path = type === 'test' ? 'preview' : type === 'capacity' ? 'capacity' : 'readiness',
        method = type === 'readiness' ? 'GET' : 'POST';
      const payload = type === 'test' ? { at: new Date(sampleAt).toISOString() } : capacityInput;
      const r = await apiFetch(`/api/routing/${id}/${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(method === 'POST' ? { body: JSON.stringify(payload) } : {}),
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error || 'Could not run check.');
      if (type === 'test') setSample(data);
      if (type === 'capacity') setCapacity(data);
      if (type === 'readiness') setReadiness(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (loading)
    return (
      <Shell active="/routing">
        <div
          className={
            'rt-page rt-panel max-w-375 m-[0_auto] p-[8px_8px_55px] text-[#f7f3fb] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_a]:no-underline [&_button]:[font:inherit] [&_input]:[font:inherit] [&_textarea]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] max-[640px]:p-[4px_0_35px] max-[640px]:[&_h1]:text-[25px] border border-[#443d4d] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[640px]:p-4.25'
          }
        >
          Loading route…
        </div>
      </Shell>
    );
  if (!row || !form)
    return (
      <Shell active="/routing">
        <div
          className={
            'rt-page max-w-375 m-[0_auto] p-[8px_8px_55px] text-[#f7f3fb] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_a]:no-underline [&_button]:[font:inherit] [&_input]:[font:inherit] [&_textarea]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] max-[640px]:p-[4px_0_35px] max-[640px]:[&_h1]:text-[25px]'
          }
        >
          <Link
            href="/routing"
            className={
              'rt-back inline-flex items-center gap-1.75 text-[#bb9beb] text-[13px] mb-4.5'
            }
          >
            ← Call routing
          </Link>
          <Alert error={error || 'Route not found.'} />
        </div>
      </Shell>
    );
  return (
    <Shell active="/routing">
      <div
        className={
          'rt-page max-w-375 m-[0_auto] p-[8px_8px_55px] text-[#f7f3fb] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_a]:no-underline [&_button]:[font:inherit] [&_input]:[font:inherit] [&_textarea]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] max-[640px]:p-[4px_0_35px] max-[640px]:[&_h1]:text-[25px]'
        }
      >
        <Link
          href="/routing"
          onClick={(e) => navigate(e, '/routing')}
          className={'rt-back inline-flex items-center gap-1.75 text-[#bb9beb] text-[13px] mb-4.5'}
        >
          <ArrowLeft size={16} /> Call routing
        </Link>
        <div
          className={
            'rt-head flex items-center justify-between gap-4.5 mb-5 [&_p]:text-[#bcb3c5] [&_p]:text-[13px] [&_p]:leading-normal max-[640px]:items-start max-[640px]:flex-col'
          }
        >
          <div>
            <span className={'rt-kicker text-[11px] font-bold tracking-[.11em] text-[#ba96f7]'}>
              INBOUND ROUTE · DRAFT {dirty ? '· UNSAVED' : ''}
            </span>
            <h1>{row.title}</h1>
            <p>
              {row.data.numberLabel} ·{' '}
              {row.data.source === 'existing' ? 'Existing number' : 'Masked demo number'} · Not live
            </p>
          </div>
          <button
            className={
              'rt-secondary inline-flex gap-2 items-center justify-center p-[10px_15px] rounded-[9px] border border-[#9c79ef] bg-[#8057e8] text-white! text-[13px] font-bold whitespace-nowrap bg-[#2d2937] text-[#ede6f7]! border-[#5a4e66] [&:hover]:bg-[#3a3049]'
            }
            disabled={busy || !dirty}
            onClick={() => save()}
          >
            <Save size={16} />
            {busy ? 'Saving…' : 'Save draft'}
          </button>
        </div>
        <div
          className={
            'rt-tabs flex gap-1 overflow-auto border-b border-b-[#51475c] mb-4.5 [&_a]:whitespace-nowrap [&_a]:text-[#bcb1c6] [&_a]:text-[13px] [&_a]:p-[12px_13px] [&_a]:border-b-[2px_solid_transparent] [&_a.active]:text-[#f0e5ff] [&_a.active]:border-[#ac80f9] max-[640px]:[&_a]:text-[11px]'
          }
        >
          {tabs.map(([key, label]) => (
            <Link
              className={view === key ? 'active' : ''}
              key={key}
              href={routeHref(id, key)}
              onClick={(e) => navigate(e, routeHref(id, key))}
            >
              {label}
            </Link>
          ))}
        </div>
        <Alert error={error} notice={notice} />
        {view === 'overview' && (
          <div
            className={
              'rt-two grid grid-cols-[1fr_1fr] gap-3.75 items-start max-[900px]:grid-cols-1'
            }
          >
            <section
              className={
                'rt-panel border border-[#443d4d] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[640px]:p-4.25'
              }
            >
              <h2>Call destination</h2>
              <p className={'rt-muted text-[#bcb3c5] text-[13px] leading-normal'}>
                Choose the voice agent that would answer during working hours.
              </p>
              <Field label="Route name">
                <input
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => {
                    setForm((old) => ({ ...old, name: e.target.value }));
                    setDirty(true);
                  }}
                />
              </Field>
              <Field label="Ready voice agent">
                <select
                  value={form.config.agentId}
                  onChange={(e) => change('agentId', e.target.value)}
                >
                  <option value="">Choose an agent</option>
                  {agents
                    .filter((agent) => agent.status === 'ready')
                    .map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name}
                      </option>
                    ))}
                </select>
              </Field>
              <div className={'rt-actions flex justify-end gap-2.5 flex-wrap mt-6.25'}>
                <button
                  className={
                    'rt-primary inline-flex gap-2 items-center justify-center p-[10px_15px] rounded-[9px] border border-[#9c79ef] bg-[#8057e8] text-white! text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#926bf2]'
                  }
                  onClick={() => save()}
                  disabled={busy || !dirty}
                >
                  Save destination
                </button>
              </div>
            </section>
            <section
              className={
                'rt-panel border border-[#443d4d] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[640px]:p-4.25'
              }
            >
              <h2>Route summary</h2>
              <div
                className={
                  'rt-facts grid grid-cols-[minmax(110px,.65fr)_1fr] gap-3 p-4 border border-[#50445a] bg-[#2b2934] rounded-[9px] m-[18px_0] text-xs [&_span]:text-[#aaa2b5] [&_strong]:font-[650]'
                }
              >
                <span>Number</span>
                <strong>{row.data.numberLabel}</strong>
                <span>Hours</span>
                <strong>
                  {form.config.start}–{form.config.end} ({form.config.timezone})
                </strong>
                <span>Closed action</span>
                <strong>
                  {form.config.afterHours === 'callback' ? 'Offer callback' : 'End politely'}
                </strong>
              </div>
              <div
                className={
                  'rt-warning flex gap-2.25 items-center p-3 m-[16px_0] border border-[#846949] bg-[#473a2d] text-[#f2d6ac] rounded-lg text-xs leading-normal [&_svg]:flex-none'
                }
              >
                <TriangleAlert size={19} /> Forwarding and streaming providers are not connected.
              </div>
              <Link
                href={routeHref(id, 'hours')}
                onClick={(e) => navigate(e, routeHref(id, 'hours'))}
                className={
                  'rt-secondary inline-flex gap-2 items-center justify-center p-[10px_15px] rounded-[9px] border border-[#9c79ef] bg-[#8057e8] text-white! text-[13px] font-bold whitespace-nowrap bg-[#2d2937] text-[#ede6f7]! border-[#5a4e66] [&:hover]:bg-[#3a3049]'
                }
              >
                Set working hours <ChevronRight size={16} />
              </Link>
            </section>
          </div>
        )}
        {view === 'hours' && (
          <div
            className={
              'rt-panel rt-narrow border border-[#443d4d] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[640px]:p-4.25 max-w-212.5'
            }
          >
            <div
              className={
                'rt-section-title [&_p]:text-[#bcb3c5] [&_p]:text-[13px] [&_p]:leading-normal flex gap-2.75 items-start mb-6 [&_svg]:text-[#bc94f3] [&_svg]:flex-none [&_p]:m-0'
              }
            >
              <CalendarClock size={23} />
              <div>
                <h2>Working hours</h2>
                <p>Agent availability is evaluated in this time zone.</p>
              </div>
            </div>
            <Field label="Time zone">
              <select
                value={form.config.timezone}
                onChange={(e) => change('timezone', e.target.value)}
              >
                {['Asia/Kolkata', 'UTC', 'Europe/London', 'America/New_York'].map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
            </Field>
            <div
              className={
                'rt-days grid grid-cols-[repeat(7,1fr)] gap-1.75 [&_label]:flex [&_label]:justify-center [&_label]:items-center [&_label]:gap-1 [&_label]:p-[8px_5px] [&_label]:bg-[#302b38] [&_label]:border [&_label]:border-[#51455c] [&_label]:rounded-lg [&_label]:text-xs [&_label]:cursor-pointer [&_label.active]:bg-[#513778] [&_label.active]:border-[#aa7ff4] [&_input]:accent-[#ad83f5] max-[900px]:grid-cols-[repeat(4,1fr)] max-[640px]:grid-cols-[repeat(4,1fr)]'
              }
            >
              {weekdays.map((day) => (
                <label key={day} className={form.config.days.includes(day) ? 'active' : ''}>
                  <input
                    type="checkbox"
                    checked={form.config.days.includes(day)}
                    onChange={(e) =>
                      change(
                        'days',
                        e.target.checked
                          ? [...form.config.days, day]
                          : form.config.days.filter((d) => d !== day),
                      )
                    }
                  />
                  {day}
                </label>
              ))}
            </div>
            <div className={'rt-time grid grid-cols-[1fr_1fr] gap-3 max-[640px]:grid-cols-1'}>
              <Field label="Start">
                <input
                  type="time"
                  value={form.config.start}
                  onChange={(e) => change('start', e.target.value)}
                />
              </Field>
              <Field label="Stop">
                <input
                  type="time"
                  value={form.config.end}
                  onChange={(e) => change('end', e.target.value)}
                />
              </Field>
            </div>
            <Field
              label="Closed dates (one YYYY-MM-DD per line)"
              hint="At most 30 dates. These override the selected weekdays."
            >
              <textarea
                rows={4}
                value={form.config.closedDates.join('\n')}
                onChange={(e) => change('closedDates', e.target.value.split(/\s+/).filter(Boolean))}
                placeholder="2026-10-02"
              />
            </Field>
            <button
              className={
                'rt-primary inline-flex gap-2 items-center justify-center p-[10px_15px] rounded-[9px] border border-[#9c79ef] bg-[#8057e8] text-white! text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#926bf2]'
              }
              onClick={() => save()}
              disabled={busy || !dirty}
            >
              Save hours
            </button>
          </div>
        )}
        {view === 'after-hours' && (
          <div
            className={
              'rt-panel rt-narrow border border-[#443d4d] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[640px]:p-4.25 max-w-212.5'
            }
          >
            <div
              className={
                'rt-section-title [&_p]:text-[#bcb3c5] [&_p]:text-[13px] [&_p]:leading-normal flex gap-2.75 items-start mb-6 [&_svg]:text-[#bc94f3] [&_svg]:flex-none [&_p]:m-0'
              }
            >
              <Clock3 size={23} />
              <div>
                <h2>After-hours rules</h2>
                <p>Define what a future call runtime should do when the route is closed.</p>
              </div>
            </div>
            <div
              className={
                'rt-choice [&_button.active]:border-[#aa83f1] [&_button.active]:bg-[#3b2c52] flex gap-2.75 m-[22px_0] [&_button]:flex-1 [&_button]:border [&_button]:border-[#51465e] [&_button]:rounded-[9px] [&_button]:bg-[#2b2934] [&_button]:text-[#eee7f5] [&_button]:p-3.5 max-[640px]:flex-col'
              }
            >
              <button
                className={form.config.afterHours === 'callback' ? 'active' : ''}
                onClick={() => change('afterHours', 'callback')}
              >
                Offer callback
              </button>
              <button
                className={form.config.afterHours === 'end' ? 'active' : ''}
                onClick={() => change('afterHours', 'end')}
              >
                End politely
              </button>
            </div>
            <Field label="Message to caller">
              <textarea
                rows={4}
                maxLength={300}
                value={form.config.afterHoursMessage}
                onChange={(e) => change('afterHoursMessage', e.target.value)}
              />
            </Field>
            <p className={'rt-muted text-[#bcb3c5] text-[13px] leading-normal'}>
              This setting is saved as a draft. It does not place callbacks or control real calls.
            </p>
            <button
              className={
                'rt-primary inline-flex gap-2 items-center justify-center p-[10px_15px] rounded-[9px] border border-[#9c79ef] bg-[#8057e8] text-white! text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#926bf2]'
              }
              onClick={() => save()}
              disabled={busy || !dirty}
            >
              Save after-hours rule
            </button>
          </div>
        )}
        {view === 'test' && (
          <div
            className={
              'rt-two grid grid-cols-[1fr_1fr] gap-3.75 items-start max-[900px]:grid-cols-1'
            }
          >
            <section
              className={
                'rt-panel border border-[#443d4d] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[640px]:p-4.25'
              }
            >
              <div
                className={
                  'rt-section-title [&_p]:text-[#bcb3c5] [&_p]:text-[13px] [&_p]:leading-normal flex gap-2.75 items-start mb-6 [&_svg]:text-[#bc94f3] [&_svg]:flex-none [&_p]:m-0'
                }
              >
                <Play size={23} />
                <div>
                  <h2>Test a sample call</h2>
                  <p>Choose a time; no real call will be placed.</p>
                </div>
              </div>
              <Field label="Sample date and time (your browser time zone)">
                <input
                  type="datetime-local"
                  value={sampleAt}
                  onChange={(e) => setSampleAt(e.target.value)}
                />
              </Field>
              <button
                className={
                  'rt-primary inline-flex gap-2 items-center justify-center p-[10px_15px] rounded-[9px] border border-[#9c79ef] bg-[#8057e8] text-white! text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#926bf2]'
                }
                onClick={() => action('test')}
                disabled={busy || !sampleAt}
              >
                <Play size={16} /> {busy ? 'Testing…' : 'Preview route'}
              </button>
            </section>
            <section
              className={
                'rt-panel border border-[#443d4d] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[640px]:p-4.25'
              }
            >
              <h2>Decision</h2>
              {sample ? (
                <>
                  <span
                    className={
                      'rt-pill inline-block p-[6px_10px] rounded-[50px] text-[#f2d3a7] bg-[#61452b] text-[11px] capitalize'
                    }
                  >
                    {sample.decision.replace(/-/g, ' ')}
                  </span>
                  <div
                    className={
                      'rt-facts grid grid-cols-[minmax(110px,.65fr)_1fr] gap-3 p-4 border border-[#50445a] bg-[#2b2934] rounded-[9px] m-[18px_0] text-xs [&_span]:text-[#aaa2b5] [&_strong]:font-[650]'
                    }
                  >
                    <span>Local time</span>
                    <strong>
                      {sample.weekday}, {sample.localDate} {sample.localTime}
                    </strong>
                    <span>Time zone</span>
                    <strong>{sample.timeZone}</strong>
                    <span>Reason</span>
                    <strong>{sample.reason}</strong>
                    <span>During hours</span>
                    <strong>{sample.withinHours ? 'Yes' : 'No'}</strong>
                  </div>
                  <p className={'rt-muted text-[#bcb3c5] text-[13px] leading-normal'}>
                    Preview only. No provider call, timer or agent output executed.
                  </p>
                </>
              ) : (
                <p className={'rt-muted text-[#bcb3c5] text-[13px] leading-normal'}>
                  Run a preview to see the exact path for this date and time.
                </p>
              )}
            </section>
          </div>
        )}
        {view === 'capacity' && (
          <div
            className={
              'rt-two grid grid-cols-[1fr_1fr] gap-3.75 items-start max-[900px]:grid-cols-1'
            }
          >
            <section
              className={
                'rt-panel border border-[#443d4d] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[640px]:p-4.25'
              }
            >
              <div
                className={
                  'rt-section-title [&_p]:text-[#bcb3c5] [&_p]:text-[13px] [&_p]:leading-normal flex gap-2.75 items-start mb-6 [&_svg]:text-[#bc94f3] [&_svg]:flex-none [&_p]:m-0'
                }
              >
                <Signal size={23} />
                <div>
                  <h2>Plan peak capacity</h2>
                  <p>Estimate simultaneous channels from a traffic scenario.</p>
                </div>
              </div>
              {[
                ['callsPerDay', 'Calls per day'],
                ['averageMinutes', 'Average call length (minutes)'],
                ['busyHours', 'Busy hours per day'],
                ['peakMultiplier', 'Peak multiplier'],
              ].map(([key, label]) => (
                <Field key={key} label={label}>
                  <input
                    type="number"
                    min={key === 'averageMinutes' ? 0.5 : 1}
                    step={key === 'averageMinutes' ? 0.5 : 1}
                    value={capacityInput[key]}
                    onChange={(e) => setCapacityInput((old) => ({ ...old, [key]: e.target.value }))}
                  />
                </Field>
              ))}
              <button
                className={
                  'rt-primary inline-flex gap-2 items-center justify-center p-[10px_15px] rounded-[9px] border border-[#9c79ef] bg-[#8057e8] text-white! text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#926bf2]'
                }
                onClick={() => action('capacity')}
                disabled={busy}
              >
                Estimate channels
              </button>
            </section>
            <section
              className={
                'rt-panel border border-[#443d4d] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[640px]:p-4.25'
              }
            >
              <h2>Planning result</h2>
              {capacity ? (
                <>
                  <div
                    className={
                      'rt-capacity flex items-baseline gap-3.25 bg-[#312843] rounded-[9px] p-4.5 m-[20px_0] [&_strong]:text-[36px] [&_strong]:text-[#d1b0ff] [&_span]:text-[#c5b8d2] [&_span]:text-xs max-[640px]:flex-col max-[640px]:gap-1'
                    }
                  >
                    <strong>{capacity.estimatedChannels}</strong>
                    <span>estimated channels for &lt;1% modeled blocking</span>
                  </div>
                  <div
                    className={
                      'rt-facts grid grid-cols-[minmax(110px,.65fr)_1fr] gap-3 p-4 border border-[#50445a] bg-[#2b2934] rounded-[9px] m-[18px_0] text-xs [&_span]:text-[#aaa2b5] [&_strong]:font-[650]'
                    }
                  >
                    <span>Offered traffic</span>
                    <strong>{capacity.offeredLoad} Erlangs</strong>
                    <span>Estimated blocking</span>
                    <strong>{(capacity.blockingProbability * 100).toFixed(2)}%</strong>
                    <span>Model</span>
                    <strong>{capacity.model}</strong>
                  </div>
                  <p className={'rt-muted text-[#bcb3c5] text-[13px] leading-normal'}>
                    {capacity.note}
                  </p>
                </>
              ) : (
                <p className={'rt-muted text-[#bcb3c5] text-[13px] leading-normal'}>
                  Enter your peak assumptions to calculate an estimate. This does not purchase or
                  reserve provider capacity.
                </p>
              )}
            </section>
          </div>
        )}
        {view === 'readiness' && (
          <div
            className={
              'rt-panel rt-narrow border border-[#443d4d] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[640px]:p-4.25 max-w-212.5'
            }
          >
            <div
              className={
                'rt-section-title [&_p]:text-[#bcb3c5] [&_p]:text-[13px] [&_p]:leading-normal flex gap-2.75 items-start mb-6 [&_svg]:text-[#bc94f3] [&_svg]:flex-none [&_p]:m-0'
              }
            >
              <ShieldCheck size={23} />
              <div>
                <h2>Launch checklist</h2>
                <p>Review what is configured and which integrations still block live calls.</p>
              </div>
            </div>
            <button
              className={
                'rt-primary inline-flex gap-2 items-center justify-center p-[10px_15px] rounded-[9px] border border-[#9c79ef] bg-[#8057e8] text-white! text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#926bf2]'
              }
              disabled={busy}
              onClick={() => action('readiness')}
            >
              {busy ? 'Checking…' : 'Run readiness check'}
            </button>
            {readiness && (
              <>
                <div
                  className={
                    'rt-checks mt-5 [&>div]:flex [&>div]:items-center [&>div]:gap-2.5 [&>div]:border-b [&>div]:border-b-[#433b4d] [&>div]:p-[12px_0] [&>div]:text-xs [&>div>span:nth-child(2)]:flex-1 [&_strong]:text-[#d4b4ad] [&_strong]:text-[11px] [&_.passed]:text-[#89e0be] [&_.pending]:text-[#f4c88a]'
                  }
                >
                  {readiness.checks.map((check) => (
                    <div key={check.name}>
                      <span className={check.passed ? 'passed' : 'pending'}>
                        {check.passed ? <Check size={16} /> : <TriangleAlert size={16} />}
                      </span>
                      <span>{check.name}</span>
                      <strong>{check.passed ? 'Ready' : 'Pending'}</strong>
                    </div>
                  ))}
                </div>
                <div
                  className={
                    'rt-warning flex gap-2.25 items-center p-3 m-[16px_0] border border-[#846949] bg-[#473a2d] text-[#f2d6ac] rounded-lg text-xs leading-normal [&_svg]:flex-none'
                  }
                >
                  <TriangleAlert size={18} />
                  {readiness.note}
                </div>
              </>
            )}
            <Link
              className={
                'rt-secondary inline-flex gap-2 items-center justify-center p-[10px_15px] rounded-[9px] border border-[#9c79ef] bg-[#8057e8] text-white! text-[13px] font-bold whitespace-nowrap bg-[#2d2937] text-[#ede6f7]! border-[#5a4e66] [&:hover]:bg-[#3a3049]'
              }
              href={routeHref(id, 'test')}
            >
              Open sample test <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </Shell>
  );
}
