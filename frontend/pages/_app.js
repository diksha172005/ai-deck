import '../styles/globals.css';
import { AuthProvider } from '../lib/auth';
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-surface-0">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
