import { LandingBrand } from "@app/(landing)/_components/landing-brand";

export const ClawFooter = () => {
  return (
    <footer className="bg-white px-4 py-4 shadow-[inset_0_0_0_1px_#e4e4e7] min-[640px]:max-[767px]:px-12 min-[640px]:max-[767px]:py-[22px] min-[768px]:max-[768px]:px-12 min-[768px]:max-[768px]:py-[22px] min-[769px]:px-12 min-[769px]:py-6">
      <div className="flex flex-col gap-2 min-[640px]:max-[767px]:flex-row min-[640px]:max-[767px]:items-center min-[640px]:max-[767px]:justify-between min-[640px]:max-[767px]:gap-4 min-[768px]:max-[768px]:flex-row min-[768px]:max-[768px]:items-center min-[768px]:max-[768px]:justify-between min-[768px]:max-[768px]:gap-4 min-[769px]:flex-row min-[769px]:items-center min-[769px]:justify-between min-[769px]:gap-4">
        <p className="order-1 text-center text-xs leading-4 text-[#9f9fa9] min-[640px]:max-[767px]:order-2 min-[640px]:max-[767px]:text-left min-[768px]:max-[768px]:order-2 min-[768px]:max-[768px]:text-left min-[769px]:order-2 min-[769px]:text-left min-[769px]:text-xs min-[769px]:leading-4">
          © 2026 Knowhere API. All rights reserved.
        </p>
        <div className="order-2 self-center min-[640px]:max-[767px]:order-1 min-[640px]:max-[767px]:self-auto min-[768px]:max-[768px]:order-1 min-[768px]:max-[768px]:self-auto min-[769px]:order-1 min-[769px]:self-auto">
          <LandingBrand compact />
        </div>
      </div>
    </footer>
  );
};
