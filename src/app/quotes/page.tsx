"use client";

import { useState, useEffect } from "react";

interface Quote {
  id: number;
  content: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      if (Array.isArray(data)) setQuotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });
      if ((await res.json()).success) {
        setNewContent("");
        setShowAdd(false);
        fetchQuotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif italic text-slate-200 mb-2">语录</h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-slate-500 to-transparent mx-auto"></div>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            添加语录
          </button>
        </div>

        {showAdd && (
          <div className="max-w-xl mx-auto mb-8 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="输入语录内容..."
              className="w-full h-24 p-3 rounded-lg bg-slate-700/50 text-white placeholder-slate-500 resize-none focus:outline-none"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-slate-400 hover:text-white text-sm">
                取消
              </button>
              <button onClick={handleAdd} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
                保存
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
          {quotes.map((quote) => (
         <div
  key={quote.id}
  className="relative p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-300 flex items-center justify-center text-center"
>
  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
    {quote.content}
  </p>
</div>
          ))}
        </div>

        {quotes.length === 0 && (
          <div className="text-center py-20 text-slate-500 italic">暂无语录</div>
        )}
      </div>
    </div>
  );
}
