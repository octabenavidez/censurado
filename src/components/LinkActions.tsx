import React, { useState, useRef, useCallback } from 'react';
import type { BranchLink } from '../data/links';
import ShareModal from './ShareModal';

/**
 * Props for the LinkActions component.
 */
interface LinkActionsProps {
  /** Link item data */
  link: BranchLink;
  /** Optional callback when a notification toast should be triggered */
  onShowToast?: (message: string) => void;
}

/**
 * LinkActions renders the three-dots options button on an individual link card.
 * Clicking it opens the Linktree-style share modal for that specific branch or destination.
 *
 * @param props - Component properties
 * @param props.link - Branch link data
 * @returns JSX.Element
 */
export default function LinkActions({ link }: LinkActionsProps): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  /**
   * Opens the share modal for this specific link.
   *
   * @param event - Mouse click event
   */
  const handleTriggerClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setIsModalOpen(true);
  };

  /**
   * Closes the share modal and restores keyboard focus.
   */
  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(false);
    triggerRef.current?.focus();
  }, []);

  return (
    <div className="link-actions-container" style={{ position: 'relative' }}>
      <button
        ref={triggerRef}
        type="button"
        className="link-actions-trigger"
        aria-label={`Compartir ${link.label}`}
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
        onClick={handleTriggerClick}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {/* Link Share Modal */}
      <ShareModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type="link"
        title={link.label}
        url={link.href}
        description={link.description || 'Hace tu pedido!'}
      />
    </div>
  );
}
