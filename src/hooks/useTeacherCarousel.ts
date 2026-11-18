import { useCallback, useEffect, useRef, useState, type DragEvent, type PointerEvent } from 'react';
import { useMediaQuery } from './useMediaQuery';
import { usePageVisibility } from './usePageVisibility';

export function useTeacherCarousel() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const drag = useRef<{ pointerId: number; x: number; scroll: number; moved: boolean } | null>(null);
  const [hasOverflow, setHasOverflow] = useState(true);
  const [visible, setVisible] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [touching, setTouching] = useState(false);
  const [autoplayVersion, setAutoplayVersion] = useState(0);
  const pageVisible = usePageVisibility();
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', true);
  const behavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth';
  const restartAutoplay = () => setAutoplayVersion(version => version + 1);

  const getScrollStep = useCallback(() => {
    const items = trackRef.current?.children;
    const first = items?.[0] as HTMLElement | undefined;
    const second = items?.[1] as HTMLElement | undefined;
    return (second && first ? second.offsetLeft - first.offsetLeft : first?.offsetWidth)
      || viewportRef.current?.clientWidth || 1;
  }, []);

  const move = useCallback((direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const max = viewport.scrollWidth - viewport.clientWidth;
    const wrap = direction === 1 ? viewport.scrollLeft >= max - 2 : viewport.scrollLeft <= 2;
    viewport.scrollTo({
      left: wrap ? (direction === 1 ? 0 : max) : viewport.scrollLeft + direction * getScrollStep(),
      behavior: wrap ? 'auto' : behavior,
    });
  }, [behavior, getScrollStep]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const slider = sliderRef.current;
    if (!viewport || !track || !slider) return;
    const measure = () => setHasOverflow(viewport.scrollWidth > viewport.clientWidth + 1);
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
    resizeObserver?.observe(viewport);
    resizeObserver?.observe(track);
    if (!resizeObserver) window.addEventListener('resize', measure, { passive: true });
    const visibilityObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? true), { threshold: 0.2 })
      : null;
    visibilityObserver?.observe(slider);
    const frame = window.requestAnimationFrame(measure);
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      window.removeEventListener('resize', measure);
      const pointerId = drag.current?.pointerId;
      if (pointerId !== undefined && viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId);
      drag.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hasOverflow || !visible || !pageVisible || dragging || touching) return;
    const timer = window.setInterval(() => move(1), 1500);
    return () => window.clearInterval(timer);
  }, [hasOverflow, visible, pageVisible, dragging, touching, autoplayVersion, move]);

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(current.pointerId)) {
      event.currentTarget.releasePointerCapture(current.pointerId);
    }
    if (current.moved) {
      const step = getScrollStep();
      event.currentTarget.scrollTo({ left: Math.round(event.currentTarget.scrollLeft / step) * step, behavior });
    }
    drag.current = null;
    setDragging(false);
    restartAutoplay();
  };

  return {
    sliderRef,
    viewportRef,
    trackRef,
    hasOverflow,
    dragging,
    previous() { move(-1); restartAutoplay(); },
    next() { move(1); restartAutoplay(); },
    viewportEvents: {
      onPointerDown(event: PointerEvent<HTMLDivElement>) {
        if (event.pointerType === 'touch' || event.button !== 0) return;
        drag.current = { pointerId: event.pointerId, x: event.clientX, scroll: event.currentTarget.scrollLeft, moved: false };
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.focus({ preventScroll: true });
        setDragging(true);
        event.preventDefault();
      },
      onPointerMove(event: PointerEvent<HTMLDivElement>) {
        const current = drag.current;
        if (!current || current.pointerId !== event.pointerId) return;
        const distance = event.clientX - current.x;
        current.moved ||= Math.abs(distance) > 4;
        event.currentTarget.scrollLeft = current.scroll - distance;
      },
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
      onDragStart(event: DragEvent<HTMLDivElement>) { event.preventDefault(); },
      onWheel: restartAutoplay,
      onKeyDown: restartAutoplay,
      onTouchStart() { setTouching(true); },
      onTouchEnd() { setTouching(false); restartAutoplay(); },
      onTouchCancel() { setTouching(false); restartAutoplay(); },
    },
  };
}
