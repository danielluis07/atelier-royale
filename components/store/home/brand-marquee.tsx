export function BrandMarquee() {
  const words = [
    "Exclusividade",
    "Elegância",
    "Sofisticação",
    "Atemporalidade",
    "Luxo",
    "Refinamento",
    "Distinção",
    "Excelência",
  ];

  return (
    <section className="py-6 bg-foreground overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...words, ...words, ...words].map((word, i) => (
          <span key={i} className="flex items-center">
            <span className="font-serif italic text-lg lg:text-xl text-background/30 mx-8 tracking-wider">
              {word}
            </span>
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 bg-primary/50 rotate-45 shrink-0"
            />{" "}
          </span>
        ))}
      </div>
    </section>
  );
}
