import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    const initial = dialog?.querySelector<HTMLElement>('input:not([disabled]):not([readonly]), select:not([disabled]), textarea:not([disabled])');
    initial?.focus({ preventScroll: true });
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
      <dialog
        ref={dialogRef}
        onCancel={(event) => { event.preventDefault(); onClose(); }}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) onClose();
        }}
        className={cn(
          "app-modal fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl bg-surface text-text border border-border shadow-lg",
          "animate-in fade-in zoom-in-95 duration-200",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        <div className="flex flex-col space-y-1.5 p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 id={titleId} className="text-lg font-semibold leading-tight tracking-tight text-text">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 hover:bg-surface-secondary text-text-muted transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Fechar</span>
            </button>
          </div>
          {description && (
            <p id={descriptionId} className="text-sm text-text-muted">
              {description}
            </p>
          )}
        </div>
        
        <div className="p-6">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end p-6 border-t border-border gap-2">
            {footer}
          </div>
        )}
      </dialog>
  );
}
