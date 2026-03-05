export function ProductDetailsError() {
  return (
    <section className="max-w-360 mx-auto px-6 lg:px-12 py-8 lg:py-16">
      <div className="text-center py-24">
        <h2 className="font-serif text-2xl text-foreground mb-2">
          Produto não encontrado
        </h2>
        <p className="font-sans text-sm text-muted-foreground">
          O produto que você procura não existe ou não está mais disponível.
        </p>
      </div>
    </section>
  );
}
