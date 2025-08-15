"use client";

import { useEffect, useState } from "react";
import styles from "./ArtifactLoading.module.scss";

type Props = {
  loading: boolean;
  artifactTitle?: string;
  artifactId: string;
  artifactVersion: number;
  onArtifactSelected?: (artifact: { id: string; version: number }) => void;
};

const ArtifactLoading = ({
  loading,
  artifactTitle = "",
  artifactId,
  artifactVersion,
  onArtifactSelected,
}: Props) => {
  const [currentTitle, setCurrentTitle] = useState(artifactTitle);

  useEffect(() => {
    setCurrentTitle(artifactTitle);
  }, [artifactTitle]);

  const truncatedTitle =
    currentTitle.length > 50
      ? currentTitle.substring(0, 50) + "..."
      : currentTitle;

  const handleClick = () => {
    if (!loading && onArtifactSelected) {
      onArtifactSelected({ id: artifactId, version: artifactVersion });
    }
  };

  return (
    <div
      className={`artifact-loading-container flex ${
        !loading ? "cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <div className="artifact-loading-right flex flex-col justify-center">
        {loading ? (
          <p className="text-gray-400">Generiere Antwort</p>
        ) : currentTitle ? (
          <p className={`artifact-title ${styles.linkOrange}`} data-icon="→">
            {truncatedTitle}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default ArtifactLoading;
