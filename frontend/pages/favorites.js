import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getFavorites } from '../lib/api';
import { useAuth } from '../lib/auth';
import ToolCard from '../components/ToolCard';
import SkeletonCard from '../components/SkeletonCard';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    getFavorites(user.id)
      .then(data => {
        setFavorites(data);
        setFavoriteIds(new Set(data.map(t => t.id)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const handleFavoriteChange = (toolId, nowFavorited) => {
    if (!nowFavorited) {
      setFavorites(prev => prev.filter(t => t.id !== toolId));
      setFavoriteIds(prev => {
        const next = new Set(prev);
        next.delete(toolId);
        return next;
      });
    }
  };

  if (authLoading || (!user && loading)) return null;

  return (
    <>
      <Head>
        <title>My Favorites — AI Deck</title>
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">❤️</span>
            <h1 className="font-display text-3xl font-bold text-white">My Favorites</h1>
          </div>
          <p className="text-white/40 font-body text-sm ml-11">
            {loading ? '…' : `${favorites.length} saved tool${favorites.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-5 text-center">
            <span className="text-6xl opacity-30">🔖</span>
            <div>
              <p className="text-white/60 font-body text-lg mb-1">No favorites yet</p>
              <p className="text-white/30 font-body text-sm">Browse tools and click the heart to save them here.</p>
            </div>
            <Link
              href="/"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-body rounded-xl transition-all mt-2"
            >
              Explore Tools
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favorites.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isFavorited={favoriteIds.has(tool.id)}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
