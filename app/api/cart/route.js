import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { cart } = await request.json();

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        cart: cart,
      },
    });

    return NextResponse.json({
      message: "Cart updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return NextResponse.json({
      cart: user.cart,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 400,
      }
    );
  }
}
