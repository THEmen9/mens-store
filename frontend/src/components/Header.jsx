import {useState} from 'react';

function Header() {
  const[isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      <nav className="mx-auto flex items-center justify-between px-6 py-4">
        <div className="hidden md:block">
            <a href="/">Logo</a>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="/">Shop</a>
          <a href="/">Collections</a>
          <a href="/">New Arrivals</a>
        </div>

        <div className="hidden md:flex items-center gap-4">

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            >
            Search
          </button>

          <button
            type="button"
            onClick={() => setIsWishlistActive((prev) => !prev)}
            >
            {isWishlistActive ? 'Wishlisted' : 'Wishlist'}
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            >
            Cart
          </button>
        </div>

        {/* moblie-nav */}
        <div className="flex w-full items-center justify-between md:hidden">
        <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
        >
            Menu
        </button>

        <a href="/">Logo</a>

        <div className="flex items-center gap-4">
            <button
            type="button"
            onClick={() => setIsWishlistActive((prev) => !prev)}
            >
            {isWishlistActive ? 'Wishlisted' : 'Wishlist'}
            </button>

            <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            >
            Cart
            </button>
        </div>
        </div>
      </nav>
      {/* Mobile Search */}
        <div className="md:hidden">
        <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
        >
            Search products...
        </button>
        </div>
        {/* Search UI */}
        {isSearchOpen && (
        <div>
            <input
            type="text"
            placeholder="Search products..."
            autoFocus
            />

            <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            >
            Close
            </button>
        </div>
        )}
        {/* Cart UI */}
        {isCartOpen && (
        <div>
            <p>Cart is open</p>

            <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            >
            Close
            </button>
        </div>
        )}
    </header>
  )
}

export default Header