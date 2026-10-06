'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Globe2,
  KeyRound,
  LockKeyhole,
  Plus,
  ShieldCheck,
  UserRound,
  PanelsTopLeft,
  Activity,
} from 'lucide-react';
import Shell from './Shell';
import { apiFetch } from './api-client';
function Field({ label, children, hint = '' }) {
  return (
    <label
      className={
        'ws-field flex flex-col gap-2 m-[19px_0] text-[#e7deef] text-[13px] font-[650] [&_input]:bg-[#2d2935] [&_input]:text-white [&_input]:border [&_input]:border-[#574c61] [&_input]:rounded-[9px] [&_input]:p-[11px_12px] [&_input]:outline-0 [&_input]:w-full [&_input]:min-w-0 [&_select]:bg-[#2d2935] [&_select]:text-white [&_select]:border [&_select]:border-[#574c61] [&_select]:rounded-[9px] [&_select]:p-[11px_12px] [&_select]:outline-0 [&_select]:w-full [&_select]:min-w-0 [&_input:focus]:border-[#ac88fa] [&_select:focus]:border-[#ac88fa] [&_small]:font-normal [&_small]:text-[11px] [&_small]:text-[#aaa0b9]'
      }
    >
      {label}
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
function Back({ href = '/widgets', children = 'Voice widgets' }) {
  return (
    <Link
      className={'ws-back inline-flex gap-1.75 items-center text-[#bca1e8] text-[13px] mb-5'}
      href={href}
    >
      <ArrowLeft size={16} />
      {children}
    </Link>
  );
}
function Message({ error, notice = '' }) {
  return (
    <>
      {error && (
        <div
          role="alert"
          className={
            'ws-error border border-[#92546c] bg-[#522c3d] text-[#ffc0d1] rounded-lg p-2.75 m-[12px_0] text-xs'
          }
        >
          {error}
        </div>
      )}
      {notice && (
        <div
          role="status"
          className={
            'ws-success border border-[#92546c] bg-[#522c3d] text-[#ffc0d1] rounded-lg p-2.75 m-[12px_0] text-xs flex gap-2 items-center bg-[#214c3f] border-[#457e68] text-[#b1f0d5]'
          }
        >
          <Check size={16} />
          {notice}
        </div>
      )}
    </>
  );
}
function Tabs({ id, view }) {
  return (
    <div
      className={
        'ws-tabs flex gap-1.75 overflow-auto border-b border-b-[#504658] mb-4.5 [&_a]:text-[#bcb2c8] [&_a]:text-[13px] [&_a]:p-[12px_14px] [&_a]:whitespace-nowrap [&_a]:border-b-[2px_solid_transparent] [&_a.active]:text-[#eadfff] [&_a.active]:border-[#a17af5]'
      }
    >
      {[
        ['domains', 'Domains'],
        ['security', 'Session & publish'],
        ['install', 'Install & activity'],
      ].map(([key, label]) => (
        <Link className={view === key ? 'active' : ''} href={`/widgets/${id}/${key}`} key={key}>
          {label}
        </Link>
      ))}
    </div>
  );
}
function useWidget(id) {
  const [row, setRow] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    apiFetch(`/api/widget-admin/widgets/${id}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw Error(data.error || 'Could not load widget.');
        if (active) setRow(data);
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
  return { row, setRow, loading, error, setError };
}
export function WorkspaceSettings() {
  const [profile, setProfile] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    apiFetch('/api/widget-admin/profile')
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error || 'Could not load workspace.');
        if (active) setProfile(d);
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
    <Shell active="/settings">
      <div
        className={
          'ws-page max-w-362.5 m-[0_auto] p-[8px_8px_55px] text-[#f7f2fb] [&_*]:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_a]:no-underline [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:opacity-[.55] [&_button:disabled]:cursor-not-allowed max-[650px]:p-[4px_0_32px] max-[650px]:[&_h1]:text-[25px]'
        }
      >
        <span className={'ws-kicker text-[11px] font-bold tracking-[.11em] text-[#b996f3]'}>
          WORKSPACE / SETTINGS
        </span>
        <h1>Workspace settings</h1>
        <p className={'ws-subtitle text-[#bcb5c5] text-[13px] leading-[1.55]'}>
          Business identity, website access, and member setup in one place.
        </p>
        <Message error={error} />
        {loading ? (
          <div
            className={
              'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
            }
          >
            Loading workspace…
          </div>
        ) : (
          <>
            <div
              className={
                'ws-hero [&_p]:text-[#bcb5c5] [&_p]:text-[13px] [&_p]:leading-[1.55] border border-[#433c4c] bg-[#20212a] rounded-[13px] flex items-center gap-3.75 p-6.25 m-[22px_0] [&>div]:flex-1 [&_h2]:m-0 [&_p]:m-[5px_0_0] max-[650px]:flex-wrap max-[650px]:[&>div]:basis-[70%]'
              }
            >
              <span
                className={
                  'ws-icon grid place-items-center flex-none w-11.25 h-11.25 rounded-[10px] bg-[#483362] text-[#d1a9ff]'
                }
              >
                <UserRound size={25} />
              </span>
              <div>
                <h2>{profile?.data?.companyName || 'Your merchant workspace'}</h2>
                <p>
                  Support email: {profile?.data?.supportEmail || 'Not set'} ·{' '}
                  {profile?.data?.timezone || 'Asia/Kolkata'}
                </p>
              </div>
              <span
                className={
                  'ws-tag text-[10px] text-[#f2d3aa] bg-[#59422e] rounded-[30px] p-[7px_10px]'
                }
              >
                DEMO
              </span>
            </div>
            <div
              className={
                'ws-links border border-[#433c4c] bg-[#20212a] rounded-[13px] overflow-hidden [&>a]:flex [&>a]:items-center [&>a]:gap-3.75 [&>a]:p-[18px_20px] [&>a]:border-b [&>a]:border-b-[#3f3849] [&>a]:text-[#f2ebf8] [&>a:last-child]:border-0 [&>a:hover]:bg-[#2e2939] [&>a>svg:first-child]:text-[#b78cf2] [&>a>span]:flex-1 [&>a>span]:min-w-0 [&_strong]:block [&_small]:block [&_strong]:text-sm [&_small]:text-[11px] [&_small]:text-[#b7afc1] [&_small]:mt-1.25'
              }
            >
              <Link href="/settings/profile">
                <UserRound size={22} />
                <span>
                  <strong>Merchant profile</strong>
                  <small>Company name, support email and time zone</small>
                </span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/widgets">
                <Globe2 size={22} />
                <span>
                  <strong>Voice widgets</strong>
                  <small>Verify domains and configure customer sessions</small>
                </span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/team">
                <ShieldCheck size={22} />
                <span>
                  <strong>Team</strong>
                  <small>Roles and availability</small>
                </span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
export function MerchantProfile() {
  const [row, setRow] = useState(null),
    [form, setForm] = useState({ companyName: '', supportEmail: '', timezone: 'Asia/Kolkata' }),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState('');
  useEffect(() => {
    let active = true;
    apiFetch('/api/widget-admin/profile')
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw Error(data.error || 'Could not load profile.');
        if (active) {
          setRow(data);
          setForm({
            companyName: data.data.companyName || '',
            supportEmail: data.data.supportEmail || '',
            timezone: data.data.timezone || 'Asia/Kolkata',
          });
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
  }, []);
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const r = await apiFetch('/api/widget-admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, revision: row.data.revision }),
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error || 'Could not save profile.');
      setRow(data);
      setNotice('Merchant profile saved.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell active="/settings">
      <div
        className={
          'ws-page ws-narrow max-w-362.5 m-[0_auto] p-[8px_8px_55px] text-[#f7f2fb] [&_*]:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_a]:no-underline [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:opacity-[.55] [&_button:disabled]:cursor-not-allowed max-[650px]:p-[4px_0_32px] max-[650px]:[&_h1]:text-[25px] max-w-207.5'
        }
      >
        <Back href="/settings">Workspace settings</Back>
        <span className={'ws-kicker text-[11px] font-bold tracking-[.11em] text-[#b996f3]'}>
          WORKSPACE / PROFILE
        </span>
        <h1>Merchant profile</h1>
        <p className={'ws-subtitle text-[#bcb5c5] text-[13px] leading-[1.55]'}>
          These details identify this demo workspace. Account registration and billing need
          production integrations.
        </p>
        {loading ? (
          <div
            className={
              'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
            }
          >
            Loading profile…
          </div>
        ) : (
          <form
            className={
              'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
            }
            onSubmit={save}
          >
            <Field label="Company name">
              <input
                required
                maxLength={120}
                value={form.companyName}
                onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
              />
            </Field>
            <Field label="Support email">
              <input
                type="email"
                required
                maxLength={180}
                value={form.supportEmail}
                onChange={(e) => setForm((f) => ({ ...f, supportEmail: e.target.value }))}
              />
            </Field>
            <Field label="Time zone">
              <select
                value={form.timezone}
                onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
              >
                {['Asia/Kolkata', 'UTC', 'Europe/London', 'America/New_York'].map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
            </Field>
            <Message error={error} notice={notice} />
            <button
              className={
                'ws-primary inline-flex gap-2 items-center justify-center p-[10px_15px] border border-[#9c78ef] rounded-[9px] text-white! bg-[#8056e8] text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#906af1]'
              }
              disabled={busy}
            >
              {busy ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        )}
      </div>
    </Shell>
  );
}
export function WidgetList() {
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    apiFetch('/api/widget-admin/widgets')
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error || 'Could not load widgets.');
        if (active) setRows(d);
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
    <Shell active="/widgets">
      <div
        className={
          'ws-page max-w-362.5 m-[0_auto] p-[8px_8px_55px] text-[#f7f2fb] [&_*]:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_a]:no-underline [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:opacity-[.55] [&_button:disabled]:cursor-not-allowed max-[650px]:p-[4px_0_32px] max-[650px]:[&_h1]:text-[25px]'
        }
      >
        <div
          className={
            'ws-head [&_p]:text-[#bcb5c5] [&_p]:text-[13px] [&_p]:leading-[1.55] flex items-center justify-between gap-4.5 mb-5 max-[650px]:items-start max-[650px]:flex-col'
          }
        >
          <div>
            <span className={'ws-kicker text-[11px] font-bold tracking-[.11em] text-[#b996f3]'}>
              BUILD / VOICE WIDGETS
            </span>
            <h1>Voice widgets</h1>
            <p>
              Connect a ready agent to verified websites. Customer sessions stay scoped to this
              widget.
            </p>
          </div>
          <Link
            className={
              'ws-primary inline-flex gap-2 items-center justify-center p-[10px_15px] border border-[#9c78ef] rounded-[9px] text-white! bg-[#8056e8] text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#906af1]'
            }
            href="/widgets/new"
          >
            <Plus size={16} /> New widget
          </Link>
        </div>
        <Message error={error} />
        {loading ? (
          <div
            className={
              'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
            }
          >
            Loading widgets…
          </div>
        ) : rows.length ? (
          <div
            className={
              'ws-list border border-[#433c4c] bg-[#20212a] rounded-[13px] overflow-hidden [&>a]:flex [&>a]:items-center [&>a]:gap-3.75 [&>a]:p-[18px_20px] [&>a]:border-b [&>a]:border-b-[#3f3849] [&>a]:text-[#f2ebf8] [&>a:last-child]:border-0 [&>a:hover]:bg-[#2e2939] [&>a>span:nth-child(2)]:flex-1 [&>a>span:nth-child(2)]:min-w-0 [&_strong]:block [&_small]:block [&_strong]:text-sm [&_small]:text-[11px] [&_small]:text-[#b7afc1] [&_small]:mt-1.25 mt-5'
            }
          >
            {rows.map((row) => (
              <Link key={row._id} href={`/widgets/${row._id}/domains`}>
                <span
                  className={
                    'ws-icon grid place-items-center flex-none w-11.25 h-11.25 rounded-[10px] bg-[#483362] text-[#d1a9ff]'
                  }
                >
                  <PanelsTopLeft size={20} />
                </span>
                <span>
                  <strong>{row.title}</strong>
                  <small>
                    {row.data.security?.domains?.filter((d) => d.status === 'verified').length || 0}{' '}
                    verified domains · {row.status}
                  </small>
                </span>
                <ArrowRight size={17} />
              </Link>
            ))}
          </div>
        ) : (
          <div
            className={
              'ws-empty border border-[#433c4c] bg-[#20212a] rounded-[13px] text-center p-[55px_20px] [&_svg]:text-[#ba9beb] [&_.ws-primary]:mt-2.5'
            }
          >
            <PanelsTopLeft size={32} />
            <h2>No widgets yet</h2>
            <p>Add a widget, verify a domain and publish it.</p>
            <Link
              className={
                'ws-primary inline-flex gap-2 items-center justify-center p-[10px_15px] border border-[#9c78ef] rounded-[9px] text-white! bg-[#8056e8] text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#906af1]'
              }
              href="/widgets/new"
            >
              Create widget
            </Link>
          </div>
        )}
        <p className={'ws-footnote text-[#b7adbf] text-[11px] leading-normal mt-4.75'}>
          Legacy reference screens remain at /screens. Use this setup to publish a verified widget.
        </p>
      </div>
    </Shell>
  );
}
export function WidgetCreate() {
  const router = useRouter(),
    [name, setName] = useState(''),
    [agentId, setAgentId] = useState(''),
    [agents, setAgents] = useState([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  useEffect(() => {
    apiFetch('/api/voice-agents')
      .then((r) => r.json())
      .then(setAgents)
      .catch(() => setError('Could not load voice agents.'));
  }, []);
  async function create(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const r = await apiFetch('/api/widget-admin/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, agentId }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || 'Could not create widget.');
      router.push(`/widgets/${d._id}/domains`);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }
  return (
    <Shell active="/widgets">
      <div
        className={
          'ws-page ws-narrow max-w-362.5 m-[0_auto] p-[8px_8px_55px] text-[#f7f2fb] [&_*]:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_a]:no-underline [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:opacity-[.55] [&_button:disabled]:cursor-not-allowed max-[650px]:p-[4px_0_32px] max-[650px]:[&_h1]:text-[25px] max-w-207.5'
        }
      >
        <Back />
        <span className={'ws-kicker text-[11px] font-bold tracking-[.11em] text-[#b996f3]'}>
          WIDGET / CREATE
        </span>
        <h1>Create voice widget</h1>
        <form
          className={
            'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
          }
          onSubmit={create}
        >
          <span
            className={
              'ws-icon grid place-items-center flex-none w-11.25 h-11.25 rounded-[10px] bg-[#483362] text-[#d1a9ff]'
            }
          >
            <PanelsTopLeft size={23} />
          </span>
          <Field label="Widget name">
            <input
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer support"
            />
          </Field>
          <Field label="Ready voice agent">
            <select required value={agentId} onChange={(e) => setAgentId(e.target.value)}>
              <option value="">Choose agent</option>
              {Array.isArray(agents) &&
                agents
                  .filter((a) => a.status === 'ready')
                  .map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name}
                    </option>
                  ))}
            </select>
          </Field>
          <Message error={error} />
          <button
            className={
              'ws-primary inline-flex gap-2 items-center justify-center p-[10px_15px] border border-[#9c78ef] rounded-[9px] text-white! bg-[#8056e8] text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#906af1]'
            }
            disabled={busy || !agentId}
          >
            {busy ? 'Creating…' : 'Create and verify domain'} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </Shell>
  );
}
export function WidgetDomains({ id }) {
  const { row, setRow, loading, error, setError } = useWidget(id),
    [origin, setOrigin] = useState(''),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState('');
  async function add(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const r = await apiFetch(`/api/widget-admin/widgets/${id}/domains`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, revision: row.data.security.revision }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || 'Could not add domain.');
      setRow(d);
      setOrigin('');
      setNotice('Domain added. Verify its DNS TXT record next.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell active="/widgets">
      <div
        className={
          'ws-page max-w-362.5 m-[0_auto] p-[8px_8px_55px] text-[#f7f2fb] [&_*]:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_a]:no-underline [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:opacity-[.55] [&_button:disabled]:cursor-not-allowed max-[650px]:p-[4px_0_32px] max-[650px]:[&_h1]:text-[25px]'
        }
      >
        <Back />
        <span className={'ws-kicker text-[11px] font-bold tracking-[.11em] text-[#b996f3]'}>
          WIDGET / WEBSITE ACCESS
        </span>
        <h1>{row?.title || 'Widget'} · Domains</h1>
        <p className={'ws-subtitle text-[#bcb5c5] text-[13px] leading-[1.55]'}>
          Only websites you prove ownership of can start a customer session.
        </p>
        {row && <Tabs id={id} view="domains" />}
        {loading ? (
          <div
            className={
              'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
            }
          >
            Loading domains…
          </div>
        ) : row ? (
          <div
            className={
              'ws-grid grid grid-cols-[minmax(0,_1.2fr)_minmax(290px,_.9fr)] gap-3.75 items-start max-[900px]:grid-cols-1'
            }
          >
            <section
              className={
                'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
              }
            >
              <h2>Allowed domains</h2>
              {row.data.security.domains.length ? (
                row.data.security.domains.map((d) => (
                  <Link
                    className={
                      'ws-domain flex gap-2.5 items-center text-[#eee7f6] p-[14px_0] border-b border-b-[#464050] [&>svg:first-child]:text-[#bd9cff] [&>span:nth-child(2)]:flex-1 [&>span:nth-child(2)]:min-w-0 [&_strong]:block [&_small]:block [&_strong]:text-[13px] [&_small]:text-[11px] [&_small]:text-[#b5aabe] [&_small]:mt-1.25 max-[650px]:flex-wrap max-[650px]:[&>span:nth-child(2)]:basis-[70%]'
                    }
                    href={`/widgets/${id}/domains/${d.id}`}
                    key={d.id}
                  >
                    <Globe2 size={18} />
                    <span>
                      <strong>{d.origin}</strong>
                      <small>
                        {d.status === 'verified'
                          ? 'Verified on ' + new Date(d.verifiedAt).toLocaleDateString('en-IN')
                          : 'Waiting for DNS verification'}
                      </small>
                    </span>
                    <span
                      className={`ws-state text-[10px] rounded-[30px] text-[#f4d5a1] bg-[#56432f] p-[6px_9px] capitalize [&.verified]:bg-[#255443] [&.verified]:text-[#a2eac7]${d.status}`}
                    >
                      {d.status}
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                ))
              ) : (
                <p className={'ws-muted text-[#bcb5c5] text-[13px] leading-[1.55]'}>
                  No website domain has been added.
                </p>
              )}
            </section>
            <section
              className={
                'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
              }
            >
              <h2>Add a website</h2>
              <p className={'ws-muted text-[#bcb5c5] text-[13px] leading-[1.55]'}>
                Enter the exact HTTPS origin used by your customers.
              </p>
              <form onSubmit={add}>
                <Field label="Website origin">
                  <input
                    type="url"
                    required
                    placeholder="https://shop.yourcompany.com"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </Field>
                <Message error={error} notice={notice} />
                <button
                  className={
                    'ws-primary inline-flex gap-2 items-center justify-center p-[10px_15px] border border-[#9c78ef] rounded-[9px] text-white! bg-[#8056e8] text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#906af1]'
                  }
                  disabled={busy}
                >
                  {busy ? 'Adding…' : 'Add domain'} <Plus size={15} />
                </button>
              </form>
            </section>
          </div>
        ) : (
          <Message error={error} />
        )}
      </div>
    </Shell>
  );
}
export function WidgetVerify({ id, domainId }) {
  const { row, setRow, loading, error, setError } = useWidget(id),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(''),
    [copied, setCopied] = useState(false);
  const domain = row?.data.security.domains.find((d) => d.id === domainId);
  async function verify() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const r = await apiFetch(`/api/widget-admin/widgets/${id}/domains/${domainId}/verify`, {
        method: 'POST',
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || 'Verification failed.');
      setRow(d);
      setNotice('Website ownership verified.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell active="/widgets">
      <div
        className={
          'ws-page ws-narrow max-w-362.5 m-[0_auto] p-[8px_8px_55px] text-[#f7f2fb] [&_*]:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_a]:no-underline [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:opacity-[.55] [&_button:disabled]:cursor-not-allowed max-[650px]:p-[4px_0_32px] max-[650px]:[&_h1]:text-[25px] max-w-207.5'
        }
      >
        <Back href={`/widgets/${id}/domains`}>Domains</Back>
        <span className={'ws-kicker text-[11px] font-bold tracking-[.11em] text-[#b996f3]'}>
          WIDGET / DOMAIN VERIFICATION
        </span>
        <h1>Verify website</h1>
        {loading ? (
          <div
            className={
              'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
            }
          >
            Loading challenge…
          </div>
        ) : domain ? (
          <div
            className={
              'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
            }
          >
            <span
              className={
                'ws-icon grid place-items-center flex-none w-11.25 h-11.25 rounded-[10px] bg-[#483362] text-[#d1a9ff]'
              }
            >
              <KeyRound size={22} />
            </span>
            <h2>{domain.origin}</h2>
            <p className={'ws-muted text-[#bcb5c5] text-[13px] leading-[1.55]'}>
              Add this TXT record to your domain DNS. DNS changes may take time to appear.
            </p>
            <div
              className={
                'ws-dns grid grid-cols-[68px_minmax(0,_1fr)] gap-3.25 p-4.5 m-[20px_0] border border-[#52485e] bg-[#292735] rounded-lg text-[13px] [&_span]:text-[#aba3b7] [&_code]:font-[ui-monospace,_SFMono-Regular,_monospace] [&_code]:wrap-anywhere [&_code]:text-[#e9dcff]'
              }
            >
              <span>Type</span>
              <strong>TXT</strong>
              <span>Name</span>
              <code>{domain.recordName}</code>
              <span>Value</span>
              <code>chatbucket-verify={domain.challenge}</code>
            </div>
            <button
              className={
                'ws-secondary inline-flex gap-2 items-center justify-center p-[10px_15px] border border-[#9c78ef] rounded-[9px] text-white! bg-[#8056e8] text-[13px] font-bold whitespace-nowrap bg-[#2b2935] text-[#eee5f8]! border-[#5b4d64] [&:hover]:bg-[#3b3248]'
              }
              onClick={() =>
                navigator.clipboard
                  .writeText(`chatbucket-verify=${domain.challenge}`)
                  .then(() => setCopied(true))
              }
            >
              <Copy size={16} />
              {copied ? 'Copied' : 'Copy value'}
            </button>
            <Message error={error} notice={notice} />
            <div className={'ws-actions flex gap-2.5 flex-wrap mt-5.5'}>
              <button
                className={
                  'ws-primary inline-flex gap-2 items-center justify-center p-[10px_15px] border border-[#9c78ef] rounded-[9px] text-white! bg-[#8056e8] text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#906af1]'
                }
                onClick={verify}
                disabled={busy}
              >
                {busy
                  ? 'Checking DNS…'
                  : domain.status === 'verified'
                    ? 'Recheck DNS'
                    : 'Check DNS record'}
              </button>
              <Link
                className={
                  'ws-secondary inline-flex gap-2 items-center justify-center p-[10px_15px] border border-[#9c78ef] rounded-[9px] text-white! bg-[#8056e8] text-[13px] font-bold whitespace-nowrap bg-[#2b2935] text-[#eee5f8]! border-[#5b4d64] [&:hover]:bg-[#3b3248]'
                }
                href={`/widgets/${id}/security`}
              >
                Session settings <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <Message error={error || 'Domain not found.'} />
        )}
      </div>
    </Shell>
  );
}
export function WidgetSecurity({ id }) {
  const { row, setRow, loading, error, setError } = useWidget(id),
    [minutes, setMinutes] = useState(15),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState('');
  useEffect(() => {
    if (row) setMinutes(row.data.security.sessionMinutes || 15);
  }, [row]);
  async function run(action) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const endpoint = action === 'publish' ? 'publish' : 'security';
      const r = await apiFetch(`/api/widget-admin/widgets/${id}/${endpoint}`, {
        method: action === 'publish' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          revision: row.data.security.revision,
          sessionMinutes: Number(minutes),
        }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || 'Could not update widget.');
      setRow(d);
      setNotice(
        action === 'publish' ? 'Widget published for verified domains.' : 'Session settings saved.',
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell active="/widgets">
      <div
        className={
          'ws-page ws-narrow max-w-362.5 m-[0_auto] p-[8px_8px_55px] text-[#f7f2fb] [&_*]:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_a]:no-underline [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:opacity-[.55] [&_button:disabled]:cursor-not-allowed max-[650px]:p-[4px_0_32px] max-[650px]:[&_h1]:text-[25px] max-w-207.5'
        }
      >
        <Back />
        <span className={'ws-kicker text-[11px] font-bold tracking-[.11em] text-[#b996f3]'}>
          WIDGET / SESSION SECURITY
        </span>
        <h1>{row?.title || 'Widget'} · Security</h1>
        {row && <Tabs id={id} view="security" />}
        {loading ? (
          <div
            className={
              'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
            }
          >
            Loading settings…
          </div>
        ) : row ? (
          <div
            className={
              'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
            }
          >
            <span
              className={
                'ws-icon grid place-items-center flex-none w-11.25 h-11.25 rounded-[10px] bg-[#483362] text-[#d1a9ff]'
              }
            >
              <LockKeyhole size={23} />
            </span>
            <h2>Customer session</h2>
            <p className={'ws-muted text-[#bcb5c5] text-[13px] leading-[1.55]'}>
              Each visitor gets a scoped, expiring token. The browser website origin must match a
              verified domain.
            </p>
            <Field label="Session length (minutes)">
              <input
                type="number"
                min="5"
                max="60"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
              />
            </Field>
            <div
              className={
                'ws-summary grid grid-cols-[1fr_auto] gap-2.5 p-4 border border-[#51455a] bg-[#2b2934] rounded-[9px] m-[20px_0] text-xs [&_span]:text-[#b5adc1] [&_strong]:font-[650] [&_strong]:text-right max-[650px]:grid-cols-[1fr_1fr]'
              }
            >
              <span>Verified domains</span>
              <strong>
                {row.data.security.domains.filter((d) => d.status === 'verified').length}
              </strong>
              <span>Current status</span>
              <strong>{row.status}</strong>
            </div>
            <Message error={error} notice={notice} />
            <div className={'ws-actions flex gap-2.5 flex-wrap mt-5.5'}>
              <button
                className={
                  'ws-secondary inline-flex gap-2 items-center justify-center p-[10px_15px] border border-[#9c78ef] rounded-[9px] text-white! bg-[#8056e8] text-[13px] font-bold whitespace-nowrap bg-[#2b2935] text-[#eee5f8]! border-[#5b4d64] [&:hover]:bg-[#3b3248]'
                }
                disabled={busy}
                onClick={() => run('save')}
              >
                Save policy
              </button>
              <button
                className={
                  'ws-primary inline-flex gap-2 items-center justify-center p-[10px_15px] border border-[#9c78ef] rounded-[9px] text-white! bg-[#8056e8] text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#906af1]'
                }
                disabled={busy || !row.data.security.domains.some((d) => d.status === 'verified')}
                onClick={() => run('publish')}
              >
                <ShieldCheck size={16} /> Publish verified widget
              </button>
            </div>
            <p className={'ws-footnote text-[#b7adbf] text-[11px] leading-normal mt-4.75'}>
              Demo sessions remain in one API process. A production embed needs shared sessions,
              abuse controls, and a complete security review.
            </p>
          </div>
        ) : (
          <Message error={error} />
        )}
      </div>
    </Shell>
  );
}
export function WidgetInstall({ id }) {
  const { row, loading, error } = useWidget(id),
    [copied, setCopied] = useState(false),
    [counts, setCounts] = useState(null),
    [origin, setOrigin] = useState('');
  useEffect(() => {
    setOrigin(window.location.origin);
    apiFetch('/api/records/call?limit=250')
      .then((r) => r.json())
      .then((rows) => {
        if (Array.isArray(rows)) setCounts(rows.filter((r) => r.data?.widgetId === id).length);
      })
      .catch(() => {});
  }, [id]);
  const snippet = `<script src="${origin}/chatbucket-voice.js" data-widget-id="${id}"></script>`;
  return (
    <Shell active="/widgets">
      <div
        className={
          'ws-page max-w-362.5 m-[0_auto] p-[8px_8px_55px] text-[#f7f2fb] [&_*]:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_a]:no-underline [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:opacity-[.55] [&_button:disabled]:cursor-not-allowed max-[650px]:p-[4px_0_32px] max-[650px]:[&_h1]:text-[25px]'
        }
      >
        <Back />
        <span className={'ws-kicker text-[11px] font-bold tracking-[.11em] text-[#b996f3]'}>
          WIDGET / INSTALL & ACTIVITY
        </span>
        <h1>{row?.title || 'Widget'} · Install</h1>
        {row && <Tabs id={id} view="install" />}
        {loading ? (
          <div
            className={
              'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
            }
          >
            Loading installation…
          </div>
        ) : row ? (
          <div
            className={
              'ws-grid grid grid-cols-[minmax(0,_1.2fr)_minmax(290px,_.9fr)] gap-3.75 items-start max-[900px]:grid-cols-1'
            }
          >
            <section
              className={
                'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
              }
            >
              <h2>Website embed</h2>
              <p className={'ws-muted text-[#bcb5c5] text-[13px] leading-[1.55]'}>
                Add this script to a verified website before the closing body tag.
              </p>
              <pre
                className={
                  'ws-code [&_code]:font-[ui-monospace,_SFMono-Regular,_monospace] [&_code]:wrap-anywhere [&_code]:text-[#e9dcff] whitespace-pre-wrap bg-[#15161d] border border-[#4c4259] rounded-[9px] p-4.5 text-xs leading-[1.6]'
                }
              >
                <code>{snippet}</code>
              </pre>
              <button
                className={
                  'ws-secondary inline-flex gap-2 items-center justify-center p-[10px_15px] border border-[#9c78ef] rounded-[9px] text-white! bg-[#8056e8] text-[13px] font-bold whitespace-nowrap bg-[#2b2935] text-[#eee5f8]! border-[#5b4d64] [&:hover]:bg-[#3b3248]'
                }
                onClick={() => navigator.clipboard.writeText(snippet).then(() => setCopied(true))}
              >
                <Copy size={16} />
                {copied ? 'Copied' : 'Copy snippet'}
              </button>
              <div
                className={
                  'ws-notice flex gap-2 items-start mt-5 bg-[#273d36] text-[#aee8d0] border border-[#426e60] rounded-lg p-3.25 text-xs [&_svg]:flex-none'
                }
              >
                <ShieldCheck size={18} />{' '}
                {row.status === 'published'
                  ? 'This widget is published. Only verified origins can request sessions.'
                  : 'Publish after DNS verification to open customer sessions.'}
              </div>
            </section>
            <section
              className={
                'ws-panel border border-[#433c4c] bg-[#20212a] rounded-[13px] p-6 min-w-0 max-[650px]:p-4.25'
              }
            >
              <h2>Demo activity</h2>
              <div
                className={
                  'ws-summary grid grid-cols-[1fr_auto] gap-2.5 p-4 border border-[#51455a] bg-[#2b2934] rounded-[9px] m-[20px_0] text-xs [&_span]:text-[#b5adc1] [&_strong]:font-[650] [&_strong]:text-right max-[650px]:grid-cols-[1fr_1fr]'
                }
              >
                <span>Website sessions</span>
                <strong>Not tracked in shared storage</strong>
                <span>Widget demo calls</span>
                <strong>{counts === null ? 'Loading…' : counts}</strong>
                <span>Verified domains</span>
                <strong>
                  {row.data.security.domains.filter((d) => d.status === 'verified').length}
                </strong>
              </div>
              <p className={'ws-footnote text-[#b7adbf] text-[11px] leading-normal mt-4.75'}>
                Counts reflect only this demo API process. Live analytics require a durable event
                store.
              </p>
              <Link
                className={
                  'ws-secondary inline-flex gap-2 items-center justify-center p-[10px_15px] border border-[#9c78ef] rounded-[9px] text-white! bg-[#8056e8] text-[13px] font-bold whitespace-nowrap bg-[#2b2935] text-[#eee5f8]! border-[#5b4d64] [&:hover]:bg-[#3b3248]'
                }
                href="/ai-handoff"
              >
                <Activity size={16} /> Review call queue
              </Link>
            </section>
          </div>
        ) : (
          <Message error={error} />
        )}
      </div>
    </Shell>
  );
}
