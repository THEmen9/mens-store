import { LuSearch } from 'react-icons/lu';
import { Container, Input } from '../components/ui';

function Search() {
  return (
    <main>
      <Container className="py-10">
        {/* Search */}
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <LuSearch
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />

            <Input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Catalog */}
        <section className="mt-10">
          <h1 className="text-2xl font-medium">
            Search Products
          </h1>

          <div className="mt-6">
            {/* Products will be connected here */}
          </div>
        </section>
      </Container>
    </main>
  );
}

export default Search;