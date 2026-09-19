import { LuMenu, LuSearch, LuUser } from "react-icons/lu";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

function MobileNav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 md:hidden">
      {/* Menu */}
      <Button
        className="flex items-center justify-center"
        aria-label="Open menu"
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
    </nav>
  );
}

export default MobileNav;