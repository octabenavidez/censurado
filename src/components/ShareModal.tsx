import React, { useEffect, useRef, useState, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';

/**
 * Props for the ShareModal component.
 */
export interface ShareModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Callback triggered when the modal requests to close */
  onClose: () => void;
  /** Type of content being shared: the overall profile or an individual link */
  type: 'profile' | 'link';
  /** Display title (e.g., branch name or profile handle) */
  title: string;
  /** Destination URL to share */
  url: string;
  /** Avatar image path for profile sharing */
  avatarUrl?: string;
  /** Subtitle or handle (e.g., '@censurado.ok' or formatted URL) */
  subtitle?: string;
  /** Short action or descriptive text (e.g., 'Hace tu pedido!') */
  description?: string;
}

/**
 * ShareModal renders an authentic, self-hosted sharing modal matching the Linktree
 * visual interaction pattern while stripping out all third-party branding and spam.
 *
 * @param props - Component properties
 * @returns JSX.Element | null
 */
export default function ShareModal({
  isOpen,
  onClose,
  type,
  title,
  url,
  avatarUrl = '/images/cara-con-fondo.webp',
  subtitle,
  description = 'Hace tu pedido!',
}: ShareModalProps): React.JSX.Element | null {
  const titleId = useId();
  const [manualCopy, setManualCopy] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  /**
   * Broadcasts toast notification message to global listener.
   *
   * @param message - Notification text to display
   */
  const notifyToast = useCallback((message: string): void => {
    window.dispatchEvent(new CustomEvent('censurado-toast', { detail: { message } }));
  }, []);

  /**
   * Copies current share URL to clipboard with fallback.
   */
  const handleCopyLink = async (): Promise<void> => {
    let success = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        success = true;
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopied(true);
      notifyToast('Enlace copiado');
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } else {
      setManualCopy(true);
      notifyToast('Seleccioná el enlace para copiarlo manualmente');
    }
  };

  /**
   * Opens a share target URL in a new window/tab safely.
   *
   * @param targetUrl - Complete social share endpoint URL
   */
  const openShareWindow = (targetUrl: string): void => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setManualCopy(true);
        notifyToast('Podés copiar el enlace para compartirlo');
      }
    }
  };

  // Keyboard navigation and background isolation.
  useEffect(() => {
    if (!isOpen) return;
    setCopied(false);
    setManualCopy(false);
    setCanShare(typeof navigator.share === 'function');
    const previousFocus = document.activeElement as HTMLElement | null;
    const background = document.querySelector<HTMLElement>('.page-wrapper');
    const previousInert = background?.inert ?? false;
    if (background) background.inert = true;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Tab') {
        const items = modalRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, [tabindex="0"]');
        if (items?.length) {
          const first = items[0], last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    closeBtnRef.current?.focus();

    // Prevent body background scroll while modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (background) background.inert = previousInert;
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // Pre-formatted share messages
  const shareText =
    type === 'profile'
      ? '¡Mirá las sucursales y hacé tu pedido en Censurado!'
      : `¡Hacé tu pedido en Censurado ${title}!`;

  const shortenedUrl = (() => {
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname.length > 15 ? `${parsed.pathname.slice(0, 15)}...` : parsed.pathname;
      return `${parsed.hostname}${pathname}`;
    } catch {
      return url.length > 28 ? `${url.slice(0, 28)}...` : url;
    }
  })();

  const modalContent = (
    <div
      className="lt-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="lt-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {/* Header with Title and Close Button */}
        <div className="lt-modal-header">
          <h2 id={titleId} className="lt-modal-title">
            {type === 'profile' ? 'Compartir' : 'Compartir enlace'}
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="lt-modal-close-btn"
            aria-label="Cerrar ventana de compartir"
            onClick={onClose}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Preview Card */}
        {type === 'profile' ? (
          <div className="lt-modal-preview-profile">
            <img
              src={avatarUrl}
              alt=""
              width="72"
              height="72"
              className="lt-modal-preview-avatar"
            />
            <span className="lt-modal-preview-handle">@censurado.ok</span>
            <span className="lt-modal-preview-url">
              {subtitle || 'censurado.ok'}
            </span>
          </div>
        ) : (
          <div className="lt-modal-preview-link">
            <strong className="lt-modal-preview-link-title">{title}</strong>
            <span className="lt-modal-preview-link-url">{shortenedUrl}</span>
            <span className="lt-modal-preview-link-desc">{description}</span>
          </div>
        )}

        <span role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>{copied ? 'Enlace copiado' : ''}</span>
        {manualCopy && <label className="manual-copy-field">Enlace para copiar
          <input autoFocus readOnly value={url} onFocus={(event) => event.currentTarget.select()} />
        </label>}

        {/* Horizontal Scroll of Social Share Channels */}
        <div className="lt-modal-channels-scroll" role="group" aria-label="Opciones de compartir">
          {/* Copy Link */}
          <div className="lt-modal-channel-item">
            <button
              type="button"
              className="lt-modal-channel-btn lt-channel-copy"
              aria-label="Copiar enlace"
              onClick={handleCopyLink}
            >
              {copied ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              )}
            </button>
            <span className="lt-modal-channel-label">
              {copied ? '¡Copiado!' : 'Copiar enlace'}
            </span>
          </div>

          {/* X (formerly Twitter) */}
          <div className="lt-modal-channel-item">
            <button
              type="button"
              className="lt-modal-channel-btn lt-channel-x"
              aria-label="Compartir en X"
              onClick={() =>
                openShareWindow(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`
                )
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <span className="lt-modal-channel-label">X</span>
          </div>

          {/* Facebook */}
          <div className="lt-modal-channel-item">
            <button
              type="button"
              className="lt-modal-channel-btn lt-channel-facebook"
              aria-label="Compartir en Facebook"
              onClick={() =>
                openShareWindow(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                )
              }
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <span className="lt-modal-channel-label">Facebook</span>
          </div>

          {/* WhatsApp */}
          <div className="lt-modal-channel-item">
            <button
              type="button"
              className="lt-modal-channel-btn lt-channel-whatsapp"
              aria-label="Compartir en WhatsApp"
              onClick={() =>
                openShareWindow(
                  `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' - ' + url)}`
                )
              }
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
            <span className="lt-modal-channel-label">WhatsApp</span>
          </div>

          {/* LinkedIn */}
          <div className="lt-modal-channel-item">
            <button
              type="button"
              className="lt-modal-channel-btn lt-channel-linkedin"
              aria-label="Compartir en LinkedIn"
              onClick={() =>
                openShareWindow(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
                )
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </button>
            <span className="lt-modal-channel-label">LinkedIn</span>
          </div>

          {canShare && <div className="lt-modal-channel-item">
            <button type="button" className="lt-modal-channel-btn" onClick={handleNativeShare} aria-label="Compartir con otras aplicaciones">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
              </svg>
            </button>
            <span className="lt-modal-channel-label">Más opciones</span>
          </div>}


        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
