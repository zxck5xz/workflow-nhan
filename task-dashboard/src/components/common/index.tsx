import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './Common.css';

// ── Button ──
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export function Button({ children, variant = 'secondary', size = 'md', onClick, type = 'button', disabled, className = '' }: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${size !== 'md' ? `btn--${size}` : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// ── Badge ──
interface BadgeProps {
  children: ReactNode;
  variant?: string;
  className?: string;
}

export function Badge({ children, variant = '', className = '' }: BadgeProps) {
  return (
    <span className={`badge ${variant ? `badge--${variant}` : ''} ${className}`}>
      {children}
    </span>
  );
}

// ── Avatar ──
interface AvatarProps {
  initials: string;
  color: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
}

export function Avatar({ initials, color, size = 'md', title }: AvatarProps) {
  return (
    <div
      className={`avatar ${size !== 'md' ? `avatar--${size}` : ''}`}
      style={{ background: color }}
      title={title}
    >
      {initials}
    </div>
  );
}

// ── Modal ──
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal__header">
          <h3>{title}</h3>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

// ── Weight Dots ──
interface WeightDotsProps {
  weight: number;
  max?: number;
}

export function WeightDots({ weight, max = 5 }: WeightDotsProps) {
  return (
    <div className="weight-dots" title={`Trọng số: ${weight}/${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={`weight-dot ${i < weight ? 'weight-dot--filled' : ''}`} />
      ))}
    </div>
  );
}

// ── Empty State ──
interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <div className="empty-state__title">{title}</div>
      {description && <div className="empty-state__description">{description}</div>}
      {action}
    </div>
  );
}

export { TaskFormModal } from './TaskFormModal';
export { ProjectModal } from './ProjectModal';
