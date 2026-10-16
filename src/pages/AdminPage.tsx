import { useEffect, useMemo, useState } from 'react';
import AdminQuestionCard from '../components/admin/AdminQuestionCard';
import type { AdminAnswer, AdminQuestion } from '../components/admin/AdminQuestionCard';
import { usePageMeta } from '../hooks/usePageMeta';

// Private page for the family: questions about photos that need an answer
// (titles, dates, which house a plan was for). Not linked from anywhere and
// hidden from search engines. The password is checked on the server by
// netlify/functions/admin.mts; this page only remembers it for the session.

const ENDPOINT = '/.netlify/functions/admin';
const PASSWORD_KEY = 'leah-admin-password';

type Status = 'locked' | 'loading' | 'ready' | 'wrong' | 'not-configured' | 'error';

function readSaved(): string {
  try {
    return sessionStorage.getItem(PASSWORD_KEY) ?? '';
  } catch {
    return '';
  }
}

function AdminPage(): JSX.Element {
  usePageMeta('Admin');
  const [password, setPassword] = useState(readSaved);
  const [status, setStatus] = useState<Status>(password ? 'loading' : 'locked');
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, AdminAnswer>>({});
  const [onlyOpen, setOnlyOpen] = useState(true);
  // Questions answered before this visit. Ones answered during the visit stay
  // on screen (showing "Sent") until the page is reloaded.
  const [answeredBefore, setAnsweredBefore] = useState<Set<string>>(new Set());

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const load = async (pw: string): Promise<void> => {
    setStatus('loading');
    try {
      const res = await fetch(ENDPOINT, { headers: { 'x-admin-password': pw } });
      if (res.status === 401) return setStatus('wrong');
      if (res.status === 503) return setStatus('not-configured');
      if (!res.ok) return setStatus('error');
      const data = await res.json();
      setQuestions(data.questions);
      setAnswers(data.answers);
      setAnsweredBefore(new Set(Object.keys(data.answers)));
      try {
        sessionStorage.setItem(PASSWORD_KEY, pw);
      } catch {
        // Private browsing: they'll just be asked again next visit.
      }
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    if (password && status === 'loading') load(password);
    // Only on first mount, with a password remembered from earlier.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (id: string, text: string): Promise<boolean> => {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id, text }),
    }).catch(() => null);
    if (!res || !res.ok) return false;
    const data = await res.json();
    setAnswers((prev) => {
      const next = { ...prev };
      if (data.answer) next[id] = data.answer;
      else delete next[id];
      return next;
    });
    return true;
  };

  const download = (): void => {
    const rows = questions.map((q) => ({ id: q.id, question: q.question, answer: answers[q.id]?.text ?? null }));
    const notes = Object.entries(answers).filter(([id]) => id.startsWith('note-')).map(([id, a]) => ({ id, note: a.text }));
    const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), answers: rows, notes }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `leah-archive-answers-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const groups = useMemo(() => {
    const visible = questions.filter((q) => !onlyOpen || !answeredBefore.has(q.id));
    const map = new Map<string, AdminQuestion[]>();
    visible.forEach((q) => map.set(q.group, [...(map.get(q.group) ?? []), q]));
    return [...map.entries()];
  }, [questions, answeredBefore, onlyOpen]);

  const answered = questions.filter((q) => answers[q.id]).length;

  if (status !== 'ready') {
    return (
      <main className="min-h-screen pt-32 pb-20 px-6">
        <form
          className="max-w-sm mx-auto glass-card p-8 text-center"
          onSubmit={(e) => { e.preventDefault(); if (password) load(password); }}
        >
          <h1 className="font-heading text-3xl text-text-primary mb-6">Admin</h1>
          <label className="block text-left font-body text-sm text-text-secondary mb-2" htmlFor="admin-pw">
            Password
          </label>
          <input
            id="admin-pw"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[#E2DBC9] bg-white/80 px-4 py-3 font-body text-text-primary"
          />
          {status === 'wrong' && <p className="font-body text-sm text-red-700 mt-3">That password isn't right.</p>}
          {status === 'not-configured' && (
            <p className="font-body text-sm text-red-700 mt-3">The admin password hasn't been set up on Netlify yet.</p>
          )}
          {status === 'error' && <p className="font-body text-sm text-red-700 mt-3">Couldn't reach the server. Try again.</p>}
          <button type="submit" className="glass-pill mt-6 px-6 py-3 font-body text-sm text-text-primary">
            {status === 'loading' ? 'Opening…' : 'Open'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="font-heading text-4xl text-text-primary">What we still need</h1>
          <p className="font-body text-sm text-text-muted mt-2">
            {answered} of {questions.length} answered
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button type="button" className="glass-pill px-4 py-2 font-body text-sm text-text-primary" onClick={() => setOnlyOpen(!onlyOpen)}>
              {onlyOpen ? 'Show answered too' : 'Show only unanswered'}
            </button>
            <button type="button" className="glass-pill px-4 py-2 font-body text-sm text-text-primary" onClick={download}>
              Download answers
            </button>
          </div>
        </header>

        <AdminQuestionCard
          question={{ id: 'note', group: '', question: 'Anything else we should know? Send a note.', photos: [] }}
          answer={undefined}
          onSave={(_, text) => save(`note-${Date.now()}`, text)}
          clearAfterSend
        />

        {groups.length === 0 && (
          <p className="font-heading text-xl text-text-secondary mt-12 text-center">Everything's answered. Thank you.</p>
        )}
        {groups.map(([group, items]) => (
          <section key={group} className="mt-14">
            <h2 className="font-heading text-2xl text-text-primary mb-6">{group}</h2>
            <div className="space-y-6">
              {items.map((q) => (
                <AdminQuestionCard key={q.id} question={q} answer={answers[q.id]} onSave={save} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export default AdminPage;
