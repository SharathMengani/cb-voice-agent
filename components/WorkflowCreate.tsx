'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, GitBranch, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import Shell from './Shell';
import { apiFetch } from './api-client';
export default function WorkflowCreate() {
  const router = useRouter(),
    [name, setName] = useState(''),
    [trigger, setTrigger] = useState('inbound'),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  async function create(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await apiFetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, trigger }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || 'Could not create workflow.');
      router.push(`/workflows/${data._id}`);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }
  return (
    <Shell active="/workflows">
      <div
        className={
          'wf-page wf-narrow max-w-400 m-[0_auto] text-[#f7f4fe] p-[8px_8px_55px] [&_*]:box-border [&_h1]:text-3xl [&_h1]:tracking-[-.03em] [&_h1]:m-[6px_0] [&_h2]:text-[19px] [&_h2]:m-[0_0_9px] [&_p]:leading-normal [&_button]:[font:inherit] [&_input]:[font:inherit] [&_select]:[font:inherit] [&_textarea]:[font:inherit] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] [&_a]:no-underline max-[580px]:p-[4px_0_35px] max-[580px]:[&_h1]:text-[25px] max-w-212.5'
        }
      >
        <Link
          href="/workflows"
          className={'wf-back inline-flex items-center gap-1.75 text-[#baa6e6] text-[13px] mb-4'}
        >
          <ArrowLeft size={17} /> All workflows
        </Link>
        <p
          className={
            'wf-eyebrow text-[11px] font-bold tracking-[.11em] text-[#a88ff5] m-0 uppercase'
          }
        >
          STEP 1 / CREATE
        </p>
        <h1>New workflow</h1>
        <p className={'wf-subtitle text-[#bcb6cb]'}>
          Start with a simple call path. Add decisions and more conversation steps on the canvas.
        </p>
        <form
          className={
            'wf-panel wf-create [&>p]:text-[#bcb6cb] border border-[#3d3948] bg-[#1f2029] rounded-[14px] p-5.5 min-w-0 max-[580px]:p-4.25 p-7.5 mt-6 [&_.wf-feature-icon]:mb-6'
          }
          onSubmit={create}
        >
          <span
            className={
              'wf-feature-icon grid place-items-center w-11.5 h-11.5 flex-none rounded-xl bg-[#372858] text-[#b891ff]'
            }
          >
            <GitBranch size={25} />
          </span>
          <label
            className={
              'wf-field flex flex-col gap-2.25 text-[#e5e0ee] text-[13px] font-[650] m-[18px_0] [&_input]:w-full [&_input]:border [&_input]:border-[#504a5a] [&_input]:bg-[#282732] [&_input]:rounded-[9px] [&_input]:text-white [&_input]:p-3 [&_input]:outline-0 [&_input]:min-w-0 [&_select]:w-full [&_select]:border [&_select]:border-[#504a5a] [&_select]:bg-[#282732] [&_select]:rounded-[9px] [&_select]:text-white [&_select]:p-3 [&_select]:outline-0 [&_select]:min-w-0 [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-[#504a5a] [&_textarea]:bg-[#282732] [&_textarea]:rounded-[9px] [&_textarea]:text-white [&_textarea]:p-3 [&_textarea]:outline-0 [&_textarea]:min-w-0 [&_input:focus]:border-[#aa83fd] [&_textarea:focus]:border-[#aa83fd] [&_select:focus]:border-[#aa83fd]'
            }
          >
            Workflow name
            <input
              autoFocus
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="For example, Sales intake flow"
            />
          </label>
          <span className={'wf-field-caption block m-[25px_0_12px] text-[13px] font-[650]'}>
            How will this flow start?
          </span>
          <div
            className={
              'wf-trigger-grid grid grid-cols-[1fr_1fr] gap-3 [&_button]:flex [&_button]:flex-col [&_button]:items-start [&_button]:gap-2.5 [&_button]:text-[#ede9f4] [&_button]:p-5.5 [&_button]:text-left [&_button]:bg-[#292833] [&_button]:border [&_button]:border-[#46404e] [&_button]:rounded-[11px] [&_button.chosen]:border-[#aa83fd] [&_button.chosen]:bg-[#35284b] [&_button_svg]:text-[#ae8cfc] [&_button_small]:text-[#bfb8c9] [&_button_small]:leading-[1.4] max-[580px]:grid-cols-1'
            }
          >
            <button
              type="button"
              onClick={() => setTrigger('inbound')}
              className={trigger === 'inbound' ? 'chosen' : ''}
            >
              <PhoneIncoming size={22} />
              <strong>Inbound call</strong>
              <small>Answer a customer who calls your business.</small>
            </button>
            <button
              type="button"
              onClick={() => setTrigger('outbound')}
              className={trigger === 'outbound' ? 'chosen' : ''}
            >
              <PhoneOutgoing size={22} />
              <strong>Outbound campaign</strong>
              <small>Use this flow when a campaign initiates a call.</small>
            </button>
          </div>
          {error && (
            <p
              className={
                'wf-error flex gap-2.25 items-center p-[11px_13px] rounded-[9px] m-[12px_0] bg-[#512b3c] border border-[#89516b] text-[#ffb7c8] text-[13px]'
              }
              role="alert"
            >
              {error}
            </p>
          )}
          <div
            className={
              'wf-form-footer flex justify-end gap-3 mt-7.5 max-[580px]:flex-wrap max-[580px]:[&>*]:flex-1'
            }
          >
            <Link
              href="/workflows"
              className={
                'wf-secondary inline-flex justify-center items-center gap-2 rounded-[9px] p-[11px_15px] text-[13px] font-bold whitespace-nowrap text-[#eee8fa]! bg-[#292734] border border-[#514a60] [&:hover]:bg-[#373249]'
              }
            >
              Cancel
            </Link>
            <button
              className={
                'wf-primary inline-flex justify-center items-center gap-2 rounded-[9px] p-[11px_15px] text-[13px] font-bold whitespace-nowrap text-white! bg-[#8057e8] border border-[#9773ef] [&:hover]:bg-[#906bf0]'
              }
              disabled={busy || !name.trim()}
            >
              {busy ? 'Creating…' : 'Create and open canvas'} <ArrowRight size={17} />
            </button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
