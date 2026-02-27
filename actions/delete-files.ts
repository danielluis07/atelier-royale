"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { client } from "@/lib/s3";

export async function deleteFiles(fileUrls: string[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "admin") {
    return { success: false, error: "Usuário não autenticado" };
  }

  try {
    const expectedHost = `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;

    const keys = fileUrls.map((fileUrl) => {
      const parsedUrl = new URL(fileUrl);
      if (parsedUrl.host !== expectedHost) {
        throw new Error("URL não pertence ao sistema");
      }
      const key = parsedUrl.pathname.substring(1);
      if (!key) throw new Error("Chave do arquivo não encontrada");
      return key;
    });

    await Promise.all(keys.map((key) => client.file(key).delete()));

    return { success: true };
  } catch (err) {
    console.error("Erro ao deletar arquivos:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Falha ao deletar",
    };
  }
}
