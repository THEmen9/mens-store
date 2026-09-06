// This function calculates the discount percentage based on the original price and the compare at price. It returns 0 if the compare at price is not provided.
const calculateDiscount = (price, compareAtPrice) => {
  if (!compareAtPrice) {
    return 0;
  }

  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};

export default calculateDiscount;