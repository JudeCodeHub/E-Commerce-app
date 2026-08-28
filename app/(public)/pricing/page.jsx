import { PricingTable } from "@clerk/nextjs";
import Title from "@/components/Title";

export default function PricingPage() {
  return (
    <div className="min-h-[80vh] px-6 py-20">
      <Title
        title="Simple, Transparent Pricing"
        description="Free to start. Upgrade to Plus anytime for exclusive perks and faster shipping."
        visibleButton={false}
      />

      <div className="mx-auto max-w-[820px] mt-14">
        <PricingTable
          appearance={{
            variables: {
              colorPrimary: "#fbbd0c",
              colorBackground: "#131316",
              colorText: "#f1f5f9",
              colorTextSecondary: "#94a3b8",
              colorInputBackground: "#1a1a1f",
              colorInputText: "#f1f5f9",
              colorNeutral: "#ffffff",
              colorShadow: "rgba(0,0,0,0.4)",
              borderRadius: "1rem",
            },
            elements: {
              pricingTableCard: "bg-panel! border border-white/10! shadow-xl shadow-black/30",
              pricingTableCardHeader: "border-white/10!",
              pricingTableCardTitle: "text-white! font-semibold",
              pricingTableCardDescription: "text-muted!",
              pricingTableCardFee: "text-white!",
              pricingTableCardFeePeriod: "text-muted!",
              pricingTableCardFeatures: "text-slate-300!",
              pricingTableCardFeaturesListItemIcon: "text-accent!",
              badge: "bg-accent! text-slate-900!",
              formButtonPrimary:
                "bg-accent! hover:bg-accent-hover! text-slate-900! font-bold! shadow-md shadow-accent/20",
            },
          }}
        />
      </div>
    </div>
  );
}
