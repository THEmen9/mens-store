import {useState} from 'react';
import { Link } from 'react-router-dom'
import { LuSearch, LuHeart, LuShoppingCart } from 'react-icons/lu';
import {Button} from './ui/index'

function Header() {
  return (
    <header>
      <nav className="mx-auto flex items-center justify-between px-6 py-4">
        <div className="hidden md:block">
          <Link to="/">Logo</Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/shop">Shop</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/new-arrivals">New Arrivals</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">

          <Link to="/search">
            <Button aria-label="Open search">
              <LuSearch size={20} />
            </Button>
          </Link>

          <Link to="/wishlist">
            <Button aria-label="Open wishlist">
              <LuHeart size={20} />
            </Button>
          </Link>

          <Link to="/cart">
            <Button aria-label="Open cart">
              <LuShoppingCart size={20} />
            </Button>
          </Link>
        </div>
      </nav>

    </header>
  )
}

export default Header