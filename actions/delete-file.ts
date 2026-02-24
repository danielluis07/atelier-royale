"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { client } from "@/lib/s3";

export async function deleteFile(fileUrl: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Usuário não autenticado" };
  }

  try {
    let fileKey: string;

    try {
      const parsedUrl = new URL(fileUrl);
      const expectedHost = `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
      if (parsedUrl.host !== expectedHost) {
        return { success: false, error: "URL não pertence ao sistema" };
      }

      fileKey = parsedUrl.pathname.substring(1);
    } catch {
      return { success: false, error: "URL com formato inválido" };
    }

    if (!fileKey)
      return { success: false, error: "Chave do arquivo não encontrada" };

    const s3File = client.file(fileKey);
    await s3File.delete();

    return { success: true };
  } catch (err) {
    console.error("Erro ao deletar arquivo:", err);
    return { success: false, error: "Falha ao deletar" };
  }
}
