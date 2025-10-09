import { auth } from "@/lib/auth";
import { DokumentFeedback } from "@/types/pflicht";

export const submitDokumentFeedback = async (dokumentId: string, feedback: DokumentFeedback): Promise<void> => {
  try {
    const token = await auth.currentUser?.getIdToken();
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const response = await fetch(`${baseUrl}/api/documents/dokument/${dokumentId}/feedback`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} ${errorText}`);
    }
  } catch (error) {
    console.error("Error submitting dokument feedback:", error);
    throw error;
  }
};
