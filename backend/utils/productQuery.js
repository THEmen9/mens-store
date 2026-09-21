const allowedSorts = ["newest", "price-asc", "price-desc"];

const createQueryError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const productQuery = (query) => {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 12 : Number(query.limit);
  const sort = query.sort || "newest";

  const search = query.search?.trim() || "";
  const category = query.category?.trim() || "";
  const subcategory = query.subcategory?.trim() || "";

  const minPrice = query.minPrice === undefined ? undefined : Number(query.minPrice);
  const maxPrice = query.maxPrice === undefined ? undefined : Number(query.maxPrice);

  const color = query.color?.trim() || "";
  const size = query.size?.trim() || "";

  // sort query
  if (!Number.isInteger(page) || page < 1) {
    throw createQueryError("Page must be a positive integer");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw createQueryError("Limit must be between 1 and 50");
  }

  if (!allowedSorts.includes(sort)) {
    throw createQueryError("Invalid sort option");
  }
// price qurey
  if (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) {
    throw createQueryError("minPrice must be a valid non-negative number");
  }

  if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) {
    throw createQueryError("maxPrice must be a valid non-negative number");
  }

if (
  minPrice !== undefined &&
  maxPrice !== undefined &&
  minPrice > maxPrice
) {
  throw createQueryError("minPrice cannot be greater than maxPrice");
}

  return {
    page,
    limit,
    sort,
    search,
    category,
    subcategory,
    minPrice,
    maxPrice,
    color,
    size
  };
};

export default productQuery;