'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Phone,
  PhoneIncoming,
  Search,
  ShieldCheck,
} from 'lucide-react';
import Shell from './Shell';
import { apiFetch } from './api-client';
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function Field({ label, children }) {
  return (
    <label
      className={
        'nm-field flex flex-col gap-2 text-[#e7dfed] text-[13px] font-[650] m-[19px_0] [&_input]:w-full [&_input]:min-w-0 [&_input]:bg-[#2d2a35] [&_input]:border [&_input]:border-[#594e60] [&_input]:rounded-[9px] [&_input]:text-white [&_input]:p-2.75 [&_input]:outline-0 [&_select]:w-full [&_select]:min-w-0 [&_select]:bg-[#2d2a35] [&_select]:border [&_select]:border-[#594e60] [&_select]:rounded-[9px] [&_select]:text-white [&_select]:p-2.75 [&_select]:outline-0 [&_input:focus]:border-[#ac83fb] [&_select:focus]:border-[#ac83fb]'
      }
    >
      {label}
      {children}
    </label>
  );
}
export function NumberCatalog() {
  const [items, setItems] = useState([]),
    [owned, setOwned] = useState([]),
    [region, setRegion] = useState('All'),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    Promise.all(['/api/numbers/catalog', '/api/numbers'].map((url) => apiFetch(url)))
      .then(async (responses) => {
        const data = await Promise.all(responses.map((r) => r.json()));
        responses.forEach((r, i) => {
          if (!r.ok) throw Error(data[i].error || 'Could not load numbers.');
        });
        if (alive) {
          setItems(data[0]);
          setOwned(data[1]);
        }
      })
      .catch((e) => {
        if (alive) setError(e.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  return (
    <Shell active="/numbers">
      <div
        className={
          'nm-page max-w-360 m-[0_auto] p-[8px_8px_55px] text-[#f6f2fa] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] [&_a]:no-underline max-[640px]:p-[4px_0_35px] max-[640px]:[&_h1]:text-[25px]'
        }
      >
        <div
          className={
            'nm-header flex justify-between items-center gap-4.5 mb-5.25 [&_p]:text-[#bdb4c8] [&_p]:text-[13px] [&_p]:leading-normal max-[640px]:items-start max-[640px]:flex-col'
          }
        >
          <div>
            <span className={'nm-kicker text-[11px] font-bold tracking-[.11em] text-[#b592f8]'}>
              INVENTORY / PHONE NUMBERS
            </span>
            <h1>Phone numbers</h1>
            <p>Choose a demo number, then prepare its voice agent and working hours.</p>
          </div>
          <span
            className={'nm-tag text-[11px] rounded-[50px] p-[8px_11px] text-[#f3d4a4] bg-[#60462c]'}
          >
            DEMO CATALOG
          </span>
        </div>
        {owned.length > 0 && (
          <section
            className={
              'nm-panel bg-[#20212a] border border-[#413c49] rounded-[13px] p-6 mb-4.5 max-[640px]:p-4'
            }
          >
            <h2>Your demo reservations</h2>
            <div
              className={
                'nm-reservations grid grid-cols-[repeat(2,1fr)] gap-2.5 [&_a]:flex [&_a]:gap-2.5 [&_a]:items-center [&_a]:p-3.25 [&_a]:bg-[#302a3a] [&_a]:border [&_a]:border-[#554764] [&_a]:rounded-lg [&_a]:text-white [&_a>span]:flex-1 [&_strong]:block [&_small]:block [&_small]:text-[#bcb1c4] [&_small]:text-[11px] [&_small]:mt-1 max-[640px]:grid-cols-1'
              }
            >
              {owned.map((n) => (
                <Link key={n._id} href={`/numbers/${n._id}`}>
                  <Phone size={18} />
                  <span>
                    <strong>{n.title}</strong>
                    <small>{n.data.region} · Routing draft</small>
                  </span>
                  <ArrowRight size={17} />
                </Link>
              ))}
            </div>
          </section>
        )}
        <div
          className={
            'nm-section flex justify-between items-center gap-4.5 mb-5.25 [&_p]:text-[#bdb4c8] [&_p]:text-[13px] [&_p]:leading-normal [&_p]:m-0 max-[640px]:items-start max-[640px]:flex-col'
          }
        >
          <div>
            <h2>Browse available numbers</h2>
            <p>Masked examples only. These numbers are not dialable or assigned by a carrier.</p>
          </div>
          <div
            className={
              'nm-filter flex items-center gap-1.75 text-[#b49cdf] [&_select]:bg-[#2d2b34] [&_select]:text-white [&_select]:border [&_select]:border-[#554b60] [&_select]:p-2.25 [&_select]:rounded-lg'
            }
          >
            <MapPin size={17} />
            <select
              aria-label="Filter by city"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {['All', ...new Set(items.map((i) => i.region))].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        {error && (
          <div
            className={
              'nm-error bg-[#502d3d] text-[#ffc2cf] border border-[#86506a] rounded-lg p-[10px_12px] m-[13px_0] text-xs'
            }
            role="alert"
          >
            {error}
          </div>
        )}
        {loading ? (
          <div
            className={
              'nm-panel bg-[#20212a] border border-[#413c49] rounded-[13px] p-6 mb-4.5 max-[640px]:p-4'
            }
          >
            Loading catalog…
          </div>
        ) : (
          <div
            className={
              'nm-grid grid grid-cols-3 gap-3.25 max-[900px]:grid-cols-[repeat(2,1fr)] max-[640px]:grid-cols-1'
            }
          >
            {items
              .filter((item) => region === 'All' || item.region === region)
              .map((item) => (
                <div
                  className={
                    'nm-card bg-[#20212a] border border-[#413c49] rounded-[13px] p-5.25 [&_strong]:block [&_small]:block [&_strong]:text-[17px] [&_small]:text-xs [&_small]:text-[#b9aec5] [&_small]:mt-1.75 max-[640px]:p-3.75'
                  }
                  key={item.id}
                >
                  <div
                    className={
                      'nm-card-icon w-11.25 h-11.25 grid place-items-center rounded-[11px] bg-[#443260] text-[#ccadfa] mb-3.75'
                    }
                  >
                    <PhoneIncoming size={23} />
                  </div>
                  <strong>{item.display}</strong>
                  <small>
                    {item.region} · Area code {item.area}
                  </small>
                  <div
                    className={
                      'nm-card-bottom flex items-center justify-between gap-2 mt-6 [&>span]:text-[11px] [&>span]:text-[#93e1c3] [&>span.held]:text-[#dba9a9]'
                    }
                  >
                    <span className={item.available ? 'free' : 'held'}>
                      {item.available ? 'Available in demo' : 'Reserved'}
                    </span>
                    {item.available ? (
                      <Link
                        href={`/numbers/review/${item.id}`}
                        className={
                          'nm-secondary inline-flex justify-center items-center gap-1.75 bg-[#8057e8] border border-[#9b75f0] text-white! rounded-[9px] p-[10px_15px] text-[13px] font-bold whitespace-nowrap bg-[#2c2935] border-[#584d62] text-[#eee7f7]! [&:hover]:bg-[#3c3248]'
                        }
                      >
                        Review <ArrowRight size={15} />
                      </Link>
                    ) : (
                      <span className={'nm-muted text-[#aaa1b3]!'}>Unavailable</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
        <p className={'nm-footnote text-xs text-[#afa5bb] mt-4.25 leading-normal'}>
          No checkout, fee, KYC, telecom allocation, inbound routing, or payment occurs here. A
          provider must supply live inventory and pricing.
        </p>
      </div>
    </Shell>
  );
}
export function NumberReview({ catalogId }) {
  const router = useRouter(),
    [item, setItem] = useState(null),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    apiFetch('/api/numbers/catalog')
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw Error(data.error || 'Could not load catalog.');
        if (alive) setItem(data.find((i) => i.id === catalogId) || null);
      })
      .catch((e) => {
        if (alive) setError(e.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [catalogId]);
  async function reserve() {
    setBusy(true);
    setError('');
    try {
      const r = await apiFetch('/api/numbers/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catalogId }),
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error || 'Could not reserve demo number.');
      router.push(`/numbers/${data._id}`);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }
  return (
    <Shell active="/numbers">
      <div
        className={
          'nm-page nm-narrow max-w-360 m-[0_auto] p-[8px_8px_55px] text-[#f6f2fa] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] [&_a]:no-underline max-[640px]:p-[4px_0_35px] max-[640px]:[&_h1]:text-[25px] max-w-207.5'
        }
      >
        <Link
          href="/numbers"
          className={'nm-back inline-flex items-center gap-1.5 text-[#bd9ef1] text-[13px] mb-4.5'}
        >
          <ArrowLeft size={16} /> Phone numbers
        </Link>
        <span className={'nm-kicker text-[11px] font-bold tracking-[.11em] text-[#b592f8]'}>
          NUMBER / REVIEW
        </span>
        <h1>Review demo reservation</h1>
        {loading ? (
          <div
            className={
              'nm-panel bg-[#20212a] border border-[#413c49] rounded-[13px] p-6 mb-4.5 max-[640px]:p-4'
            }
          >
            Loading number…
          </div>
        ) : item ? (
          <div
            className={
              'nm-panel nm-checkout bg-[#20212a] border border-[#413c49] rounded-[13px] p-6 mb-4.5 max-[640px]:p-4 [&_h2]:text-[24px] [&>p]:text-[#b8afc6]'
            }
          >
            <span
              className={
                'nm-card-icon w-11.25 h-11.25 grid place-items-center rounded-[11px] bg-[#443260] text-[#ccadfa] mb-3.75'
              }
            >
              <Phone size={24} />
            </span>
            <h2>{item.display}</h2>
            <p>
              {item.region}, India · Area code {item.area}
            </p>
            <div
              className={
                'nm-review-row flex justify-between gap-3 p-[13px_0] border-b border-b-[#4a4250] text-[13px] [&_span]:text-[#bcb4c7]'
              }
            >
              <span>Reservation</span>
              <strong>Demo record only</strong>
            </div>
            <div
              className={
                'nm-review-row flex justify-between gap-3 p-[13px_0] border-b border-b-[#4a4250] text-[13px] [&_span]:text-[#bcb4c7]'
              }
            >
              <span>Payment</span>
              <strong>None</strong>
            </div>
            <div
              className={
                'nm-review-row flex justify-between gap-3 p-[13px_0] border-b border-b-[#4a4250] text-[13px] [&_span]:text-[#bcb4c7]'
              }
            >
              <span>Live inbound calls</span>
              <strong>Unavailable</strong>
            </div>
            <div
              className={
                'nm-warning flex gap-2.75 items-start bg-[#463a2c] border border-[#846a46] rounded-[9px] p-3 mt-5 text-[#f3d7a9] [&_svg]:flex-none [&_p]:text-xs [&_p]:leading-normal [&_p]:m-0'
              }
            >
              <ShieldCheck size={19} />
              <p>
                Confirm creates a reservation in this demo workspace. It does not buy, activate, or
                lease a real phone number.
              </p>
            </div>
            {error && (
              <div
                className={
                  'nm-error bg-[#502d3d] text-[#ffc2cf] border border-[#86506a] rounded-lg p-[10px_12px] m-[13px_0] text-xs'
                }
                role="alert"
              >
                {error}
              </div>
            )}
            <div
              className={
                'nm-actions flex justify-end gap-2.75 flex-wrap mt-6.25 max-[640px]:*:flex-1'
              }
            >
              <Link
                href="/numbers"
                className={
                  'nm-secondary inline-flex justify-center items-center gap-1.75 bg-[#8057e8] border border-[#9b75f0] text-white! rounded-[9px] p-[10px_15px] text-[13px] font-bold whitespace-nowrap bg-[#2c2935] border-[#584d62] text-[#eee7f7]! [&:hover]:bg-[#3c3248]'
                }
              >
                Back to catalog
              </Link>
              <button
                className={
                  'nm-primary inline-flex justify-center items-center gap-1.75 bg-[#8057e8] border border-[#9b75f0] text-white! rounded-[9px] p-[10px_15px] text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#956df3]'
                }
                onClick={reserve}
                disabled={busy || !item.available}
              >
                {busy ? 'Reserving…' : item.available ? 'Reserve demo number' : 'Already reserved'}{' '}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div
            className={
              'nm-error bg-[#502d3d] text-[#ffc2cf] border border-[#86506a] rounded-lg p-[10px_12px] m-[13px_0] text-xs'
            }
          >
            {error || 'Number not found.'}
          </div>
        )}
      </div>
    </Shell>
  );
}
export function NumberRouting({ id }) {
  const [record, setRecord] = useState(null),
    [form, setForm] = useState(null),
    [agents, setAgents] = useState([]),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState('');
  useEffect(() => {
    let alive = true;
    Promise.all([apiFetch(`/api/numbers/${id}`), apiFetch('/api/voice-agents')])
      .then(async ([a, b]) => {
        const [number, agents] = await Promise.all([a.json(), b.json()]);
        if (!a.ok) throw Error(number.error || 'Could not load number.');
        if (!b.ok) throw Error(agents.error || 'Could not load agents.');
        if (alive) {
          setRecord(number);
          setForm(number.data.routing);
          setAgents(agents);
        }
      })
      .catch((e) => {
        if (alive) setError(e.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);
  function change(key, value) {
    setForm((old) => ({ ...old, [key]: value }));
    setNotice('');
  }
  async function save() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const r = await apiFetch(`/api/numbers/${id}/routing`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revision: record.data.revision, routing: form }),
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error || 'Could not save routing.');
      setRecord(data);
      setForm(data.data.routing);
      setNotice('Routing draft saved. This number is not live.');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell active="/numbers">
      <div
        className={
          'nm-page nm-narrow max-w-360 m-[0_auto] p-[8px_8px_55px] text-[#f6f2fa] **:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] [&_a]:no-underline max-[640px]:p-[4px_0_35px] max-[640px]:[&_h1]:text-[25px] max-w-207.5'
        }
      >
        <Link
          href="/numbers"
          className={'nm-back inline-flex items-center gap-1.5 text-[#bd9ef1] text-[13px] mb-4.5'}
        >
          <ArrowLeft size={16} /> Phone numbers
        </Link>
        {loading ? (
          <div
            className={
              'nm-panel bg-[#20212a] border border-[#413c49] rounded-[13px] p-6 mb-4.5 max-[640px]:p-4'
            }
          >
            Loading routing…
          </div>
        ) : record && form ? (
          <>
            <div
              className={
                'nm-header flex justify-between items-center gap-4.5 mb-5.25 [&_p]:text-[#bdb4c8] [&_p]:text-[13px] [&_p]:leading-normal max-[640px]:items-start max-[640px]:flex-col'
              }
            >
              <div>
                <span className={'nm-kicker text-[11px] font-bold tracking-[.11em] text-[#b592f8]'}>
                  DEMO NUMBER / ROUTING DRAFT
                </span>
                <h1>{record.title}</h1>
                <p>{record.data.region} · Reserved in this demo workspace</p>
              </div>
              <span
                className={
                  'nm-tag text-[11px] rounded-[50px] p-[8px_11px] text-[#f3d4a4] bg-[#60462c]'
                }
              >
                NOT ACTIVE
              </span>
            </div>
            <div
              className={
                'nm-panel nm-routing bg-[#20212a] border border-[#413c49] rounded-[13px] p-6 mb-4.5 max-[640px]:p-4 [&_.nm-section-title:not(:first-child)]:border-t [&_.nm-section-title:not(:first-child)]:border-t-[#494152] [&_.nm-section-title:not(:first-child)]:pt-5 [&_.nm-section-title_h2]:m-[0_0_6px]'
              }
            >
              <div
                className={
                  'nm-section-title flex items-start gap-3 m-[20px_0] [&_svg]:text-[#b794f5] [&_svg]:flex-none [&_p]:text-[#bcb3c5] [&_p]:text-xs [&_p]:m-0'
                }
              >
                <PhoneIncoming size={22} />
                <div>
                  <h2>Incoming calls</h2>
                  <p>Set which ready voice agent would answer when a provider is connected.</p>
                </div>
              </div>
              <Field label="Voice agent">
                <select
                  value={form.agentId || ''}
                  onChange={(e) => change('agentId', e.target.value)}
                >
                  <option value="">Choose an agent</option>
                  {agents
                    .filter((a) => a.status === 'ready')
                    .map((a) => (
                      <option value={a._id} key={a._id}>
                        {a.name}
                      </option>
                    ))}
                </select>
              </Field>
              <div
                className={
                  'nm-section-title flex items-start gap-3 m-[20px_0] [&_svg]:text-[#b794f5] [&_svg]:flex-none [&_p]:text-[#bcb3c5] [&_p]:text-xs [&_p]:m-0'
                }
              >
                <Clock3 size={22} />
                <div>
                  <h2>Working hours</h2>
                  <p>The voice agent should only be routed during these hours.</p>
                </div>
              </div>
              <Field label="Time zone">
                <select value={form.timezone} onChange={(e) => change('timezone', e.target.value)}>
                  {['Asia/Kolkata', 'UTC', 'Europe/London', 'America/New_York'].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <div
                className={
                  'nm-days grid grid-cols-[repeat(7,1fr)] gap-1.75 [&_label]:flex [&_label]:items-center [&_label]:justify-center [&_label]:gap-1 [&_label]:p-2 [&_label]:bg-[#302b37] [&_label]:border [&_label]:border-[#4e4356] [&_label]:rounded-[7px] [&_label]:text-xs [&_label]:cursor-pointer [&_label.active]:bg-[#523a7a] [&_label.active]:border-[#9b73e3] [&_input]:accent-[#aa8afe] max-[900px]:grid-cols-[repeat(4,1fr)] max-[640px]:grid-cols-[repeat(4,1fr)]'
                }
              >
                {weekdays.map((day) => (
                  <label className={form.days.includes(day) ? 'active' : ''} key={day}>
                    <input
                      type="checkbox"
                      checked={form.days.includes(day)}
                      onChange={(e) =>
                        change(
                          'days',
                          e.target.checked
                            ? [...form.days, day]
                            : form.days.filter((d) => d !== day),
                        )
                      }
                    />
                    {day}
                  </label>
                ))}
              </div>
              <div
                className={'nm-time-row grid grid-cols-[1fr_1fr] gap-3.25 max-[640px]:grid-cols-1'}
              >
                <Field label="Start">
                  <input
                    type="time"
                    value={form.start}
                    onChange={(e) => change('start', e.target.value)}
                  />
                </Field>
                <Field label="Stop">
                  <input
                    type="time"
                    value={form.end}
                    onChange={(e) => change('end', e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Outside working hours">
                <select
                  value={form.afterHours}
                  onChange={(e) => change('afterHours', e.target.value)}
                >
                  <option value="callback">Offer a callback</option>
                  <option value="end">End politely</option>
                </select>
              </Field>
              {error && (
                <div
                  className={
                    'nm-error bg-[#502d3d] text-[#ffc2cf] border border-[#86506a] rounded-lg p-[10px_12px] m-[13px_0] text-xs'
                  }
                  role="alert"
                >
                  {error}
                </div>
              )}
              {notice && (
                <div
                  className={
                    'nm-success bg-[#502d3d] text-[#ffc2cf] border border-[#86506a] rounded-lg p-[10px_12px] m-[13px_0] text-xs flex gap-2 items-center bg-[#214a3e] text-[#a5e9ca] border-[#3b816b]'
                  }
                  role="status"
                >
                  <Check size={16} />
                  {notice}
                </div>
              )}
              <div
                className={
                  'nm-actions flex justify-end gap-2.75 flex-wrap mt-6.25 max-[640px]:*:flex-1'
                }
              >
                <button
                  className={
                    'nm-primary inline-flex justify-center items-center gap-1.75 bg-[#8057e8] border border-[#9b75f0] text-white! rounded-[9px] p-[10px_15px] text-[13px] font-bold whitespace-nowrap [&:hover]:bg-[#956df3]'
                  }
                  disabled={busy}
                  onClick={save}
                >
                  {busy ? 'Saving…' : 'Save routing draft'}
                </button>
              </div>
            </div>
            <div
              className={
                'nm-warning flex gap-2.75 items-start bg-[#463a2c] border border-[#846a46] rounded-[9px] p-3 mt-5 text-[#f3d7a9] [&_svg]:flex-none [&_p]:text-xs [&_p]:leading-normal [&_p]:m-0'
              }
            >
              <ShieldCheck size={19} />
              <p>
                For live calls, connect a telephony provider, verify number ownership, configure
                carrier forwarding, and test concurrency and failover.{' '}
                <Link href="/routing/new" className={'nm-inline-link text-[#ffe2aa] underline!'}>
                  Plan an inbound route →
                </Link>
              </p>
            </div>
          </>
        ) : (
          <div
            className={
              'nm-error bg-[#502d3d] text-[#ffc2cf] border border-[#86506a] rounded-lg p-[10px_12px] m-[13px_0] text-xs'
            }
          >
            {error || 'Number not found.'}
          </div>
        )}
      </div>
    </Shell>
  );
}
