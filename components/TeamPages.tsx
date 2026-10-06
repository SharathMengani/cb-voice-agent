'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Shell from './Shell';
import { apiFetch } from './api-client';
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const perms = [
  ['Manage team and roles', 'Yes', 'No', 'No', 'No'],
  ['Edit workflows and tools', 'Yes', 'No', 'No', 'No'],
  ['Review calls and callbacks', 'Yes', 'Yes', 'No', 'No'],
  ['Manage phone routing', 'Yes', 'No', 'No', 'No'],
];
const Field = ({ label, children, hint = '' }) => (
  <label
    className={
      'tm-field flex flex-col gap-2 text-[#e7dfed] text-[13px] font-[650] m-[19px_0] [&_input]:w-full [&_input]:min-w-0 [&_input]:bg-[#2d2a35] [&_input]:border [&_input]:border-[#594e60] [&_input]:rounded-[9px] [&_input]:text-white [&_input]:p-2.75 [&_input]:outline-0 [&_select]:w-full [&_select]:min-w-0 [&_select]:bg-[#2d2a35] [&_select]:border [&_select]:border-[#594e60] [&_select]:rounded-[9px] [&_select]:text-white [&_select]:p-2.75 [&_select]:outline-0 [&_input:focus]:border-[#ac83fb] [&_select:focus]:border-[#ac83fb] [&_input[readonly]]:text-[#aba2b3] [&_small]:text-[#bcb2c6] [&_small]:text-[11px] [&_small]:font-normal'
    }
  >
    {label}
    {children}
    {hint && <small>{hint}</small>}
  </label>
);
export function TeamDirectory() {
  const [members, setMembers] = useState([]),
    [query, setQuery] = useState(''),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('');
  const owner = { name: 'Sharath', email: 'Local demo' };
  useEffect(() => {
    let active = true;
    apiFetch('/api/team')
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error || 'Could not load team.');
        if (active) setMembers(d);
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
  const visible = members.filter((m) =>
    `${m.title} ${m.data.email} ${m.data.department}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Shell active="/team">
      <div
        className={
          'tm-page max-w-360 m-[0_auto] p-[8px_8px_55px] text-[#f6f2fa] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] [&_a]:no-underline max-[640px]:p-[4px_0_35px] max-[640px]:[&_h1]:text-[25px]'
        }
      >
        <div
          className={
            'tm-header flex justify-between items-center gap-4.5 mb-5.25 [&_p]:text-[#bdb4c8] [&_p]:text-[13px] [&_p]:leading-normal max-[640px]:items-start max-[640px]:flex-col'
          }
        >
          <div>
            <span className={'tm-kicker text-[11px] font-bold tracking-[.11em] text-[#b592f8]'}>
              WORKSPACE / TEAM
            </span>
            <h1>Team</h1>
            <p>Manage member details and see who is available for human support.</p>
          </div>
          <Link
            className={
              'tm-primary inline-flex justify-center items-center gap-1.75 bg-[#8057e8] border border-[#9b75f0] text-white! rounded-[9px] p-[10px_15px] text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#956df3]'
            }
            href="/team/new"
          >
            <Plus size={17} /> Add member
          </Link>
        </div>
        <div
          className={
            'tm-stats [&>div]:bg-[#20212a] [&>div]:border [&>div]:border-[#413c49] [&>div]:rounded-[13px] grid grid-cols-[repeat(3,1fr)] gap-3 mb-4.5 [&>div]:p-4.75 [&_strong]:block [&_small]:block [&_strong]:text-[25px] [&_small]:text-xs [&_small]:text-[#b7afc1] max-[640px]:gap-1.5 max-[640px]:[&>div]:p-2.75 max-[640px]:[&_strong]:text-[19px] max-[640px]:[&_small]:text-[10px]'
          }
        >
          <div>
            <strong>{members.length + 1}</strong>
            <small>People</small>
          </div>
          <div>
            <strong>{members.filter((m) => m.status === 'active').length + 1}</strong>
            <small>Active demo users</small>
          </div>
          <div>
            <strong>{members.filter((m) => m.status === 'invited').length}</strong>
            <small>Staged invitations</small>
          </div>
        </div>
        <div
          className={
            'tm-toolbar flex justify-between items-center gap-4.5 mb-5.25 max-[640px]:items-start max-[640px]:flex-col'
          }
        >
          <div
            className={
              'tm-search flex items-center gap-2 border border-[#554c60] rounded-[9px] bg-[#2b2934] p-[9px_12px] text-[#bcb1c9] [&_input]:w-57.5 [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-white [&_input]:outline-0 max-[640px]:w-full max-[640px]:[&_input]:w-full'
            }
          >
            <Search size={17} />
            <input
              aria-label="Search team"
              placeholder="Search members…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Link
            href="/team/permissions"
            className={
              'tm-secondary inline-flex justify-center items-center gap-1.75 bg-[#8057e8] border border-[#9b75f0] text-white! rounded-[9px] p-[10px_15px] text-[13px] font-bold whitespace-nowrap bg-[#2c2935] border-[#584d62] text-[#eee7f7]! [&:hover]:bg-[#3c3248]'
            }
          >
            <ShieldCheck size={16} /> Roles & permissions
          </Link>
        </div>
        {error && (
          <p
            className={
              'tm-error bg-[#502d3d] text-[#ffc2cf] border border-[#86506a] rounded-lg p-[10px_12px] m-[13px_0] text-xs'
            }
            role="alert"
          >
            {error}
          </p>
        )}
        <div
          className={'tm-list bg-[#20212a] border border-[#413c49] rounded-[13px] overflow-hidden'}
        >
          <div
            className={
              'tm-member owner flex items-center gap-3.5 text-[#f2ebf7] p-[15px_18px] border-b border-b-[#3b3544] last:border-0 [&:not(.owner):hover]:bg-[#30273e] [&>span:nth-child(2)]:flex-1 [&>span:nth-child(2)]:min-w-0 [&_strong]:block [&_small]:block [&_strong]:text-[13px] [&_strong_em]:text-[10px] [&_strong_em]:text-[#b993f5] [&_strong_em]:not-italic [&_small]:text-[11px] [&_small]:text-[#bdb2c6] [&_small]:mt-1.25 [&_b]:text-[11px] [&_b]:font-semibold [&_b]:capitalize [&_b]:bg-[#443454] [&_b]:text-[#d5bff0] [&_b]:rounded-[30px] [&_b]:p-[6px_10px] [&_b.invited]:bg-[#594332] [&_b.invited]:text-[#ffd49b] max-[640px]:p-3 max-[640px]:gap-2 max-[640px]:[&_small]:overflow-hidden max-[640px]:[&_small]:text-ellipsis max-[640px]:[&_small]:whitespace-nowrap font-semibold [&_small]:text-(--muted) [&_small]:text-xs [&_small]:font-normal max-[800px]:hidden'
            }
          >
            <span
              className={
                'tm-avatar w-9.75 h-9.75 grid place-items-center flex-none rounded-full bg-[#6c4bb3] text-white font-bold [&.large]:w-13.5 [&.large]:h-13.5 [&.large]:text-[21px]'
              }
            >
              {owner?.name?.slice(0, 1) || 'O'}
            </span>
            <span>
              <strong>
                {owner?.name || 'Workspace owner'} <em>You</em>
              </strong>
              <small>{owner?.email || 'Owner account'} · Workspace owner</small>
            </span>
            <b>Owner</b>
          </div>
          {loading ? (
            <div className={'tm-empty p-7.5 text-center text-[#b7afbf]'}>Loading team…</div>
          ) : visible.length ? (
            visible.map((m) => (
              <Link
                href={`/team/${m._id}`}
                className={
                  'tm-member flex items-center gap-3.5 text-[#f2ebf7] p-[15px_18px] border-b border-b-[#3b3544] last:border-0 [&:not(.owner):hover]:bg-[#30273e] [&>span:nth-child(2)]:flex-1 [&>span:nth-child(2)]:min-w-0 [&_strong]:block [&_small]:block [&_strong]:text-[13px] [&_strong_em]:text-[10px] [&_strong_em]:text-[#b993f5] [&_strong_em]:not-italic [&_small]:text-[11px] [&_small]:text-[#bdb2c6] [&_small]:mt-1.25 [&_b]:text-[11px] [&_b]:font-semibold [&_b]:capitalize [&_b]:bg-[#443454] [&_b]:text-[#d5bff0] [&_b]:rounded-[30px] [&_b]:p-[6px_10px] [&_b.invited]:bg-[#594332] [&_b.invited]:text-[#ffd49b] max-[640px]:p-3 max-[640px]:gap-2 max-[640px]:[&_small]:overflow-hidden max-[640px]:[&_small]:text-ellipsis max-[640px]:[&_small]:whitespace-nowrap'
                }
                key={m._id}
              >
                <span
                  className={
                    'tm-avatar w-9.75 h-9.75 grid place-items-center flex-none rounded-full bg-[#6c4bb3] text-white font-bold [&.large]:w-13.5 [&.large]:h-13.5 [&.large]:text-[21px]'
                  }
                >
                  {m.title.slice(0, 1)}
                </span>
                <span>
                  <strong>{m.title}</strong>
                  <small>
                    {m.data.email} · {m.data.department || 'No department'}
                  </small>
                </span>
                <b className={`${m.status} [&]:text-[#ff8f99]!`}>
                  {m.status === 'invited' ? 'Staged' : m.data.role}
                </b>
                <ArrowRight size={17} />
              </Link>
            ))
          ) : (
            <div className={'tm-empty p-7.5 text-center text-[#b7afbf]'}>
              {query ? 'No members match.' : 'No additional members yet.'}
            </div>
          )}
        </div>
        <p className={'tm-footnote text-xs text-[#afa5bb] mt-4.25 leading-normal'}>
          New invitations are staged in the demo. Email delivery and new login access are not
          configured.
        </p>
      </div>
    </Shell>
  );
}
export function TeamInvite() {
  const router = useRouter(),
    [form, setForm] = useState({ name: '', email: '', role: 'agent', department: '' }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const r = await apiFetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || 'Could not stage member.');
      router.push(`/team/${d._id}`);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }
  return (
    <Shell active="/team">
      <div
        className={
          'tm-page tm-narrow max-w-360 m-[0_auto] p-[8px_8px_55px] text-[#f6f2fa] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] [&_a]:no-underline max-[640px]:p-[4px_0_35px] max-[640px]:[&_h1]:text-[25px] max-w-207.5'
        }
      >
        <Link
          href="/team"
          className={'tm-back inline-flex items-center gap-1.5 text-[#bd9ef1] text-[13px] mb-4.5'}
        >
          <ArrowLeft size={17} /> Team
        </Link>
        <span className={'tm-kicker text-[11px] font-bold tracking-[.11em] text-[#b592f8]'}>
          TEAM / ADD MEMBER
        </span>
        <h1>Add a team member</h1>
        <p className={'tm-subtitle text-[#bdb4c8] text-[13px] leading-normal'}>
          Record the person and their planned role. This demo does not email an invitation or create
          a login.
        </p>
        <form
          className={
            'tm-panel bg-[#20212a] border border-[#413c49] rounded-[13px] p-6 mb-4.5 max-[640px]:p-4'
          }
          onSubmit={submit}
        >
          <div
            className={
              'tm-form-icon w-11.25 h-11.25 grid place-items-center rounded-[11px] bg-[#443260] text-[#ccadfa] mb-3.75'
            }
          >
            <Mail size={23} />
          </div>
          <Field label="Full name">
            <input
              required
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="For example, Anjali Rao"
            />
          </Field>
          <Field label="Work email">
            <input
              required
              type="email"
              maxLength={180}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="anjali@company.com"
            />
          </Field>
          <Field label="Department">
            <input
              maxLength={80}
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              placeholder="Customer support"
            />
          </Field>
          <Field
            label="Planned role"
            hint="Only the seeded owner and agent can sign in to this demo."
          >
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            >
              <option value="agent">Agent</option>
              <option value="supervisor">Supervisor</option>
              <option value="viewer">Viewer</option>
            </select>
          </Field>
          {error && (
            <div
              className={
                'tm-error bg-[#502d3d] text-[#ffc2cf] border border-[#86506a] rounded-lg p-[10px_12px] m-[13px_0] text-xs'
              }
              role="alert"
            >
              {error}
            </div>
          )}
          <div
            className={
              'tm-actions flex justify-end gap-2.75 flex-wrap mt-6.25 max-[640px]:*:flex-1'
            }
          >
            <Link
              href="/team"
              className={
                'tm-secondary inline-flex justify-center items-center gap-1.75 bg-[#8057e8] border border-[#9b75f0] text-white! rounded-[9px] p-[10px_15px] text-[13px] font-bold whitespace-nowrap bg-[#2c2935] border-[#584d62] text-[#eee7f7]! [&:hover]:bg-[#3c3248]'
              }
            >
              Cancel
            </Link>
            <button
              className={
                'tm-primary inline-flex justify-center items-center gap-1.75 bg-[#8057e8] border border-[#9b75f0] text-white! rounded-[9px] p-[10px_15px] text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#956df3]'
              }
              disabled={busy}
            >
              {busy ? 'Saving…' : 'Add to team directory'} <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
export function TeamPermissions() {
  return (
    <Shell active="/team">
      <div
        className={
          'tm-page max-w-360 m-[0_auto] p-[8px_8px_55px] text-[#f6f2fa] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] [&_a]:no-underline max-[640px]:p-[4px_0_35px] max-[640px]:[&_h1]:text-[25px]'
        }
      >
        <Link
          href="/team"
          className={'tm-back inline-flex items-center gap-1.5 text-[#bd9ef1] text-[13px] mb-4.5'}
        >
          <ArrowLeft size={17} /> Team
        </Link>
        <span className={'tm-kicker text-[11px] font-bold tracking-[.11em] text-[#b592f8]'}>
          TEAM / ROLES
        </span>
        <h1>Roles & permissions</h1>
        <p className={'tm-subtitle text-[#bdb4c8] text-[13px] leading-normal'}>
          Current demo access for signed-in accounts. Other roles can be staged in the directory,
          but cannot sign in yet.
        </p>
        <div
          className={
            'tm-panel tm-permissions bg-[#20212a] border border-[#413c49] rounded-[13px] p-6 mb-4.5 max-[640px]:p-4 overflow-auto max-[640px]:overflow-auto'
          }
        >
          <div
            className={
              'tm-permission-row heading grid grid-cols-[minmax(210px,2fr)_repeat(4,minmax(90px,.7fr))] items-center gap-2.5 p-[13px_4px] border-b border-b-[#3e3945] text-xs last:border-0 [&.heading]:font-bold [&.heading]:text-[#cbb9e2] [&>span:not(:first-child)]:grid [&>span:not(:first-child)]:place-items-center [&_.yes]:text-[#7dddbb] [&_.no]:text-[#887d91] max-[640px]:min-w-150'
            }
          >
            <span>Capability</span>
            <strong>Owner</strong>
            <strong>Agent</strong>
            <strong>Supervisor*</strong>
            <strong>Viewer*</strong>
          </div>
          {perms.map(([label, ...values]) => (
            <div
              className={
                'tm-permission-row grid grid-cols-[minmax(210px,2fr)_repeat(4,minmax(90px,.7fr))] items-center gap-2.5 p-[13px_4px] border-b border-b-[#3e3945] text-xs last:border-0 [&.heading]:font-bold [&.heading]:text-[#cbb9e2] [&>span:not(:first-child)]:grid [&>span:not(:first-child)]:place-items-center [&_.yes]:text-[#7dddbb] [&_.no]:text-[#887d91] max-[640px]:min-w-150'
              }
              key={label}
            >
              <span>{label}</span>
              {values.map((v, i) => (
                <span key={i} className={v === 'Yes' ? 'yes' : 'no'}>
                  {v === 'Yes' ? <Check size={17} /> : '—'}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div
          className={
            'tm-panel tm-access-note bg-[#20212a] border border-[#413c49] rounded-[13px] p-6 mb-4.5 max-[640px]:p-4 flex gap-3.25 items-start [&_svg]:text-[#b28ff1] [&_svg]:flex-none [&_p]:text-xs [&_p]:text-[#c4bbce] [&_p]:leading-normal [&_p]:m-[7px_0]'
          }
        >
          <ShieldCheck size={22} />
          <div>
            <strong>Demo sign-in boundaries</strong>
            <p>
              Owner manages the workspace. The seeded human agent can access call and callback work.
              Staged supervisor and viewer roles do not receive credentials or API access.
            </p>
          </div>
        </div>
        <Link
          className={
            'tm-primary inline-flex justify-center items-center gap-1.75 bg-[#8057e8] border border-[#9b75f0] text-white! rounded-[9px] p-[10px_15px] text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#956df3]'
          }
          href="/team/new"
        >
          Add member <ArrowRight size={16} />
        </Link>
      </div>
    </Shell>
  );
}
export function TeamMember({ id, availabilityView = false }) {
  const [record, setRecord] = useState(null),
    [form, setForm] = useState(null),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState('');
  useEffect(() => {
    let active = true;
    apiFetch(`/api/team/${id}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error || 'Could not load member.');
        if (active) {
          setRecord(d);
          setForm({
            name: d.title,
            department: d.data.department || '',
            role: d.data.role,
            availability: d.data.availability,
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
  }, [id]);
  function updateAvailability(key, value) {
    setForm((old) => ({ ...old, availability: { ...old.availability, [key]: value } }));
    setNotice('');
  }
  async function save() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const r = await apiFetch(`/api/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, revision: record.data.revision }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error || 'Could not save member.');
      setRecord(d);
      setForm({
        name: d.title,
        department: d.data.department || '',
        role: d.data.role,
        availability: d.data.availability,
      });
      setNotice('Member details saved.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell active="/team">
      <div
        className={
          'tm-page tm-narrow max-w-360 m-[0_auto] p-[8px_8px_55px] text-[#f6f2fa] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] [&_a]:no-underline max-[640px]:p-[4px_0_35px] max-[640px]:[&_h1]:text-[25px] max-w-207.5'
        }
      >
        <Link
          href="/team"
          className={'tm-back inline-flex items-center gap-1.5 text-[#bd9ef1] text-[13px] mb-4.5'}
        >
          <ArrowLeft size={17} /> Team
        </Link>
        {loading ? (
          <div
            className={
              'tm-panel bg-[#20212a] border border-[#413c49] rounded-[13px] p-6 mb-4.5 max-[640px]:p-4'
            }
          >
            Loading member…
          </div>
        ) : record && form ? (
          <>
            <div
              className={
                'tm-header flex justify-between items-center gap-4.5 mb-5.25 [&_p]:text-[#bdb4c8] [&_p]:text-[13px] [&_p]:leading-normal max-[640px]:items-start max-[640px]:flex-col'
              }
            >
              <div>
                <span className={'tm-kicker text-[11px] font-bold tracking-[.11em] text-[#b592f8]'}>
                  TEAM / {availabilityView ? 'AVAILABILITY' : 'MEMBER'}
                </span>
                <h1>{availabilityView ? 'Availability' : record.title}</h1>
                <p>
                  {record.data.email} ·{' '}
                  {record.status === 'invited'
                    ? 'Staged invitation · No sign-in access'
                    : 'Seeded demo agent'}
                </p>
              </div>
              <span
                className={
                  'tm-avatar large w-9.75 h-9.75 grid place-items-center flex-none rounded-full bg-[#6c4bb3] text-white font-bold [&.large]:w-13.5 [&.large]:h-13.5 [&.large]:text-[21px]'
                }
              >
                {record.title.slice(0, 1)}
              </span>
            </div>
            <div
              className={
                'tm-tabs flex gap-2 border-b border-b-[#4a4153] m-[8px_0_18px] [&_a]:text-[#b5a9c4] [&_a]:text-[13px] [&_a]:p-[12px_16px] [&_a]:border-b-[2px_solid_transparent] [&_a.active]:text-[#e9ddff] [&_a.active]:border-[#a079f5]'
              }
            >
              <Link className={!availabilityView ? 'active' : ''} href={`/team/${id}`}>
                Details
              </Link>
              <Link className={availabilityView ? 'active' : ''} href={`/team/${id}/availability`}>
                Availability
              </Link>
            </div>
            <div
              className={
                'tm-panel bg-[#20212a] border border-[#413c49] rounded-[13px] p-6 mb-4.5 max-[640px]:p-4'
              }
            >
              {!availabilityView ? (
                <>
                  <Field label="Full name">
                    <input
                      maxLength={100}
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </Field>
                  <Field label="Email">
                    <input readOnly value={record.data.email} />
                  </Field>
                  <Field label="Department">
                    <input
                      maxLength={80}
                      value={form.department}
                      onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                    />
                  </Field>
                  <Field label="Planned role">
                    <select
                      value={form.role}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    >
                      <option value="agent">Agent</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </Field>
                  <p className={'tm-footnote text-xs text-[#afa5bb] mt-4.25 leading-normal'}>
                    Changing this planned role does not change the seeded account's actual demo
                    permissions.
                  </p>
                </>
              ) : (
                <>
                  <div
                    className={
                      'tm-section-title flex items-start gap-3 m-[20px_0] [&_svg]:text-[#b794f5] [&_svg]:flex-none [&_p]:text-[#bcb3c5] [&_p]:text-xs [&_p]:m-0'
                    }
                  >
                    <CalendarDays size={22} />
                    <div>
                      <h2>Weekly schedule</h2>
                      <p>
                        Availability here is saved for the team directory. Live routing needs a
                        presence service.
                      </p>
                    </div>
                  </div>
                  <Field label="Time zone">
                    <select
                      value={form.availability.timezone}
                      onChange={(e) => updateAvailability('timezone', e.target.value)}
                    >
                      {['Asia/Kolkata', 'UTC', 'Europe/London', 'America/New_York'].map((zone) => (
                        <option key={zone}>{zone}</option>
                      ))}
                    </select>
                  </Field>
                  <div
                    className={
                      'tm-day-grid grid grid-cols-[repeat(7,1fr)] gap-1.75 [&_label]:flex [&_label]:items-center [&_label]:justify-center [&_label]:gap-1 [&_label]:p-2 [&_label]:bg-[#302b37] [&_label]:border [&_label]:border-[#4e4356] [&_label]:rounded-[7px] [&_label]:text-xs [&_label]:cursor-pointer [&_label.active]:bg-[#523a7a] [&_label.active]:border-[#9b73e3] [&_input]:accent-[#aa8afe] max-[900px]:grid-cols-[repeat(4,1fr)] max-[640px]:grid-cols-[repeat(4,_1fr)]'
                    }
                  >
                    {weekdays.map((day) => (
                      <label
                        key={day}
                        className={form.availability.days.includes(day) ? 'active' : ''}
                      >
                        <input
                          type="checkbox"
                          checked={form.availability.days.includes(day)}
                          onChange={(e) =>
                            updateAvailability(
                              'days',
                              e.target.checked
                                ? [...form.availability.days, day]
                                : form.availability.days.filter((d) => d !== day),
                            )
                          }
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                  <div
                    className={
                      'tm-time-row grid grid-cols-[1fr_1fr] gap-3.25 max-[640px]:grid-cols-1'
                    }
                  >
                    <Field label="Start">
                      <input
                        type="time"
                        value={form.availability.start}
                        onChange={(e) => updateAvailability('start', e.target.value)}
                      />
                    </Field>
                    <Field label="End">
                      <input
                        type="time"
                        value={form.availability.end}
                        onChange={(e) => updateAvailability('end', e.target.value)}
                      />
                    </Field>
                  </div>
                  <label
                    className={
                      'tm-switch flex gap-2.25 items-center text-[13px] m-[18px_0] [&_input]:accent-[#986cf1]'
                    }
                  >
                    <input
                      type="checkbox"
                      checked={form.availability.paused}
                      onChange={(e) => updateAvailability('paused', e.target.checked)}
                    />{' '}
                    Mark unavailable
                  </label>
                </>
              )}
              {error && (
                <div
                  className={
                    'tm-error bg-[#502d3d] text-[#ffc2cf] border border-[#86506a] rounded-lg p-[10px_12px] m-[13px_0] text-xs'
                  }
                  role="alert"
                >
                  {error}
                </div>
              )}
              {notice && (
                <div
                  className={
                    'tm-success bg-[#502d3d] text-[#ffc2cf] border border-[#86506a] rounded-lg p-[10px_12px] m-[13px_0] text-xs flex gap-2 items-center bg-[#214a3e] text-[#a5e9ca] border-[#3b816b]'
                  }
                  role="status"
                >
                  <Check size={16} />
                  {notice}
                </div>
              )}
              <div
                className={
                  'tm-actions flex justify-end gap-2.75 flex-wrap mt-6.25 max-[640px]:[&>*]:flex-1'
                }
              >
                <button
                  className={
                    'tm-primary inline-flex justify-center items-center gap-1.75 bg-[#8057e8] border border-[#9b75f0] text-white! rounded-[9px] p-[10px_15px] text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#956df3]'
                  }
                  disabled={busy || !form.name.trim()}
                  onClick={save}
                >
                  {busy ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            className={
              'tm-error bg-[#502d3d] text-[#ffc2cf] border border-[#86506a] rounded-lg p-[10px_12px] m-[13px_0] text-xs'
            }
            role="alert"
          >
            {error || 'Member not found.'}
          </div>
        )}
      </div>
    </Shell>
  );
}
