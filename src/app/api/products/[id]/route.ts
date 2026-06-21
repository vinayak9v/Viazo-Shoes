import { NextRequest } from "next/server";
import db from "../../../../lib/db";
import { ok, fail } from "../../../../lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return fail("Invalid product id");
    }

    const [products]: any = await db.query(
      `
      SELECT
        p.*,
        c.id as categoryId,
        c.name as categoryName
      FROM product p
      LEFT JOIN category c
        ON c.id = p.categoryId
      WHERE p.id = ?
      LIMIT 1
      `,
      [productId]
    );

    if (products.length === 0) {
      return fail("Product not found", 404);
    }

    const product = products[0];

    const [images]: any = await db.query(
      `
      SELECT id, imageUrl
      FROM productimage
      WHERE productId = ?
      `,
      [productId]
    );

    const [colors]: any = await db.query(
      `
      SELECT id, color
      FROM productcolor
      WHERE productId = ?
      `,
      [productId]
    );

    const [sizes]: any = await db.query(
      `
      SELECT id, size
      FROM productsize
      WHERE productId = ?
      `,
      [productId]
    );

    return ok({
      ...product,
      category: {
        id: product.categoryId,
        name: product.categoryName,
      },
      images,
      colors,
      sizes,
    });
  } catch (error: any) {
    return fail(error.message || "Failed to fetch product");
  }
}