import { useEffect, useState } from 'react';
import { Button } from '../components/ui';
import { FiX } from 'react-icons/fi';
import ShopFilters from '../components/shop/ShopFilters';
import { getProducts } from '../api/product.api';
import ProductCard from '../components/product/ProductCard';


function Shop() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [products, setProducts] = useState([]);

   useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();

        console.log('Products API response:', response);

        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);
  
  return (
    <main className="px-4 py-8 md:px-8 lg:px-12">
      {/* Shop Header */}
      <section className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          Shop
        </p>

        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl">
          Explore the Collection
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-500 md:text-base">
          Discover our latest collection of men's essentials.
        </p>
      </section>

      {/* Toolbar */}
      <section className="mx-auto mt-10 max-w-7xl border-y border-neutral-200 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            All Products
          </p>

          <div className="flex items-center gap-3">
            {/* Mobile Filter */}
            <Button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="text-sm md:hidden"
            >
              Filter
            </Button>
            <Button
              type="button"
              onClick={() => setIsSortOpen(true)}
              className="text-sm md:hidden"
            >
              Sort
          </Button>

            {/* Sort */}
            <select
              defaultValue="featured"
              className="hidden border-0 bg-transparent text-sm outline-none md:block"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="mx-auto mt-8 max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[220px_1fr]">

          {/* Desktop Filters */}
          <aside className="hidden border-r border-neutral-200 pr-6 md:block">
              <ShopFilters />
          </aside>

          {/* Product Grid */}
          <div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {isFilterOpen && (
      <div className="fixed inset-0 z-60 md:hidden">
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setIsFilterOpen(false)}
          className="absolute inset-0 bg-black/40"
        />

        {/* Drawer */}
        <aside className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <h2 className="text-sm font-medium">
                Filters
              </h2>

              <Button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="p-2 text-xl"
                aria-label="Close filters"
              >
                <FiX />
              </Button>
            </div>

            {/* Filter content */}
            <div className="flex-1 overflow-y-auto px-5 py-6">
                <ShopFilters />
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-neutral-200 p-5">
              <Button
                type="button"
                className="flex-1 border border-neutral-300 py-3 text-sm"
              >
                Clear
              </Button>

              <Button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 bg-black py-3 text-sm text-white"
              >
                Apply
            </Button>
            </div>
          </div>
        </aside>
      </div>
    )}

    {isSortOpen && (
    <div className="fixed inset-0 z-60 md:hidden">
      {/* Backdrop */}
      <button
        type="button"
        onClick={() => setIsSortOpen(false)}
        className="absolute inset-0 bg-black/40"
        aria-label="Close sort"
      />

      {/* Bottom Sheet */}
      <aside className="absolute bottom-0 left-0 w-full rounded-t-2xl bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="text-sm font-medium">
            Sort By
          </h2>

          <Button
            type="button"
            onClick={() => setIsSortOpen(false)}
            className="p-2"
          >
            <FiX aria-hidden="true" />
          </Button>
        </div>

        <div className="px-5 py-4">
          <div className="space-y-4">
            <button type="button" className="block w-full text-left text-sm">
              Featured
            </button>

            <button type="button" className="block w-full text-left text-sm">
              Newest
            </button>

            <button type="button" className="block w-full text-left text-sm">
              Price: Low to High
            </button>

            <button type="button" className="block w-full text-left text-sm">
              Price: High to Low
            </button>
          </div>
        </div>
      </aside>
    </div>
    )}
    </main>
  );
}

export default Shop;