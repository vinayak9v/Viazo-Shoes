// app/api/products/route.ts

import { NextRequest } from "next/server";
import db from "../../../lib/db";
import { ok, fail, parsePagination, paginated } from "../../../lib/utils";

// GET /api/products?page=1&limit=12&categoryId=&search=&minPrice=&maxPrice=
export async function GET(req: NextRequest) {
  try {
    const { page, limit, skip } = parsePagination(req.url);

    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    // Category filter
    if (categoryId) {
      whereClause += " AND p.categoryId = ?";
      params.push(Number(categoryId));
    }

    // Search filter
    if (search) {
      whereClause += `
        AND (
          p.name LIKE ?
          OR p.shortDescription LIKE ?
        )
      `;

      params.push(
        `%${search}%`,
        `%${search}%`
      );
    }

    // Price filter
    if (minPrice) {
      whereClause += " AND p.price >= ?";
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      whereClause += " AND p.price <= ?";
      params.push(Number(maxPrice));
    }

    const [products]: any = await db.query(
      `
      SELECT
        p.*,
        c.id AS categoryId,
        c.name AS categoryName

      FROM product p

      LEFT JOIN category c
        ON c.id = p.categoryId

      ${whereClause}

      ORDER BY p.createdAt DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, skip]
    );

    // Load images/colors/sizes
    for (const product of products) {
      const [images]: any = await db.query(
        `
        SELECT id, imageUrl
        FROM productimage
        WHERE productId = ?
        `,
        [product.id]
      );

      const [colors]: any = await db.query(
        `
        SELECT id, color
        FROM productcolor
        WHERE productId = ?
        `,
        [product.id]
      );

      const [sizes]: any = await db.query(
        `
        SELECT id, size
        FROM productsize
        WHERE productId = ?
        `,
        [product.id]
      );

      product.productimage = images;
      product.productcolor = colors;
      product.productsize = sizes;

      product.category = {
        id: product.categoryId,
        name: product.categoryName,
      };
    }

    const [countRows]: any = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM product p
      ${whereClause}
      `,
      params
    );

    const total = countRows[0].total;

    return ok(
      paginated(
        products,
        total,
        page,
        limit
      )
    );
  } catch (error: any) {
    return fail(
      error.message || "Failed to fetch products"
    );
  }
}