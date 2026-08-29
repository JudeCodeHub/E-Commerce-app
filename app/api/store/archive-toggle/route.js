import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middlewares/authSeller";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { refillFeaturedSlots } from "@/lib/refillFeatured";

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Missing details : productId" },
        { status: 400 }
      );
    }

    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const isArchiving = !product.archived;

    const updated = await prisma.product.update({
      where: {
        id: productId,
        storeId,
      },
      data: {
        archived: isArchiving,
        featured: isArchiving ? false : product.featured,
      },
    });

    if (isArchiving && product.featured) {
      await refillFeaturedSlots();
    }

    return NextResponse.json({
      message: updated.archived
        ? "Product archived successfully"
        : "Product restored successfully",
      product: updated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
