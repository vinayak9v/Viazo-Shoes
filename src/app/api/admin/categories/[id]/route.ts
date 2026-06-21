// app/api/admin/categories/[id]/route.ts

import { NextRequest } from "next/server";
import db from "../../../../../lib/db";
import { ok, fail } from "../../../../../lib/utils";

// GET /api/admin/categories/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);

    if (isNaN(id)) return fail("Invalid ID");

    const [rows]: any = await db.query(
      "SELECT * FROM category WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return fail("Category not found", 404);
    }

    return ok(rows[0]);
  } catch (error: any) {
    return fail(error.message);
  }
}

// PUT /api/admin/categories/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);

    if (isNaN(id)) return fail("Invalid ID");

    const body = await req.json();

    const [rows]: any = await db.query(
      "SELECT * FROM category WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return fail("Category not found", 404);
    }

    const category = rows[0];

    const name = body.name?.trim() || category.name;
    const imageUrl =
      body.imageUrl !== undefined
        ? body.imageUrl
        : category.imageUrl;

    await db.query(
      `UPDATE category
       SET name = ?, imageUrl = ?, updatedAt = NOW()
       WHERE id = ?`,
      [name, imageUrl, id]
    );

    const [updated]: any = await db.query(
      "SELECT * FROM category WHERE id = ?",
      [id]
    );

    return ok(updated[0]);
  } catch (error: any) {
    return fail(error.message);
  }
}

// DELETE /api/admin/categories/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);

    if (isNaN(id)) return fail("Invalid ID");

    const [categories]: any = await db.query(
      "SELECT * FROM category WHERE id = ?",
      [id]
    );

    if (categories.length === 0) {
      return fail("Category not found", 404);
    }

    const [products]: any = await db.query(
      "SELECT COUNT(*) as count FROM product WHERE categoryId = ?",
      [id]
    );

    const productCount = products[0].count;

    if (productCount > 0) {
      return fail(
        `Cannot delete. ${productCount} product(s) are using this category. Delete or reassign them first.`,
        400
      );
    }

    await db.query(
      "DELETE FROM category WHERE id = ?",
      [id]
    );

    return ok({ message: "Category deleted" });
  } catch (error: any) {
    return fail(error.message);
  }
}