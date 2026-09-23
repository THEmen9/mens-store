import User from "../models/User.js";

const validUser = {
  name: "Test User",
  email: "test@example.com",
};

const user = new User(validUser);

try {
  await user.validate();
  console.log("User validation passed");
} catch (error) {
  console.error("User validation failed:", error.message);
  process.exitCode = 1;
}

async function expectValidationFailure(data, testName) {
  const user = new User({
    ...validUser,
    ...data,
  });

  try {
    await user.validate();
    console.error(`❌ ${testName}: validation unexpectedly passed`);
    process.exitCode = 1;
  } catch {
    console.log(`✅ ${testName}: validation failed as expected`);
  }
}

await expectValidationFailure(
  { name: undefined },
  "Missing name"
);

await expectValidationFailure(
  { email: undefined },
  "Missing email"
);
