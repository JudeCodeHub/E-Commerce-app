import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    const { orderId, productId, rating, review } = await request.json();

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isAlreadyRated = await prisma.rating.findFirst({
      where: {
        orderId,
        productId,
      },
    });

    if (isAlreadyRated) {
      return NextResponse.json(
        { error: "You have already rated this product" },
        { status: 400 }
      );
    }

    const response = await prisma.rating.create({
      data: {
        userId,
        productId,
        rating,
        review,
        orderId,
      },
    });

    return NextResponse.json(
      { message: "Rating added successfully", rating: response },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ratings = await prisma.rating.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json({ ratings }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
