import { NextRequest } from "next/server";
import db from "../../../../lib/db";
import { ok, fail } from "../../../../lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q");

    if (!q?.trim()) {
      return fail("Search query required");
    }

    const [products]: any = await db.query(
      `
      SELECT
        p.*,
        c.name AS categoryName
      FROM product p
      LEFT JOIN category c
        ON c.id = p.categoryId
      WHERE
        p.name LIKE ?
        OR p.sku LIKE ?
        OR p.shortDescription LIKE ?
      ORDER BY p.createdAt DESC
      `,
      [
        `%${q}%`,
        `%${q}%`,
        `%${q}%`,
      ]
    );

    for (const product of products) {
      const [images]: any = await db.query(
        `
        SELECT id, imageUrl
        FROM productimage
        WHERE productId = ?
        LIMIT 1
        `,
        [product.id]
      );

      product.image = images.length
        ? images[0].imageUrl
        : null;
    }

    return ok(products);
  } catch (error: any) {
    return fail(error.message);
  }
}