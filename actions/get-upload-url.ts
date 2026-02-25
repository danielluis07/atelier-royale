"use server";

import { MAX_FILE_SIZE_BYTES } from "@/constants";
import { auth } from "@/lib/auth";
import { client } from "@/lib/s3";
import { headers } from "next/headers";

export async function getUploadUrl(
  fileName: string,
  fileType: string,
  fileSize: number,
  folder: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Usuário não autenticado" };
  }

  // 1. Validate Size
  if (fileSize <= 0) {
    return { success: false, error: "Arquivo inválido" };
  }

  if (fileSize > MAX_FILE_SIZE_BYTES.value) {
    return {
      success: false,
      error: `Arquivo muito grande. Tamanho máximo permitido: ${MAX_FILE_SIZE_BYTES.label}`,
    };
  }

  // 2. Validate MIME Type
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedMimeTypes.includes(fileType)) {
    return { success: false, error: "Tipo de arquivo não permitido" };
  }

  // 3. Sanitize Name & Generate S3 Key
  const sanitizedName = fileName
    .replace(/^.*[\\/]/, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_");

  const s3FileName = `${folder}/${crypto.randomUUID()}-${sanitizedName}`;
  const s3File = client.file(s3FileName);

  try {
    // Generate the Presigned URL using Bun's native S3 API
    const presignedUrl = s3File.presign({
      method: "PUT",
      expiresIn: 3600, // Valid for 1 hour
      type: fileType, // Enforces the exact content-type we validated
    });

    // Generate the final public URL that you'll want to save to your database later
    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3FileName}`;

    return {
      success: true,
      uploadUrl: presignedUrl,
      publicUrl,
    };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Erro ao gerar URL de upload" };
  }
}
