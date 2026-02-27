"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useState } from "react";

export const CategoryBanner = ({
  name,
  description,
  imageUrl,
}: {
  name: string;
  description?: string;
  imageUrl?: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden">
      {isLoading && <Skeleton className="absolute inset-0" />}
      <Image
        src={imageUrl || "/images/image-placeholder.jpg"}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
        priority
        className="object-cover"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/50 to-black/60" />

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="space-y-3 max-w-2xl">
          <h1 className="font-serif text-4xl lg:text-5xl font-light text-white tracking-wide drop-shadow-lg">
            {name}
          </h1>
          {description && (
            <p className="font-sans text-sm lg:text-base text-gray-100 font-light leading-relaxed drop-shadow-md">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
