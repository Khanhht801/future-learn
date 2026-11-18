import { useEffect, useRef, useState } from "react";
export function useFullscreen() {
  const card = useRef<HTMLElement>(null),
    button = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const busy = useRef(false);
  const [fallback, setFallback] = useState(false),
    [native, setNative] = useState(false);
  useEffect(() => {
    const sync = () => setNative(document.fullscreenElement === card.current);
    document.addEventListener("fullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      if (document.fullscreenElement === card.current)
        void document.exitFullscreen();
    };
  }, []);
  const expanded = fallback || native;
  useEffect(() => {
    if (expanded) return;
    if (previousFocus.current?.isConnected)
      previousFocus.current.focus({ preventScroll: true });
    previousFocus.current = null;
  }, [expanded]);
  useEffect(() => {
    if (!fallback || !card.current) return;
    document.documentElement.classList.add("lesson-fullscreen-open");
    const outside = new Map<HTMLElement, boolean>();
    for (
      let node: HTMLElement | null = card.current;
      node?.parentElement;
      node = node.parentElement
    ) {
      for (const sibling of node.parentElement.children)
        if (sibling !== node && sibling instanceof HTMLElement) {
          outside.set(sibling, sibling.inert);
          sibling.inert = true;
        }
    }
    button.current?.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (card.current?.querySelector("dialog[open]")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setFallback(false);
      }
      if (event.key !== "Tab") return;
      const controls = [
        ...card.current!.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], [tabindex="0"]',
        ),
      ].filter((node) => node.getClientRects().length);
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      outside.forEach((inert, node) => {
        node.inert = inert;
      });
      document.documentElement.classList.remove("lesson-fullscreen-open");
      document.removeEventListener("keydown", keydown);
    };
  }, [fallback]);
  const toggle = async () => {
    if (busy.current || !card.current) return;
    busy.current = true;
    try {
      if (fallback) {
        setFallback(false);
        return;
      }
      if (document.fullscreenElement === card.current) {
        await document.exitFullscreen();
        return;
      }
      previousFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      if (
        card.current.requestFullscreen &&
        document.fullscreenEnabled !== false
      ) {
        try {
          await card.current.requestFullscreen();
          card.current
            .querySelector<HTMLElement>("[data-speak]")
            ?.focus({ preventScroll: true });
          return;
        } catch {
          /* Native fullscreen may be denied. */
        }
      }
      setFallback(true);
    } finally {
      busy.current = false;
    }
  };
  return { card, button, expanded, native, toggle };
}
