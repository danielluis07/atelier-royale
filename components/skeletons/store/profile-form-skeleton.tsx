import { Skeleton } from "@/components/ui/skeleton";

function SectionSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      {/* Section header: icon + title + description */}
      <div className="flex items-start gap-3">
        <Skeleton className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-52" />
        </div>
      </div>
      {children}
    </div>
  );
}

function InputSkeleton({ wide }: { wide?: boolean }) {
  return (
    <div className="space-y-2">
      <Skeleton className={`h-3 ${wide ? "w-40" : "w-28"}`} />
      <Skeleton className="h-10 w-full rounded-none" />
    </div>
  );
}

export function ProfileFormSkeleton() {
  return (
    <div className="space-y-10">
      {/* ─── Personal Data ─── */}
      <SectionSkeleton>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
          {/* Full name — spans 2 cols */}
          <div className="sm:col-span-2">
            <InputSkeleton wide />
          </div>
          {/* Email */}
          <InputSkeleton />
          {/* Phone */}
          <InputSkeleton />
          {/* CPF/CNPJ */}
          <InputSkeleton />
          {/* Birth date */}
          <InputSkeleton />
        </div>
      </SectionSkeleton>

      {/* ─── Address ─── */}
      <SectionSkeleton>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-7">
          {/* Label */}
          <InputSkeleton />
          {/* Recipient — spans 2 cols */}
          <div className="sm:col-span-2 lg:col-span-2">
            <InputSkeleton wide />
          </div>
          {/* CEP */}
          <InputSkeleton />
          {/* Street — spans 2 cols */}
          <div className="sm:col-span-2 lg:col-span-2">
            <InputSkeleton wide />
          </div>
          {/* Number */}
          <InputSkeleton />
          {/* Complement */}
          <InputSkeleton />
          {/* Neighborhood */}
          <InputSkeleton />
          {/* City */}
          <InputSkeleton />
          {/* State */}
          <InputSkeleton />
        </div>
      </SectionSkeleton>

      {/* ─── Submit row ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <Skeleton className="h-3 w-72" />
        <Skeleton className="h-12 w-44 rounded-none" />
      </div>
    </div>
  );
}
