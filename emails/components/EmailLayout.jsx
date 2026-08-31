import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const EmailLayout = ({ previewText, children }) => {
  return (
    <Html>
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>
              <span style={{ color: "#fbbd0c" }}>Nex</span>Buy
              <span style={{ color: "#fbbd0c" }}>.</span>
            </Text>
          </Section>

          <Section style={content}>{children}</Section>

          <Hr style={hr} />

          <Section>
            <Text style={footer}>
              You&apos;re receiving this email because you have an account on
              NexBuy.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const body = {
  backgroundColor: "#f4f5f7",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  margin: 0,
  padding: "24px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  maxWidth: "560px",
  margin: "0 auto",
  overflow: "hidden",
};

const header = {
  backgroundColor: "#131316",
  padding: "24px 32px",
};

const logo = {
  color: "#f4f5f7",
  fontSize: "24px",
  fontWeight: "600",
  margin: 0,
};

const content = {
  padding: "32px",
};

const hr = {
  borderColor: "#e2e4e9",
  margin: "0 32px",
};

const footer = {
  color: "#94a3b8",
  fontSize: "12px",
  padding: "0 32px 24px",
  textAlign: "center",
};

export default EmailLayout;
