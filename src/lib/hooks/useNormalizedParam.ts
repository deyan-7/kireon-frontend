import { useParams } from "next/navigation";

export const useNormalizedParam = (key: string): string | undefined => {
  const params = useParams();
  const value = params?.[key];
  if (Array.isArray(value)) return value[0];
  return typeof value === "string" ? value : undefined;
};
