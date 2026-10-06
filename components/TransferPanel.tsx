'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Info, Repeat2, Search, X } from 'lucide-react';
const teammates = [
  ['Arjun Mehta', 'Technical Support', 'Online'],
  ['Priya Sharma', 'Technical Support', 'Online'],
  ['Karan Desai', 'Product Support', 'Away'],
  ['Neha Verma', 'Customer Success', 'Offline'],
];
export default function TransferPanel({ form, setForm, feedback, working, onTransfer }) {
  const [query, setQuery] = useState('');
  const [validation, setValidation] = useState('');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  function submit() {
    if (!form['Transfer to agent'] || !form['Reason for transfer']?.trim())
      return setValidation('Choose a teammate and enter a handoff reason.');
    setValidation('');
    onTransfer();
  }
  return (
    <aside
      className={
        'transfer-panel border border-[#3c3c47] bg-[#20222b] rounded-[9px] p-4 overflow-y-auto min-w-0 [&>p]:text-xs [&>p]:text-[#bac0cf] [&>p]:leading-normal [&>.button]:flex [&>.button]:w-full [&>.button]:justify-center [&>.button]:mt-2.25 [&_.transfer-note]:flex [&_.transfer-note]:items-center [&_.transfer-note]:gap-1.75 [&_.transfer-note]:border-t [&_.transfer-note]:border-t-[#40434e] [&_.transfer-note]:mt-5 [&_.transfer-note]:pt-3.25'
      }
    >
      <div
        className={
          'transfer-panel-head flex items-center justify-between [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2 [&_h2]:text-lg [&_h2]:m-0 [&_h2_svg]:text-[#bc83ff] [&>a]:text-[#f6f3fb]'
        }
      >
        <h2>
          <Repeat2 size={20} /> Transfer this call
        </h2>
        <Link href="/agent/live-call" aria-label="Close transfer panel">
          <X size={20} />
        </Link>
      </div>
      <p>
        Find a teammate to hand off this demo call. The current agent remains assigned until
        acceptance.
      </p>
      <label
        className={
          'transfer-search block text-xs m-[17px_0_10px] [&_div]:flex [&_div]:items-center [&_div]:gap-2 [&_div]:border [&_div]:border-[#4a4a55] [&_div]:rounded-[7px] [&_div]:mt-2 [&_div]:p-2.25 [&_div]:text-[#babaca] [&_input]:bg-transparent [&_input]:border-0 [&_input]:outline-0 [&_input]:text-white [&_input]:min-w-0 [&_input]:w-full [&_input]:[font:inherit] [&_input]:text-xs'
        }
      >
        Search teammates
        <div>
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name or department"
          />
        </div>
      </label>
      <div
        className={
          'teammate-list border border-[#474553] rounded-lg overflow-hidden mb-3.75 [&_button]:flex [&_button]:items-center [&_button]:gap-2 [&_button]:text-left [&_button]:text-white [&_button]:bg-[#242631] [&_button]:border-0 [&_button]:border-t [&_button]:border-t-[#494752] [&_button]:w-full [&_button]:p-2.25 [&_button]:cursor-pointer [&_button:first-child]:border-t-0 [&_button.selected]:bg-[#32254d] [&_button.selected]:outline-1 [&_button.selected]:outline-[#9761e9] [&_button:disabled]:opacity-[.48] [&_button:disabled]:cursor-not-allowed [&_button>span:nth-child(2)]:flex-1 [&_button>span:nth-child(2)]:min-w-0 [&_strong]:block [&_small]:block [&_strong]:text-xs [&_small]:text-[10px] [&_small]:text-[#b4b6c5] [&_em]:text-[10px] [&_em]:text-[#50d9a3] [&_em]:not-italic [&_em.away]:text-[#f6be68] [&_em.offline]:text-[#b6b5c1] [&_b]:text-[17px] [&_b]:text-[#ba8fff]'
        }
      >
        {teammates
          .filter(([name, dept]) => `${name} ${dept}`.toLowerCase().includes(query.toLowerCase()))
          .map(([name, dept, status]) => (
            <button
              key={name}
              disabled={status === 'Offline'}
              className={form['Transfer to agent'] === name ? 'selected' : ''}
              onClick={() => {
                update('Transfer to agent', name);
                update('Transfer to department', dept);
              }}
            >
              <span
                className={
                  'mini-avatar grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,_#8a5bff,_#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
                }
              >
                {name
                  .split(' ')
                  .map((word) => word[0])
                  .join('')}
              </span>
              <span>
                <strong>{name}</strong>
                <small>{dept}</small>
              </span>
              <em className={`${status.toLowerCase()} [&]:text-[#ff8f99]!`}>● {status}</em>
              <b>{form['Transfer to agent'] === name ? '●' : '○'}</b>
            </button>
          ))}
      </div>
      <label
        className={
          'widget-setup-field flex flex-col gap-2 text-[#d9d9e3] text-xs [&:has(textarea)]:col-[1/-1] [&_input]:bg-[#23232b] [&_input]:border [&_input]:border-[#46444e] [&_input]:text-white [&_input]:rounded-[7px] [&_input]:p-[11px_12px] [&_input]:min-w-0 [&_input]:[font:inherit] [&_input]:text-xs [&_textarea]:bg-[#23232b] [&_textarea]:border [&_textarea]:border-[#46444e] [&_textarea]:text-white [&_textarea]:rounded-[7px] [&_textarea]:p-[11px_12px] [&_textarea]:min-w-0 [&_textarea]:[font:inherit] [&_textarea]:text-xs [&_select]:bg-[#23232b] [&_select]:border [&_select]:border-[#46444e] [&_select]:text-white [&_select]:rounded-[7px] [&_select]:p-[11px_12px] [&_select]:min-w-0 [&_select]:[font:inherit] [&_select]:text-xs [&_input[type=color]]:w-full [&_input[type=color]]:h-10.5 [&_input[type=color]]:p-1'
        }
      >
        Transfer reason
        <textarea
          value={form['Reason for transfer'] || ''}
          onChange={(e) => update('Reason for transfer', e.target.value)}
          placeholder="What does the next agent need to know?"
          rows={4}
        />
      </label>
      {(validation || feedback) && (
        <p role="status" className={'live-feedback text-[#b3ffda] text-xs p-[0_15px]'}>
          {validation || feedback}
        </p>
      )}
      <button
        className={
          'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,_#7c49f5,_#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
        }
        disabled={working}
        onClick={submit}
      >
        <Repeat2 size={17} /> {working ? 'Requesting…' : 'Request transfer'}
      </button>
      <Link
        className={
          'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,_#7c49f5,_#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
        }
        href="/agent/live-call"
      >
        Cancel
      </Link>
      <p className={'transfer-note'}>
        <Info size={16} /> AI stays silent while a person owns this demo conversation.
      </p>
    </aside>
  );
}
