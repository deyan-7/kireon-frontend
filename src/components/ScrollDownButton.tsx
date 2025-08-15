"use client";

import styles from "./ScrollDownButton.module.scss";

interface ScrollDownButtonProps {
  onClick: () => void;
}

const ScrollDownButton = ({ onClick }: ScrollDownButtonProps) => {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="border-black/10 border-2 bg-white hover:bg-gray-100 mx-auto z-10 rounded-full cursor-pointer"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        className={`m-1 ${styles.textOrange}`}
      >
        <path
          d="M17 13L12 18L7 13M12 6L12 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ScrollDownButton;
