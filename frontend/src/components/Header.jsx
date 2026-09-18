import {useState} from 'react';
import {Button, Search} from './ui/index'

function Header() {
  const[isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
      </nav>

        {/* Search UI */}
        {isSearchOpen && (
          <Search onClose={() => setIsSearchOpen(false)} />
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