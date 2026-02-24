"use server";

import { MAX_FILE_SIZE_BYTES } from "@/constants";
import { auth } from "@/lib/auth";
import { client } from "@/lib/s3";
import { headers } from "next/headers";

export async function uploadFile(formData: FormData, folder: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Usuário não autenticado" };
  }

  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { success: false, error: "Arquivo inválido" };
  }

  if (file.size > MAX_FILE_SIZE_BYTES.value) {
    return {
      success: false,
      error: `Arquivo muito grande. Tamanho máximo permitido: ${MAX_FILE_SIZE_BYTES.label}`,
    };
  }

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedMimeTypes.includes(file.type)) {
    return { success: false, error: "Tipo de arquivo não permitido" };
  }

  const sanitizedName = file.name
    .replace(/^.*[\\/]/, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_");

  const fileName = `${folder}/${crypto.randomUUID()}-${sanitizedName}`;
  const s3File = client.file(fileName);

  try {
    await s3File.write(file);

    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return { success: true, url };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Erro no upload" };
  }
}
