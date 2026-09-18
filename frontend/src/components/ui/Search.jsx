import { LuSearch, LuX } from "react-icons/lu";
import {Input, Button} from "./index";

function Search({ onClose }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <LuSearch
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2"
        />

        <Input
          type="text"
          placeholder="Search products..."
          autoFocus
          className="w-full pl-10"
        />
      </div>

      <Button
        onClick={onClose}
        className="shrink-0"
        aria-label="Close search"
      >
        <LuX size={20} />
      </Button>
    </div>
  );
}

export default Search;