import { LandingBrand } from "@app/(landing)/_components/landing-brand";

export const ClawFooter = () => {
  return (
    <footer className="border border-[#e4e4e7] bg-[#fafafa] px-4 py-4 sm:px-16 sm:py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="order-1 text-center text-xs leading-4 text-[#9f9fa9] sm:order-2 sm:text-left sm:text-sm sm:leading-5">
          © 2026 Knowhere API. All rights reserved.
        </p>
        <div className="order-2 self-center sm:order-1 sm:self-auto">
          <LandingBrand compact />
        </div>
      </div>
    </footer>
  );
};
