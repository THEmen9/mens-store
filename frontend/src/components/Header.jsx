import {useState} from 'react';
import Button from './ui/Button'

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

          <Button
            onClick={() => setIsSearchOpen(true)}
            >
            Search
          </Button>

          <Button
            onClick={() => setIsWishlistActive((prev) => !prev)}
            >
            {isWishlistActive ? 'Wishlisted' : 'Wishlist'}
          </Button>

          <Button
            onClick={() => setIsCartOpen(true)}
            >
            Cart
          </Button>
        </div>

        {/* moblie-nav */}
        <div className="flex w-full items-center justify-between md:hidden">
        <Button
            onClick={() => setIsMenuOpen((prev) => !prev)}
        >
            Menu
        </Button>

        <a href="/">Logo</a>

        <div className="flex items-center gap-4">
            <Button
            onClick={() => setIsWishlistActive((prev) => !prev)}
            >
            {isWishlistActive ? 'Wishlisted' : 'Wishlist'}
            </Button>

            <Button
            onClick={() => setIsCartOpen(true)}
            >
            Cart
            </Button>
        </div>
        </div>
      </nav>
      {/* Mobile Search */}
        <div className="md:hidden">
        <Button
            onClick={() => setIsSearchOpen(true)}
        >
            Search products...
        </Button>
        </div>
        {/* Search UI */}
        {isSearchOpen && (
        <div>
            <input
            type="text"
            placeholder="Search products..."
            autoFocus
            />

            <Button
            onClick={() => setIsSearchOpen(false)}
            >
            Close
            </Button>
        </div>
        )}
        {/* Cart UI */}
        {isCartOpen && (
        <div>
            <p>Cart is open</p>

            <Button
            onClick={() => setIsCartOpen(false)}
            >
            Close
            </Button>
        </div>
        )}
    </header>
  )
}

export default Header