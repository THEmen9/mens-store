import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuHouse,
  LuShoppingBag,
  LuHeart,
  LuShoppingCart,
} from "react-icons/lu";

const MobileBottomNav = () => {
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always visible at the top
      if (currentScrollY === 0) {
        setIsVisible(true);
      }

      // Scrolling up → show immediately
      else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      // Scrolling down → hide
      else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;

      // Show 2.5 seconds after scrolling stops
      clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        setIsVisible(true);
      }, 2500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, []);

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-gray-200 bg-white
      transition-transform duration-300
      ${isVisible ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        <Link
            to="/"
            className="flex flex-col items-center gap-1"
            >
            <LuHouse size={20} />
            <span className="text-[11px]">Home</span>
        </Link>

        <Link to="/shop" className="flex flex-col items-center gap-1">
            <LuShoppingBag size={20} />
            <span className="text-[11px]">Shop</span>
        </Link>

        <Link to="/wishlist" className="flex flex-col items-center gap-1">
            <LuHeart size={20} />
            <span className="text-[11px]">Wishlist</span>
        </Link>

        <Link to="/cart" className="flex flex-col items-center gap-1">
          <LuShoppingCart size={20}/>
          <span className="text-[11px]">Cart</span>
        </Link>

      </div>
    </nav>
  );
};

export default MobileBottomNav;