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

  it("uses the Figma desktop code-panel inset for the welcome dialog", () => {
    expect(dashboardDialogDesign.usageWelcome.codePanelFrame).toContain("lg:pl-20");
    expect(dashboardDialogDesign.usageWelcome.codePanelFrame).toContain("lg:pr-12");
    expect(dashboardDialogDesign.usageWelcome.codeTitleFrame).toContain("lg:pl-20");
    expect(dashboardDialogDesign.usageWelcome.codeIconTag).toContain("lg:size-12");
  });

  it("keeps dialog action buttons at the Figma desktop pixel depth", () => {
    const dialogSizeClassName: string = dashboardDialogDesign.actionButton.dialogSize;

    expect(dialogSizeClassName).toContain("h-12");
    expect(dialogSizeClassName).toContain("sm:h-9");
    expect(dialogSizeClassName).toContain("border-b-4");
    expect(dialogSizeClassName).toContain("border-l");
    expect(dialogSizeClassName).toContain("border-r");
    expect(dialogSizeClassName).toContain("border-t");
    expect(dialogSizeClassName).toContain("gap-1");
    expect(dialogSizeClassName).toContain("px-3");
    expect(dialogSizeClassName).toContain("pb-0.5");
    expect(dialogSizeClassName).toContain("leading-5");
    expect(dialogSizeClassName).not.toContain("sm:border-b-[3px]");
    expect(dialogSizeClassName).not.toContain("sm:!border-l-[0.5px]");
    expect(dialogSizeClassName).not.toContain("sm:gap-0.5");
    expect(dialogSizeClassName).not.toContain("sm:px-2.5");
    expect(dialogSizeClassName).not.toContain("sm:leading-[18px]");
  });
});
