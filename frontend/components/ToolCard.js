import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { addFavorite, removeFavorite } from '../lib/api';

export default function ToolCard({ tool, isFavorited = false, onFavoriteChange }) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || loading) return;

    setLoading(true);
    try {
      if (favorited) {
        await removeFavorite(user.id, tool.id);
        setFavorited(false);
      } else {
        await addFavorite(user.id, tool.id);
        setFavorited(true);
      }
      onFavoriteChange && onFavoriteChange(tool.id, !favorited);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categoryColor = getCategoryColor(tool.categoryName);

  return (
    <div className="group relative glass rounded-2xl p-5 card-hover border border-white/6 flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Logo / Emoji */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${categoryColor.bg}`}>
            {tool.logoUrl || '🤖'}
          </div>

          <div>
            <h3 className="font-display font-semibold text-white text-base leading-tight">
              {tool.name}
            </h3>
            <span className={`text-xs font-body mt-0.5 inline-block ${categoryColor.text}`}>
              {tool.categoryName}
            </span>
          </div>
        </div>

        {/* Favorite button */}
        {user && (
          <button
            onClick={handleFavorite}
            disabled={loading}
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all
              ${favorited
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-white/5 text-white/25 hover:bg-rose-500/10 hover:text-rose-400'
              }`}
          >
            <svg className="w-4 h-4" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-white/50 font-body leading-relaxed line-clamp-2 flex-1">
        {tool.description}
      </p>

      {/* Tags */}
      {tool.tags && tool.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-white/5 text-white/35 text-xs font-mono rounded-md border border-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        {tool.featured && (
          <span className="flex items-center gap-1 text-xs text-amber-400/80 font-body">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </span>
        )}
        <div className={!tool.featured ? 'ml-auto' : ''}>
          <a
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600/15 hover:bg-brand-600/30 text-brand-400 text-xs font-body rounded-lg transition-all border border-brand-600/20 hover:border-brand-500/40"
          >
            Visit
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category) {
  const map = {
    'Chatbot':           { bg: 'bg-blue-500/15',   text: 'text-blue-400' },
    'Image Generation':  { bg: 'bg-purple-500/15', text: 'text-purple-400' },
    'Coding':            { bg: 'bg-green-500/15',  text: 'text-green-400' },
    'Video':             { bg: 'bg-red-500/15',    text: 'text-red-400' },
    'Productivity':      { bg: 'bg-amber-500/15',  text: 'text-amber-400' },
    'Writing':           { bg: 'bg-rose-500/15',   text: 'text-rose-400' },
    'Audio':             { bg: 'bg-cyan-500/15',   text: 'text-cyan-400' },
  };
  return map[category] || { bg: 'bg-white/10', text: 'text-white/50' };
}
