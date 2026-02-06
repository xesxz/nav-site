"use client";

import { useState, useEffect } from "react";

export default function AddBookmark() {
  const [form, setForm] = useState({
    url: "",
    name: "",
    type: "",
    icon: "",
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [iconLoading, setIconLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.map((item: { type: string }) => item.type));
        }
      })
      .catch(console.error);
  }, []);

  const fetchIcon = async () => {
    if (!form.url) {
      setMessage({ type: "error", text: "请先输入网址" });
      return;
    }
    setIconLoading(true);
    try {
      const res = await fetch("https://billowing-mountain-b26a.leeycheung.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.url }),
      });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, icon: data.url }));
        setMessage({ type: "success", text: "图标获取成功" });
      }
    } catch {
      setMessage({ type: "error", text: "获取图标失败" });
    } finally {
      setIconLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url || !form.name || !form.type) {
      setMessage({ type: "error", text: "请填写必填字段" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "书签添加成功！" });
        setForm({ url: "", name: "", type: "", icon: "" });
      } else {
        setMessage({ type: "error", text: data.error || "添加失败" });
      }
    } catch {
      setMessage({ type: "error", text: "网络错误" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            添加书签
          </h1>
          <a href="/" className="text-slate-400 hover:text-white transition-colors">
            返回首页
          </a>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-400 text-sm mb-2">网址 *</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                type="button"
                onClick={fetchIcon}
                disabled={iconLoading}
                className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50"
              >
                {iconLoading ? "..." : "获取图标"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">名称 *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="网站名称"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">分类 *</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">选择分类</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">图标URL</label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="图标地址（可自动获取）"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            {form.icon && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-slate-500 text-sm">预览:</span>
                <img src={form.icon} alt="icon" className="w-8 h-8 object-contain" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all disabled:opacity-50"
          >
            {loading ? "提交中..." : "添加书签"}
          </button>
        </form>
      </div>
    </div>
  );
}
