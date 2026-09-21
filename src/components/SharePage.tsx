import React, { useState, useRef, useEffect, useCallback } from 'react';
import ShareModal from './ShareModal';

/**
 * Props for SharePage component.
 */
interface SharePageProps {
  /** Page title for sharing */
  title: string;
  /** Configured site URL fallback if window.location is unavailable */
  siteUrl?: string;
}

/**
 * SharePage provides the top-right share button.
 * Clicking it opens the authentic, spam-free profile share modal matching Linktree's UI.
 * Also renders a global accessible toast live region for "Enlace copiado" announcements.
 *
 * @param props - Component properties
 * @param props.title - Page title to share
 * @param props.siteUrl - Fallback URL
 * @returns JSX.Element
 */
export default function SharePage({ title, siteUrl }: SharePageProps): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  /**
   * Displays an accessible toast message with automatic dismissal.
   *
   * @param message - Text to announce to user and screen readers
   */
  const showToast = useCallback((message: string): void => {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  /**
   * Listen for global toast notifications triggered from ShareModal or LinkActions.
   */
  useEffect(() => {
    const handleToastEvent = (event: Event): void => {
      const customEvent = event as CustomEvent<{ message: string }>;
      if (customEvent.detail?.message) {
        showToast(customEvent.detail.message);
      }
    };

    window.addEventListener('censurado-toast', handleToastEvent);
    return () => {
      window.removeEventListener('censurado-toast', handleToastEvent);
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [showToast]);

  /**
   * Gets the current canonical or window URL of the site.
   *
   * @returns Current site URL string
   */
  const getSiteUrl = (): string => {
    if (typeof window !== 'undefined' && window.location.href) {
      return document.querySelector<HTMLLinkElement>('link[rel=canonical]')?.href || siteUrl || window.location.origin + window.location.pathname;
    }
    return siteUrl || '';
  };

  /**
   * Handles clicking the top-right share button to open the modal.
   */
  const handleShareClick = (): void => {
    setIsModalOpen(true);
  };

  /**
   * Closes the share modal and restores focus.
   */
  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="share-top-btn"
        aria-label="Compartir perfil"
        onClick={handleShareClick}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </button>

      {/* Authentic Linktree-style Profile Share Modal */}
      <ShareModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type="profile"
        title={title || "Censurado"}
        url={getSiteUrl()}
        avatarUrl="/images/cara-con-fondo.webp"
        subtitle="censurado.ok"
        description="🍔BURGERS🍔/ 🥪LOMOS🥪/ 🌯WRAPS🌯/ PICKERS"
      />

      {/* Live Region for Screen Readers and Visual Toast */}
      {toastMessage && (
        <div
          className="toast-feedback"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E5AD00"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
