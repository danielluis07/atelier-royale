"use server";

import { client } from "@/lib/s3";

export async function deleteFile(fileUrl: string) {
  try {
    const fileKey = fileUrl.split(".amazonaws.com/")[1];
    if (!fileKey) return { success: false, error: "URL inválida" };

    const s3File = client.file(fileKey);
    await s3File.delete();

    console.log(`Deleted file: ${fileKey}`);

    return { success: true };
  } catch (err) {
    console.error("Erro ao deletar arquivo:", err);
    return { success: false, error: "Falha ao deletar" };
  }
}
