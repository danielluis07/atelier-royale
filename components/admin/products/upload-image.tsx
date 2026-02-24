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

export const UploadImage = ({
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
  const [dragActive, setDragActive] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const displayUrl = previewUrl ?? existingUrl ?? null;

  useEffect(() => {
    // Cleanup function to revoke the object URL when it changes or component unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateAndSet = useCallback(
    (selectedFile: File) => {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("O arquivo precisa ser uma imagem");
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }

      onFileChange(selectedFile);
    },
    [onFileChange],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSet(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    setDragActive(false);
    const selected = e.dataTransfer.files?.[0];
    if (selected) validateAndSet(selected);
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
    onExistingUrlClear?.();
  };

  return (
    <Card className={cn("flex flex-col pb-2", className)}>
      <CardHeader>
        <CardTitle>Imagem</CardTitle>
        <CardDescription className="text-xs">
          Imagem principal do produto. Tamanho recomendado: 1080 x 1080 pixels
          (1:1).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {displayUrl ? (
          <div className="relative flex flex-1 min-h-110 w-full overflow-hidden rounded-lg border">
            <Image
              src={displayUrl}
              alt="Imagem do produto"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute right-2 top-2 z-10">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="size-8"
                onClick={handleRemove}
                disabled={disabled}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "relative flex flex-1 min-h-110 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "hover:border-muted-foreground/50",
            )}>
            <input
              type="file"
              accept="image/*"
              aria-label="Selecionar imagem do produto"
              onChange={handleFileChange}
              disabled={disabled}
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
            />{" "}
            <ImagePlus className="mb-3 size-10 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">
              Clique ou arraste uma imagem
            </p>
            <p className="mt-1 text-xs text-center text-muted-foreground/70">
              PNG, JPG ou WebP (máx. 5MB) <br />
              Dimensões ideais: 1080x1080px
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
