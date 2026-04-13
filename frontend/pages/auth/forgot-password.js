import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        { email }
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Forgot Password — AI Deck</title></Head>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">🔑</span>
            <h1 className="font-display text-2xl font-bold text-white">Forgot Password</h1>
            <p className="text-sm text-white/40 font-body mt-1">
              Enter your email and we'll send a reset link
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/8">
            {success ? (
              <div className="text-center">
                <span className="text-4xl block mb-3">📧</span>
                <p className="text-white font-body text-sm">
                  Reset link sent! Check your email inbox.
                </p>
                <p className="text-white/40 font-body text-xs mt-2">
                  Link expires in 15 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                  <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-body">
                    {error}
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-body text-white/50 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="px-4 py-3 bg-surface-2 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm font-body focus:outline-none focus:border-brand-500/60 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-body font-medium rounded-xl transition-all"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-white/35 font-body mt-5">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-brand-400 hover:text-brand-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
