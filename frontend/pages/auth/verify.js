import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';

export default function VerifyPage() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify?token=${token}`)
      .then(res => {
        setStatus('success');
        setMessage(res.data.message);
        setTimeout(() => router.push('/auth/login'), 3000);
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed.');
      });
  }, [token]);

  return (
    <>
      <Head><title>Verify Email — AI Deck</title></Head>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 border border-white/8 max-w-sm w-full text-center">
          {status === 'verifying' && (
            <>
              <span className="text-5xl block mb-4">⏳</span>
              <p className="text-white font-body">Verifying your email...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <span className="text-5xl block mb-4">✅</span>
              <h2 className="font-display text-xl text-white font-bold mb-2">Email Verified!</h2>
              <p className="text-white/50 font-body text-sm">{message}</p>
              <p className="text-white/30 font-body text-xs mt-2">Redirecting to login...</p>
            </>
          )}
          {status === 'error' && (
            <>
              <span className="text-5xl block mb-4">❌</span>
              <h2 className="font-display text-xl text-white font-bold mb-2">Verification Failed</h2>
              <p className="text-white/50 font-body text-sm">{message}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
