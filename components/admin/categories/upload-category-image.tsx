"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MAX_FILE_SIZE_BYTES } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";

// Opcional: definir um padrão de banner
const RECOMMENDED = {
  width: 1600,
  height: 600,
  label: "1600 x 600 pixels (~8:3)",
};

// Opcional: tolerância do aspect ratio (ex: 5%)
// Se você não quiser validar ratio, pode remover tudo relacionado a isso.
// const ASPECT_RATIO = RECOMMENDED.width / RECOMMENDED.height;
// const ASPECT_TOLERANCE = 0.07;

/* async function getImageSize(
  file: File,
): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = new window.Image();
    img.src = url;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Falha ao ler a imagem"));
    });
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
} */

export const UploadCategoryImage = ({
  file,
  onFileChange,
  existingUrl,
  onExistingUrlClear,
  disabled,
  className,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
  existingUrl?: string | null;
  onExistingUrlClear?: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const displayUrl = previewUrl ?? existingUrl ?? null;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);
  const validateAndSet = useCallback(
    async (selectedFile: File) => {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("O arquivo precisa ser uma imagem");
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE_BYTES.value) {
        toast.error(`A imagem deve ter no máximo ${MAX_FILE_SIZE_BYTES.label}`);
        return;
      }

      // Opcional: validar ratio para banner
      /*       try {
        const { width, height } = await getImageSize(selectedFile);
        const ratio = width / height;
        const diff = Math.abs(ratio - ASPECT_RATIO) / ASPECT_RATIO;

        if (diff > ASPECT_TOLERANCE) {
          toast.error(
            `Formato de banner inválido. Use algo próximo de ${RECOMMENDED.label}.`,
          );
          return;
        }
      } catch {
        toast.error("Não foi possível validar a imagem. Tente outra.");
        return;
      } */

      onFileChange(selectedFile);
    },
    [onFileChange],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) void validateAndSet(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    setDragActive(false);
    const selected = e.dataTransfer.files?.[0];
    if (selected) void validateAndSet(selected);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemove = () => {
    onFileChange(null);
    if (!file) onExistingUrlClear?.();
  };

  return (
    <Card className={cn("flex flex-col pb-2", className)}>
      <CardHeader>
        <CardTitle>Banner da categoria</CardTitle>
        <CardDescription className="text-xs">
          Imagem de capa (banner) da categoria. Recomendado: {RECOMMENDED.label}
          .
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        {displayUrl ? (
          <div className="relative flex flex-1 min-h-40 w-full overflow-hidden rounded-lg border">
            {isLoading && <Skeleton className="absolute inset-0" />}

            <Image
              src={displayUrl}
              alt="Banner da categoria"
              fill
              className={cn("object-cover", disabled && "opacity-70")}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />

            <div className="absolute right-2 top-2 z-10">
              {!isLoading && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="size-8"
                  onClick={handleRemove}
                  disabled={disabled}>
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "relative flex flex-1 min-h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "hover:border-muted-foreground/50",
            )}>
            <input
              type="file"
              accept="image/*"
              aria-label="Selecionar banner da categoria"
              onChange={handleFileChange}
              disabled={disabled}
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
            />

            <ImagePlus className="mb-3 size-10 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">
              Clique ou arraste um banner
            </p>
            <p className="mt-1 text-xs text-center text-muted-foreground/70">
              PNG, JPG ou WebP (máx. {MAX_FILE_SIZE_BYTES.label}) <br />
              Dimensões ideais: {RECOMMENDED.width}x{RECOMMENDED.height}px
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
