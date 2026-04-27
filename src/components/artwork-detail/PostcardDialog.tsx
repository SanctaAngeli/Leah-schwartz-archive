// Send a painting as a postcard · compose dialog that opens the user's mail client.

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Artwork } from '../../types';

interface Props {
  artwork: Artwork;
  open: boolean;
  onClose: () => void;
}

export default function PostcardDialog({ artwork, open, onClose }: Props): JSX.Element | null {
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [fromName, setFromName] = useState('');
  const [message, setMessage] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && nameInputRef.current) nameInputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  const artworkUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/artwork/${artwork.id}`
    : `/artwork/${artwork.id}`;

  const handleSend = () => {
    const subject = `A painting from Leah Schwartz: ${artwork.display_title || artwork.title}`;
    const greeting = recipientName ? `Dear ${recipientName},\n\n` : '';
    const fromLine = fromName ? `\n\nFrom ${fromName}` : '';
    const userMsg = message.trim() ? message.trim() + '\n\n' : '';
    const body = [
      greeting + userMsg + `I wanted to send you a painting.`,
      '',
      `"${artwork.display_title || artwork.title}" by Leah Schwartz`,
      [
        artwork.year ? `${artwork.circa ? 'c. ' : ''}${artwork.year}` : null,
        artwork.medium,
        artwork.dimensions,
      ].filter(Boolean).join(' · '),
      '',
      'See it here: ' + artworkUrl,
      '',
      'From the Leah Schwartz Archive · 267 paintings, 28,660 words, one life.' + fromLine,
    ].join('\n');
    const mailto = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setTimeout(onClose, 500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Send this painting as a postcard"
        >
          <motion.div
            className="relative w-full max-w-lg mx-4 bg-bg-gallery rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Painting strip at top */}
            <div className="relative aspect-[3/1] bg-[#fafafa] overflow-hidden" style={{ backgroundColor: artwork.placeholderColor }}>
              {artwork.imagePath && (
                <img
                  src={artwork.thumbPath || artwork.imagePath}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <p className="font-heading italic text-sm drop-shadow">A painting from Leah</p>
                <p className="font-heading text-lg md:text-xl drop-shadow">
                  {artwork.display_title || artwork.title}
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="font-body text-text-muted uppercase tracking-widest text-[11px]">Share</p>
                  <h2 className="font-heading text-2xl text-text-primary">Send as a postcard</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-text-muted hover:text-text-primary"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <form
                className="space-y-3"
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="font-body text-text-muted text-xs">To (name)</span>
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="A dear friend"
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E8E2D5] bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/40"
                    />
                  </label>
                  <label className="block">
                    <span className="font-body text-text-muted text-xs">Their email</span>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="friend@example.com"
                      required
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E8E2D5] bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/40"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="font-body text-text-muted text-xs">Your note (optional)</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Why did this painting make you think of them?"
                    rows={3}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E8E2D5] bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/40 resize-none"
                  />
                </label>
                <label className="block">
                  <span className="font-body text-text-muted text-xs">From (your name)</span>
                  <input
                    type="text"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    placeholder="You"
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-[#E8E2D5] bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/40"
                  />
                </label>

                <div className="flex items-center justify-between pt-2">
                  <p className="font-body text-[11px] text-text-muted italic">
                    Opens in your mail app. Nothing is sent by this site.
                  </p>
                  <button
                    type="submit"
                    disabled={!recipientEmail}
                    className="glass-pill px-5 py-2.5 font-body text-sm text-text-primary hover:shadow-glass transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Send postcard →
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
