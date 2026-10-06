'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  AudioLines,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Headphones,
  Mail,
  Mic,
  Phone,
  PhoneOff,
  Search,
  Send,
  ShieldCheck,
  Star,
  UserRound,
  Volume2,
  X,
} from 'lucide-react';
import { apiFetch } from './api-client';

const icons = [BookOpen, ShieldCheck, AudioLines, Headphones];
const cards = [
  ['Getting started', 'Set up the account and learn the basics'],
  ['Product guides', 'Find setup instructions and tutorials'],
  ['Billing & plans', 'Manage subscription and payments'],
  ['Troubleshooting', 'Resolve common problems'],
];
export default function CustomerWidget({
  number,
  config,
  record,
  form,
  setForm,
  onPrimary,
  onSave,
  feedback,
  working,
  widgetToken,
  widgetId,
}) {
  const [stars, setStars] = useState(5);
  const [answer, setAnswer] = useState('');
  const [typing, setTyping] = useState(false);
  const [muted, setMuted] = useState(false);
  const widgetPath = (value) =>
    `/flow/${value}${widgetId ? `?widget=${encodeURIComponent(widgetId)}` : ''}`;
  async function ask() {
    const question = String(form['Your question'] || '').trim();
    if (!question) return;
    setTyping(true);
    try {
      const response = await apiFetch('/api/demo/widget/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Widget-Session': widgetToken },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error);
      setAnswer(data.answer);
      if (!muted && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(data.answer);
        utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      setAnswer(error.message);
    } finally {
      setTyping(false);
    }
  }
  function update(label, value) {
    setForm((current) => ({ ...current, [label]: value }));
  }
  return (
    <div
      className={
        "acme-site min-h-screen bg-white text-[#1d2332] font-['Inter_Variable',system-ui,sans-serif]"
      }
    >
      <header
        className={
          'acme-header h-16.25 border-b border-b-[#e9eaf0] flex items-center gap-9 p-[0_max(25px,calc((100vw-1200px)/2))] text-[13px] [&_nav]:flex [&_nav]:gap-6.25 [&_nav]:text-[#666e80] [&_nav]:flex-1 [&_button]:bg-[#6843ea] [&_button]:border-0 [&_button]:rounded-[5px] [&_button]:text-white [&_button]:p-[9px_14px] [&_button]:text-xs max-[900px]:p-[0_20px] max-[650px]:[&_nav]:hidden'
        }
      >
        <Link
          href={widgetPath(28)}
          className={'acme-logo text-[21px] font-[750] tracking-[-.7px] flex items-center gap-2'}
        >
          <span className={'acme-logo-glyph text-[#6742f0] text-[22px]'}>◆</span> Acme
        </Link>
        <nav>
          <span>Products</span>
          <span>Support</span>
          <span>Pricing</span>
          <span>Resources</span>
        </nav>
        <button>Get started</button>
      </header>
      <main
        className={
          'acme-body m-[80px_max(28px,calc((100vw-1160px)/2))] w-[min(665px,calc(100%-440px))] [&_h1]:text-[36px] [&_h1]:m-[9px_0_5px] [&_h1]:tracking-[-1.4px] [&>p]:text-[#717a8c] [&>p]:text-sm [&_h2]:text-base [&_h2]:m-[38px_0_14px] max-[900px]:w-[calc(100%-400px)] max-[900px]:ml-7.5 max-[650px]:hidden'
        }
      >
        <p className={'acme-eyebrow text-[11px] text-[#6c48e7]! font-[750] tracking-[1.2px]'}>
          HELP CENTER
        </p>
        <h1>Acme Support</h1>
        <p>How can we help you today?</p>
        <div
          className={
            'acme-search border border-[#dfe2e9] rounded-[7px] text-[#98a0af] p-[13px_15px] text-xs flex items-center gap-2.5 m-[27px_0]'
          }
        >
          <Search size={19} /> Search for help articles, guides, and FAQs…
        </div>
        <div className={'acme-cards grid grid-cols-[1fr_1fr] gap-3.25'}>
          {cards.map(([title, description], index) => {
            const Icon = icons[index];
            return (
              <div
                className={
                  'acme-card border border-[#e8e9ee] rounded-[7px] min-h-35.5 p-4.25 flex flex-col items-start [&>span:first-child]:text-[#7655de] [&>span:first-child]:bg-[#f1ecff] [&>span:first-child]:rounded-md [&>span:first-child]:p-1.75 [&>span:first-child]:grid [&>span:first-child]:place-items-center [&_strong]:text-[13px] [&_strong]:mt-2.75 [&_small]:text-[#888f9b] [&_small]:mt-1.25 [&_small]:text-[11px] [&_.acme-more]:text-[#7956e9] [&_.acme-more]:text-[10px] [&_.acme-more]:mt-auto [&_.acme-more]:pt-2'
                }
                key={title}
              >
                <span>
                  <Icon size={21} />
                </span>
                <strong>{title}</strong>
                <small>{description}</small>
                <span className={'acme-more'}>View articles →</span>
              </div>
            );
          })}
        </div>
        <h2>Popular articles</h2>
        {[
          'How to set up your first agent',
          'Change billing information',
          'Install a widget on your website',
          'Contact support',
        ].map((title) => (
          <div
            className={
              'acme-article border-b border-b-[#ecedf2] text-[#697184] text-xs p-[11px_4px] flex items-center gap-2.25 [&_span]:ml-auto'
            }
            key={title}
          >
            <BookOpen size={17} />
            {title} <span>›</span>
          </div>
        ))}
      </main>
      <section
        aria-label="ChatBucket voice widget"
        className={
          'voice-widget fixed right-[max(28px,calc((100vw-1240px)/2))] bottom-5 w-89 h-[min(730px,calc(100vh-42px))] flex flex-col bg-[#181a28] text-[#f5f4ff] border border-[#454052] rounded-[13px] shadow-[0_24px_55px_#25203555] overflow-hidden text-[13px] max-[650px]:left-0 max-[650px]:right-0 max-[650px]:top-0 max-[650px]:bottom-0 max-[650px]:w-full max-[650px]:h-screen max-[650px]:rounded-none'
        }
      >
        <div
          className={
            'widget-top h-12.5 border-b border-b-[#3c394c] p-[0_16px] flex items-center justify-between [&_strong]:text-xs [&_strong]:flex [&_strong]:items-center [&_strong]:gap-1.25 [&_small]:text-[#abb0c2] [&_small]:text-[10px] [&_small]:font-normal'
          }
        >
          <strong>
            <span
              className={
                'widget-small-logo grid place-items-center text-[#e1d8ff] bg-[#7048df] rounded-[5px] w-5.5 h-5.5'
              }
            >
              <AudioLines size={16} />
            </span>{' '}
            ChatBucket <small>· Acme Support</small>
          </strong>
          <span className={'widget-language text-[10px] text-[#c3b8df]'}>English · हिन्दी</span>
        </div>
        <div
          className={
            'widget-crumb h-8.75 flex items-center justify-evenly border-b border-b-[#343142] text-[#8a8b9c] text-[10px]'
          }
        >
          <span>⌕ Chat</span>
          <span
            className={
              'widget-crumb-active text-[#d1bbff] flex items-center gap-1 border-b-[2px_solid_#9a69ff] h-8.75'
            }
          >
            <Phone size={13} /> Voice Support
          </span>
          <span>✦ Help center</span>
        </div>
        <div
          className={
            'widget-body min-h-0 overflow-y-auto p-[22px_19px] flex flex-col items-center flex-1 [&_h2]:text-base [&_h2]:text-center [&_h2]:m-[5px_0] [&_h2]:tracking-[-.3px] [&_h3]:text-[13px] [&_h3]:m-[12px_0]'
          }
        >
          <span
            className={
              'widget-avatar grid place-items-center w-12.75 h-12.75 text-[#ebdfff] bg-[linear-gradient(145deg,#8357fa,#5125c9)] rounded-full mb-3.25 shadow-[0_0_0_10px_#6845bd19]'
            }
          >
            <AudioLines size={22} />
          </span>
          <h2>
            {number === 28
              ? 'Talk to support'
              : number === 29
                ? 'Website Support AI'
                : number === 30
                  ? 'Finding a human specialist'
                  : number === 31
                    ? 'Priya Sharma joined'
                    : number === 32
                      ? 'Request a callback'
                      : number === 33
                        ? 'How was your support?'
                        : 'Inbound phone support'}
          </h2>
          <p className={'widget-subtitle text-[11px] text-[#b9b7c9] text-center m-[0_0_18px]'}>
            {number === 28
              ? 'Hi! How can we help today?'
              : number === 29
                ? 'AI is speaking · Ask your question'
                : number === 30
                  ? 'The team has your request'
                  : number === 31
                    ? 'A support specialist is connected'
                    : number === 32
                      ? 'Our team will contact you'
                      : number === 33
                        ? 'Your call has ended'
                        : 'Acme Support · AI voice agent'}
          </p>
          {number === 28 && (
            <>
              <p
                className={
                  'widget-description text-xs text-[#bfbed0] leading-[1.55] text-center max-w-65 m-[0_0_20px]'
                }
              >
                Speak naturally with our AI voice agent. Ask for a person at any time.
              </p>
              <span
                className={
                  'mic-ring w-19.25 h-19.25 rounded-full grid place-items-center bg-[linear-gradient(135deg,#7854ec,#502fca)] shadow-[0_0_0_10px_#825deb22] m-[8px_0_28px] text-white'
                }
              >
                <Mic size={30} />
              </span>
              <button
                className={
                  'widget-main-button border-0 bg-[#7443ee] text-white rounded-md p-[12px_15px] text-xs font-[620] w-full flex items-center justify-center gap-1.75 min-h-10.25 shadow-[0_7px_15px_#501ca33b] disabled:opacity-[.6]'
                }
                onClick={onPrimary}
              >
                Allow microphone & start <ArrowRight size={16} />
              </button>
              <div
                className={
                  'widget-option border border-[#3a394b] rounded-lg text-[#c1bfd1] text-[10px] p-2.75 w-full flex gap-2.25 items-center mt-2.5 [&_svg]:text-[#b89cfd]'
                }
              >
                <Headphones size={17} /> Voice call with Website Support AI
              </div>
              <Link
                className={
                  'widget-option border border-[#3a394b] rounded-lg text-[#c1bfd1] text-[10px] p-2.75 w-full flex gap-2.25 items-center mt-2.5 [&_svg]:text-[#b89cfd]'
                }
                href={widgetPath(32)}
              >
                <Phone size={17} /> Choose a callback instead
              </Link>
            </>
          )}
          {number === 29 && (
            <>
              <div
                className={
                  'widget-wave grid place-items-center text-[#b286ff] m-[15px_0_22px] gap-1.5 [&_span]:text-[11px] [&_span]:text-[#aeadc0]'
                }
              >
                <AudioLines size={48} />
                <span>AI is listening</span>
              </div>
              <div
                className={
                  'widget-transcript bg-[#292938] rounded-lg p-[10px_12px] w-full m-[0_0_11px] text-[11px] [&_span]:text-[#b38eff] [&_span]:text-[10px] [&_p]:m-[5px_0_0] [&_p]:leading-[1.45] [&.answer]:bg-[#382b66]'
                }
              >
                <span>AI voice agent</span>
                <p>Welcome to Acme Support. What can I help you with?</p>
              </div>
              <div
                className={
                  'widget-question flex w-full gap-1.25 border border-[#484256] rounded-[7px] p-1.25 mb-2.5 [&_input]:border-0 [&_input]:min-w-0 [&_input]:bg-transparent [&_input]:text-[#eee] [&_input]:outline-0 [&_input]:flex-1 [&_input]:text-[11px] [&_input]:p-1.25 [&_button]:bg-[#6440be] [&_button]:border-0 [&_button]:rounded-[5px] [&_button]:text-white [&_button]:w-7.25 [&_button]:grid [&_button]:place-items-center'
                }
              >
                <input
                  value={form['Your question'] || ''}
                  onChange={(e) => update('Your question', e.target.value)}
                  placeholder="Type a question to try the demo…"
                />
                <button disabled={typing} onClick={ask} aria-label="Ask voice agent">
                  <Send size={17} />
                </button>
              </div>
              {answer && (
                <div
                  className={
                    'widget-transcript answer bg-[#292938] rounded-lg p-[10px_12px] w-full m-[0_0_11px] text-[11px] [&_span]:text-[#b38eff] [&_span]:text-[10px] [&_p]:m-[5px_0_0] [&_p]:leading-[1.45] [&.answer]:bg-[#382b66]'
                  }
                >
                  <span>Website Support AI · Demo response</span>
                  <p>{answer}</p>
                </div>
              )}
              <button
                className={
                  'widget-main-button border-0 bg-[#7443ee] text-white rounded-md p-[12px_15px] text-xs font-[620] w-full flex items-center justify-center gap-1.75 min-h-10.25 shadow-[0_7px_15px_#501ca33b] disabled:opacity-[.6]'
                }
                onClick={onPrimary}
                disabled={working}
              >
                Talk to a person <ArrowRight size={16} />
              </button>
              <div
                className={
                  'widget-call-controls flex justify-center gap-2.5 w-full mt-auto pt-3.5 [&_button]:flex [&_button]:flex-col [&_button]:items-center [&_button]:justify-center [&_button]:gap-1.5 [&_button]:text-[#c4c3d1] [&_button]:text-[10px] [&_button]:bg-none [&_button]:border-0 [&_button]:min-w-15 [&_a]:flex [&_a]:flex-col [&_a]:items-center [&_a]:justify-center [&_a]:gap-1.5 [&_a]:text-[#c4c3d1] [&_a]:text-[10px] [&_a]:bg-none [&_a]:border-0 [&_a]:min-w-15 [&_a]:text-[#fc797d]'
                }
              >
                <button onClick={() => setMuted(!muted)}>
                  <Mic size={18} />
                  {muted ? 'Unmute' : 'Mute'}
                </button>
                <button onClick={() => setMuted(!muted)}>
                  <Volume2 size={18} /> Audio
                </button>
                <Link href={widgetPath(33)}>
                  <PhoneOff size={18} /> End call
                </Link>
              </div>
            </>
          )}
          {number === 30 && (
            <>
              <span
                className={
                  'connecting-orb w-19.25 h-19.25 rounded-full grid place-items-center bg-[linear-gradient(135deg,#7854ec,#502fca)] shadow-[0_0_0_10px_#825deb22] m-[8px_0_28px] text-white'
                }
              >
                <Headphones size={38} />
              </span>
              <p
                className={
                  'widget-description text-xs text-[#bfbed0] leading-[1.55] text-center max-w-65 m-[0_0_20px]'
                }
              >
                A member of Technical Support has been notified. Please stay on the call.
              </p>
              <div
                className={
                  'widget-progress w-full flex justify-between border-t border-t-[#353348] m-[5px_0_15px] pt-3 text-[9px] text-[#85869b] [&_.active]:text-[#b794fa]'
                }
              >
                <span className={'active'}>Requested</span>
                <span className={'active'}>Notifying team</span>
                <span>Connecting</span>
              </div>
              <div
                className={
                  'widget-note bg-[#2d2942] rounded-[7px] p-2.75 flex items-start gap-2 text-[11px] text-[#d5c9ee] leading-normal m-[0_0_15px]'
                }
              >
                <Clock3 size={17} /> You're next in line. The AI has shared your question with the
                team.
              </div>
              <button
                className={
                  'widget-main-button border-0 bg-[#7443ee] text-white rounded-md p-[12px_15px] text-xs font-[620] w-full flex items-center justify-center gap-1.75 min-h-10.25 shadow-[0_7px_15px_#501ca33b] [&:disabled]:opacity-[.6]'
                }
                onClick={onPrimary}
              >
                Check for available agent
              </button>
              <Link
                className={'widget-link text-[#c6a8ff] text-[11px] m-[16px_auto_4px] underline'}
                href={widgetPath(32)}
              >
                Request a callback instead
              </Link>
            </>
          )}
          {number === 31 && (
            <>
              <div
                className={
                  'joined-avatars flex m-[7px_auto_15px] [&_span]:grid [&_span]:place-items-center [&_span]:bg-[#693dde] [&_span]:rounded-full [&_span]:w-13.5 [&_span]:h-13.5 [&_span]:border-[3px_solid_#191a2b] [&_span+span]:bg-[#494061] [&_span+span]:ml--2.5'
                }
              >
                <span>
                  <AudioLines size={22} />
                </span>
                <span>
                  <UserRound size={23} />
                </span>
              </div>
              <h3>
                {record?.status === 'human'
                  ? `${record?.data?.assignedAgent || 'A support specialist'} is here to help`
                  : 'Waiting for an agent to join'}
              </h3>
              <p
                className={
                  'widget-description text-xs text-[#bfbed0] leading-[1.55] text-center max-w-65 m-[0_0_20px]'
                }
              >
                {record?.status === 'human'
                  ? 'Technical Support · You are now speaking with a person.'
                  : 'An agent needs to accept this call before joining.'}
              </p>
              <div
                className={
                  'widget-transcript bg-[#292938] rounded-lg p-[10px_12px] w-full m-[0_0_11px] text-[11px] [&_span]:text-[#b38eff] [&_span]:text-[10px] [&_p]:m-[5px_0_0] [&_p]:leading-[1.45] [&.answer]:bg-[#382b66]'
                }
              >
                <span>System update</span>
                <p>
                  {record?.status === 'human'
                    ? `${record?.data?.assignedAgent || 'Your support specialist'} joined this conversation.`
                    : 'Your request has been sent to Technical Support.'}
                </p>
              </div>
              <div
                className={
                  'widget-call-controls flex justify-center gap-2.5 w-full mt-auto pt-3.5 [&_button]:flex [&_button]:flex-col [&_button]:items-center [&_button]:justify-center [&_button]:gap-1.5 [&_button]:text-[#c4c3d1] [&_button]:text-[10px] [&_button]:bg-none [&_button]:border-0 [&_button]:min-w-15 [&_a]:flex [&_a]:flex-col [&_a]:items-center [&_a]:justify-center [&_a]:gap-1.5 [&_a]:text-[#c4c3d1] [&_a]:text-[10px] [&_a]:bg-none [&_a]:border-0 [&_a]:min-w-15 [&_a]:text-[#fc797d]'
                }
              >
                <button onClick={() => setMuted(!muted)}>
                  <Mic size={18} />
                  {muted ? 'Unmute' : 'Mute'}
                </button>
                <button>
                  <Volume2 size={18} /> Speaker
                </button>
                <Link href={widgetPath(33)}>
                  <PhoneOff size={18} /> End call
                </Link>
              </div>
            </>
          )}
          {number === 32 && (
            <>
              <div className="callback-icon">
                <Phone size={26} />
              </div>
              <p
                className={
                  'widget-description text-xs text-[#bfbed0] leading-[1.55] text-center max-w-65 m-[0_0_20px]'
                }
              >
                No one is available right now. Leave your details and we’ll follow up.
              </p>
              <div
                className={
                  'widget-form grid gap-2.25 w-full mb-3 [&_label]:grid [&_label]:gap-1.25 [&_label]:text-[10px] [&_label]:text-[#c8c6d4] [&_label]:text-left [&_input]:bg-[#262536] [&_input]:border [&_input]:border-[#494658] [&_input]:text-white [&_input]:rounded-[5px] [&_input]:p-2.25 [&_input]:text-[11px] [&_input]:outline-none [&_input]:resize-y [&_input]:w-full [&_textarea]:bg-[#262536] [&_textarea]:border [&_textarea]:border-[#494658] [&_textarea]:text-white [&_textarea]:rounded-[5px] [&_textarea]:p-2.25 [&_textarea]:text-[11px] [&_textarea]:outline-none [&_textarea]:resize-y [&_textarea]:w-full'
                }
              >
                {[
                  ['Your name', 'text'],
                  ['Phone number', 'tel'],
                  ['Email', 'email'],
                ].map(([label, type]) => (
                  <label key={label}>
                    {label}
                    <input
                      type={type}
                      value={form[label] || ''}
                      onChange={(e) => update(label, e.target.value)}
                      required={label !== 'Email'}
                    />
                  </label>
                ))}
                <label>
                  How can we help?
                  <textarea
                    value={form['How can we help?'] || ''}
                    onChange={(e) => update('How can we help?', e.target.value)}
                  />
                </label>
              </div>
              <button
                className={
                  'widget-main-button border-0 bg-[#7443ee] text-white rounded-md p-[12px_15px] text-xs font-[620] w-full flex items-center justify-center gap-1.75 min-h-10.25 shadow-[0_7px_15px_#501ca33b] [&:disabled]:opacity-[.6]'
                }
                disabled={working || !form['Your name'] || !form['Phone number']}
                onClick={onPrimary}
              >
                Request callback
              </button>
            </>
          )}
          {number === 33 && (
            <>
              <span
                className={
                  'rating-orb w-19.25 h-19.25 rounded-full grid place-items-center bg-[linear-gradient(135deg,#7854ec,#502fca)] shadow-[0_0_0_10px_#825deb22] m-[8px_0_28px] text-white'
                }
              >
                <Phone size={27} />
              </span>
              <p
                className={
                  'widget-description text-xs text-[#bfbed0] leading-[1.55] text-center max-w-65 m-[0_0_20px]'
                }
              >
                Your feedback helps us improve our support.
              </p>
              <div
                className={
                  'widget-stars flex m-[4px_0_18px] [&_button]:bg-none [&_button]:border-0 [&_button]:p-0.5'
                }
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    aria-label={`Rate ${value} stars`}
                    onClick={() => {
                      setStars(value);
                      update('Rating', String(value));
                    }}
                  >
                    <Star
                      size={29}
                      fill={value <= stars ? '#ffce56' : 'transparent'}
                      color={value <= stars ? '#ffce56' : '#636080'}
                    />
                  </button>
                ))}
              </div>
              <textarea
                className={
                  'widget-feedback bg-[#262536] border border-[#494658] text-white rounded-[5px] p-2.25 text-[11px] outline-none resize-y w-full min-h-16 m-[0_0_12px]'
                }
                placeholder="What went well? (optional)"
                value={form['Your feedback'] || ''}
                onChange={(e) => update('Your feedback', e.target.value)}
              />
              <button
                className={
                  'widget-main-button border-0 bg-[#7443ee] text-white rounded-md p-[12px_15px] text-xs font-[620] w-full flex items-center justify-center gap-1.75 min-h-10.25 shadow-[0_7px_15px_#501ca33b] disabled:opacity-[.6]'
                }
                disabled={working}
                onClick={onPrimary}
              >
                Submit rating
              </button>
              <Link
                href={widgetPath(28)}
                className={'widget-link text-[#c6a8ff] text-[11px] m-[16px_auto_4px] underline'}
              >
                Skip for now
              </Link>
            </>
          )}
          {number === 42 && (
            <>
              <div
                className={
                  'widget-wave grid place-items-center text-[#b286ff] m-[15px_0_22px] gap-1.5 [&_span]:text-[11px] [&_span]:text-[#aeadc0]'
                }
              >
                <Phone size={39} />
                <span>Inbound phone route</span>
              </div>
              <p
                className={
                  'widget-description text-xs text-[#bfbed0] leading-[1.55] text-center max-w-65 m-[0_0_20px]'
                }
              >
                A caller dials your business number. Website Support AI answers and can request a
                person.
              </p>
              <button
                className={
                  'widget-main-button border-0 bg-[#7443ee] text-white rounded-md p-[12px_15px] text-xs font-[620] w-full flex items-center justify-center gap-1.75 min-h-10.25 shadow-[0_7px_15px_#501ca33b] disabled:opacity-[.6]'
                }
                onClick={onPrimary}
              >
                Open inbound routing <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
        <div
          className={
            'widget-footer border-t border-t-[#363449] h-8.5 p-[0_12px] flex items-center justify-center text-[10px] text-[#9793a9] [&_span]:flex [&_span]:gap-1.25 [&_span]:items-center'
          }
        >
          {feedback ? (
            <span
              className={
                'widget-error text-[#fac9c9] text-[10px] overflow-hidden text-ellipsis whitespace-nowrap'
              }
              role="status"
            >
              {feedback}
            </span>
          ) : (
            <span>
              <ShieldCheck size={14} /> Powered by ChatBucket Voice · Demo
            </span>
          )}
        </div>
      </section>
      <Link
        className={
          'customer-all-screens fixed left-4 bottom-3 bg-white text-[#5d3dc9] text-[10px] max-[650px]:hidden'
        }
        href="/screens"
      >
        View 51-screen flow
      </Link>
    </div>
  );
}
