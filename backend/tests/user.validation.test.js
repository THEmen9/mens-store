import { describe, test, expect } from "vitest"
import User from "../models/User.js"

const validUser = {
  name: "Test User",
  email: "test@example.com",
}

describe("User Model Validation", () => {
  test("should validate a valid user", async () => {
    const user = new User(validUser)

    await expect(user.validate()).resolves.toBeUndefined()
  })

  test("should reject missing name", async () => {
    const user = new User({
      ...validUser,
      name: undefined,
    })

    await expect(user.validate()).rejects.toThrow()
  })

  test("should reject missing email", async () => {
    const user = new User({
      ...validUser,
      email: undefined,
    })

    await expect(user.validate()).rejects.toThrow()
  })
})