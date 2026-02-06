"use client";

import { useState, useEffect, useMemo } from "react";

interface Bookmark {
  id: number;
  name: string;
  url: string;
  type: string;
  icon?: string;
}

const categoryColors: Record<string, string> = {
  ai: "bg-purple-500",
  工具: "bg-blue-500",
  影视: "bg-red-500",
  在线影视: "bg-pink-500",
  磁链: "bg-orange-500",
  科学上网: "bg-green-500",
  home: "bg-cyan-500",
  api: "bg-indigo-500",
  英语: "bg-yellow-500",
  ipv6: "bg-teal-500",
  gis: "bg-emerald-500",
  book: "bg-amber-500",
};

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBookmarks(data);
        } else {
          console.error("API error:", data);
          setBookmarks([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  // 从书签数据中动态提取分类
  const categories = useMemo(() => {
    const types = [...new Set(bookmarks.map((b) => b.type).filter(Boolean))];
    return types.map((type) => ({
      name: type,
      color: categoryColors[type] || "bg-gray-500",
    }));
  }, [bookmarks]);

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesCategory = !activeCategory || bookmark.type === activeCategory;
    const matchesSearch = bookmark.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedBookmarks = categories.reduce((acc, category) => {
    const items = filteredBookmarks.filter((b) => b.type === category.name);
    if (items.length > 0) {
      acc[category.name] = items;
    }
    return acc;
  }, {} as Record<string, Bookmark[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-400 text-lg">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <Main categories={categories} groupedBookmarks={groupedBookmarks} />
    </div>
  );
}

function Header({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
}) {
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-slate-700/50">
      <div className="w-full max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Nav
          </h1>
          <div className="flex-1 max-w-xl relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="搜索书签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-slate-400 text-sm">{user.username}</span>
                <a href="/notes" className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm transition-colors">
                  便签
                </a>
                <a href="/add" className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors">
                  添加
                </a>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors"
                >
                  退出
                </button>
              </>
            ) : (
              <a href="/login" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors">
                登录
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function CategoryNav({
  categories,
  activeCategory,
  setActiveCategory,
}: {
  categories: { name: string; color: string }[];
  activeCategory: string | null;
  setActiveCategory: (v: string | null) => void;
}) {
  return (
    <nav className="sticky top-[31px] z-40 backdrop-blur-xl bg-slate-900/60 border-b border-slate-700/30">
      <div className="w-full max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              !activeCategory
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.name
                  ? `${cat.color} text-white shadow-lg`
                  : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Main({
  categories,
  groupedBookmarks
}: {
  categories: { name: string; color: string }[];
  groupedBookmarks: Record<string, Bookmark[]>
}) {
  return (
    <main className="w-full mx-auto px-6 py-10">
      {Object.entries(groupedBookmarks).map(([categoryName, items]) => {
        const category = categories.find((c) => c.name === categoryName);
        return (
          <section key={categoryName} className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <h2 className={`text-base font-semibold px-4 py-1.5 rounded-lg ${category?.color || "bg-gray-500"} text-white`}>
                {categoryName}
              </h2>
              <span className="text-slate-500 text-sm">{items.length} 个</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {items.map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} />
              ))}
            </div>
          </section>
        );
      })}
      {Object.keys(groupedBookmarks).length === 0 && (
        <div className="text-center py-32">
          <div className="text-slate-500 text-lg">没有找到匹配的书签</div>
        </div>
      )}
    </main>
  );
}

function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const [imgError, setImgError] = useState(false);

  const getIconUrl = (icon?: string) => {
    if (!icon) return null;
    if (icon.startsWith("http")) return icon;
    return null;
  };

  const iconUrl = getIconUrl(bookmark.icon);

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col items-center p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-3 overflow-hidden shadow-inner">
        {iconUrl && !imgError ? (
          <img
            src={iconUrl}
            alt={bookmark.name}
            className="w-9 h-9 object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-2xl font-bold bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {bookmark.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <span className="text-sm text-slate-400 text-center truncate w-full group-hover:text-white transition-colors">
        {bookmark.name}
      </span>
    </a>
  );
}
