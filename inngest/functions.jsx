import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { resend, FROM_ADDRESS } from "@/lib/resend";
import OrderConfirmedEmail from "@/emails/OrderConfirmedEmail";

const orderInclude = {
  user: true,
  address: true,
  orderItems: { include: { product: true } },
};

const buildName = (data) =>
  [data.first_name, data.last_name].filter(Boolean).join(" ") || "Customer";

export const syncUsercreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses[0].email_address,
        name: buildName(data),
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
        name: buildName(data),
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
    const expiryDate = new Date(data.expires_at);
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

export const sendOrderConfirmedEmail = inngest.createFunction(
  { id: "send-order-confirmed-email" },
  { event: "app/order.placed" },
  async ({ event }) => {
    const order = await prisma.order.findUnique({
      where: { id: event.data.orderId },
      include: orderInclude,
    });
    if (!order) return;

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: order.user.email,
      subject: `Order Confirmed - #${order.id.slice(-8).toUpperCase()}`,
      react: <OrderConfirmedEmail order={order} />,
    });
    if (error) throw new Error(error.message || "Resend send failed");
  }
);
