import { useState } from 'react';
import { Link } from 'react-router-dom';

export interface AdminQuestion {
  id: string;
  group: string;
  question: string;
  photos: { file: string; src: string | null }[];
  artworkId?: string;
}

export interface AdminAnswer {
  text: string;
  at: string;
}

interface Props {
  question: AdminQuestion;
  answer: AdminAnswer | undefined;
  onSave: (id: string, text: string) => Promise<boolean>;
  /** For the free-form note box: empty the field after each send. */
  clearAfterSend?: boolean;
}

function AdminQuestionCard({ question, answer, onSave, clearAfterSend }: Props): JSX.Element {
  const [text, setText] = useState(answer?.text ?? '');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  const send = async (): Promise<void> => {
    if (!text.trim() && !answer) return;
    setState('sending');
    const ok = await onSave(question.id, text);
    setState(ok ? 'sent' : 'failed');
    if (ok && clearAfterSend) setText('');
  };

  return (
    <article className="glass-card p-5 md:p-6">
      {question.photos.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-3 mb-4">
          {question.photos.map((p) =>
            p.src ? (
              <a key={p.file} href={p.src} target="_blank" rel="noreferrer" className="shrink-0">
                <img src={p.src} alt={p.file} loading="lazy" className="h-44 w-auto rounded-lg shadow-soft" />
                <span className="block font-body text-[11px] text-text-muted mt-1">{p.file}</span>
              </a>
            ) : (
              <span key={p.file} className="shrink-0 font-body text-xs text-text-muted border border-[#E2DBC9] rounded-lg px-3 py-2">
                {p.file}
              </span>
            )
          )}
        </div>
      )}
      <p className="font-body text-base text-text-primary">{question.question}</p>
      {question.artworkId && (
        <Link to={`/artwork/${question.artworkId}`} className="font-body text-xs text-text-muted underline">
          See it on the site
        </Link>
      )}
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setState('idle'); }}
        rows={3}
        maxLength={5000}
        aria-label={`Answer: ${question.question}`}
        className="mt-4 w-full rounded-xl border border-[#E2DBC9] bg-white/80 px-4 py-3 font-body text-sm text-text-primary"
      />
      <div className="flex items-center gap-4 mt-3">
        <button
          type="button"
          onClick={send}
          disabled={state === 'sending'}
          className="glass-pill px-5 py-2 font-body text-sm text-text-primary disabled:opacity-50"
        >
          {state === 'sending' ? 'Sending…' : 'Send'}
        </button>
        {state === 'sent' && <span className="font-body text-sm text-green-700">Sent</span>}
        {state === 'failed' && <span className="font-body text-sm text-red-700">Didn't send. Try again.</span>}
        {state === 'idle' && answer && (
          <span className="font-body text-xs text-text-muted">Answered {new Date(answer.at).toLocaleDateString()}</span>
        )}
      </div>
    </article>
  );
}

export default AdminQuestionCard;
