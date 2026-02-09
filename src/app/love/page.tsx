"use client";

import { useState, useEffect } from "react";

interface LoveItem {
  id: number;
  content: string;
}

export default function LovePage() {
  const [items, setItems] = useState<LoveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/love");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    try {
      const res = await fetch("/api/love", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });
      if ((await res.json()).success) {
        setNewContent("");
        setShowAdd(false);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif italic text-slate-200 mb-2">Love</h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent mx-auto"></div>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-sm"
          >
            添加
          </button>
        </div>

        {showAdd && (
          <div className="max-w-xl mx-auto mb-8 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="输入内容..."
              className="w-full h-24 p-3 rounded-lg bg-slate-700/50 text-white placeholder-slate-500 resize-none focus:outline-none"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-slate-400 hover:text-white text-sm">
                取消
              </button>
              <button onClick={handleAdd} className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-sm rounded-lg">
                保存
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-pink-600/50 hover:bg-slate-800/70 transition-all duration-300 flex items-center justify-center text-center"
            >
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20 text-slate-500 italic">暂无内容</div>
        )}
      </div>
    </div>
  );
}
