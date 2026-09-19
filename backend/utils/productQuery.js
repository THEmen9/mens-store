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

  if (!Number.isInteger(page) || page < 1) {
    throw createQueryError("Page must be a positive integer");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw createQueryError("Limit must be between 1 and 50");
  }

  if (!allowedSorts.includes(sort)) {
    throw createQueryError("Invalid sort option");
  }

  return {
    page,
    limit,
    sort,
  };
};

export default productQuery;