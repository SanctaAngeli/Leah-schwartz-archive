// Private admin endpoint for the /admin page.
//
// The family answers questions about photos (titles, dates, which house a
// plan was for...). Answers are saved in Netlify Blobs, Netlify's built-in
// storage, so nothing needs a database or a separate account.
//
// Every request must carry the admin password in the x-admin-password
// header. The password is NOT in this code (the repository is public): it is
// read from the ADMIN_PASSWORD environment variable, set in the Netlify
// dashboard under Site configuration → Environment variables.
//
//   GET  /.netlify/functions/admin            → { questions, answers }
//   POST /.netlify/functions/admin {id, text} → saves one answer

import { createHash, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import questions from '../admin-data/questions.ts';

const MAX_ANSWER_LENGTH = 5000;
const questionIds = new Set((questions as { id: string }[]).map((q) => q.id));

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

function passwordMatches(given: string, expected: string): boolean {
  // Compare fixed-length digests so the check takes the same time either way.
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

export default async (req: Request): Promise<Response> => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return json({ error: 'not-configured' }, 503);

  const given = req.headers.get('x-admin-password') ?? '';
  if (!passwordMatches(given, expected)) return json({ error: 'wrong-password' }, 401);

  const store = getStore('family-answers');

  if (req.method === 'GET') {
    const { blobs } = await store.list();
    const answers: Record<string, unknown> = {};
    await Promise.all(
      blobs.map(async ({ key }) => {
        answers[key] = await store.get(key, { type: 'json' });
      })
    );
    return json({ questions, answers });
  }

  if (req.method === 'POST') {
    let body: { id?: unknown; text?: unknown };
    try {
      body = await req.json();
    } catch {
      return json({ error: 'bad-request' }, 400);
    }
    const id = typeof body.id === 'string' ? body.id : '';
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const isNote = /^note-\d{13}$/.test(id);
    if (!questionIds.has(id) && !isNote) return json({ error: 'unknown-question' }, 400);
    if (text.length > MAX_ANSWER_LENGTH) return json({ error: 'too-long' }, 400);
    if (!text) {
      await store.delete(id);
      return json({ ok: true, id, answer: null });
    }
    const answer = { text, at: new Date().toISOString() };
    await store.setJSON(id, answer);
    return json({ ok: true, id, answer });
  }

  return json({ error: 'method-not-allowed' }, 405);
};
