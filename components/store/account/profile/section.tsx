"use client";

export function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border">
      {/* Section header */}
      <div className="flex items-center gap-4 px-6 sm:px-8 py-5 border-b border-border bg-muted/30">
        <div className="w-9 h-9 border border-border flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="font-serif text-base text-foreground">{title}</h2>
          <p className="font-sans text-xs text-muted-foreground tracking-wide">
            {description}
          </p>
        </div>
      </div>

      {/* Section content */}
      <div className="px-6 sm:px-8 py-8">{children}</div>
    </div>
  );
}
