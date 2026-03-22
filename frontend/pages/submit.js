import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCategories, createTool } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function SubmitPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', link: '', logoUrl: '',
    tags: '', categoryId: '', featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.categoryId) {
      setError('Please select a category.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        categoryId: parseInt(form.categoryId),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      await createTool(payload);
      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to submit tool. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Submit a Tool — AI Deck</title>
      </Head>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Submit a Tool</h1>
          <p className="text-white/40 font-body text-sm">
            Know a great AI tool? Add it to the collection.
            {!user && <span className="text-brand-400"> Sign in to submit.</span>}
          </p>
        </div>

        {success ? (
          <div className="glass rounded-2xl p-8 border border-green-500/20 text-center">
            <span className="text-5xl mb-4 block">✅</span>
            <h2 className="font-display text-xl text-white font-semibold mb-1">Tool submitted!</h2>
            <p className="text-white/40 font-body text-sm">Redirecting to explore page…</p>
          </div>
        ) : (
          <div className="glass rounded-2xl p-6 border border-white/8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-body">
                  {error}
                </div>
              )}

              <FormField label="Tool Name *">
                <input
                  type="text" name="name" required value={form.name} onChange={handleChange}
                  placeholder="e.g. ChatGPT"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Description *">
                <textarea
                  name="description" required value={form.description} onChange={handleChange}
                  placeholder="What does this tool do? (1–2 sentences)"
                  rows={3}
                  className={inputClass + ' resize-none'}
                />
              </FormField>

              <FormField label="URL *">
                <input
                  type="url" name="link" required value={form.link} onChange={handleChange}
                  placeholder="https://example.com"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Category *">
                <select
                  name="categoryId" required value={form.categoryId} onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select a category…</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Tags" hint="Comma-separated, e.g. chatbot, openai, productivity">
                <input
                  type="text" name="tags" value={form.tags} onChange={handleChange}
                  placeholder="chatbot, openai, free"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Logo / Emoji" hint="Optional — paste an emoji or leave blank">
                <input
                  type="text" name="logoUrl" value={form.logoUrl} onChange={handleChange}
                  placeholder="🤖"
                  className={inputClass}
                />
              </FormField>

              <button
                type="submit"
                disabled={loading || !user}
                className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-body font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-brand-600/25"
              >
                {!user ? 'Sign in to Submit' : loading ? 'Submitting…' : 'Submit Tool'}
              </button>
            </form>
          </div>
        )}
      </main>
    </>
  );
}

const inputClass = `
  w-full px-4 py-3 bg-surface-2 border border-white/8 rounded-xl
  text-white placeholder-white/20 text-sm font-body
  focus:outline-none focus:border-brand-500/60 transition-colors
`;

function FormField({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-body text-white/50 uppercase tracking-wider">{label}</label>
        {hint && <span className="text-xs text-white/25 font-body">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
