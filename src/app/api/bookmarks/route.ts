import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT id, url, name, type, icon FROM bookmark_rows ORDER BY id"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, name, type, icon } = body;

    if (!url || !name || !type) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const [result] = await pool.query(
      "INSERT INTO bookmark_rows (url, name, type, icon) VALUES (?, ?, ?, ?)",
      [url, name, type, icon || null]
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}
