import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/');
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In — AI Deck</title>
      </Head>

      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4 glow-brand">
              <span className="text-white font-display font-bold">AI</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-white/40 font-body mt-1">Sign in to your AI Deck account</p>
          </div>

          {/* Card */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-body">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-body text-white/50 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="px-4 py-3 bg-surface-2 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm font-body focus:outline-none focus:border-brand-500/60 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-body text-white/50 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="px-4 py-3 bg-surface-2 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm font-body focus:outline-none focus:border-brand-500/60 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-brand-600/25 mt-1"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

                // Add this below the submit button inside the form card
                <div className="text-right mt-1">
                  <Link href="/auth/forgot-password" className="text-xs text-white/35 hover:text-brand-400 font-body transition-colors">
                    Forgot password?
                  </Link>
                </div>
                
            </form>
          </div>

          <p className="text-center text-sm text-white/35 font-body mt-5">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-brand-400 hover:text-brand-300 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
