import { useEffect, type RefObject } from "react";
/** Pointer scrolling preserves keyboard clicks and suppresses clicks after a drag. */
export function useDragScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scroller = ref.current;
    if (!scroller) return;
    let drag: { id: number; x: number; left: number } | null = null,
      dragged = false;
    const down = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragged = false;
      drag = {
        id: event.pointerId,
        x: event.clientX,
        left: scroller.scrollLeft,
      };
    };
    const move = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const distance = event.clientX - drag.x;
      if (!dragged && Math.abs(distance) < 6) return;
      if (!dragged) {
        dragged = true;
        scroller.setPointerCapture(drag.id);
        scroller.classList.add("is-dragging");
      }
      event.preventDefault();
      scroller.scrollLeft = drag.left - distance;
    };
    const end = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const id = drag.id;
      drag = null;
      scroller.classList.remove("is-dragging");
      if (scroller.hasPointerCapture(id)) scroller.releasePointerCapture(id);
    };
    const click = (event: MouseEvent) => {
      if (dragged && event.detail !== 0) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    const prevent = (event: DragEvent) => event.preventDefault();
    scroller.addEventListener("pointerdown", down);
    scroller.addEventListener("pointermove", move);
    scroller.addEventListener("click", click, true);
    scroller.addEventListener("dragstart", prevent);
    const endEvents = [
      "pointerup",
      "pointercancel",
      "lostpointercapture",
    ] as const;
    endEvents.forEach((type) => scroller.addEventListener(type, end));
    return () => {
      scroller.removeEventListener("pointerdown", down);
      scroller.removeEventListener("pointermove", move);
      scroller.removeEventListener("click", click, true);
      scroller.removeEventListener("dragstart", prevent);
      endEvents.forEach((type) => scroller.removeEventListener(type, end));
      scroller.classList.remove("is-dragging");
    };
  }, [ref]);
}
