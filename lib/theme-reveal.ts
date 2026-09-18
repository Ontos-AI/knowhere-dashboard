const REVEAL_ATTRIBUTE = "themeTransition";

const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The prototype animates a theme change with a circular reveal: the new palette is
 * clipped into a circle that grows out of the control the user activated.
 *
 * This mirrors the prototype's maths so the `theme-circle-reveal` keyframes that
 * ship with the site theme can run. It falls back to an instant change when the
 * browser cannot start a view transition or when the user asked for reduced motion.
 *
 * `applyTheme` has to mutate the DOM synchronously (wrap React state updates in
 * `flushSync`), otherwise both snapshots of the transition show the old theme.
 */
export const runThemeReveal = async (
  origin: HTMLElement,
  applyTheme: () => void
): Promise<void> => {
  const root = document.documentElement;

  if (root.dataset[REVEAL_ATTRIBUTE] === "active") return;

  if (!document.startViewTransition) {
    applyTheme();
    return;
  }

  if (prefersReducedMotion()) {
    applyTheme();
    return;
  }

  const { left, top, width, height } = origin.getBoundingClientRect();
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  const reach = Math.hypot(window.innerWidth, window.innerHeight) / Math.SQRT2;
  const radius = Math.hypot(
    Math.max(centerX, window.innerWidth - centerX),
    Math.max(centerY, window.innerHeight - centerY)
  );

  root.style.setProperty(
    "--theme-reveal-origin",
    `${(centerX / window.innerWidth) * 100}% ${(centerY / window.innerHeight) * 100}%`
  );
  root.style.setProperty("--theme-reveal-radius", `${(radius / reach) * 100}%`);
  root.dataset[REVEAL_ATTRIBUTE] = "active";

  const transition = document.startViewTransition(applyTheme);

  try {
    await transition.finished;
  } catch {
    // A skipped or interrupted transition still has to clean up after itself.
  } finally {
    delete root.dataset[REVEAL_ATTRIBUTE];
    root.style.removeProperty("--theme-reveal-origin");
    root.style.removeProperty("--theme-reveal-radius");
  }
};
