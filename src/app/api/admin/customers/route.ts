// app/api/admin/customers/route.ts

import { NextRequest } from "next/server";
import db from "../../../../lib/db";
import { ok, fail, parsePagination, paginated } from "../../../../lib/utils";

// GET /api/admin/customers?page=1&limit=10&search=
export async function GET(req: NextRequest) {
  try {
    const { page, limit, skip } = parsePagination(req.url);
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");

    let whereClause = "";
    let queryParams: any[] = [];

    if (search) {
      whereClause = `
        WHERE u.name LIKE ?
        OR u.email LIKE ?
        OR u.phone LIKE ?
      `;

      const searchValue = `%${search}%`;
      queryParams.push(searchValue, searchValue, searchValue);
    }

    const [customers]: any = await db.query(
      `
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.isVerified,
        u.createdAt,
        COUNT(o.id) AS orderCount
      FROM user u
      LEFT JOIN orders o ON o.userId = u.id
      ${whereClause}
      GROUP BY u.id
      ORDER BY u.createdAt DESC
      LIMIT ? OFFSET ?
      `,
      [...queryParams, limit, skip]
    );

    const [countRows]: any = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM user u
      ${whereClause}
      `,
      queryParams
    );

    const total = countRows[0].total;

    return ok(
      paginated(customers, total, page, limit)
    );
  } catch (error: any) {
    return fail(error.message || "Something went wrong");
  }
}