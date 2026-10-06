'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FileSpreadsheet,
  Megaphone,
  Phone,
  PhoneCall,
  ShieldCheck,
  UploadCloud,
  Users,
} from 'lucide-react';
import { apiFetch } from './api-client';

const stepNames = ['Basics & agent', 'Contacts', 'Calling settings', 'Schedule', 'Review & launch'];
const stepLinks = [
  '/campaigns/new/basics',
  '/campaigns/new/contacts',
  '/campaigns/new/calling-settings',
  '/campaigns/new/schedule',
  '/campaigns/new/review',
];
function Field({ field, value, onChange, agents }) {
  const props = {
    value: value ?? '',
    onChange: (event) =>
      onChange(field.type === 'switch' ? event.target.checked : event.target.value),
  };
  if (field.type === 'switch')
    return (
      <label
        className={
          'campaign-toggle flex items-center justify-between p-[12px_0] border-b border-b-[#363846] text-[#eee] text-sm gap-3 [&_input]:accent-[#7944f8] [&_input]:w-4.75 [&_input]:h-4.75'
        }
      >
        <span>{field.label}</span>
        <input type="checkbox" checked={Boolean(value)} onChange={props.onChange} />
      </label>
    );
  if (field.type === 'agent' || field.type === 'select')
    return (
      <label
        className={
          'field grid gap-2 text-sm [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#454551] [&_input]:bg-[#202128] [&_input]:p-[12px_13px] [&_input]:text-[#f5f5f8] [&_input]:outline-0 [&_input]:text-sm [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#454551] [&_textarea]:bg-[#202128] [&_textarea]:p-[12px_13px] [&_textarea]:text-[#f5f5f8] [&_textarea]:outline-0 [&_textarea]:text-sm [&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-[#454551] [&_select]:bg-[#202128] [&_select]:p-[12px_13px] [&_select]:text-[#f5f5f8] [&_select]:outline-0 [&_select]:text-sm [&_textarea]:resize-y [&_textarea]:leading-normal [&_input:focus]:border-[#a47aff] [&_input:focus]:shadow-[0_0_0_3px_#7646e323] [&_textarea:focus]:border-[#a47aff] [&_textarea:focus]:shadow-[0_0_0_3px_#7646e323] [&_select:focus]:border-[#a47aff] [&_select:focus]:shadow-[0_0_0_3px_#7646e323] [&_small]:text-(--muted) [&_small]:text-xs'
        }
      >
        <span className={'field-label text-[#f0eff5] font-[540]'}>{field.label}</span>
        <select {...props}>
          <option value="">Select {field.label.toLowerCase()}</option>
          {(field.type === 'agent' ? agents.map((a) => a.name) : field.options).map((name) => (
            <option key={name}>{name}</option>
          ))}
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
        <textarea {...props} rows={field.label.includes('Contacts') ? 7 : 3} />
      ) : (
        <input {...props} type={field.type || 'text'} />
      )}
    </label>
  );
}
function Panel({ title, description, children }) {
  return (
    <section
      className={
        'campaign-wizard-panel bg-[linear-gradient(145deg,#1e1f27,#1a1c24)] border border-[#3c3d48] rounded-[11px] p-5.25 mb-4.25 min-w-0 [&_h2]:m-[0_0_4px] [&_h2]:text-[19px] [&>p]:m-0 [&>p]:text-[#acafc1] [&>p]:text-[13px] [&>p]:leading-normal [&>p]:mb-4.75'
      }
    >
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </section>
  );
}
function Summary({ record, form, view, agents }) {
  const basics = view === 'campaign-basics' ? form : record?.data?.screen_44 || {};
  const contacts = view === 'campaign-contacts' ? form : record?.data?.screen_45 || {};
  const calling = view === 'campaign-calling-settings' ? form : record?.data?.screen_46 || {};
  const schedule = view === 'campaign-schedule' ? form : record?.data?.screen_47 || {};
  return (
    <Panel title="Campaign summary" description="Current saved settings and launch prerequisites.">
      <div
        className={
          'campaign-wizard-summary [&>div]:flex [&>div]:items-start [&>div]:justify-between [&>div]:gap-3.75 [&>div]:border-b [&>div]:border-b-[#373944] [&>div]:p-[12px_0] [&>div]:text-sm [&_strong]:text-right [&_strong]:wrap-anywhere [&_strong]:max-w-[65%] [&_span]:text-[#afb1c5]'
        }
      >
        {[
          ['Campaign', basics['Campaign name'] || record?.title || 'Not set'],
          ['Purpose', basics.Purpose || 'Not set'],
          ['Voice agent', basics['Voice agent'] || 'Not selected'],
          [
            'Contacts',
            contacts['Contacts (one phone per line)']
              ? `${contacts['Contacts (one phone per line)'].split(/[\n,;]+/).filter(Boolean).length} entered`
              : 'Not uploaded',
          ],
          ['Consent', contacts['Consent source'] || 'Not recorded'],
          ['Caller number', calling['Verified caller number'] || 'Not verified'],
          ['Start', schedule['Start date and time'] || 'Not scheduled'],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      {view === 'campaign-review' && (
        <div
          className={
            'campaign-wizard-note border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal [&_svg]:align-middle'
          }
        >
          Scheduling saves this campaign for the demo. Only a connected, verified dialer can place
          real calls.
        </div>
      )}
    </Panel>
  );
}

export default function CampaignWizard({
  previousHref,
  view,
  config,
  record,
  form,
  setForm,
  agents,
  working,
  feedback,
  onSave,
}) {
  const stepIndex = [
    'campaign-basics',
    'campaign-contacts',
    'campaign-calling-settings',
    'campaign-schedule',
    'campaign-review',
  ].indexOf(view);
  const [importMessage, setImportMessage] = useState('');
  const [preview, setPreview] = useState('');
  const [checking, setChecking] = useState(false);
  const update = (label, value) => setForm((current) => ({ ...current, [label]: value }));
  const rows = String(
    form['Contacts (one phone per line)'] ||
      record?.data?.screen_45?.['Contacts (one phone per line)'] ||
      '',
  )
    .split(/[\n,;]+/)
    .map((text) => text.trim())
    .filter(Boolean);
  const distinct = [...new Set(rows)];
  const eligible = distinct.filter((phone) => /^\+?[0-9]{10,15}$/.test(phone));
  async function importCsv(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 2_000_000) throw Error('Maximum CSV size for this preview is 2 MB.');
      const content = await file.text();
      const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const header = lines[0]?.toLowerCase().split(',') || [];
      const phoneIndex = header.findIndex((label) => /phone|mobile|number/.test(label));
      const phones = (phoneIndex < 0 ? lines : lines.slice(1))
        .map((line) => line.split(',')[Math.max(0, phoneIndex)]?.replace(/^"|"$/g, '').trim())
        .filter(Boolean);
      update('Contacts (one phone per line)', phones.join('\n'));
      setImportMessage(
        `${file.name}: ${phones.length} contacts loaded. Check phone numbers and consent before continuing.`,
      );
    } catch (error) {
      setImportMessage(error.message);
    }
  }
  async function check() {
    if (!record) return setPreview('Save the campaign first, then check eligibility.');
    setChecking(true);
    try {
      const response = await apiFetch(`/api/demo/campaigns/${record._id}/eligibility`);
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      setPreview(
        `${data.eligible} eligible · ${data.excluded} excluded · ${data.duplicates} duplicate. These are formatting checks only; external consent and suppression have not been verified.`,
      );
    } catch (error) {
      setPreview(error.message);
    } finally {
      setChecking(false);
    }
  }
  const fields = (labels) =>
    config.fields
      .filter((f) => labels.includes(f.label))
      .map((field) => (
        <Field
          key={field.label}
          field={field}
          value={form[field.label]}
          onChange={(value) => update(field.label, value)}
          agents={agents}
        />
      ));
  return (
    <div className={'campaign-wizard max-w-362.5 m-auto'}>
      <Link
        href="/campaigns"
        className={
          'studio-back inline-flex items-center gap-2.5 text-[#c8c9d8] text-sm m-[6px_0_19px]'
        }
      >
        <ArrowLeft size={17} /> Back to campaigns
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
          <PhoneCall size={27} />
        </span>
        <div>
          <h1>{record?.title || form['Campaign name'] || 'Create campaign'}</h1>
          <p>Outbound voice campaign · Acme Support</p>
        </div>
        <span
          className={`status inline-flex rounded-[25px] p-[7px_12px] text-[13px] [&.ready]:text-[#5de5b8] [&.ready]:bg-[#133b32] [&.ready]:border [&.ready]:border-[#215544] [&.draft]:text-[#ffd17d] [&.draft]:bg-[#4a351a] [&.draft]:border [&.draft]:border-[#765020]${record?.status === 'running' ? 'ready' : 'draft'}`}
        >
          ● {record?.status || 'New draft'}
        </span>
        <button
          className={
            'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
          }
          disabled={working}
          onClick={() => onSave({ advance: false })}
        >
          Save draft
        </button>
      </div>
      <nav
        className={
          'campaign-wizard-progress flex items-center justify-between gap-1.5 p-[15px_0_20px] border-b border-b-[#3a3a48] overflow-x-auto [&>a]:whitespace-nowrap [&>a]:flex [&>a]:items-center [&>a]:gap-2.5 [&>a]:text-[#c6c6d6] [&>a]:text-[13px] [&>a_span]:w-8.5 [&>a_span]:h-8.5 [&>a_span]:rounded-full [&>a_span]:grid [&>a_span]:place-items-center [&>a_span]:bg-[#31323d] [&>a_span]:border [&>a_span]:border-[#545664] [&>a_span]:text-[#ddd] [&>a.active_span]:bg-[linear-gradient(140deg,#9060f9,#5732d8)] [&>a.active_span]:text-white [&>a.active_span]:border-[#986fff] [&>a.done_span]:bg-[linear-gradient(140deg,#9060f9,#5732d8)] [&>a.done_span]:text-white [&>a.done_span]:border-[#986fff] [&>a.active]:text-white [&>a.active]:font-[650] max-[750px]:[&>a]:text-[0] max-[750px]:[&>a_span]:text-[13px]'
        }
        aria-label="Campaign setup steps"
      >
        {stepNames.map((name, index) => (
          <Link
            className={index === stepIndex ? 'active' : index < stepIndex ? 'done' : ''}
            key={name}
            href={stepLinks[index]}
          >
            <span>{index < stepIndex ? <Check size={16} /> : index + 1}</span>
            {name}
          </Link>
        ))}
      </nav>
      <div
        className={
          'campaign-wizard-intro flex items-center justify-between m-[15px_0_21px] [&_h2]:m-[0_0_5px] [&_h2]:text-[26px] [&_h2]:tracking-[-.028em] [&_p]:m-0 [&_p]:text-[#b4b5c6] [&_p]:text-sm [&>span]:text-[#bda6fa] [&>span]:text-[13px]'
        }
      >
        <div>
          <h2>{config.title}</h2>
          <p>{config.caption}</p>
        </div>
        <span>Step {stepIndex + 1} of 5</span>
      </div>
      {feedback && (
        <div
          role="status"
          className={
            'flow-alert flex gap-2.5 items-center bg-[#173b34] border border-[#296a55] text-[#81e4b8] p-[13px_16px] rounded-[9px] m-[15px_0] text-sm [&.problem]:bg-[#402630] [&.problem]:border-[#a44c68] [&.problem]:text-[#ffb5c1]'
          }
        >
          {feedback}
        </div>
      )}
      <div
        className={
          'campaign-wizard-grid [&>div]:min-w-0 [&>aside]:min-w-0 grid grid-cols-[minmax(0,1.12fr)_minmax(340px,.78fr)] gap-4.25 items-start max-[1150px]:grid-cols-1'
        }
      >
        <div>
          {view === 'campaign-basics' && (
            <>
              <Panel
                title="Campaign basics"
                description="Name the campaign and state why recipients are being contacted."
              >
                <div
                  className={
                    'campaign-wizard-fields grid gap-3.75 [&_.field]:grid [&_.field]:gap-1.75 [&_.field_input]:w-full [&_.field_input]:bg-[#1c1e26] [&_.field_input]:border [&_.field_input]:border-[#454651] [&_.field_input]:rounded-lg [&_.field_input]:text-[#f9f8ff] [&_.field_input]:p-[12px_13px] [&_.field_input]:min-h-11 [&_.field_input]:resize-y [&_.field_textarea]:w-full [&_.field_textarea]:bg-[#1c1e26] [&_.field_textarea]:border [&_.field_textarea]:border-[#454651] [&_.field_textarea]:rounded-lg [&_.field_textarea]:text-[#f9f8ff] [&_.field_textarea]:p-[12px_13px] [&_.field_textarea]:min-h-11 [&_.field_textarea]:resize-y [&_.field_select]:w-full [&_.field_select]:bg-[#1c1e26] [&_.field_select]:border [&_.field_select]:border-[#454651] [&_.field_select]:rounded-lg [&_.field_select]:text-[#f9f8ff] [&_.field_select]:p-[12px_13px] [&_.field_select]:min-h-11 [&_.field_select]:resize-y [&_.field-label]:text-sm'
                  }
                >
                  {fields(['Campaign name', 'Purpose', 'Voice agent', 'Opening script'])}
                </div>
              </Panel>
              <Panel
                title="Test agent"
                description="Preview a sample greeting with the selected voice agent."
              >
                <div
                  className={
                    'campaign-wizard-agent [&_strong]:block [&_small]:block [&_small]:text-[#aeb0c1] [&_small]:text-xs [&_small]:mt-1.25 flex items-center gap-3 text-[#a981fa] [&_strong]:text-white'
                  }
                >
                  <Megaphone size={27} />
                  <span>
                    <strong>{form['Voice agent'] || 'Select a voice agent'}</strong>
                    <small>AI agent for this outbound campaign</small>
                  </span>
                </div>
                <div
                  className={
                    'campaign-wizard-note border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal [&_svg]:align-middle'
                  }
                >
                  Test calls are browser previews until the outbound provider is connected.
                </div>
              </Panel>
            </>
          )}
          {view === 'campaign-contacts' && (
            <>
              <Panel
                title="Upload contacts"
                description="Import a CSV or enter one phone number per line."
              >
                <div
                  className={
                    'campaign-wizard-upload flex items-center gap-3.5 border-[1px_dashed_#686085] rounded-[9px] p-4.5 m-[18px_0] bg-[#211f30] [&_svg]:text-[#bd91fb] [&_span]:flex-1 [&_strong]:block [&_small]:block [&_small]:text-[#aeb0c1] [&_small]:text-xs [&_small]:mt-1.25'
                  }
                >
                  <FileSpreadsheet size={28} />
                  <span>
                    <strong>Choose a CSV file</strong>
                    <small>Phone or mobile column · 2 MB maximum</small>
                  </span>
                  <label
                    className={
                      'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                    }
                  >
                    <UploadCloud size={16} /> Upload CSV
                    <input type="file" accept=".csv,text/csv" onChange={importCsv} hidden />
                  </label>
                </div>
                {importMessage && (
                  <p
                    className={
                      'campaign-wizard-note border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal [&_svg]:align-middle'
                    }
                    role="status"
                  >
                    {importMessage}
                  </p>
                )}
                <div
                  className={
                    'campaign-wizard-fields grid gap-3.75 [&_.field]:grid [&_.field]:gap-1.75 [&_.field_input]:w-full [&_.field_input]:bg-[#1c1e26] [&_.field_input]:border [&_.field_input]:border-[#454651] [&_.field_input]:rounded-lg [&_.field_input]:text-[#f9f8ff] [&_.field_input]:p-[12px_13px] [&_.field_input]:min-h-11 [&_.field_input]:resize-y [&_.field_textarea]:w-full [&_.field_textarea]:bg-[#1c1e26] [&_.field_textarea]:border [&_.field_textarea]:border-[#454651] [&_.field_textarea]:rounded-lg [&_.field_textarea]:text-[#f9f8ff] [&_.field_textarea]:p-[12px_13px] [&_.field_textarea]:min-h-11 [&_.field_textarea]:resize-y [&_.field_select]:w-full [&_.field_select]:bg-[#1c1e26] [&_.field_select]:border [&_.field_select]:border-[#454651] [&_.field_select]:rounded-lg [&_.field_select]:text-[#f9f8ff] [&_.field_select]:p-[12px_13px] [&_.field_select]:min-h-11 [&_.field_select]:resize-y [&_.field-label]:text-sm'
                  }
                >
                  {fields([
                    'Contacts (one phone per line)',
                    'Consent source',
                    'Suppress opted-out contacts',
                  ])}
                </div>
                <button
                  className={
                    'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                  }
                  onClick={check}
                  disabled={checking}
                >
                  {checking ? 'Checking…' : 'Check saved eligibility'}
                </button>
                {preview && (
                  <p
                    className={
                      'campaign-wizard-note border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal [&_svg]:align-middle'
                    }
                    role="status"
                  >
                    {preview}
                  </p>
                )}
              </Panel>
            </>
          )}
          {view === 'campaign-calling-settings' && (
            <>
              <Panel
                title="Caller number & outbound calling pool"
                description="Use a verified caller ID and reserve capacity for inbound requests."
              >
                <div
                  className={
                    'campaign-wizard-fields grid gap-3.75 [&_.field]:grid [&_.field]:gap-1.75 [&_.field_input]:w-full [&_.field_input]:bg-[#1c1e26] [&_.field_input]:border [&_.field_input]:border-[#454651] [&_.field_input]:rounded-lg [&_.field_input]:text-[#f9f8ff] [&_.field_input]:p-[12px_13px] [&_.field_input]:min-h-11 [&_.field_input]:resize-y [&_.field_textarea]:w-full [&_.field_textarea]:bg-[#1c1e26] [&_.field_textarea]:border [&_.field_textarea]:border-[#454651] [&_.field_textarea]:rounded-lg [&_.field_textarea]:text-[#f9f8ff] [&_.field_textarea]:p-[12px_13px] [&_.field_textarea]:min-h-11 [&_.field_textarea]:resize-y [&_.field_select]:w-full [&_.field_select]:bg-[#1c1e26] [&_.field_select]:border [&_.field_select]:border-[#454651] [&_.field_select]:rounded-lg [&_.field_select]:text-[#f9f8ff] [&_.field_select]:p-[12px_13px] [&_.field_select]:min-h-11 [&_.field_select]:resize-y [&_.field-label]:text-sm'
                  }
                >
                  {fields([
                    'Verified caller number',
                    'Concurrent campaign calls',
                    'Reserved inbound slots',
                    'Calls per second',
                  ])}
                </div>
              </Panel>
              <Panel
                title="Call capacity"
                description="Review the configured concurrency before launch."
              >
                <div
                  className={
                    'campaign-wizard-tiles grid grid-cols-[repeat(3,1fr)] gap-2 [&>div]:border [&>div]:border-[#3b3b4b] [&>div]:p-3 [&>div]:bg-[#252533] [&>div]:rounded-[9px] [&_strong]:text-[22px] [&_strong]:block [&_strong]:text-[#bea7fc] [&_span]:text-xs [&_span]:text-[#c2bfd1]'
                  }
                >
                  <div>
                    <strong>{form['Concurrent campaign calls'] || 5}</strong>
                    <span>Campaign calls</span>
                  </div>
                  <div>
                    <strong>{form['Reserved inbound slots'] || 2}</strong>
                    <span>Reserved inbound</span>
                  </div>
                  <div>
                    <strong>{form['Calls per second'] || 1}</strong>
                    <span>Calls per second</span>
                  </div>
                </div>
                <div
                  className={
                    'campaign-wizard-note border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal [&_svg]:align-middle'
                  }
                >
                  Actual carrier concurrency requires provider capacity and rate controls.
                </div>
              </Panel>
            </>
          )}
          {view === 'campaign-schedule' && (
            <>
              <Panel
                title="Campaign schedule"
                description="Choose calling times and a time zone appropriate for your contacts."
              >
                <div
                  className={
                    'campaign-wizard-fields grid gap-3.75 [&_.field]:grid [&_.field]:gap-1.75 [&_.field_input]:w-full [&_.field_input]:bg-[#1c1e26] [&_.field_input]:border [&_.field_input]:border-[#454651] [&_.field_input]:rounded-lg [&_.field_input]:text-[#f9f8ff] [&_.field_input]:p-[12px_13px] [&_.field_input]:min-h-11 [&_.field_input]:resize-y [&_.field_textarea]:w-full [&_.field_textarea]:bg-[#1c1e26] [&_.field_textarea]:border [&_.field_textarea]:border-[#454651] [&_.field_textarea]:rounded-lg [&_.field_textarea]:text-[#f9f8ff] [&_.field_textarea]:p-[12px_13px] [&_.field_textarea]:min-h-11 [&_.field_textarea]:resize-y [&_.field_select]:w-full [&_.field_select]:bg-[#1c1e26] [&_.field_select]:border [&_.field_select]:border-[#454651] [&_.field_select]:rounded-lg [&_.field_select]:text-[#f9f8ff] [&_.field_select]:p-[12px_13px] [&_.field_select]:min-h-11 [&_.field_select]:resize-y [&_.field-label]:text-sm'
                  }
                >
                  {fields([
                    'Start date and time',
                    'End date and time',
                    'Time zone',
                    'Maximum retries',
                    'Voicemail action',
                  ])}
                </div>
              </Panel>
              <Panel
                title="Retry policy"
                description="Demo scheduling stores your settings; it will not call contacts automatically."
              >
                <div
                  className={
                    'campaign-wizard-note border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal [&_svg]:align-middle'
                  }
                >
                  <Clock3 size={18} /> Enforce approved hours, consent, suppression, retry limits
                  and local law when a live dialer is connected.
                </div>
              </Panel>
            </>
          )}
          {view === 'campaign-review' && (
            <>
              <Panel
                title="Campaign summary"
                description="Review all saved settings before scheduling a demo campaign."
              >
                <div
                  className={
                    'campaign-wizard-summary [&>div]:flex [&>div]:items-start [&>div]:justify-between [&>div]:gap-3.75 [&>div]:border-b [&>div]:border-b-[#373944] [&>div]:p-[12px_0] [&>div]:text-sm [&_strong]:text-right [&_strong]:wrap-anywhere [&_strong]:max-w-[65%] [&_span]:text-[#afb1c5]'
                  }
                >
                  {[
                    ['Name', record?.title],
                    ['Agent', record?.data?.screen_44?.['Voice agent']],
                    [
                      'Contacts',
                      record?.data?.screen_45?.['Contacts (one phone per line)']
                        ?.split(/[\n,;]+/)
                        .filter(Boolean).length,
                    ],
                    ['Consent source', record?.data?.screen_45?.['Consent source']],
                    ['Caller number', record?.data?.screen_46?.['Verified caller number']],
                    ['Start', record?.data?.screen_47?.['Start date and time']],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span>{label}</span>
                      <strong>{value || 'Missing'}</strong>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel
                title="Preview & confirm"
                description="Demo readiness check before saving the campaign schedule."
              >
                <div className={'campaign-wizard-check flex items-center gap-3 text-[#57d7af]'}>
                  <CheckCircle2 size={22} /> Agent and contact settings can be reviewed above.
                </div>
                <div
                  className={
                    'campaign-wizard-note border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal [&_svg]:align-middle'
                  }
                >
                  No calls start when you schedule. The Run demo button on monitoring animates
                  synthetic results only.
                </div>
              </Panel>
            </>
          )}
        </div>
        <aside>
          <Summary record={record} form={form} view={view} agents={agents} />
          <Panel title="Eligibility preview" description="Format check for the numbers entered.">
            <div
              className={
                'campaign-wizard-tiles grid grid-cols-[repeat(3,1fr)] gap-2 [&>div]:border [&>div]:border-[#3b3b4b] [&>div]:p-3 [&>div]:bg-[#252533] [&>div]:rounded-[9px] [&_strong]:text-[22px] [&_strong]:block [&_strong]:text-[#bea7fc] [&_span]:text-xs [&_span]:text-[#c2bfd1]'
              }
            >
              <div>
                <strong>{rows.length}</strong>
                <span>Uploaded</span>
              </div>
              <div>
                <strong>{eligible.length}</strong>
                <span>Valid format</span>
              </div>
              <div>
                <strong>{rows.length - eligible.length}</strong>
                <span>Excluded</span>
              </div>
            </div>
            <div
              className={
                'campaign-wizard-note border border-[#574976] bg-[linear-gradient(110deg,#29233a,#242230)] text-[#d6cbea] rounded-[9px] p-[13px_15px] mt-4.25 text-[13px] leading-normal [&_svg]:align-middle'
              }
            >
              Consent, DND and opt-out checks require connected data sources.
            </div>
          </Panel>
        </aside>
      </div>
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
            onClick={() => onSave({ advance: false })}
            disabled={working}
          >
            Save draft
          </button>
          <button
            className={
              'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
            }
            onClick={() =>
              onSave({
                advance: view !== 'campaign-review',
                status: view === 'campaign-review' ? 'scheduled' : undefined,
              })
            }
            disabled={working}
          >
            {working
              ? 'Saving…'
              : view === 'campaign-review'
                ? 'Schedule demo campaign'
                : 'Continue'}{' '}
            <ArrowRight size={16} />
          </button>
        </div>
      </footer>
    </div>
  );
}
