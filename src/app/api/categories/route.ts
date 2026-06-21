// app/api/categories/route.ts

import db from "../../../lib/db";
import { ok, fail } from "../../../lib/utils";

// GET /api/categories
export async function GET() {
  try {
    const [categories]: any = await db.query(
      `
      SELECT
        id,
        name,
        imageUrl
      FROM category
      ORDER BY name ASC
      `
    );

    return ok(categories);
  } catch (error: any) {
    return fail(error.message || "Failed to fetch categories");
  }
}