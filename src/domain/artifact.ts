export interface ArtifactIdDictionary {
  [key: string]: any[];
}

export const parseArtifactPayload = <T>(
  payload: { [key: string]: unknown } | null | undefined
): T => {
  return typeof payload === "object" && payload !== null
    ? (payload as T)
    : ({} as T);
};
