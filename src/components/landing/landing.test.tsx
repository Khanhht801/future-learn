import { StrictMode } from 'react';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LandingPage } from '../../LandingPage';
import { ConsultationSection } from './ConsultationSection';
import { HeroSection } from './HeroSection';
import { SiteHeader } from './SiteHeader';
import { StatisticsSection } from './StatisticsSection';
import { TeachersSection } from './TeachersSection';
import { TestimonialsSection } from './TestimonialsSection';

class TestIntersectionObserver {
  static instances: TestIntersectionObserver[] = [];
  targets = new Set<Element>();
  constructor(private callback: IntersectionObserverCallback, readonly options: IntersectionObserverInit = {}) {
    TestIntersectionObserver.instances.push(this);
  }
  observe(target: Element) { this.targets.add(target); }
  unobserve(target: Element) { this.targets.delete(target); }
  disconnect() { this.targets.clear(); }
  emit(target: Element, isIntersecting: boolean) {
    if (!this.targets.has(target)) return;
    this.callback([{ target, isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

class TestResizeObserver {
  static instances: TestResizeObserver[] = [];
  targets = new Set<Element>();
  constructor(private callback: ResizeObserverCallback) { TestResizeObserver.instances.push(this); }
  observe(target: Element) { this.targets.add(target); }
  disconnect() { this.targets.clear(); }
  emit() { this.callback([], this as unknown as ResizeObserver); }
}

const mediaQueries = new Map<string, MediaQueryList>();
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function setMedia(query: string, matches: boolean) {
  const media = window.matchMedia(query);
  Object.defineProperty(media, 'matches', { configurable: true, value: matches });
  media.dispatchEvent(new Event('change'));
}

function intersectionFor(target: Element, threshold: number) {
  const observer = TestIntersectionObserver.instances.find(instance => instance.targets.has(target) && instance.options.threshold === threshold);
  expect(observer).toBeDefined();
  return observer!;
}

const scrollTo = vi.fn(function (this: HTMLElement, options: ScrollToOptions) {
  this.scrollLeft = options.left ?? this.scrollLeft;
});
const setPointerCapture = vi.fn();
const releasePointerCapture = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  mediaQueries.clear();
  TestIntersectionObserver.instances = [];
  TestResizeObserver.instances = [];
  scrollTo.mockClear();
  setPointerCapture.mockClear();
  releasePointerCapture.mockClear();
  vi.stubGlobal('IntersectionObserver', TestIntersectionObserver);
  vi.stubGlobal('ResizeObserver', TestResizeObserver);
  vi.stubGlobal('matchMedia', (query: string) => {
    if (!mediaQueries.has(query)) {
      const target = new EventTarget();
      mediaQueries.set(query, Object.assign(target, { matches: query === reducedMotionQuery, media: query, onchange: null }) as MediaQueryList);
    }
    return mediaQueries.get(query)!;
  });
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400);
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1600);
  Object.defineProperties(HTMLElement.prototype, {
    scrollTo: { configurable: true, value: scrollTo },
    setPointerCapture: { configurable: true, value: setPointerCapture },
    hasPointerCapture: { configurable: true, value: () => true },
    releasePointerCapture: { configurable: true, value: releasePointerCapture },
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('landing page interactions', () => {
  it('shows readable account labels on desktop and in the mobile menu', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('button', { name: 'Đăng nhập' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Mở menu' }));
    const mobileLogin = screen.getByRole('button', { name: 'Đăng nhập / Đăng ký' });
    fireEvent.click(mobileLogin);
    expect(screen.getByRole('dialog', { name: 'Chào mừng bạn trở lại!' })).toBeTruthy();
  });

  it('closes the mobile menu on Escape, outside click, navigation and desktop resize', () => {
    render(<SiteHeader />);
    const button = screen.getByRole('button', { name: 'Mở menu' });
    const drawer = document.getElementById('mobile-menu')!;
    fireEvent.click(button);
    expect(drawer.hidden).toBe(false);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
    fireEvent.click(button);
    fireEvent.click(document.body);
    expect(drawer.hidden).toBe(true);
    fireEvent.click(button);
    fireEvent.click(within(drawer).getByText('Giới thiệu'));
    expect(drawer.hidden).toBe(true);
    fireEvent.click(button);
    act(() => setMedia('(min-width: 1200px)', true));
    expect(drawer.hidden).toBe(true);
  });

  it('maps introduction subsections to the active navigation item', () => {
    render(<><SiteHeader /><main><section id="why-choose" /></main></>);
    const section = document.getElementById('why-choose')!;
    act(() => intersectionFor(section, 0).emit(section, true));
    const link = screen.getByRole('menuitem', { name: 'Giới thiệu' });
    expect(link.parentElement!.classList.contains('is-active')).toBe(true);
  });

  it('rotates hero slides, pauses when hidden and clears the timer on unmount', () => {
    const { container, unmount } = render(<StrictMode><HeroSection /></StrictMode>);
    const slides = container.querySelectorAll('[data-hero-slide]');
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(3000));
    expect(slides[1].getAttribute('aria-hidden')).toBe('false');
    expect(slides[0].hasAttribute('inert')).toBe(true);
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    fireEvent(document, new Event('visibilitychange'));
    act(() => vi.advanceTimersByTime(6000));
    expect(slides[1].getAttribute('aria-hidden')).toBe('false');
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    fireEvent(document, new Event('visibilitychange'));
    act(() => vi.advanceTimersByTime(3000));
    expect(slides[0].getAttribute('aria-hidden')).toBe('false');
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('validates all required fields, cleans the phone number and accepts a valid form', () => {
    render(<ConsultationSection />);
    fireEvent.click(screen.getByRole('button', { name: 'Đăng ký ngay!' }));
    const name = screen.getByLabelText('Họ và tên');
    const phone = screen.getByLabelText('Số điện thoại') as HTMLInputElement;
    expect(document.activeElement).toBe(name);
    expect(screen.getByText('Vui lòng nhập họ và tên.')).toBeTruthy();
    expect(phone.getAttribute('aria-invalid')).toBe('true');
    fireEvent.input(phone, { target: { value: 'abc01234567890123' } });
    expect(phone.value).toBe('0123456789');
    expect(phone.getAttribute('aria-invalid')).toBe('false');
    fireEvent.input(name, { target: { value: 'Nguyễn An' } });
    fireEvent.input(screen.getByLabelText('Lớp cần tư vấn'), { target: { value: 'Lớp 10' } });
    fireEvent.change(screen.getByLabelText('Bố mẹ biết đến FutureLearn qua đâu?'), { target: { value: 'school' } });
    fireEvent.click(screen.getByRole('button', { name: 'Đăng ký ngay!' }));
    expect(screen.getByText('Biểu mẫu đã hợp lệ và sẵn sàng kết nối hệ thống tiếp nhận tư vấn.')).toBeTruthy();
    expect(document.querySelectorAll('[aria-invalid="true"]').length).toBe(0);
  });

  it('scrolls teacher cards, wraps at the ends and pauses autoplay outside the viewport', () => {
    const { container, unmount } = render(<TeachersSection />);
    const viewport = container.querySelector<HTMLElement>('[data-teachers-carousel]')!;
    const slider = container.querySelector('[data-teachers-slider]')!;
    act(() => vi.advanceTimersByTime(20));
    fireEvent.click(screen.getByRole('button', { name: 'Xem giáo viên tiếp theo' }));
    expect(viewport.scrollLeft).toBe(400);
    viewport.scrollLeft = 1200;
    fireEvent.click(screen.getByRole('button', { name: 'Xem giáo viên tiếp theo' }));
    expect(viewport.scrollLeft).toBe(0);
    fireEvent.click(screen.getByRole('button', { name: 'Xem giáo viên trước' }));
    expect(viewport.scrollLeft).toBe(1200);
    act(() => intersectionFor(slider, 0.2).emit(slider, false));
    scrollTo.mockClear();
    act(() => vi.advanceTimersByTime(3000));
    expect(scrollTo).not.toHaveBeenCalled();
    act(() => intersectionFor(slider, 0.2).emit(slider, true));
    act(() => vi.advanceTimersByTime(1500));
    expect(scrollTo).toHaveBeenCalledOnce();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('drags teacher cards, snaps to a card and releases pointer capture', () => {
    class PointerEventMock extends MouseEvent {
      pointerId: number;
      pointerType: string;
      constructor(type: string, options: PointerEventInit = {}) {
        super(type, options);
        this.pointerId = options.pointerId ?? 0;
        this.pointerType = options.pointerType ?? 'mouse';
      }
    }
    vi.stubGlobal('PointerEvent', PointerEventMock);
    const { container } = render(<TeachersSection />);
    const viewport = container.querySelector<HTMLElement>('[data-teachers-carousel]')!;
    fireEvent.pointerDown(viewport, { pointerId: 7, pointerType: 'mouse', button: 0, clientX: 500 });
    expect(viewport.classList.contains('is-dragging')).toBe(true);
    fireEvent.pointerMove(viewport, { pointerId: 7, clientX: 170 });
    expect(viewport.scrollLeft).toBe(330);
    fireEvent.pointerUp(viewport, { pointerId: 7 });
    expect(viewport.scrollLeft).toBe(400);
    expect(viewport.classList.contains('is-dragging')).toBe(false);
    expect(setPointerCapture).toHaveBeenCalledWith(7);
    expect(releasePointerCapture).toHaveBeenCalledWith(7);
  });

  it('renders one accessible review group and keeps reveal state when the marquee pauses', () => {
    setMedia(reducedMotionQuery, false);
    const { container, unmount } = render(<TestimonialsSection />);
    const section = container.querySelector('section')!;
    act(() => intersectionFor(section, 0.12).emit(section, true));
    act(() => vi.advanceTimersByTime(20));
    expect(container.querySelectorAll('.student-reviews__group').length).toBe(2);
    expect(container.querySelectorAll('.student-reviews__group[aria-hidden="true"]').length).toBe(1);
    const viewport = container.querySelector('[data-reviews-marquee]')!;
    const card = container.querySelector('.student-reviews__item')!;
    fireEvent.mouseEnter(card);
    expect(viewport.classList.contains('is-paused')).toBe(true);
    expect(viewport.classList.contains('is-motion-visible')).toBe(true);
    fireEvent(window, new Event('blur'));
    expect(viewport.classList.contains('is-paused')).toBe(false);
    unmount();
    expect(TestResizeObserver.instances.every(observer => observer.targets.size === 0)).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('animates statistics once and cancels pending animation frames on unmount', () => {
    setMedia(reducedMotionQuery, false);
    const { container, unmount } = render(<StatisticsSection />);
    const section = container.querySelector('section')!;
    act(() => intersectionFor(section, 0.35).emit(section, true));
    expect(container.querySelector('[data-stat-counter="500000"]')!.textContent).toBe('0');
    act(() => vi.advanceTimersByTime(1500));
    expect(container.querySelector('[data-stat-counter="500000"]')!.textContent).toBe('500.000');
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels a statistic animation in progress and keeps final values for reduced motion', () => {
    setMedia(reducedMotionQuery, false);
    const first = render(<StatisticsSection />);
    const section = first.container.querySelector('section')!;
    act(() => intersectionFor(section, 0.35).emit(section, true));
    act(() => vi.advanceTimersByTime(100));
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    first.unmount();
    expect(vi.getTimerCount()).toBe(0);

    setMedia(reducedMotionQuery, true);
    const second = render(<StatisticsSection />);
    expect(second.container.querySelector('[data-stat-counter="500000"]')!.textContent).toBe('500.000');
    expect(second.container.querySelector('[data-motion]')).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('mounts and unmounts the complete page in StrictMode without duplicate groups or active observers', () => {
    const { container, unmount } = render(<StrictMode><LandingPage /></StrictMode>);
    act(() => vi.advanceTimersByTime(20));
    expect(container.querySelectorAll('.student-reviews__group').length).toBe(2);
    expect(container.querySelectorAll('main > section').length).toBe(9);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(TestIntersectionObserver.instances.every(observer => observer.targets.size === 0)).toBe(true);
    expect(TestResizeObserver.instances.every(observer => observer.targets.size === 0)).toBe(true);
  });
});
