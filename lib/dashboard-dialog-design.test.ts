import { dashboardDialogDesign } from "@app/(dashboard)/_components/dashboard-dialog-design";
import { describe, expect, it } from "vitest";

describe("dashboard dialog design contracts", () => {
  it("keeps the previous preset amount visible while a custom credit amount is empty", () => {
    const displayAmount: string = dashboardDialogDesign.formatBuyCreditsDisplayAmount({
      customAmount: "",
      fallbackAmount: 20,
      isCustom: true,
      selectedAmount: null,
    });

    expect(displayAmount).toBe("$20.00");
  });
});
