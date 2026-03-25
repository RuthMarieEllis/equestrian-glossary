import { useState, useMemo } from 'react'
import { categories } from '../data/glossary'

export default function App() {
  const [search, setSearch]               = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [expandedTerms, setExpandedTerms]  = useState({})

  const isSearching = search.trim().length >= 2

  const searchResults = useMemo(() => {
    if (!isSearching) return []
    const q = search.trim().toLowerCase()
    const results = []
    for (const cat of categories) {
      for (const item of cat.terms) {
        if (
          item.term.toLowerCase().includes(q) ||
          item.definition.toLowerCase().includes(q)
        ) {
          results.push({
            ...item,
            categoryName:  cat.name,
            categoryColor: cat.color,
            categoryIcon:  cat.icon,
          })
        }
      }
    }
    return results
  }, [search, isSearching])

  function toggleTerm(key) {
    setExpandedTerms(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function handleSearch(val) {
    setSearch(val)
    if (val.trim().length >= 2) setActiveCategory(null)
  }

  return (
    <div className="min-h-screen bg-eq-cream">

      {/* ── Header ── */}
      <header className="bg-eq-navy shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <div className="bg-white rounded-full p-1 flex-shrink-0 shadow-md">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Stable Terms"
              className="h-14 sm:h-16 w-14 sm:w-16 object-contain rounded-full"
              onError={e => e.target.parentElement.style.display = 'none'}
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl sm:text-2xl tracking-widest uppercase leading-tight">
              Stable Terms
            </h1>
            <p className="text-eq-gold text-xs sm:text-sm italic tracking-wide">
              Your guide to horse world terminology
            </p>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl shadow-md border border-eq-cream-dark p-6 sm:p-8">

        {/* Search bar */}
        <div className="mb-8">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-eq-navy text-lg select-none">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search terms or definitions…"
              className="w-full pl-11 pr-10 py-3.5 border-2 border-eq-navy rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-eq-gold text-base shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ── SEARCH RESULTS ── */}
        {isSearching && (
          <div>
            <p className="text-sm text-gray-500 italic mb-4">
              {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for &ldquo;{search.trim()}&rdquo;
            </p>

            {searchResults.length === 0 ? (
              <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-eq-cream-dark">
                <p className="text-4xl mb-3">🐴</p>
                <p className="text-gray-500 font-medium">No results found for &ldquo;{search}&rdquo;</p>
                <p className="text-gray-400 text-sm mt-1">Try a different word or browse by category</p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 shadow-sm border border-eq-cream-dark border-l-4"
                    style={{ borderLeftColor: item.categoryColor }}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                      <h3 className="font-bold text-gray-900 text-base">{item.term}</h3>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full text-white font-semibold flex-shrink-0"
                        style={{ backgroundColor: item.categoryColor }}
                      >
                        {item.categoryIcon}&nbsp; {item.categoryName}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-2">
                      <p className="text-gray-600 text-sm leading-relaxed">{item.definition}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CATEGORY VIEW ── */}
        {!isSearching && activeCategory && (
          <div>
            <button
              onClick={() => { setActiveCategory(null); setExpandedTerms({}) }}
              className="mb-5 flex items-center gap-2 text-eq-navy hover:text-eq-maroon font-semibold text-sm transition-colors"
            >
              ← Back to Categories
            </button>

            {/* Category banner */}
            <div className="rounded-xl overflow-hidden shadow-sm mb-6">
              <div
                className="px-5 py-5 flex items-center gap-4"
                style={{ backgroundColor: activeCategory.color }}
              >
                <span className="text-4xl">{activeCategory.icon}</span>
                <div>
                  <h2 className="text-white font-bold text-xl leading-tight">
                    {activeCategory.name}
                  </h2>
                  <p className="text-white/75 text-sm mt-0.5">
                    {activeCategory.terms.length} terms — tap any term to expand
                  </p>
                </div>
              </div>
              <div className="h-1 bg-eq-gold" />
            </div>

            {/* Term accordion */}
            <div className="space-y-2">
              {activeCategory.terms.map((item, i) => {
                const key = activeCategory.id + '-' + item.term
                const isOpen = !!expandedTerms[key]
                return (
                  <button
                    key={i}
                    onClick={() => toggleTerm(key)}
                    className={`w-full text-left bg-white rounded-lg shadow-sm border transition-all duration-150
                      ${isOpen
                        ? 'border-l-4 border-eq-cream-dark shadow-md'
                        : 'border-eq-cream-dark hover:shadow-md hover:border-gray-200'
                      }`}
                    style={isOpen ? { borderLeftColor: activeCategory.color } : {}}
                  >
                    <div className="flex items-center justify-between px-4 py-3.5 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="text-xs font-bold tabular-nums flex-shrink-0 w-6 text-right"
                          style={{ color: activeCategory.color }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className={`font-semibold text-sm leading-snug ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                          {item.term}
                        </span>
                      </div>
                      <span
                        className="text-base flex-shrink-0 transition-transform duration-200"
                        style={{
                          color: activeCategory.color,
                          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                        }}
                      >
                        ›
                      </span>
                    </div>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="border-t border-gray-100 pt-3">
                          <p className="text-gray-600 text-sm leading-relaxed">{item.definition}</p>
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── HOME — CATEGORY GRID ── */}
        {!isSearching && !activeCategory && (
          <div>
            {/* Decorative label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold tracking-widest text-eq-gold-dark uppercase whitespace-nowrap">
                Browse by Category
              </span>
              <div className="flex-1 h-px bg-eq-cream-dark" />
            </div>

            {/* Category grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat)}
                  className="bg-white rounded-xl p-4 text-left shadow-sm hover:shadow-md transition-all duration-150 border border-eq-cream-dark border-l-4 hover:-translate-y-0.5"
                  style={{ borderLeftColor: cat.color }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-lg"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm leading-snug mb-1.5">
                    {cat.name}
                  </h3>
                  <p className="text-eq-gold-dark text-xs font-semibold">
                    {cat.terms.length} {cat.terms.length === 1 ? 'term' : 'terms'}
                  </p>
                </button>
              ))}
            </div>

            {/* Footer ornament */}
            <div className="flex items-center gap-3 mt-10">
              <div className="flex-1 h-px bg-eq-cream-dark" />
              <span className="text-eq-gold text-sm">✦</span>
              <div className="flex-1 h-px bg-eq-cream-dark" />
            </div>
          </div>
        )}

        </div>{/* end white container */}
      </main>

      <footer className="bg-eq-navy mt-12 py-5">
        <p className="text-center text-white/50 text-xs tracking-widest uppercase">
          Stable Terms &mdash; Your guide to horse world terminology
        </p>
      </footer>
    </div>
  )
}
