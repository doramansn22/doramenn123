import * as ImageManipulator from "expo-image-manipulator";

const API_URL = "http://172.20.10.4:5055";

export async function analyzeHomeImage(
  imageUri: string | null,
  problem: string
) {
  let imageBase64: string | null = null;

  if (imageUri) {
    const manipulatedImage =
      await ImageManipulator.manipulateAsync(
        imageUri,
        [],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

    if (!manipulatedImage.base64) {
      throw new Error("Could not convert image to JPEG.");
    }

    imageBase64 =
      `data:image/jpeg;base64,${manipulatedImage.base64}`;
  }

  const apiResponse = await fetch(
    `${API_URL}/api/analyze-image`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64,
        problem: problem.trim(),
      }),
    }
  );

  const data = await apiResponse.json();

  if (!apiResponse.ok || !data.success) {
    throw new Error(
      data.message || "AI analysis failed."
    );
  }

  return data.analysis;
}