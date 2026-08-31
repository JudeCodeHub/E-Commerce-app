import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address } = await request.json();

    address.userId = userId;

    const existingCount = await prisma.address.count({ where: { userId } });
    if (existingCount === 0) {
      address.isDefault = true;
    }

    const newAddress = await prisma.address.create({
      data: address,
    });

    return NextResponse.json({
      newAddress,
      message: "Address added successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.code || error.message,
      },
      {
        status: 400,
      }
    );
  }
}

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const { addressId, address } = await request.json();

    const existing = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: address,
    });

    return NextResponse.json({
      updatedAddress,
      message: "Address updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.code || error.message,
      },
      {
        status: 400,
      }
    );
  }
}

export async function PATCH(request) {
  try {
    const { userId } = getAuth(request);
    const { addressId } = await request.json();

    const existing = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      }),
    ]);

    return NextResponse.json({ message: "Default address updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.code || error.message,
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);
    const { addressId } = await request.json();

    const existing = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id: addressId } });

    if (existing.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "asc" },
      });
      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "This address is used in past orders and can't be deleted" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: error.code || error.message,
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

    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json({
      addresses,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.code || error.message,
      },
      {
        status: 400,
      }
    );
  }
}
