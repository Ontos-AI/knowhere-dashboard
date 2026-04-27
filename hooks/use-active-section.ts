import { useEffect, useState } from "react";

type UseActiveSectionOptions = {
  ids: string[];
  offset?: number;
};

export const useActiveSection = ({ ids, offset = 96 }: UseActiveSectionOptions) => {
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    if (ids.length === 0) {
      return undefined;
    }

    let frameId = 0;

    const updateActiveId = () => {
      const sections = ids
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => section !== null);

      if (sections.length === 0) {
        return;
      }

      const scrollPosition = window.scrollY + offset;
      let nextActiveId = sections[0]?.id ?? ids[0] ?? "";

      for (const section of sections) {
        if (scrollPosition >= section.offsetTop) {
          nextActiveId = section.id;
          continue;
        }

        break;
      }

      const viewportBottom = window.scrollY + window.innerHeight;
      const documentBottom = document.documentElement.scrollHeight;

      if (viewportBottom >= documentBottom - 4) {
        nextActiveId = sections.at(-1)?.id ?? nextActiveId;
      }

      setActiveId((currentActiveId) =>
        currentActiveId === nextActiveId ? currentActiveId : nextActiveId
      );
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveId);
    };

    requestUpdate();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
    };
  }, [ids, offset]);

  return activeId;
};
