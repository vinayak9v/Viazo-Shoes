// app/api/admin/categories/route.ts

import { NextRequest } from "next/server";
import db from "../../../../lib/db";
import { ok, fail, parsePagination, paginated } from "../../../../lib/utils";

// POST /api/admin/categories
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, imageUrl } = body;

    if (!name?.trim()) {
      return fail("Category name is required");
    }

    const [existing]: any = await db.query(
      "SELECT id FROM category WHERE name = ?",
      [name.trim()]
    );

    if (existing.length > 0) {
      return fail("Category with this name already exists");
    }

    const [result]: any = await db.query(
      `INSERT INTO category (name, imageUrl, createdAt, updatedAt)
       VALUES (?, ?, NOW(), NOW())`,
      [name.trim(), imageUrl || null]
    );

    const [category]: any = await db.query(
      "SELECT * FROM category WHERE id = ?",
      [result.insertId]
    );

    return ok(category[0], 201);
  } catch (error: any) {
    return fail(error.message);
  }
}

// GET /api/admin/categories?page=1&limit=10
export async function GET(req: NextRequest) {
  try {
    const { page, limit, skip } = parsePagination(req.url);

    const [categories]: any = await db.query(
      `SELECT *
       FROM category
       ORDER BY createdAt DESC
       LIMIT ? OFFSET ?`,
      [limit, skip]
    );

    const [countRows]: any = await db.query(
      "SELECT COUNT(*) as total FROM category"
    );

    const total = countRows[0].total;

    return ok(
      paginated(categories, total, page, limit)
    );
  } catch (error: any) {
    return fail(error.message);
  }
}