import CollectionCard from '../components/collections/CollectionCard';

function Collections() {
  const collections = [
    {
      title: 'T-Shirts',
      description: 'Everyday essentials with a refined edge.',
      slug: 't-shirts',
    },
    {
      title: 'Shirts',
      description: 'Clean silhouettes for everyday dressing.',
      slug: 'shirts',
    },
    {
      title: 'Jeans',
      description: 'Reliable fits built for everyday wear.',
      slug: 'jeans',
    },
    {
      title: 'Bottom Wear',
      description: 'Versatile pieces for effortless styling.',
      slug: 'bottom-wear',
    },
  ];

  return (
    <main className="px-4 py-8 md:px-8 lg:px-12">
      {/* Header */}
      <section className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          Collections
        </p>

        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl">
          Explore Our Collections
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500 md:text-base">
          Discover thoughtfully selected collections designed for
          modern everyday dressing.
        </p>
      </section>

      {/* Collection Grid */}
      <section className="mx-auto mt-10 max-w-7xl">
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.slug}
              {...collection}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Collections;