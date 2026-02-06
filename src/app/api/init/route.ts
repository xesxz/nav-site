import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 插入默认管理员账号
    await pool.query(`
      INSERT IGNORE INTO users (username, password) VALUES ('admin', 'admin123')
    `);

    // 创建便签表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        content TEXT NOT NULL,
        color VARCHAR(20) DEFAULT 'yellow',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    return NextResponse.json({ success: true, message: "数据库表创建成功" });
  } catch (error) {
    console.error("Init error:", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
