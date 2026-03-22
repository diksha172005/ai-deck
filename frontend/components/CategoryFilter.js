export default function CategoryFilter({ categories, selected, onSelect }) {
  const all = [{ id: null, name: 'All', icon: '✦' }, ...categories];

  return (
    <div className="flex gap-2 flex-wrap">
      {all.map((cat) => {
        const isActive = selected === cat.name || (cat.id === null && !selected);
        return (
          <button
            key={cat.name}
            onClick={() => onSelect(cat.id === null ? null : cat.name)}
            className={`
              flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-body
              border transition-all duration-150 whitespace-nowrap
              ${isActive
                ? 'bg-brand-600 border-brand-600 text-white shadow-md shadow-brand-600/20'
                : 'bg-transparent border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
              }
            `}
          >
            <span className="text-base leading-none">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
