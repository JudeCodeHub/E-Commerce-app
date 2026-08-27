import AdminLayout from "@/components/admin/AdminLayout";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "NexBuy. - Admin",
  description: "NexBuy. - Admin",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <SignedIn>
        <AdminLayout>{children}</AdminLayout>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex justify-center items-center">
          <SignIn fallbackRedirectUrl="/admin" routing="hash" />
        </div>
      </SignedOut>
    </>
  );
}
