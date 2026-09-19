import { useState } from "react";
import { LuMenu, LuSearch, LuUser, LuX  } from "react-icons/lu";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:hidden">
      {/* Menu */}
      <Button
        className="flex items-center justify-center"
        aria-label="Open menu"
        onClick={() => setIsOpen(true)}
      >
        <LuMenu size={22} />
      </Button>

      {/* Brand */}
      <Link to="/" className="text-lg font-medium">
        LOGO
      </Link>

      {/* Search + Account */}
      <div className="flex items-center gap-4">
      <Link to="/search">
        <Button
          className="flex items-center justify-center"
          aria-label="Open search"
        >
          <LuSearch size={22} />
        </Button>
      </Link>

      <Link to="/account">
        <Button
          className="flex items-center justify-center"
          aria-label="Open account"
        >
          <LuUser size={22} />
        </Button>
      </Link>

      </div>
      {isOpen && (
      <div className="fixed inset-0 z-60 md:hidden">
        {/* Backdrop */}
        <Button
          aria-label="Close menu"
          className="absolute inset-0 bg-black/30"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <aside className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white p-6 
        shadow-xl overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">MENU</span>

            <Button
              className="flex items-center justify-center"
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
            >
              <LuX size={22} />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-10 flex flex-col gap-3">
            <Link
              to="/shop"
              onClick={() => setIsOpen(false)}
              className="border-b py-4"
            >
              Shop
            </Link>

            <Link
              to="/collections"
              onClick={() => setIsOpen(false)}
              className="border-b py-4"
            >
              Collections
            </Link>

            <Link
              to="/new-arrivals"
              onClick={() => setIsOpen(false)}
              className="border-b py-4"
            >
              New Arrivals
            </Link>

            {/* Category Cards */}
            <div className="mt-4">
              <p className="mb-3 text-sm text-gray-500">Shop by category</p>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/shop?collection=t-shirts"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border p-4"
                >
                  <span className="text-sm font-medium">T-Shirts</span>
                </Link>

                <Link
                  to="/shop?collection=shirts"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border p-4"
                >
                  <span className="text-sm font-medium">Shirts</span>
                </Link>

                <Link
                  to="/shop?collection=jeans"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border p-4"
                >
                  <span className="text-sm font-medium">Jeans</span>
                </Link>

                <Link
                  to="/shop?collection=bottom-wear"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border p-4"
                >
                  <span className="text-sm font-medium">Bottom Wear</span>
                </Link>
              </div>
            </div>

            <Link
              to="/wishlist"
              onClick={() => setIsOpen(false)}
              className="border-b py-4"
            >
              Wishlist
            </Link>

            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="border-b py-4"
            >
              Cart
            </Link>

            <Link
              to="/account"
              onClick={() => setIsOpen(false)}
              className="border-b py-4"
            >
              Account
            </Link>
          </nav>
        </aside>
      </div>
    )}
    </nav>
  );
}

export default MobileNav;