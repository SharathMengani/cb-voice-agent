import '@fontsource-variable/inter';
import './tailwind.css';

export const metadata = {
  title: 'Voice Agents · ChatBucket Business',
  description: 'Configure ChatBucket voice agents',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div
          id="voice-agent-app"
          className={
            "scheme-dark [--bg:#121318] [--panel:#1b1c23] [--panel2:#21222b] [--line:#34353f] [--text:#f6f6fa] [--muted:#a7a7bb] [--purple:#7542f5] [--purple2:#582fea] [--green:#2ad5a0] [--amber:#ffbe50] font-[Arial,Helvetica,sans-serif] m-0 min-h-full bg-(--bg) text-(--text) [&_button]:[font:inherit] [&_input]:[font:inherit] [&_textarea]:[font:inherit] [&_select]:[font:inherit] [&_button]:cursor-pointer [&_a]:text-inherit [&_a]:no-underline [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-[.55] [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_table]:min-w-212.5 [&_th]:bg-[#24242c] [&_th]:text-[#bcbcc8] [&_th]:text-[13px] [&_th]:font-medium [&_th]:p-[17px_20px] [&_td]:border-t [&_td]:border-t-(--line) [&_td]:p-[15px_20px] [&_td]:text-sm [&_td]:text-[#d7d6df] [&_td:first-child]:min-w-61.25 font-['Inter_Variable',Inter,system-ui,-apple-system,sans-serif] [&_button]:font-['Inter_Variable',Inter,system-ui,-apple-system,sans-serif] [&_input]:font-['Inter_Variable',Inter,system-ui,-apple-system,sans-serif] [&_textarea]:font-['Inter_Variable',Inter,system-ui,-apple-system,sans-serif] [&_select]:font-['Inter_Variable',Inter,system-ui,-apple-system,sans-serif]"
          }
        >
          {children}
        </div>
      </body>
    </html>
  );
}
