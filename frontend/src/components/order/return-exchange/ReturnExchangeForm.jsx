import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import {
    LuEye,
    LuImagePlus,
    LuX,
} from 'react-icons/lu'

import Button from '../../ui/Button'
import { getProductById} from '../../../api/product.api'
import {
    uploadReturnExchangeProof,
} from '../../../api/order.api'

const REASONS = [
    { value: 'size_issue', label: 'Size issue' },
    { value: 'wrong_product', label: 'Wrong product' },
    { value: 'damaged_product', label: 'Damaged product' },
    { value: 'quality_issue', label: 'Quality issue' },
    { value: 'changed_mind', label: 'Changed my mind' },
    { value: 'other', label: 'Other' },
]

const EXCHANGE_REASONS = REASONS.filter(
    (reason) => reason.value !== 'quality_issue'
)

const PROOF_REASONS = [
    'wrong_product',
    'damaged_product',
    'quality_issue',
]

const MAX_IMAGES = 4
const MAX_VIDEOS = 1
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 20 * 1024 * 1024

function ReturnExchangeForm({ type, onClose, productId }) {
    const { token } = useAuth()

    const [reason, setReason] = useState('')
    const [comment, setComment] = useState('')
    const [error, setError] = useState('')
    const [proof, setProof] = useState([])

    const [previewFile, setPreviewFile] = useState(null)

    const [variants, setVariants] = useState([])
    const [isLoadingVariants, setIsLoadingVariants] = useState(false)
    const [variantError, setVariantError] = useState('')

    const [selectedColor, setSelectedColor] = useState('')
    const [selectedSize, setSelectedSize] = useState('')

    const [isSubmitting, setIsSubmitting] = useState(false)

    const requiresProof = PROOF_REASONS.includes(reason)

    const colors = [
        ...new Set(
            variants.map((variant) => variant.color)
        ),
    ]

    const sizes = [
        ...new Set(
            variants
                .filter((variant) => variant.color === selectedColor)
                .map((variant) => variant.size)
        ),
    ]

    useEffect(() => {
        if (type !== 'exchange' || !reason || !productId) {
            return
        }

        const fetchVariants = async () => {
            try {
                setIsLoadingVariants(true)
                setVariantError('')

                const response = await getProductById(productId)

                // Only variants currently having stock can be selected.
                setVariants(
                    response.data.variants.filter(
                        (variant) => variant.stock > 0
                    )
                )
            } catch (error) {
                setVariantError(error.message)
            } finally {
                setIsLoadingVariants(false)
            }
        }

        fetchVariants()
    }, [type, reason, productId])

    const handleReasonChange = (event) => {
        const value = event.target.value

        setReason(value)
        setError('')

        // Reset reason-specific selections when the reason changes.
        setSelectedSize('')
        setProof([])
    }

    const handleProofChange = (event) => {
        const selectedFiles = Array.from(event.target.files || [])

        const images = proof.filter((file) =>
            file.type.startsWith('image/')
        )

        const videos = proof.filter((file) =>
            file.type.startsWith('video/')
        )

        const nextFiles = [...proof]

        for (const file of selectedFiles) {
            const isImage = file.type.startsWith('image/')
            const isVideo = file.type.startsWith('video/')

            if (!isImage && !isVideo) {
                setError('Only images and videos are allowed')
                continue
            }

            if (isImage && file.size > MAX_IMAGE_SIZE) {
                setError('Each image must be 5MB or smaller')
                continue
            }

            if (isVideo && file.size > MAX_VIDEO_SIZE) {
                setError('Video must be 20MB or smaller')
                continue
            }

            const imageCount = images.length + nextFiles.filter(
                (item) => item.type.startsWith('image/')
            ).length - images.length

            const videoCount = videos.length + nextFiles.filter(
                (item) => item.type.startsWith('video/')
            ).length - videos.length

            if (isImage) {
                const currentImageCount = nextFiles.filter(
                    (item) => item.type.startsWith('image/')
                ).length

                if (currentImageCount >= MAX_IMAGES) {
                    setError('You can upload up to 4 images')
                    continue
                }
            }

            if (isVideo) {
                const currentVideoCount = nextFiles.filter(
                    (item) => item.type.startsWith('video/')
                ).length

                if (currentVideoCount >= MAX_VIDEOS) {
                    setError('You can upload only 1 video')
                    continue
                }
            }

            nextFiles.push(file)
        }

        setProof(nextFiles)
        event.target.value = ''
    }

    const removeProof = (index) => {
        setProof((currentFiles) =>
            currentFiles.filter((_, fileIndex) => fileIndex !== index)
        )
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        // Clear the previous validation/API error before starting submission.
        setError('')

        if (!reason) {
            setError('Please select a reason')
            return
        }

        if (
            type === 'exchange' &&
            reason === 'size_issue' &&
            !selectedSize
        ) {
            setError('Please select a size')
            return
        }

        if (requiresProof && proof.length === 0) {
            setError('Please upload proof')
            return
        }

        if (!token) {
            setError('Please login again')
            return
        }

        try {
            setIsSubmitting(true)

            const uploadedProof = []

            // Upload each selected proof file to Cloudinary.
            // We keep uploads sequential so the flow remains predictable
            // and easier to handle if one upload fails.
            for (const file of proof) {
                const response = await uploadReturnExchangeProof(
                    file,
                    token
                )

                uploadedProof.push({
                    url: response.data.url,
                    type: response.data.resourceType,
                })
            }

            // Temporary verification only.
            // The next step will send these URLs to the Return/Exchange
            // request creation API.
            console.log({
                type,
                reason,
                comment,
                selectedColor,
                selectedSize,
                proof: uploadedProof,
            })
        } catch (error) {
            setError(error.message || 'Failed to upload proof')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
    <>
        <form
            onSubmit={handleSubmit}
            className="mt-4 max-w-xl space-y-4"
        >
            <p className="text-sm font-medium text-neutral-900">
                {type === 'return' ? 'Return Request' : 'Exchange Request'}
            </p>

            {/* Reason controls which additional fields are displayed. */}
            <div>
                <label
                    htmlFor={`${type}-reason`}
                    className="text-sm font-medium text-neutral-900"
                >
                    Reason
                </label>

                <select
                    id={`${type}-reason`}
                    value={reason}
                    onChange={handleReasonChange}
                    className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 
                    py-2.5 text-sm outline-none focus:border-neutral-900"
                    >
                    <option value="">Select a reason</option>

                    {(type === 'exchange' ? EXCHANGE_REASONS : REASONS).map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Size selection is only relevant to an exchange caused by size. */}
            {type === 'exchange' && reason && (
                <div className="space-y-4">
                    {isLoadingVariants ? (
                        <p className="text-xs text-neutral-500">
                            Loading available options...
                        </p>
                    ) : variantError ? (
                        <p className="text-xs text-red-600">
                            {variantError}
                        </p>
                    ) : (
                        <>
                            {/* Color is selected first because size depends on color. */}
                            <div>
                                <label
                                    htmlFor="exchange-color"
                                    className="text-sm font-medium text-neutral-900"
                                >
                                    Color
                                </label>

                                <select
                                    id="exchange-color"
                                    value={selectedColor}
                                    onChange={(event) => {
                                        setSelectedColor(event.target.value)
                                        setSelectedSize('')
                                        setError('')
                                    }}
                                    className="mt-2 w-full rounded-xl border border-neutral-200
                                    bg-white px-3 py-2.5 text-sm outline-none
                                    focus:border-neutral-900"
                                >
                                    <option value="">Select color</option>

                                    {colors.map((color) => (
                                        <option key={color} value={color}>
                                            {color}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Size options are filtered using the selected color. */}
                            <div>
                                <label
                                    htmlFor="exchange-size"
                                    className="text-sm font-medium text-neutral-900"
                                >
                                    Size
                                </label>

                                <select
                                    id="exchange-size"
                                    value={selectedSize}
                                    onChange={(event) => {
                                        setSelectedSize(event.target.value)
                                        setError('')
                                    }}
                                    disabled={!selectedColor}
                                    className="mt-2 w-full rounded-xl border border-neutral-200
                                    bg-white px-3 py-2.5 text-sm outline-none
                                    focus:border-neutral-900 disabled:bg-neutral-100"
                                >
                                    <option value="">Select size</option>

                                    {sizes.map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Proof appears only for reasons that require evidence. */}
            {requiresProof && (
                <div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-900">
                                Proof
                            </p>

                            <p className="mt-1 text-xs text-neutral-500">
                                Add photos or video showing the issue.
                            </p>
                        </div>

                        <label
                            htmlFor={`${type}-proof`}
                            className="flex cursor-pointer items-center gap-1.5 rounded-full 
                            border border-neutral-200 px-3 py-1.5 text-xs font-medium transition 
                            hover:bg-neutral-100"
                            >
                            <LuImagePlus size={14} />
                            Add proof
                        </label>

                        <input
                            id={`${type}-proof`}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                            multiple
                            onChange={handleProofChange}
                            className="hidden"
                        />
                    </div>

                    {proof.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-3">
                            {proof.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="relative h-20 w-20 overflow-hidden rounded-xl 
                                    border border-neutral-200"
                                    >
                                    {file.type.startsWith('image/') ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="h-full w-full cursor-pointer object-cover"
                                            onClick={() =>
                                                setPreviewFile(file)
                                            }
                                        />
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPreviewFile(file)
                                            }
                                            className="flex h-full w-full items-center 
                                            justify-center bg-neutral-100 text-xs 
                                            text-neutral-600"
                                        >
                                            <LuEye size={18} />
                                            <span className="ml-1">
                                                Video
                                            </span>
                                        </button>
                                    )}

                                    {/* Removes only this selected proof file. */}
                                    <button
                                        type="button"
                                        onClick={() => removeProof(index)}
                                        className="absolute right-1 top-1 flex h-5 w-5 
                                        items-center justify-center rounded-full 
                                        bg-white text-neutral-700 shadow-sm transition 
                                        hover:bg-neutral-100"
                                        aria-label={`Remove ${file.name}`}
                                        >
                                        <LuX size={13} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Optional customer explanation. */}
            <div>
                <label
                    htmlFor={`${type}-comment`}
                    className="text-sm font-medium text-neutral-900"
                >
                    Comment{' '}
                    <span className="text-neutral-400">(optional)</span>
                </label>

                <textarea
                    id={`${type}-comment`}
                    value={comment}
                    onChange={(event) => {
                        setComment(event.target.value)
                        setError('')
                    }}
                    maxLength={500}
                    rows={2}
                    placeholder="Tell us more..."
                    className="mt-2 w-full resize-none rounded-xl border border-neutral-200 
                    px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                />
            </div>

            {error && (
                <p className="text-xs text-red-600">
                    {error}
                </p>
            )}

            <div className="flex gap-2">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium 
                    text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed 
                    disabled:opacity-50"
                >
                    {isSubmitting ? 'Uploading...' : `Submit ${type}`}
                </Button>

                {onClose && (
                    <Button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-neutral-200 px-4 py-2 text-sm 
                        font-medium transition hover:bg-neutral-100"
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>

        {/* Opens the selected proof so the customer can verify it before submitting. */}
        {previewFile && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 
                p-4"
                onClick={() => setPreviewFile(null)}
            >
                <div
                    className="relative max-h-[90vh] max-w-4xl"
                    onClick={(event) => event.stopPropagation()}
                >
                    <button
                        type="button"
                        onClick={() => setPreviewFile(null)}
                        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center 
                        justify-center rounded-full bg-white text-neutral-900 shadow"
                        aria-label="Close preview"
                    >
                        <LuX size={18} />
                    </button>

                    {previewFile.type.startsWith('image/') ? (
                        <img
                            src={URL.createObjectURL(previewFile)}
                            alt={previewFile.name}
                            className="max-h-[85vh] max-w-full rounded-xl object-contain"
                        />
                    ) : (
                        <video
                            src={URL.createObjectURL(previewFile)}
                            controls
                            autoPlay
                            className="max-h-[85vh] max-w-full rounded-xl"
                        />
                    )}
                </div>
            </div>
        )}
    </>
    )
}

export default ReturnExchangeForm