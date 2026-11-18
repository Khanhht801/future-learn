import { useEffect, useRef, type ReactNode, type RefObject } from "react";

/** Native modal semantics, Escape and focus restoration shared by dashboard pages. */
export function useDialog(
  open: boolean,
  onClose: () => void,
  ref: RefObject<HTMLDialogElement | null>,
) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog.showModal();
    const close = () => closeRef.current();
    dialog.addEventListener("close", close);
    return () => {
      dialog.removeEventListener("close", close);
      if (dialog.open) dialog.close();
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open, ref]);
}

export function Dialog({
  open,
  onClose,
  title,
  id,
  className = "",
  children,
  backLabel,
  dataAttribute,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  id: string;
  className?: string;
  children: ReactNode;
  backLabel?: string;
  dataAttribute?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useDialog(open, onClose, ref);
  return (
    <dialog
      ref={ref}
      className={`topic-dialog ${className}`}
      aria-labelledby={id}
      {...(dataAttribute ? { [dataAttribute]: "" } : {})}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], input, select, [tabindex="0"]',
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
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const b = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < b.left ||
            event.clientX > b.right ||
            event.clientY < b.top ||
            event.clientY > b.bottom
          )
            onClose();
        }
      }}
    >
      <div className="topic-dialog__heading">
        <h2 id={id} data-dialog-title>
          {title}
        </h2>
        <button
          className="icon-button"
          type="button"
          aria-label="Đóng cửa sổ"
          data-dialog-close
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <div data-dialog-content>{children}</div>
      {backLabel && (
        <form method="dialog">
          <button className="button button--primary" type="submit">
            {backLabel}
          </button>
        </form>
      )}
    </dialog>
  );
}
