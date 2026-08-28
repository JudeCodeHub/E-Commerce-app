import { getAuth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

async function getUserProfileData() {
  const clerkUser = await currentUser();
  return {
    email: clerkUser.emailAddresses[0].emailAddress,
    name: `${clerkUser.firstName} ${clerkUser.lastName}`,
    image: clerkUser.imageUrl,
  };
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { cart } = await request.json();

    await prisma.user.upsert({
      where: {
        id: userId,
      },
      update: {
        cart: cart,
      },
      create: {
        id: userId,
        ...(await getUserProfileData()),
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
    let user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          ...(await getUserProfileData()),
        },
      });
    }

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
