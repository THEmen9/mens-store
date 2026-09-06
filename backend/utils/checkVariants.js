
// Check for duplicate color and size combinations in variants
const checkVariants = (variants) => {
  const combinations = new Set();

  for (const variant of variants) {
    const combination = `${variant.color.toLowerCase()}-${variant.size.toLowerCase()}`;

    if (combinations.has(combination)) {
      const error = new Error(
        "Duplicate color and size combination is not allowed"
      );

      error.statusCode = 400;
      error.errors = [
        {
          field: "variants",
          message: "Duplicate color and size combination is not allowed",
        },
      ];

      throw error;
    }

    combinations.add(combination);
  }
};
export default checkVariants;