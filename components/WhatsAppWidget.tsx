'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type WhatsAppWidgetProps = {
  /** Phone number in international format, digits only (no +). */
  phone?: string;
  /** Name shown in the chat card header. */
  agentName?: string;
  /** Short status line under the agent name. */
  agentStatus?: string;
  /** The greeting bubble shown when the card opens. */
  greeting?: string;
  /** Prefilled message the customer sends when starting the chat. */
  prefilledMessage?: string;
};

const DEFAULT_PHONE = '233246033792';

// Routes where the widget should never show (admin, checkout, payment flows).
const HIDDEN_PREFIXES = ['/admin', '/checkout', '/pay', '/shopper/pay', '/auth', '/shopper/payment-complete'];

export default function WhatsAppWidget({
  phone = DEFAULT_PHONE,
  agentName = 'GSG Support',
  agentStatus = 'Typically replies within minutes',
  greeting = "Hi there! 👋\n\nWelcome to GSG. How can we help you today?",
  prefilledMessage = "Hi GSG! I'd like some help.",
}: WhatsAppWidgetProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay first paint slightly so it doesn't compete with initial load.
    const t = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Close the card whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isHidden = HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (isHidden || !mounted) return null;

  const cleanPhone = phone.replace(/[^\d]/g, '');
  const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(prefilledMessage)}`;

  return (
    <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-[60] flex flex-col items-end gap-3 print:hidden">
      {/* Chat card */}
      <div
        className={`w-[calc(100vw-2rem)] max-w-[340px] origin-bottom-right overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-200 ${
          open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        }`}
        role="dialog"
        aria-label="Chat with us on WhatsApp"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3.5 text-white">
          <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
            <i className="ri-whatsapp-fill text-2xl text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#075E54] bg-green-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold leading-tight">{agentName}</p>
            <p className="truncate text-xs text-white/80">{agentStatus}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        {/* Body — WhatsApp-style chat backdrop */}
        <div className="bg-[#ECE5DD] px-4 py-5">
          <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-white px-3.5 py-2.5 shadow-sm">
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-800">
              {greeting}
            </p>
            <span className="mt-1 block text-right text-[10px] text-gray-400">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-white p-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-semibold text-white shadow-md transition-all hover:bg-[#1FB855] hover:shadow-lg active:scale-95"
          >
            <i className="ri-whatsapp-fill text-xl" />
            Start Chat
          </a>
        </div>
      </div>

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close WhatsApp chat' : 'Chat with us on WhatsApp'}
        aria-expanded={open}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#1FB855] hover:shadow-xl active:scale-95"
      >
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-60" />
        )}
        <i className={`relative text-3xl ${open ? 'ri-close-line' : 'ri-whatsapp-fill'}`} />
      </button>
    </div>
  );
}
