import { describe, expect, test, vi } from "vitest"

import {
    validateReturnExchangeProofSize,
} from "../middleware/upload.middleware.js"

// ==================== Test Helpers ====================

// Creates a minimal request object with only the file data
// required by the middleware.
const createRequest = (mimetype, size) => ({
    file: {
        mimetype,
        size,
    },
})

// Creates a mock Express response object.
// This middleware does not currently use res, but keeping
// the signature makes the test match the real middleware.
const createResponse = () => ({})

// Creates a mock next() function so we can verify
// whether validation passed or failed.
const createNext = () => vi.fn()

describe("validateReturnExchangeProofSize", () => {
    // ==================== Image Validation ====================

    test("should allow an image smaller than 5 MB", () => {
        const req = createRequest(
            "image/jpeg",
            4 * 1024 * 1024
        )
        const res = createResponse()
        const next = createNext()

        validateReturnExchangeProofSize(req, res, next)

        expect(next).toHaveBeenCalledOnce()
        expect(next).toHaveBeenCalledWith()
    })

    test("should allow an image exactly 5 MB", () => {
        const req = createRequest(
            "image/png",
            5 * 1024 * 1024
        )
        const res = createResponse()
        const next = createNext()

        validateReturnExchangeProofSize(req, res, next)

        expect(next).toHaveBeenCalledOnce()
        expect(next).toHaveBeenCalledWith()
    })

    test("should reject an image larger than 5 MB", () => {
        const req = createRequest(
            "image/webp",
            5 * 1024 * 1024 + 1
        )
        const res = createResponse()
        const next = createNext()

        validateReturnExchangeProofSize(req, res, next)

        expect(next).toHaveBeenCalledOnce()

        const error = next.mock.calls[0][0]

        expect(error).toMatchObject({
            message: "Image proof must be 5 MB or smaller",
            statusCode: 400,
        })
    })

    // ==================== Video Validation ====================

    test("should allow a video exactly 20 MB", () => {
        const req = createRequest(
            "video/mp4",
            20 * 1024 * 1024
        )
        const res = createResponse()
        const next = createNext()

        validateReturnExchangeProofSize(req, res, next)

        expect(next).toHaveBeenCalledOnce()
        expect(next).toHaveBeenCalledWith()
    })

    test("should reject a video larger than 20 MB", () => {
        const req = createRequest(
            "video/quicktime",
            20 * 1024 * 1024 + 1
        )
        const res = createResponse()
        const next = createNext()

        validateReturnExchangeProofSize(req, res, next)

        expect(next).toHaveBeenCalledOnce()

        const error = next.mock.calls[0][0]

        expect(error).toMatchObject({
            message: "Video proof must be 20 MB or smaller",
            statusCode: 400,
        })
    })

    // ==================== Missing File ====================

    test("should continue when no file is provided", () => {
        const req = {}
        const res = createResponse()
        const next = createNext()

        validateReturnExchangeProofSize(req, res, next)

        expect(next).toHaveBeenCalledOnce()
        expect(next).toHaveBeenCalledWith()
    })
})