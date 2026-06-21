// app/api/admin/products/[id]/route.ts

import { NextRequest } from "next/server";
import db from "../../../../../lib/db";
import { ok, fail } from "../../../../../lib/utils";

// GET /api/admin/products/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);

    const [products]: any = await db.query(
      `
      SELECT
        p.*,
        c.id as categoryId,
        c.name as categoryName
      FROM product p
      LEFT JOIN category c ON c.id = p.categoryId
      WHERE p.id = ?
      `,
      [id]
    );

    if (products.length === 0) {
      return fail("Product not found", 404);
    }

    const product = products[0];

    const [images]: any = await db.query(
      "SELECT imageUrl FROM productimage WHERE productId = ?",
      [id]
    );

    const [colors]: any = await db.query(
      "SELECT color FROM productcolor WHERE productId = ?",
      [id]
    );

    const [sizes]: any = await db.query(
      "SELECT size FROM productsize WHERE productId = ?",
      [id]
    );

    product.images = images.map((x: any) => x.imageUrl);
    product.colors = colors.map((x: any) => x.color);
    product.sizes = sizes.map((x: any) => x.size);

    return ok(product);
  } catch (error: any) {
    return fail(error.message);
  }
}

// DELETE /api/admin/products/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);

    const [products]: any = await db.query(
      "SELECT id FROM product WHERE id = ?",
      [id]
    );

    if (products.length === 0) {
      return fail("Product not found", 404);
    }

    await db.query(
      "DELETE FROM product WHERE id = ?",
      [id]
    );

    return ok({
      message: "Product deleted",
    });
  } catch (error: any) {
    return fail(error.message);
  }
}

// PUT /api/admin/products/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);

    const body = await req.json();

    const [products]: any = await db.query(
      "SELECT * FROM product WHERE id = ?",
      [id]
    );

    if (products.length === 0) {
      return fail("Product not found", 404);
    }

    const product = products[0];

    if (body.sku && body.sku !== product.sku) {
      const [skuExists]: any = await db.query(
        "SELECT id FROM product WHERE sku = ?",
        [body.sku.trim()]
      );

      if (skuExists.length > 0) {
        return fail("SKU already exists");
      }
    }

    await db.query(
      `
      UPDATE product
      SET
        name = ?,
        sku = ?,
        shortDescription = ?,
        fullDescription = ?,
        price = ?,
        discountPrice = ?,
        categoryId = ?,
        updatedAt = NOW()
      WHERE id = ?
      `,
      [
        body.name ?? product.name,
        body.sku ?? product.sku,
        body.shortDescription ?? product.shortDescription,
        body.fullDescription ?? product.fullDescription,
        body.price ?? product.price,
        body.discountPrice ?? product.discountPrice,
        body.categoryId ?? product.categoryId,
        id,
      ]
    );

    // Images replace
    if (body.images) {
      await db.query(
        "DELETE FROM productimage WHERE productId = ?",
        [id]
      );

      for (const imageUrl of body.images) {
        await db.query(
          "INSERT INTO productimage (productId, imageUrl) VALUES (?, ?)",
          [id, imageUrl]
        );
      }
    }

    // Colors replace
    if (body.colors) {
      await db.query(
        "DELETE FROM productcolor WHERE productId = ?",
        [id]
      );

      for (const color of body.colors) {
        await db.query(
          "INSERT INTO productcolor (productId, color) VALUES (?, ?)",
          [id, color]
        );
      }
    }

    // Sizes replace
    if (body.sizes) {
      await db.query(
        "DELETE FROM productsize WHERE productId = ?",
        [id]
      );

      for (const size of body.sizes) {
        await db.query(
          "INSERT INTO productsize (productId, size) VALUES (?, ?)",
          [id, size]
        );
      }
    }

    const [updated]: any = await db.query(
      "SELECT * FROM product WHERE id = ?",
      [id]
    );

    return ok(updated[0]);
  } catch (error: any) {
    return fail(error.message);
  }
}