"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateReview } from "@/modules/reviews/hooks";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { createReviewInput } from "@/modules/reviews/validations";
import { authClient } from "@/lib/auth-client";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const StarRating = ({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label="Nota">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5 transition-transform duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
            role="radio"
            aria-checked={star === value}>
            <Star
              className={`w-5 h-5 transition-colors duration-200 ${
                filled
                  ? "fill-primary text-primary"
                  : "fill-transparent text-border"
              }`}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
      <span className="ml-2 text-xs font-sans text-muted-foreground tracking-wide">
        {hovered || value}/5
      </span>
    </div>
  );
};

export const ReviewForm = ({ productId }: { productId: string }) => {
  const { data: session } = authClient.useSession();
  const { mutateAsync, isPending } = useCreateReview();

  const form = useForm<z.infer<typeof createReviewInput>>({
    resolver: zodResolver(createReviewInput),
    defaultValues: {
      productId,
      comment: "",
      rating: 5,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (values: z.infer<typeof createReviewInput>) => {
    try {
      await mutateAsync(values);
      toast.success("Avaliação enviada! Aguarde a aprovação.");
      reset();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Você já avaliou este produto"
      ) {
        toast.error("Você já avaliou este produto.");
      } else {
        toast.error("Erro ao enviar avaliação. Tente novamente.");
      }
    }
  };

  if (!session?.user) {
    return (
      <div className="border border-border p-6 text-center">
        <p className="text-sm font-sans text-muted-foreground mb-3">
          Faça login para deixar sua avaliação.
        </p>
        <Link
          href="/login"
          className="inline-block text-xs tracking-[0.2em] uppercase font-sans text-foreground border border-border px-6 py-3 hover:border-foreground transition-colors duration-300">
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-border p-6">
      <div className="flex flex-col gap-5">
        {/* Rating */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase font-sans text-foreground mb-3 block">
            Sua nota
          </label>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <StarRating
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
              />
            )}
          />
          {errors.rating && (
            <p className="text-xs text-destructive mt-1.5 font-sans">
              {errors.rating.message}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="text-xs tracking-[0.2em] uppercase font-sans text-foreground mb-3 block">
            Comentário{" "}
            <span className="normal-case tracking-normal text-muted-foreground">
              (opcional)
            </span>
          </label>
          <Controller
            control={control}
            name="comment"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Conte sua experiência com o produto..."
                disabled={isPending}
                className="min-h-24 resize-none font-sans text-sm"
                maxLength={1000}
              />
            )}
          />
          {errors.comment && (
            <p className="text-xs text-destructive mt-1.5 font-sans">
              {errors.comment.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-sans text-muted-foreground">
            Sua avaliação será publicada após aprovação.
          </p>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2.5 px-6 py-3 text-xs tracking-[0.25em] uppercase font-sans bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
            {isPending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </form>
  );
};
