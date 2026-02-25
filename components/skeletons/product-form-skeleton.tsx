"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function FieldSkeleton({ labelWidth = "w-20" }: { labelWidth?: string }) {
  return (
    <div className="space-y-2">
      <Skeleton className={`h-4 ${labelWidth}`} />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

function TextareaSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-44 w-full" />
    </div>
  );
}

function CardSkeleton({
  children,
  titleWidth = "w-32",
  descriptionWidth,
}: {
  children: React.ReactNode;
  titleWidth?: string;
  descriptionWidth?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className={`h-5 ${titleWidth}`} />
        {descriptionWidth && <Skeleton className={`h-4 ${descriptionWidth}`} />}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function ProductFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column — General Info */}
        <div className="flex flex-col space-y-6 lg:col-span-2">
          <CardSkeleton titleWidth="w-44" descriptionWidth="w-56">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FieldSkeleton labelWidth="w-12" />
                <FieldSkeleton labelWidth="w-14" />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FieldSkeleton labelWidth="w-20" />
                <FieldSkeleton labelWidth="w-20" />
              </div>
              <TextareaSkeleton />
            </div>
          </CardSkeleton>
        </div>

        {/* Right Column — Image Upload */}
        <div className="flex flex-col gap-6">
          <Card className="flex-1">
            <CardContent className="pt-6">
              <Skeleton className="h-64 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>

        {/* Variants — Full Width */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Variant header row */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>

                <div className="space-y-4">
                  {/* SKU, Name, Size */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FieldSkeleton labelWidth="w-8" />
                    <FieldSkeleton labelWidth="w-12" />
                    <FieldSkeleton labelWidth="w-14" />
                  </div>

                  {/* Price Override & Stock */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <FieldSkeleton labelWidth="w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <FieldSkeleton labelWidth="w-16" />
                  </div>

                  {/* Dimensions */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <FieldSkeleton labelWidth="w-16" />
                    <FieldSkeleton labelWidth="w-20" />
                    <FieldSkeleton labelWidth="w-24" />
                    <FieldSkeleton labelWidth="w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured & Availability — Full Width */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-20" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
