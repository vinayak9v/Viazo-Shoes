import { NextRequest } from "next/server";
import db from "../../../../lib/db";
import { ok, fail } from "../../../../lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const categoryId = Number(id);

    if (isNaN(categoryId)) {
      return fail("Invalid category id");
    }

    const [products]: any = await db.query(
      `
      SELECT
        p.*,
        c.name AS categoryName
      FROM product p
      LEFT JOIN category c
        ON c.id = p.categoryId
      WHERE p.categoryId = ?
      ORDER BY p.createdAt DESC
      `,
      [categoryId]
    );

    for (const product of products) {
      const [images]: any = await db.query(
        `
        SELECT id,imageUrl
        FROM productimage
        WHERE productId = ?
        `,
        [product.id]
      );

      product.images = images;
    }

    return ok(products);
  } catch (error: any) {
    return fail(error.message);
  }
}