import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { getTools, getCategories, getFavorites } from '../lib/api';
import { useAuth } from '../lib/auth';
import ToolCard from '../components/ToolCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SkeletonCard from '../components/SkeletonCard';

export default function Home() {
  const { user } = useAuth();

  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  // Load favorites for logged-in user
  useEffect(() => {
    if (user) {
      getFavorites(user.id)
        .then(favs => setFavorites(new Set(favs.map(f => f.id))))
        .catch(console.error);
    } else {
      setFavorites(new Set());
    }
  }, [user]);

  // Load tools whenever filter/search changes
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (searchQuery) params.search = searchQuery;
    else if (selectedCategory) params.category = selectedCategory;

    getTools(params)
      .then(setTools)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  const handleSearch = useCallback((q) => {
    setSearchQuery(q);
    if (q) setSelectedCategory(null);
  }, []);

  const handleCategorySelect = useCallback((cat) => {
    setSelectedCategory(cat);
    setSearchQuery('');
  }, []);

  const handleFavoriteChange = useCallback((toolId, nowFavorited) => {
    setFavorites(prev => {
      const next = new Set(prev);
      nowFavorited ? next.add(toolId) : next.delete(toolId);
      return next;
    });
  }, []);

  // Group tools by category when showing "All"
  const grouped = !selectedCategory && !searchQuery
    ? groupByCategory(tools)
    : null;

  return (
    <>
      <Head>
        <title>AI Deck — Explore the best AI tools</title>
        <meta name="description" content="Discover and explore the best AI tools, categorized and searchable." />
      </Head>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-16 px-4">
          {/* Background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-600/10 text-brand-300 text-xs font-mono mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow" />
              {tools.length > 0 ? `${tools.length}+ tools and counting` : 'Curated AI tools'}
            </div>

            <h1 className="font-display text-5xl sm:text-6xl font-bold text-white leading-[1.1] mb-5">
              Your{' '}
              <span className="text-gradient">AI toolkit</span>,{' '}
              <br className="hidden sm:block" />
              all in one place
            </h1>

            <p className="text-lg text-white/45 font-body leading-relaxed mb-10 max-w-xl mx-auto">
              Discover, filter, and save the best AI tools across every category — from code to creativity.
            </p>

            <SearchBar onSearch={handleSearch} />
          </div>
        </section>

        {/* Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </section>

        {/* Results label */}
        {(searchQuery || selectedCategory) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
            <p className="text-sm text-white/35 font-body">
              {loading ? 'Searching…' : (
                <>
                  <span className="text-white/65">{tools.length}</span> result{tools.length !== 1 ? 's' : ''}
                  {searchQuery && <> for <span className="text-brand-400">"{searchQuery}"</span></>}
                  {selectedCategory && <> in <span className="text-brand-400">{selectedCategory}</span></>}
                </>
              )}
            </p>
          </div>
        )}

        {/* Tools Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : grouped ? (
            // Grouped by category view
            <div className="flex flex-col gap-12">
              {Object.entries(grouped).map(([catName, catTools]) => (
                <div key={catName}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xl">{getCategoryIcon(catName, categories)}</span>
                    <h2 className="font-display font-semibold text-white text-lg">{catName}</h2>
                    <span className="text-xs text-white/30 font-mono">{catTools.length}</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {catTools.map(tool => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        isFavorited={favorites.has(tool.id)}
                        onFavoriteChange={handleFavoriteChange}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : tools.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <span className="text-5xl">🔍</span>
              <p className="text-white/50 font-body">No tools found. Try a different search or category.</p>
            </div>
          ) : (
            // Flat grid for search/filtered results
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tools.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorited={favorites.has(tool.id)}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function groupByCategory(tools) {
  return tools.reduce((acc, tool) => {
    const cat = tool.categoryName || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tool);
    return acc;
  }, {});
}

function getCategoryIcon(name, categories) {
  const cat = categories.find(c => c.name === name);
  return cat?.icon || '🔧';
}
