import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        { token, newPassword: form.password }
      );
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Reset Password — AI Deck</title></Head>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">🔒</span>
            <h1 className="font-display text-2xl font-bold text-white">Set New Password</h1>
            <p className="text-sm text-white/40 font-body mt-1">Enter your new password below</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/8">
            {success ? (
              <div className="text-center">
                <span className="text-4xl block mb-3">✅</span>
                <p className="text-white font-body text-sm">Password reset successfully!</p>
                <p className="text-white/40 text-xs mt-2">Redirecting to login...</p>
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
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min 6 characters"
                    className="px-4 py-3 bg-surface-2 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm font-body focus:outline-none focus:border-brand-500/60 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-body text-white/50 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={form.confirm}
                    onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                    placeholder="Repeat password"
                    className="px-4 py-3 bg-surface-2 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm font-body focus:outline-none focus:border-brand-500/60 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-body font-medium rounded-xl transition-all"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
