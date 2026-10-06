'use client';
import Link from 'next/link';
import { CalendarDays, CheckCircle2, Clock3, FileText, Sparkles, UserRound } from 'lucide-react';
export default function CallOutcome({
  records,
  selected,
  onSelect,
  form,
  setForm,
  feedback,
  working,
  onSave,
}) {
  const ended = records.filter((r) => r.status === 'ended');
  const call = ended.find((r) => r._id === selected?._id) || ended[0];
  const issue = call?.data?.screen_14?.['Issue summary'] || 'Customer support conversation';
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <div
      className={
        'call-outcome-page max-w-370 m-auto grid grid-cols-[minmax(0,1fr)_320px] gap-2.5 text-[#f7f6ff] [&>main]:border [&>main]:border-[#3e3e49] [&>main]:rounded-[9px] [&>main]:bg-[#1d1e25] [&>main]:p-4.25 [&_aside_section]:border [&_aside_section]:border-[#3e3e49] [&_aside_section]:rounded-[9px] [&_aside_section]:bg-[#1d1e25] [&_aside_section]:p-4.25 [&>main>h1]:text-[25px] [&>main>h1]:m-[0_0_4px] [&>main>p]:text-[#b2b6c5] [&>main>p]:text-xs [&_aside_section]:mb-2.25 [&_aside_h2]:flex [&_aside_h2]:gap-2 [&_aside_h2]:items-center [&_aside_h2]:text-[15px] [&_aside>section>button]:w-full [&_aside>section>button]:text-left [&_aside>section>button]:bg-[#24232c] [&_aside>section>button]:text-white [&_aside>section>button]:border [&_aside>section>button]:border-[#4a4557] [&_aside>section>button]:rounded-lg [&_aside>section>button]:p-2.75 [&_aside>section>button]:m-[4px_0] [&_aside>section>button]:cursor-pointer [&_aside>section>button.selected]:border-[#8b60e9] [&_aside>section>button.selected]:bg-[#332746] [&_aside>section>button_small]:block [&_aside>section>button_small]:text-[#adafbf] [&_aside>section>button_small]:text-[10px] max-[1050px]:grid-cols-1 max-[1050px]:[&_aside]:grid max-[1050px]:[&_aside]:grid-cols-[1fr_1fr] max-[1050px]:[&_aside]:gap-2.25 max-[650px]:[&_aside]:grid-cols-1'
      }
    >
      <main>
        <h1>Complete call outcome</h1>
        <p>Review the call details, AI summary and add outcome information.</p>
        <div
          className={
            'outcome-caller flex items-center gap-3.75 border border-[#3f4049] rounded-lg p-3.25 m-[17px_0] [&_div]:flex-1 [&_h2]:m-0 [&_h2]:text-[19px] [&_div_span]:text-[11px] [&_div_span]:text-[#b6b8c7] [&_em]:not-italic [&_em]:text-[11px] [&_em]:text-[#3ed19b]'
          }
        >
          <span
            className={
              'mini-avatar large grid place-items-center flex-none w-9.5 h-9.5 bg-[linear-gradient(135deg,#8a5bff,#5531cf)] rounded-full text-xs text-white font-bold [&.large]:w-14.75 [&.large]:h-14.75 [&.large]:text-lg'
            }
          >
            {call?.title
              ?.split(' ')
              .map((s) => s[0])
              .slice(0, 2)
              .join('') || '—'}
          </span>
          <div>
            <h2>{call?.title || 'No completed call selected'}</h2>
            <span>#{call?._id?.slice(-6).toUpperCase() || '—'} · Website voice call</span>
          </div>
          <em>● Call ended</em>
        </div>
        <div
          className={
            'outcome-timeline flex items-center justify-between gap-1.25 border border-[#47434e] rounded-lg p-3.25 mb-3.25 [&>div]:text-center [&>div]:flex-1 [&>div]:min-w-0 [&_span]:grid [&_span]:place-items-center [&_span]:rounded-full [&_span]:bg-[#5e3bd8] [&_span]:text-white [&_span]:text-[11px] [&_span]:w-8 [&_span]:h-8 [&_span]:m-[0_auto_7px] [&_strong]:text-[10px] [&_strong]:block [&_strong]:whitespace-nowrap [&_strong]:overflow-hidden [&_strong]:text-ellipsis'
          }
        >
          {[
            ['AI', 'AI voice agent'],
            ['PS', call?.data?.screen_23 ? 'First agent' : 'Human specialist'],
            [
              call?.data?.assignedAgent
                ?.split(' ')
                .map((s) => s[0])
                .join('') || 'AG',
              call?.data?.assignedAgent || 'Receiving agent',
            ],
            ['✓', 'Call ended'],
          ].map(([initial, label]) => (
            <div key={label}>
              <span>{initial}</span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>
        <section
          className={
            'outcome-card border border-[#45434f] rounded-lg p-3.25 mb-3 [&_h3]:flex [&_h3]:items-center [&_h3]:gap-2 [&_h3]:m-[0_0_10px] [&_h3]:text-sm [&_h3_svg]:text-[#a87afa] [&_p]:text-xs [&_p]:bg-[#28303d] [&_p]:border [&_p]:border-[#4c4d5c] [&_p]:rounded-[7px] [&_p]:p-3.25 [&_label]:flex [&_label]:items-center [&_label]:gap-3 [&_label]:text-xs [&_label]:m-[12px_0] [&_label>select]:min-w-0 [&_label>select]:flex-1 [&_label>select]:bg-[#242630] [&_label>select]:border [&_label>select]:border-[#51505b] [&_label>select]:rounded-[7px] [&_label>select]:text-white [&_label>select]:p-2.25 [&_label>select]:[font:inherit] [&_label>select]:text-xs [&_label>textarea]:min-w-0 [&_label>textarea]:flex-1 [&_label>textarea]:bg-[#242630] [&_label>textarea]:border [&_label>textarea]:border-[#51505b] [&_label>textarea]:rounded-[7px] [&_label>textarea]:text-white [&_label>textarea]:p-2.25 [&_label>textarea]:[font:inherit] [&_label>textarea]:text-xs [&_label>input]:min-w-0 [&_label>input]:flex-1 [&_label>input]:bg-[#242630] [&_label>input]:border [&_label>input]:border-[#51505b] [&_label>input]:rounded-[7px] [&_label>input]:text-white [&_label>input]:p-2.25 [&_label>input]:[font:inherit] [&_label>input]:text-xs max-[650px]:[&_label]:block max-[650px]:[&_label>*]:w-full max-[650px]:[&_label>*]:block max-[650px]:[&_label>*]:mt-1.75'
          }
        >
          <h3>
            <Sparkles size={19} /> AI post-call summary · demo
          </h3>
          <p>{issue}. The team reviewed the caller request. Add the final result below.</p>
        </section>
        <section
          className={
            'outcome-card border border-[#45434f] rounded-lg p-3.25 mb-3 [&_h3]:flex [&_h3]:items-center [&_h3]:gap-2 [&_h3]:m-[0_0_10px] [&_h3]:text-sm [&_h3_svg]:text-[#a87afa] [&_p]:text-xs [&_p]:bg-[#28303d] [&_p]:border [&_p]:border-[#4c4d5c] [&_p]:rounded-[7px] [&_p]:p-3.25 [&_label]:flex [&_label]:items-center [&_label]:gap-3 [&_label]:text-xs [&_label]:m-[12px_0] [&_label>select]:min-w-0 [&_label>select]:flex-1 [&_label>select]:bg-[#242630] [&_label>select]:border [&_label>select]:border-[#51505b] [&_label>select]:rounded-[7px] [&_label>select]:text-white [&_label>select]:p-2.25 [&_label>select]:[font:inherit] [&_label>select]:text-xs [&_label>textarea]:min-w-0 [&_label>textarea]:flex-1 [&_label>textarea]:bg-[#242630] [&_label>textarea]:border [&_label>textarea]:border-[#51505b] [&_label>textarea]:rounded-[7px] [&_label>textarea]:text-white [&_label>textarea]:p-2.25 [&_label>textarea]:[font:inherit] [&_label>textarea]:text-xs [&_label>input]:min-w-0 [&_label>input]:flex-1 [&_label>input]:bg-[#242630] [&_label>input]:border [&_label>input]:border-[#51505b] [&_label>input]:rounded-[7px] [&_label>input]:text-white [&_label>input]:p-2.25 [&_label>input]:[font:inherit] [&_label>input]:text-xs max-[650px]:[&_label]:block max-[650px]:[&_label>*]:w-full max-[650px]:[&_label>*]:block max-[650px]:[&_label>*]:mt-1.75'
          }
        >
          <h3>
            <FileText size={19} /> Call disposition
          </h3>
          <label>
            Disposition
            <select value={form.Outcome || ''} onChange={(e) => set('Outcome', e.target.value)}>
              <option value="">Select outcome</option>
              <option>Resolved</option>
              <option>Follow-up needed</option>
              <option>Transferred</option>
            </select>
          </label>
          <label>
            Outcome note
            <textarea
              value={form.Summary || ''}
              onChange={(e) => set('Summary', e.target.value)}
              placeholder="What happened on the call?"
              rows={4}
            />
          </label>
          <label>
            Schedule a follow-up{' '}
            <input
              type="datetime-local"
              value={form['Follow-up time'] || ''}
              onChange={(e) => set('Follow-up time', e.target.value)}
            />
          </label>
        </section>
        {feedback && (
          <p
            role="status"
            className={
              'flow-alert flex gap-2.5 items-center bg-[#173b34] border border-[#296a55] text-[#81e4b8] p-[13px_16px] rounded-[9px] m-[15px_0] text-sm [&.problem]:bg-[#402630] [&.problem]:border-[#a44c68] [&.problem]:text-[#ffb5c1]'
            }
          >
            {feedback}
          </p>
        )}
        <div className={'outcome-actions flex gap-2.25'}>
          <button
            className={
              'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
            }
            disabled={working || !call || !form.Outcome || !form.Summary?.trim()}
            onClick={onSave}
          >
            <CheckCircle2 size={16} /> {working ? 'Saving…' : 'Save outcome & close'}
          </button>
          <Link
            className={
              'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,#7c49f5,#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
            }
            href="/agent/inbox"
          >
            Back to inbox
          </Link>
        </div>
      </main>
      <aside>
        <section>
          <h2>
            <UserRound size={18} /> Customer profile
          </h2>
          {[
            ['Name', call?.title],
            ['Conversation ID', call?._id?.slice(-6).toUpperCase()],
            ['AI voice agent', 'Website Support'],
            ['Department', call?.data?.screen_14?.Department || 'Technical Support'],
            ['Language', 'English (India)'],
          ].map(([key, value]) => (
            <div
              className={
                'detail-line flex justify-between gap-4 p-[12px_0] border-t border-t-[#42414a] text-xs [&_span]:text-[#b6b7c6] [&_strong]:max-w-[60%] [&_strong]:font-medium [&_strong]:text-right'
              }
              key={key}
            >
              <span>{key}</span>
              <strong>{value || '—'}</strong>
            </div>
          ))}
        </section>
        <section>
          <h2>
            <Clock3 size={18} /> Recent completed calls
          </h2>
          {ended.map((item) => (
            <button
              key={item._id}
              className={item._id === call?._id ? 'selected' : ''}
              onClick={() => onSelect(item)}
            >
              {item.title}
              <small>#{item._id.slice(-6).toUpperCase()}</small>
            </button>
          ))}
        </section>
      </aside>
    </div>
  );
}
