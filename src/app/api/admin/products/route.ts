// app/api/admin/products/route.ts

import { NextRequest } from "next/server";
import db from "../../../../lib/db";
import { ok, fail, parsePagination, paginated } from "../../../../lib/utils";

// POST /api/admin/products
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      sku,
      shortDescription,
      fullDescription,
      price,
      discountPrice,
      categoryId,
      images = [],
      colors = [],
      sizes = [],
    } = body;

    if (!name?.trim()) return fail("Product name is required");
    if (!sku?.trim()) return fail("SKU is required");
    if (!price || isNaN(Number(price)))
      return fail("Valid price is required");
    if (!categoryId) return fail("Category is required");

    // Check SKU
    const [skuRows]: any = await db.query(
      "SELECT id FROM product WHERE sku = ?",
      [sku.trim()]
    );

    if (skuRows.length > 0) {
      return fail("SKU already exists");
    }

    // Check category
    const [categoryRows]: any = await db.query(
      "SELECT id FROM category WHERE id = ?",
      [Number(categoryId)]
    );

    if (categoryRows.length === 0) {
      return fail("Category not found");
    }

    // Create product
    const [result]: any = await db.query(
      `
      INSERT INTO product (
        name,
        sku,
        shortDescription,
        fullDescription,
        price,
        discountPrice,
        categoryId,
        createdAt,
        updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [
        name.trim(),
        sku.trim(),
        shortDescription || null,
        fullDescription || null,
        Number(price),
        discountPrice ? Number(discountPrice) : null,
        Number(categoryId),
      ]
    );

    const productId = result.insertId;

    // Images
    for (const imageUrl of images) {
      await db.query(
        `
        INSERT INTO productimage
        (productId, imageUrl)
        VALUES (?, ?)
        `,
        [productId, imageUrl]
      );
    }

    // Colors
    for (const color of colors) {
      await db.query(
        `
        INSERT INTO productcolor
        (productId, color)
        VALUES (?, ?)
        `,
        [productId, color]
      );
    }

    // Sizes
    for (const size of sizes) {
      await db.query(
        `
        INSERT INTO productsize
        (productId, size)
        VALUES (?, ?)
        `,
        [productId, size]
      );
    }

    const [product]: any = await db.query(
      `
      SELECT p.*, c.name as categoryName
      FROM product p
      LEFT JOIN category c ON c.id = p.categoryId
      WHERE p.id = ?
      `,
      [productId]
    );

    return ok(product[0], 201);
  } catch (error: any) {
    return fail(error.message);
  }
}

// GET /api/admin/products
export async function GET(req: NextRequest) {
  try {
    const { page, limit, skip } = parsePagination(req.url);

    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");

    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    if (categoryId) {
      whereClause += " AND p.categoryId = ?";
      params.push(Number(categoryId));
    }

    if (search) {
      whereClause += `
        AND (
          p.name LIKE ?
          OR p.sku LIKE ?
        )
      `;

      params.push(
        `%${search}%`,
        `%${search}%`
      );
    }

    const [products]: any = await db.query(
      `
      SELECT
        p.id,
        p.name,
        p.price,
        p.discountPrice,
        c.name AS categoryName,

        (
          SELECT imageUrl
          FROM productimage pi
          WHERE pi.productId = p.id
          LIMIT 1
        ) AS image

      FROM product p
      LEFT JOIN category c
      ON c.id = p.categoryId

      ${whereClause}

      ORDER BY p.createdAt DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, skip]
    );

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
    return fail(error.message);
  }
}