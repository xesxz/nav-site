import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM notes ORDER BY updated_at DESC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { content, color } = await request.json();
    if (!content) {
      return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
    }
    const [result] = await pool.query(
      "INSERT INTO notes (content, color) VALUES (?, ?)",
      [content, color || "yellow"]
    );
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
