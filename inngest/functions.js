import { inngest } from "./client";
import prisma from "@/lib/prisma";

export const syncUsercreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
      },
    });
  }
);

export const syncUserupdation = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
      },
    });
  }
);

export const syncUserdeletion = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  }
);

export const deleteCouponOnExpiry = inngest.createFunction(
  { id: "delete-coupon-on-expiry" },
  { event: "app/coupon.expired" },
  async ({ event, step }) => {
    const { data } = event;
    const expiryDate = new Date(data.expiresAt);
    await step.sleepUntil("wait for expiry", expiryDate);
    await step.run("delete-coupon-from-database", async () => {
      await prisma.coupon.delete({
        where: {
          code: data.code,
        },
      });
    });
  }
);
