import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LightboxPattern } from "@/app/(landing)/_components/comparison-variants/lightbox-variants/types";

type LightboxStore = {
  pattern: LightboxPattern;
  setPattern: (pattern: LightboxPattern) => void;
};

export const useLightboxStore = create<LightboxStore>()(
  persist(
    (set) => ({
      pattern: "fullscreen",
      setPattern: (pattern) => set({ pattern }),
    }),
    {
      name: "lightbox-pattern",
    }
  )
);
