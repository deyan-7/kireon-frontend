"use client";

import styles from "./ArtifactActionButton.module.scss";

type Props = {
  label: string;
  disabled: boolean;
  onAction: () => void;
  isLoading?: boolean;
};

const ArtifactActionButton = ({
  label,
  disabled,
  onAction,
  isLoading = false,
}: Props) => {
  const showLoading = isLoading;

  return (
    <div className="relative z-[2] mb-[10px] w-full">
      <div className="mx-auto container text-center">
        <button
          className="action-btn mb-3 pt-3 pb-4 w-full rounded-xl disabled:opacity-50"
          disabled={disabled || showLoading || !label}
          aria-disabled={disabled || showLoading}
          onClick={onAction}
        >
          {showLoading ? (
            <span className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          ) : (
            label
          )}
        </button>
      </div>
    </div>
  );
};

export default ArtifactActionButton;
