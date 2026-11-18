import { useRef, useState, type RefObject, type PointerEvent } from "react";
import { createPortal } from "react-dom";
export function DraggableChoice({
  value,
  drop,
  disabled,
  selected,
  className,
  label,
  choose,
  submit,
  hover,
}: {
  value: string | number;
  drop: RefObject<HTMLButtonElement | null>;
  disabled: boolean;
  selected: boolean;
  className: string;
  label: string;
  choose: (value: string | number) => void;
  submit: (value: string | number) => void;
  hover: (inside: boolean) => void;
}) {
  const drag = useRef<{
      id: number;
      x: number;
      y: number;
      moved: boolean;
    } | null>(null),
    suppressClick = useRef(false);
  const [ghost, setGhost] = useState<{ x: number; y: number } | null>(null);
  const inside = (event: PointerEvent) => {
    const rect = drop.current?.getBoundingClientRect();
    return (
      !!rect &&
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  };
  const cleanup = (button: HTMLButtonElement) => {
    const id = drag.current?.id;
    drag.current = null;
    setGhost(null);
    hover(false);
    if (id !== undefined && button.hasPointerCapture(id))
      button.releasePointerCapture(id);
  };
  return (
    <>
      <button
        type="button"
        className={`${className}${ghost ? " is-dragging" : ""}`}
        disabled={disabled}
        aria-pressed={selected}
        aria-label={label}
        onPointerDown={(event) => {
          if (disabled || !event.isPrimary || event.button !== 0) return;
          suppressClick.current = false;
          drag.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            moved: false,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const current = drag.current;
          if (!current || current.id !== event.pointerId) return;
          if (
            !current.moved &&
            Math.hypot(event.clientX - current.x, event.clientY - current.y) < 6
          )
            return;
          current.moved = true;
          setGhost({ x: event.clientX, y: event.clientY });
          hover(inside(event));
        }}
        onPointerUp={(event) => {
          if (drag.current?.id !== event.pointerId) return;
          const moved = drag.current.moved,
            dropped = moved && inside(event);
          suppressClick.current = moved;
          cleanup(event.currentTarget);
          if (dropped) submit(value);
        }}
        onPointerCancel={(event) => {
          suppressClick.current = true;
          cleanup(event.currentTarget);
        }}
        onLostPointerCapture={(event) => {
          if (drag.current) cleanup(event.currentTarget);
        }}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false;
            return;
          }
          if (!disabled) choose(value);
        }}
      >
        {value}
      </button>
      {ghost &&
        createPortal(
          <div
            className="number-drag-ghost"
            aria-hidden="true"
            style={{ left: ghost.x, top: ghost.y }}
          >
            {value}
          </div>,
          document.body,
        )}
    </>
  );
}
