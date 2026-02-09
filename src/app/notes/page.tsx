"use client";

import { useState, useEffect } from "react";

interface Note {
  id: number;
  content: string;
  color: string;
  created_at: string;
  updated_at: string;
}

const colors = [
  { name: "yellow", bg: "bg-yellow-200", border: "border-yellow-300" },
  { name: "green", bg: "bg-green-200", border: "border-green-300" },
  { name: "blue", bg: "bg-blue-200", border: "border-blue-300" },
  { name: "pink", bg: "bg-pink-200", border: "border-pink-300" },
  { name: "purple", bg: "bg-purple-200", border: "border-purple-300" },
];

const urlRegex = /(https?:\/\/[^\s]+)/g;

function renderContent(content: string) {
  const parts = content.split(urlRegex);
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newNote, setNewNote] = useState({ content: "", color: "yellow" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      if (Array.isArray(data)) setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newNote.content.trim()) return;
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });
      if ((await res.json()).success) {
        setNewNote({ content: "", color: "yellow" });
        setShowAdd(false);
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (note: Note) => {
    try {
      await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: note.content, color: note.color }),
      });
      setEditingId(null);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除这个便签吗？")) return;
    try {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const getColorClass = (colorName: string) => {
    return colors.find((c) => c.name === colorName) || colors[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            便签
          </h1>
          <div className="flex gap-3">
            <a href="/" className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm">
              返回首页
            </a>
            <button
              onClick={() => setShowAdd(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              新建便签
            </button>
          </div>
        </div>

        {showAdd && (
          <div className="mb-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="写点什么..."
              className="w-full h-32 p-3 rounded-lg bg-slate-700/50 text-white placeholder-slate-500 resize-none focus:outline-none"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setNewNote({ ...newNote, color: c.name })}
                    className={`w-6 h-6 rounded-full ${c.bg} ${newNote.color === c.name ? "ring-2 ring-white" : ""}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-slate-400 hover:text-white text-sm">
                  取消
                </button>
                <button onClick={handleAdd} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4">
          {notes.map((note) => {
            const colorClass = getColorClass(note.color);
            const isEditing = editingId === note.id;

            return (
              <div
                key={note.id}
                className={`p-4 rounded-xl ${colorClass.bg} ${colorClass.border} border-2 min-h-[150px] flex flex-col`}
              >
                {isEditing ? (
                  <>
                    <textarea
                      value={note.content}
                      onChange={(e) => setNotes(notes.map((n) => n.id === note.id ? { ...n, content: e.target.value } : n))}
                      className="flex-1 bg-white/50 rounded p-2 text-gray-800 resize-none focus:outline-none"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setEditingId(null)} className="text-gray-600 text-sm">取消</button>
                      <button onClick={() => handleUpdate(note)} className="text-blue-600 text-sm font-medium">保存</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="flex-1 text-gray-800 whitespace-pre-wrap text-sm">{renderContent(note.content)}</p>
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(note.content);
                          setCopiedId(note.id);
                          setTimeout(() => setCopiedId(null), 1500);
                        }}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        {copiedId === note.id ? "已复制" : "复制"}
                      </button>
                      <button onClick={() => setEditingId(note.id)} className="text-gray-600 hover:text-gray-800 text-sm">编辑</button>
                      <button onClick={() => handleDelete(note.id)} className="text-red-600 hover:text-red-800 text-sm">删除</button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-20 text-slate-500">暂无便签，点击右上角新建</div>
        )}
      </div>
    </div>
  );
}
