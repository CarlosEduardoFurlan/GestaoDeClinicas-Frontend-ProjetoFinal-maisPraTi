import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/Button/Button";

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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div 
        className={cn(
          "relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-surface border border-border shadow-lg",
          "animate-in fade-in zoom-in-95 duration-200",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col space-y-1.5 p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold leading-none tracking-tight text-text">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-surface-secondary text-text-muted transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Fechar</span>
            </button>
          </div>
          {description && (
            <p className="text-sm text-text-muted">
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
      </div>
    </div>
  );
}
