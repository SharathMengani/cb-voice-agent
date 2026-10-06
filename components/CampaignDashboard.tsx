'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Megaphone,
  Pause,
  Phone,
  Play,
  StopCircle,
  Users,
} from 'lucide-react';
import { apiFetch } from './api-client';

export default function CampaignDashboard({ view, records, selected, onSelect, onUpdate }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const campaign =
    view === 'campaign-results'
      ? records.find((row) => row.status === 'completed' && row._id === selected?._id) ||
        records.find((row) => row.status === 'completed') ||
        selected
      : selected || records[0];
  const stats = campaign?.data?.stats || {};
  const contacts = String(campaign?.data?.screen_45?.['Contacts (one phone per line)'] || '')
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const total = stats.eligible ?? contacts.length;
  async function control(action) {
    if (!campaign) return;
    setBusy(true);
    setMessage('');
    try {
      let response;
      if (action === 'run')
        response = await apiFetch(`/api/demo/campaigns/${campaign._id}/run`, { method: 'POST' });
      else
        response = await apiFetch(`/api/records/campaign/${campaign._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: action === 'pause' ? 'paused' : 'completed' }),
        });
      const result = await response.json();
      if (!response.ok) throw Error(result.error);
      setMessage(
        action === 'run'
          ? 'Demo dialing simulation started. No numbers are called.'
          : action === 'pause'
            ? 'Demo campaign paused.'
            : 'Demo campaign stopped.',
      );
      await onUpdate();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }
  function download() {
    const lines = [
      'phone,demo_outcome',
      ...contacts.map(
        (phone, i) =>
          `${phone},${i < Number(stats.connected || 0) ? 'simulated_connected' : i < Number(stats.initiated || 0) ? 'simulated_attempt' : 'not_attempted'}`,
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatbucket-demo-campaign-results.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div
      className={
        'campaign-live max-w-377.5 m-[0_auto] text-[#f5f4fe] [&_h1]:text-[27px] [&_h1]:tracking-[-.03em] [&_h1]:m-[0_0_4px]'
      }
    >
      <Link
        href="/campaigns"
        className={
          'back-campaign inline-flex items-center gap-1.75 text-[#bfbcd1] no-underline text-xs mb-3'
        }
      >
        <ArrowLeft size={16} /> Back to campaigns
      </Link>
      <div
        className={
          'campaign-live-title flex items-center gap-4 flex-wrap mb-5.5 [&>div:first-child]:flex-1 [&_p]:text-[#b1b4c4] [&_p]:m-0 [&_p]:text-[13px]'
        }
      >
        <div>
          <h1>
            {view === 'campaign-results'
              ? 'Campaign results and call outcomes'
              : campaign?.title || 'Campaign monitoring'}
          </h1>
          <p>
            {view === 'campaign-results'
              ? 'Overview of simulated outcomes for your campaign.'
              : 'Live campaign monitoring · simulated dialing and performance.'}
          </p>
        </div>
        <span
          className={`status inline-flex rounded-[25px] p-[7px_12px] text-[13px] [&.ready]:text-[#5de5b8] [&.ready]:bg-[#133b32] [&.ready]:border [&.ready]:border-[#215544] [&.draft]:text-[#ffd17d] [&.draft]:bg-[#4a351a] [&.draft]:border [&.draft]:border-[#765020]${campaign?.status === 'running' || campaign?.status === 'completed' ? 'ready' : 'draft'}`}
        >
          ● {campaign?.status || 'Not started'}
        </span>
        {view === 'campaign-monitoring' && (
          <div
            className={
              'campaign-actions flex gap-2 [&_button]:bg-[#4d3484] [&_button]:border [&_button]:border-[#9763fb] [&_button]:rounded-lg [&_button]:text-white [&_button]:p-[11px_15px] [&_button]:cursor-pointer [&_button]:flex [&_button]:gap-1.75 [&_button]:items-center [&_button]:[font:inherit] [&_button]:text-xs [&_button.stop]:border-[#e84772] [&_button.stop]:bg-[#582a3e] [&_button:disabled]:opacity-[.45] [&_button:disabled]:cursor-not-allowed'
            }
          >
            {campaign?.status === 'running' ? (
              <button onClick={() => control('pause')} disabled={busy}>
                <Pause size={17} /> Pause campaign
              </button>
            ) : (
              <button onClick={() => control('run')} disabled={busy || !campaign}>
                <Play size={17} /> {campaign?.status === 'paused' ? 'Resume' : 'Run demo'}
              </button>
            )}
            <button
              className={'stop'}
              disabled={busy || !['running', 'paused'].includes(campaign?.status)}
              onClick={() => control('stop')}
            >
              <StopCircle size={17} /> Stop
            </button>
          </div>
        )}
      </div>
      {message && (
        <p
          className={
            'campaign-message p-[11px_14px] text-[#b5ffd7] border border-[#296b51] rounded-lg text-xs'
          }
          role="status"
        >
          {message}
        </p>
      )}
      <div
        className={
          'campaign-live-metrics grid grid-cols-[repeat(5,1fr)] gap-2.5 mb-4.5 [&_article]:border [&_article]:border-[#34404a] [&_article]:rounded-[10px] [&_article]:bg-[#15212a] [&_article]:p-4.25 [&_article]:flex [&_article]:items-center [&_article]:gap-3 [&_article]:min-w-0 [&_svg]:text-[#a977ff] [&_svg]:shrink-0 [&_article_span]:text-[#c8d0df] [&_article_span]:text-xs [&_article_strong]:block [&_article_strong]:text-[26px] [&_article_strong]:text-white [&_article_small]:text-[10px] [&_article_small]:text-[#8ea7b2] max-[850px]:grid-cols-[repeat(2,1fr)]'
        }
      >
        {(view === 'campaign-monitoring'
          ? [
              ['Eligible', total, Users],
              ['Attempted', stats.initiated || 0, Phone],
              ['Connected', stats.connected || 0, CheckCircle2],
              ['Completed', stats.completed || 0, CheckCircle2],
              ['Queued', stats.queued ?? total, Clock3],
            ]
          : [
              ['Contacts', total, Users],
              ['Attempted', stats.initiated || 0, Phone],
              ['Answered', stats.connected || 0, CheckCircle2],
              ['Completed', stats.completed || 0, CheckCircle2],
              ['Remaining', stats.queued || 0, Clock3],
            ]
        ).map(([label, value, Icon]) => (
          <article key={label}>
            <Icon size={21} />
            <span>
              {label}
              <strong>{value}</strong>
              <small>{view === 'campaign-results' ? 'Recorded in demo' : 'Simulation only'}</small>
            </span>
          </article>
        ))}
      </div>
      <div
        className={
          'campaign-live-grid grid grid-cols-[1fr_1fr_.87fr] gap-2.75 mb-3.75 max-[1250px]:grid-cols-[1fr_1fr] max-[1250px]:[&>section:last-child]:col-span-full max-[850px]:grid-cols-1 max-[850px]:[&>section:last-child]:col-auto'
        }
      >
        <section
          className={
            'campaign-live-card border border-[#34404a] rounded-[10px] bg-[#15212a] p-4.25 [&_h2]:text-[17px] [&_h2]:m-[0_0_6px] [&>p]:text-[#a9bbc4] [&>p]:text-xs [&>p]:m-[0_0_20px]'
          }
        >
          <h2>{view === 'campaign-results' ? 'Answered call breakdown' : 'Progress'}</h2>
          <p>
            {view === 'campaign-results'
              ? 'Campaign contact outcomes'
              : 'Outbound calling progress · eligible contacts'}
          </p>
          <strong
            className={
              'progress-heading block text-[19px] mb-3.25 [&_small]:float-right [&_small]:font-normal [&_small]:text-[11px] [&_small]:text-[#b5c2ca]'
            }
          >
            {stats.initiated || 0} of {total}{' '}
            <small>
              {total ? Math.round((Number(stats.initiated || 0) / total) * 100) : 0}% initiated
            </small>
          </strong>
          <div
            className={
              'campaign-progress h-3 bg-[#293744] rounded-[15px] overflow-hidden [&_span]:block [&_span]:h-full [&_span]:bg-[linear-gradient(90deg,#8e50ff,#5f3be3)] [&_span]:rounded-[15px]'
            }
          >
            <span
              style={{
                width: `${total ? Math.min(100, (Number(stats.initiated || 0) / total) * 100) : 0}%`,
              }}
            />
          </div>
          <div
            className={
              'progress-breakdown flex justify-between gap-2 text-[#b8bfce] text-[11px] mt-5.5'
            }
          >
            <span>● {stats.connected || 0} connected</span>
            <span>● {stats.completed || 0} completed</span>
            <span>● {stats.queued ?? total} queued</span>
          </div>
        </section>
        <section
          className={
            'campaign-live-card border border-[#34404a] rounded-[10px] bg-[#15212a] p-4.25 [&_h2]:text-[17px] [&_h2]:m-[0_0_6px] [&>p]:text-[#a9bbc4] [&>p]:text-xs [&>p]:m-[0_0_20px]'
          }
        >
          <h2>Connected calls · sample chart</h2>
          <div
            className={
              'campaign-bars h-32 flex items-end gap-1.25 border-b border-b-[#47505c] [&_span]:flex-1 [&_span]:bg-[linear-gradient(#9762fd,#5630c9)] [&_span]:rounded-[4px_4px_0_0]'
            }
          >
            {[2, 3, 1, 5, 7, 5, 4, 8, 6, 3].map((v, i) => (
              <span key={i} style={{ height: `${Math.max(7, v * 9)}%` }} />
            ))}
          </div>
          <div className={'chart-axis text-[10px] text-[#9a9dac] flex justify-between mt-2.25'}>
            <span>9 AM</span>
            <span>11 AM</span>
            <span>1 PM</span>
            <span>3 PM</span>
            <span>5 PM</span>
          </div>
        </section>
        <section
          className={
            'campaign-live-card border border-[#34404a] rounded-[10px] bg-[#15212a] p-4.25 [&_h2]:text-[17px] [&_h2]:m-[0_0_6px] [&>p]:text-[#a9bbc4] [&>p]:text-xs [&>p]:m-[0_0_20px]'
          }
        >
          <h2>Campaign details</h2>
          {[
            ['Campaign', campaign?.title],
            ['Agent', campaign?.data?.screen_44?.['Voice agent'] || 'Sales Concierge'],
            ['Start', campaign?.data?.screen_47?.['Start date and time'] || '—'],
            [
              'Caller number',
              campaign?.data?.screen_46?.['Verified caller number'] || 'Demo number',
            ],
          ].map(([label, value]) => (
            <div
              className={
                'detail-line flex justify-between gap-4 p-[12px_0] border-t border-t-[#42414a] text-xs [&_span]:text-[#b6b7c6] [&_strong]:max-w-[60%] [&_strong]:font-medium [&_strong]:text-right'
              }
              key={label}
            >
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
          <p
            className={'campaign-warning text-[#ffcc87]! border border-[#665238] rounded-lg p-2.25'}
          >
            This preview does not dial a phone or use provider credits.
          </p>
        </section>
      </div>
      <section
        className={
          'campaign-live-card campaign-contacts border border-[#34404a] rounded-[10px] bg-[#15212a] p-4.25 [&_h2]:text-[17px] [&_h2]:m-[0_0_6px] [&>p]:text-[#a9bbc4] [&>p]:text-xs [&>p]:m-[0_0_20px] p-0 overflow-hidden [&_.list-head]:p-4.5'
        }
      >
        <div
          className={
            'list-head flex justify-between gap-3.75 items-center mb-5 [&_h2]:text-[19px] [&_h2]:m-[0_0_5px]'
          }
        >
          <div>
            <h2>{view === 'campaign-results' ? 'Call outcomes' : 'Contact queue'}</h2>
            <p className={'muted text-(--muted) m-0 leading-normal'}>
              Synthetic records from the entered campaign contacts.
            </p>
          </div>
          <button
            className={
              'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
            }
            onClick={download}
          >
            <Download size={16} /> Export demo CSV
          </button>
        </div>
        <div
          className={
            'campaign-contact-head grid grid-cols-[1fr_1.1fr_1fr_1fr] gap-2.5 p-[11px_18px] items-center border-t border-t-[#334450] text-xs bg-[#1c2a34] text-[#aebcc8] max-[850px]:grid-cols-[1fr_1fr]'
          }
        >
          <b>Contact</b>
          <b>Phone number</b>
          <b>Demo status</b>
          <b>Action</b>
        </div>
        {contacts.slice(0, 12).map((phone, i) => (
          <div
            className={
              'campaign-contact grid grid-cols-[1fr_1.1fr_1fr_1fr] gap-2.5 p-[11px_18px] items-center border-t border-t-[#334450] text-xs [&>.mini-avatar]:w-7.5 [&>.mini-avatar]:h-7.5 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.25 [&_a]:text-[#ba9dff] [&_a]:no-underline [&_.status]:text-[10px] [&_.status]:w-max max-[850px]:grid-cols-[1fr_1fr]'
            }
            key={`${phone}-${i}`}
          >
            <span
              className={
                'mini-avatar grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
              }
            >
              {i + 1}
            </span>
            <span>{phone.replace(/(\d{2})\d{4}(\d{4})$/, '$1••••$2')}</span>
            <span
              className={
                'status ready inline-flex rounded-[25px] p-[7px_12px] text-[13px] [&.ready]:text-[#5de5b8] [&.ready]:bg-[#133b32] [&.ready]:border [&.ready]:border-[#215544] [&.draft]:text-[#ffd17d] [&.draft]:bg-[#4a351a] [&.draft]:border [&.draft]:border-[#765020]'
              }
            >
              {i < Number(stats.connected || 0)
                ? 'Simulated connected'
                : i < Number(stats.initiated || 0)
                  ? 'Simulated attempt'
                  : 'Queued'}
            </span>
            <Link href="/agent/outbound-handoff">
              Review handoff <ArrowRight size={14} />
            </Link>
          </div>
        ))}
        {!contacts.length && (
          <p className={'muted text-(--muted) m-0 leading-normal'}>
            No contact rows stored. Set them up on screen 45.
          </p>
        )}
      </section>
      <div
        className={
          'campaign-end-links flex justify-between p-[18px_0] [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1.75 [&_a]:text-[#bb9af5] [&_a]:no-underline [&_a]:text-xs'
        }
      >
        <Link href="/campaigns">All campaigns</Link>
        <Link
          href={view === 'campaign-monitoring' ? '/campaigns/results' : '/campaigns/monitoring'}
        >
          {view === 'campaign-monitoring' ? 'View outcomes' : 'View live monitoring'}{' '}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
