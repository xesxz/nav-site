"use client";

import { useState, useEffect } from "react";

interface Star {
  id: number;
  content: string;
}

export default function StarPage() {
  const [stars, setStars] = useState<Star[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [search, setSearch] = useState("");

  const filteredStars = stars
    .filter((star) => star.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  useEffect(() => {
    fetchStars();
  }, []);

  const fetchStars = async () => {
    try {
      const res = await fetch("/api/star");
      const data = await res.json();
      if (Array.isArray(data)) setStars(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    try {
      const res = await fetch("/api/star", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });
      if ((await res.json()).success) {
        setNewContent("");
        setShowAdd(false);
        fetchStars();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif italic text-slate-200 mb-2">Star</h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm"
          >
            添加
          </button>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索..."
            className="w-full p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {showAdd && (
          <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="输入人名..."
              className="w-full p-3 rounded-lg bg-slate-700/50 text-white placeholder-slate-500 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-slate-400 hover:text-white text-sm">
                取消
              </button>
              <button onClick={handleAdd} className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg">
                保存
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {filteredStars.map((star) => (
            <span
              key={star.id}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 text-amber-200 hover:border-amber-400 hover:scale-105 transition-all duration-300 cursor-default"
            >
              {star.name}
            </span>
          ))}
        </div>

        {stars.length === 0 && (
          <div className="text-center py-20 text-slate-500 italic">暂无内容</div>
        )}
      </div>
    </div>
  );
}
