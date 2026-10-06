'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  Check,
  CheckCircle2,
  Clipboard,
  Globe2,
  Headphones,
  Info,
  Mic,
  Phone,
  ShieldCheck,
  Smartphone,
  Volume2,
} from 'lucide-react';

const steps = ['Agent', 'Appearance', 'Conversation', 'Website & hours', 'Test & install'];
const headings = {
  8: 'Design your voice widget',
  9: 'Set your greeting & caller details',
  10: 'Route calls to your team',
  11: 'Set website & availability',
  12: 'Review, test & publish',
};
const descriptions = {
  8: 'Customize the look and behavior of your voice widget to match your brand.',
  9: 'Welcome callers and collect the details your team needs.',
  10: 'Set the conditions for a smooth AI-to-human handoff.',
  11: 'Choose where and when the voice widget appears.',
  12: 'Preview the widget, check its setup and publish your demo.',
};
function Field({ field, form, setForm }) {
  const value = form[field.label] ?? (field.type === 'color' ? '#7c3aed' : '');
  const update = (event) =>
    setForm((current) => ({
      ...current,
      [field.label]: field.type === 'switch' ? event.target.checked : event.target.value,
    }));
  if (field.type === 'switch')
    return (
      <label
        className={
          'widget-setup-switch col-[1/-1] flex items-center justify-between gap-2.5 p-3 border border-[#44434e] rounded-lg text-[#e6e4ef] text-xs [&_input]:accent-[#7c52f5] [&_input]:w-4.5 [&_input]:h-4.5'
        }
      >
        <span>{field.label}</span>
        <input type="checkbox" checked={Boolean(value)} onChange={update} />
      </label>
    );
  return (
    <label
      className={
        'widget-setup-field flex flex-col gap-2 text-[#d9d9e3] text-xs [&:has(textarea)]:col-[1/-1] [&_input]:bg-[#23232b] [&_input]:border [&_input]:border-[#46444e] [&_input]:text-white [&_input]:rounded-[7px] [&_input]:p-[11px_12px] [&_input]:min-w-0 [&_input]:[font:inherit] [&_input]:text-xs [&_textarea]:bg-[#23232b] [&_textarea]:border [&_textarea]:border-[#46444e] [&_textarea]:text-white [&_textarea]:rounded-[7px] [&_textarea]:p-[11px_12px] [&_textarea]:min-w-0 [&_textarea]:[font:inherit] [&_textarea]:text-xs [&_select]:bg-[#23232b] [&_select]:border [&_select]:border-[#46444e] [&_select]:text-white [&_select]:rounded-[7px] [&_select]:p-[11px_12px] [&_select]:min-w-0 [&_select]:[font:inherit] [&_select]:text-xs [&_input[type=color]]:w-full [&_input[type=color]]:h-10.5 [&_input[type=color]]:p-1'
      }
    >
      <span>{field.label}</span>
      {field.type === 'textarea' ? (
        <textarea value={value} rows={3} onChange={update} placeholder={field.label} />
      ) : field.type === 'select' ? (
        <select value={value} onChange={update}>
          <option value="">Choose an option</option>
          {field.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type || 'text'}
          value={value}
          onChange={update}
          placeholder={field.label}
        />
      )}
    </label>
  );
}
export default function WidgetSetup({
  number,
  config,
  form,
  setForm,
  record,
  agents,
  feedback,
  working,
  onSave,
  embedOrigin,
}) {
  const [device, setDevice] = useState('Desktop');
  const [copied, setCopied] = useState(false);
  const [mic, setMic] = useState(false);
  const step = number === 8 ? 2 : number === 11 ? 4 : number === 12 ? 5 : 3;
  const code = `<script src="${embedOrigin}/chatbucket-voice.js" data-widget-id="${record?._id || 'WIDGET_ID'}"></script>`;
  const selectedAgent = record?.data?.screen_7?.['Voice agent'] || 'Website Support';
  const ready = Boolean(selectedAgent && record?.data?.screen_11?.['Allowed website URL']);
  async function test() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMic(true);
    } catch {
      setMic(false);
    }
  }
  return (
    <div
      className={
        'widget-setup-page max-w-375 m-auto text-[#faf9ff] [&>h1]:text-[27px] [&>h1]:tracking-[-.03em] [&>h1]:m-[8px_0_5px]'
      }
    >
      <Link
        href="/flow/7"
        className={
          'back-campaign inline-flex items-center gap-1.75 text-[#bfbcd1] no-underline text-xs mb-3'
        }
      >
        <ArrowLeft size={16} /> Back to voice widgets
      </Link>
      <h1>{headings[number]}</h1>
      <p className={'widget-setup-caption text-[#b3b9c9] m-[0_0_22px]'}>{descriptions[number]}</p>
      <div
        className={
          "widget-stepper grid grid-cols-[repeat(5,_1fr)] gap-2.5 mb-5.5 [&_a]:no-underline [&_a]:text-[#bfc0d0] [&_a]:relative [&_a]:flex [&_a]:flex-col [&_a]:gap-1.25 [&_a]:text-xs [&_a]:min-w-0 [&_a:not(:last-child):after]:content-[''] [&_a:not(:last-child):after]:absolute [&_a:not(:last-child):after]:top-4 [&_a:not(:last-child):after]:left-10 [&_a:not(:last-child):after]:right--1 [&_a:not(:last-child):after]:h-0.5 [&_a:not(:last-child):after]:bg-[#55515f] [&_.done:after]:bg-[#9364fd]! [&_a>span]:bg-[#37363f] [&_a>span]:w-8 [&_a>span]:h-8 [&_a>span]:rounded-full [&_a>span]:grid [&_a>span]:place-items-center [&_a>span]:mb-1.25 [&_a>span]:z-[1] [&_a.current>span]:bg-[#7046eb] [&_a.current>span]:text-white [&_a.done>span]:bg-[#7046eb] [&_a.done>span]:text-white [&_small]:text-[11px] [&_small]:text-[#aeb0c3] [&_small]:overflow-hidden [&_small]:text-ellipsis max-[1000px]:[&_small]:hidden max-[600px]:[&_a_strong]:text-[10px]"
        }
      >
        {steps.map((label, i) => (
          <Link
            key={label}
            href={i === 0 ? '/flow/7' : `/flow/${[8, 8, 9, 11, 12][i]}`}
            className={i + 1 === step ? 'current' : i + 1 < step ? 'done' : ''}
          >
            <span>{i + 1 < step ? <Check size={17} /> : i + 1}</span>
            <strong>{label}</strong>
            <small>
              {
                [
                  'Voice agent selected',
                  'Design and customize',
                  'Greeting and behavior',
                  'Where and when to show',
                  'Preview and deploy',
                ][i]
              }
            </small>
          </Link>
        ))}
      </div>
      {feedback && (
        <p
          className={
            'flow-alert flex gap-2.5 items-center bg-[#173b34] border border-[#296a55] text-[#81e4b8] p-[13px_16px] rounded-[9px] m-[15px_0] text-sm [&.problem]:bg-[#402630] [&.problem]:border-[#a44c68] [&.problem]:text-[#ffb5c1]'
          }
          role="status"
        >
          {feedback}
        </p>
      )}
      <div
        className={'widget-setup-layout grid grid-cols-[1fr_1.17fr] gap-3 max-[1000px]:grid-cols-1'}
      >
        <section
          className={
            'widget-setup-card border border-[#3b3944] rounded-[11px] bg-[#1d1d24] p-5 min-w-0 [&_h2]:text-[19px] [&_h2]:m-[0_0_6px] [&>p]:text-[#b0b3c2] [&>p]:text-xs [&>p]:m-[0_0_20px]'
          }
        >
          <h2>
            {number === 8
              ? 'Brand identity'
              : number === 9
                ? 'Conversation setup'
                : number === 10
                  ? 'Human handoff'
                  : number === 11
                    ? 'Website & hours'
                    : 'Test your voice widget'}
          </h2>
          <p>
            {number === 8
              ? 'Customize how your voice widget looks on your website.'
              : number === 12
                ? 'Try the voice preview and review your publish settings.'
                : config.caption}
          </p>
          {number !== 12 ? (
            <div
              className={
                'widget-setup-fields grid grid-cols-[1fr_1fr] gap-3.5 max-[600px]:grid-cols-1'
              }
            >
              {config.fields.map((field) => (
                <Field key={field.label} field={field} form={form} setForm={setForm} />
              ))}
            </div>
          ) : (
            <div
              className={
                'widget-test-card grid justify-items-center border border-[#44434c] p-[35px_15px] rounded-[9px] text-center [&_h3]:m-[28px_0_3px] [&_p]:text-[#c4bdd1] [&_p]:text-xs [&_.button]:m-[18px_0]'
              }
            >
              <span
                className={
                  'widget-test-orb w-27.5 h-27.5 rounded-full bg-[#673ce4] grid place-items-center shadow-[0_0_0_13px_#312647] text-white'
                }
              >
                <Mic size={47} />
              </span>
              <h3>AI voice assistant</h3>
              <p>Acme Support · {selectedAgent}</p>
              <button
                onClick={test}
                className={
                  'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,_#7c49f5,_#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
                }
              >
                <Mic size={18} /> {mic ? 'Microphone ready' : 'Test microphone'}
              </button>
              <p className={'widget-test-note border border-[#494550] p-2.5 rounded-[7px]'}>
                <Volume2 size={17} /> Demo permission test. Open the customer widget to try FAQ
                voice playback.
              </p>
              <Link
                className={'widget-test-link text-[#ac83ff] no-underline text-xs'}
                href="/flow/28"
              >
                Open customer preview <ArrowRight size={15} />
              </Link>
            </div>
          )}
          {number === 8 && (
            <p
              className={
                'widget-setup-tip flex gap-2 items-center border border-[#484253] rounded-lg p-3 text-[#c0b1db] m-[20px_0_0]!'
              }
            >
              <Info size={17} /> The preview updates as you enter the brand settings.
            </p>
          )}
        </section>
        <section
          className={
            'widget-setup-card border border-[#3b3944] rounded-[11px] bg-[#1d1d24] p-5 min-w-0 [&_h2]:text-[19px] [&_h2]:m-[0_0_6px] [&>p]:text-[#b0b3c2] [&>p]:text-xs [&>p]:m-[0_0_20px]'
          }
        >
          <div
            className={
              'widget-preview-heading [&_p]:text-[#b0b3c2] [&_p]:text-xs [&_p]:m-[0_0_20px] flex justify-between gap-2.5 items-start'
            }
          >
            <div>
              <h2>{number === 12 ? 'Deployment readiness' : 'Live preview'}</h2>
              <p>
                {number === 12
                  ? 'Check the configuration and copy the demo script.'
                  : 'See how your website voice assistant looks.'}
              </p>
            </div>
            {number === 8 && (
              <div
                className={
                  'device-switch flex border border-[#46404f] rounded-[7px] overflow-hidden [&_button]:p-[9px_13px] [&_button]:border-0 [&_button]:bg-none [&_button]:text-[#cec4da] [&_button]:cursor-pointer [&_button]:text-[11px] [&_button.active]:bg-[#6641e9] [&_button.active]:text-white'
                }
              >
                <button
                  className={device === 'Desktop' ? 'active' : ''}
                  onClick={() => setDevice('Desktop')}
                >
                  Desktop
                </button>
                <button
                  className={device === 'Mobile' ? 'active' : ''}
                  onClick={() => setDevice('Mobile')}
                >
                  Mobile
                </button>
              </div>
            )}
          </div>
          {number === 12 ? (
            <>
              <div
                className={
                  'readiness-list border border-[#43424e] rounded-lg overflow-hidden [&>div]:flex [&>div]:gap-2.5 [&>div]:items-center [&>div]:p-2.5 [&>div]:border-t [&>div]:border-t-[#3e3d49] [&>div:first-child]:border-0 [&_svg]:text-[#a481fa] [&>div>span]:flex-1 [&_strong]:block [&_small]:block [&_strong]:text-xs [&_small]:text-[#adb0bd] [&_small]:text-[10px] [&_em]:text-[10px] [&_em]:text-[#ffbd70] [&_em]:not-italic [&_em.yes]:text-[#4cdda4]'
                }
              >
                {[
                  ['Voice agent connected', Boolean(selectedAgent), selectedAgent],
                  [
                    'Greeting ready',
                    Boolean(record?.data?.screen_9 || record?.data?.screen_8),
                    'Welcome configured',
                  ],
                  [
                    'Human handoff',
                    Boolean(record?.data?.screen_10),
                    'Routes to the selected team',
                  ],
                  [
                    'Website added',
                    Boolean(record?.data?.screen_11?.['Allowed website URL']),
                    record?.data?.screen_11?.['Allowed website URL'] ||
                      'Enter the website on screen 11',
                  ],
                  ['Offline fallback', Boolean(record?.data?.screen_11), 'After-hours settings'],
                ].map(([label, isReady, description]) => (
                  <div key={label}>
                    <Headphones size={18} />
                    <span>
                      <strong>{label}</strong>
                      <small>{description}</small>
                    </span>
                    <em className={isReady ? 'yes' : ''}>{isReady ? '● Ready' : 'Setup needed'}</em>
                  </div>
                ))}
              </div>
              <div
                className={
                  'widget-install border border-[#454250] rounded-lg p-3.25 mt-3.75 [&_h3]:m-0 [&_h3]:text-sm [&_p]:text-[11px] [&_p]:text-[#bfc0cb] [&_code]:block [&_code]:whitespace-pre-wrap [&_code]:wrap-anywhere [&_code]:bg-[#181920] [&_code]:border [&_code]:border-[#46424f] [&_code]:text-[#cbb8ff] [&_code]:p-2.5 [&_code]:text-[10px] [&_button]:text-white [&_button]:bg-[#4f3a8c] [&_button]:border [&_button]:border-[#8a64ee] [&_button]:rounded-md [&_button]:p-[8px_10px] [&_button]:mt-2.25 [&_button]:cursor-pointer [&_button]:text-[11px]'
                }
              >
                <h3>Install on your website</h3>
                <p>Use this script after publishing the demo widget.</p>
                <code>{code}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(code).then(() => setCopied(true))}
                >
                  <Clipboard size={15} /> {copied ? 'Copied' : 'Copy code'}
                </button>
              </div>
            </>
          ) : (
            <div
              className={`preview-browser max-w-full bg-[#fff] rounded-lg overflow-hidden min-h-100 text-[#1f2332] [&.mobile]:max-w-85 [&.mobile]:m-auto${device === 'Mobile' ? 'mobile' : ''}`}
            >
              <div
                className={
                  'browser-bar flex items-center gap-1.5 bg-[#33343a] p-2.5 [&_i]:w-2.25 [&_i]:h-2.25 [&_i]:rounded-full [&_i]:bg-[#ff6b66] [&_i:nth-child(2)]:bg-[#ffce57] [&_i:nth-child(3)]:bg-[#44db8b] [&_span]:flex-1 [&_span]:bg-[#27282d] [&_span]:rounded-[20px] [&_span]:text-[#d8dbe1] [&_span]:p-[4px_12px] [&_span]:text-[10px] [&_span]:ml-2.25'
                }
              >
                <i /> <i /> <i />
                <span>⌕ &nbsp; www.acme.com</span>
              </div>
              <div
                className={
                  'preview-site min-h-97.5 bg-[linear-gradient(150deg,_#fff_45%,_#dce0ff)] p-3.25 relative'
                }
              >
                <div
                  className={
                    'preview-site-nav flex items-center justify-between text-[10px] [&_b]:text-[15px] [&_strong]:bg-[#673be9] [&_strong]:rounded-md [&_strong]:text-white [&_strong]:p-2.25 [&_strong]:text-[10px]'
                  }
                >
                  <b>◆ Acme</b>
                  <span>Products &nbsp;&nbsp; Solutions &nbsp;&nbsp; Pricing</span>
                  <strong>Get started</strong>
                </div>
                <div
                  className={
                    'preview-site-hero [&_span]:bg-[#673be9] [&_span]:rounded-md [&_span]:text-white [&_span]:p-2.25 [&_span]:text-[10px] m-[75px_0_0_15px] max-w-[48%] [&_small]:text-[#7546f2] [&_small]:font-bold [&_small]:text-[9px] [&_h3]:text-[25px] [&_h3]:tracking-[-.04em] [&_h3]:leading-[1.04] [&_h3]:m-[8px_0] [&_p]:text-[10px] [&_p]:leading-normal'
                  }
                >
                  <small>AI POWERED SUPPORT</small>
                  <h3>
                    Build something
                    <br />
                    extraordinary
                  </h3>
                  <p>Powerful AI solutions for modern businesses.</p>
                  <span>Get started</span>
                </div>
                <div
                  className={
                    'preview-widget-card absolute right-3 bottom-4.25 w-55 bg-[white] border border-[#ddd9ef] rounded-[10px] p-3 shadow-[0_8px_30px_#918cb94a] text-center [&_header]:flex [&_header]:items-center [&_header]:gap-1.5 [&_header]:text-[11px] [&_header]:text-left [&_header_span]:text-(--preview-accent) [&_p]:text-[10px] [&_p]:text-[#535166] [&_button]:bg-(--preview-accent) [&_button]:border-0 [&_button]:rounded-md [&_button]:text-white [&_button]:w-full [&_button]:p-2.25 [&_button]:text-[10px]'
                  }
                  style={{ '--preview-accent': form['Accent color'] || '#7c3aed' }}
                >
                  <header>
                    <span>◆</span>
                    <strong>{form['Widget name'] || record?.title || 'Acme Voice Support'}</strong>
                  </header>
                  <div
                    className={
                      'preview-voice-orb m-[18px_auto] w-19.25 h-19.25 rounded-full grid place-items-center text-white bg-(--preview-accent) shadow-[0_0_0_7px_#e7ddff]'
                    }
                  >
                    <AudioLines size={28} />
                  </div>
                  <p>
                    {number === 9
                      ? form['Welcome message'] || 'How can we help today?'
                      : number === 10
                        ? 'Ask the AI, or request a human specialist.'
                        : 'Talk with our AI assistant'}
                  </p>
                  <button>
                    <Phone size={15} /> Start voice conversation
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
      <div
        className={
          'widget-setup-footer border border-[#3f3a46] bg-[#24232b] rounded-[9px] p-3 flex items-center justify-between gap-3 mt-3 [&>span]:text-[11px] [&>span]:text-[#aeb0bf] max-[600px]:flex-wrap'
        }
      >
        <Link
          className={
            'button secondary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,_#7c49f5,_#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
          }
          href={`/flow/${number === 8 ? 7 : number === 12 ? 11 : number - 1}`}
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <span>
          {number === 12
            ? ready
              ? 'Ready for demo publishing'
              : 'Complete the website and agent setup to publish'
            : 'Settings are saved as you continue.'}
        </span>
        <button
          disabled={working}
          className={
            'button primary inline-flex items-center justify-center gap-2.25 rounded-lg border border-(--line) h-10.75 p-[0_18px] text-(--text) text-sm whitespace-nowrap bg-(--panel2) font-semibold [&.primary]:border-[#784afa] [&.primary]:bg-[linear-gradient(125deg,_#7c49f5,_#5a30e4)] [&.primary]:shadow-[0_4px_18px_#511fc533] [&.primary:hover]:brightness-[1.14] [&.secondary:hover]:border-[#8561dd] [&.subtle:hover]:border-[#8561dd] [&.small]:h-8.75 [&.small]:p-[0_13px] [&.subtle]:bg-[#272832] font-[590]'
          }
          onClick={() =>
            onSave({ advance: number !== 12, status: number === 12 ? 'published' : undefined })
          }
        >
          {working
            ? 'Saving…'
            : number === 12
              ? 'Publish voice widget'
              : number === 11
                ? 'Continue to test & install'
                : 'Save & continue'}{' '}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
