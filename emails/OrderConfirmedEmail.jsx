import {
  Button,
  Column,
  Heading,
  Hr,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";
import EmailLayout from "./components/EmailLayout";
import { APP_URL } from "@/lib/resend";

const OrderConfirmedEmail = ({ order }) => {
  const orderNumber = order.id.slice(-8).toUpperCase();
  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingAndFees = order.total - subtotal;

  return (
    <EmailLayout previewText={`Your NexBuy order #${orderNumber} is confirmed`}>
      <Heading style={heading}>Thanks for your order, {order.user.name}!</Heading>
      <Text style={text}>
        We&apos;ve confirmed your order <strong>#{orderNumber}</strong> and
        it&apos;s being prepared.
      </Text>

      <Section style={itemsBox}>
        {order.orderItems.map((item, i) => (
          <Row key={i} style={itemRow}>
            <Column width={56}>
              <Img
                src={item.product.images?.[0]}
                width="48"
                height="48"
                style={itemImage}
              />
            </Column>
            <Column>
              <Text style={itemName}>{item.product.name}</Text>
              <Text style={itemMeta}>Qty: {item.quantity}</Text>
            </Column>
            <Column align="right">
              <Text style={itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </Column>
          </Row>
        ))}
        <Hr style={hr} />
        <Row>
          <Column>
            <Text style={totalLabel}>Subtotal</Text>
          </Column>
          <Column align="right">
            <Text style={itemPrice}>${subtotal.toFixed(2)}</Text>
          </Column>
        </Row>
        {Math.abs(shippingAndFees) >= 0.01 && (
          <Row>
            <Column>
              <Text style={totalLabel}>Shipping & Fees</Text>
            </Column>
            <Column align="right">
              <Text style={itemPrice}>${shippingAndFees.toFixed(2)}</Text>
            </Column>
          </Row>
        )}
        <Hr style={hr} />
        <Row>
          <Column>
            <Text style={totalLabel}>Total</Text>
          </Column>
          <Column align="right">
            <Text style={totalValue}>${order.total.toFixed(2)}</Text>
          </Column>
        </Row>
      </Section>

      <Text style={subheading}>Shipping to</Text>
      <Text style={text}>
        {order.address.street}, {order.address.city}, {order.address.state}{" "}
        {order.address.zip}, {order.address.country}
      </Text>

      <Button href={`${APP_URL}/orders`} style={button}>
        View Order
      </Button>
    </EmailLayout>
  );
};

const heading = { fontSize: "20px", fontWeight: "600", color: "#131316" };
const subheading = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#94a3b8",
  textTransform: "uppercase",
  marginBottom: "4px",
};
const text = { fontSize: "14px", color: "#334155", lineHeight: "22px" };
const itemsBox = {
  backgroundColor: "#f4f5f7",
  borderRadius: "10px",
  padding: "16px",
  margin: "20px 0",
};
const itemRow = { marginBottom: "12px" };
const itemImage = { borderRadius: "8px", objectFit: "cover" };
const itemName = { fontSize: "14px", color: "#131316", fontWeight: "500", margin: 0 };
const itemMeta = { fontSize: "12px", color: "#94a3b8", margin: 0 };
const itemPrice = { fontSize: "14px", color: "#131316", fontWeight: "500" };
const hr = { borderColor: "#e2e4e9", margin: "12px 0" };
const totalLabel = { fontSize: "14px", color: "#334155", fontWeight: "600" };
const totalValue = { fontSize: "16px", color: "#131316", fontWeight: "700" };
const button = {
  backgroundColor: "#fbbd0c",
  color: "#131316",
  fontSize: "14px",
  fontWeight: "700",
  borderRadius: "8px",
  padding: "12px 24px",
  marginTop: "12px",
};

export default OrderConfirmedEmail;
