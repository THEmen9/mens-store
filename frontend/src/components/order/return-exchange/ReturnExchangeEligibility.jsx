import { useState } from 'react'
import { LuRefreshCw } from 'react-icons/lu'

import Button from '../../ui/Button'
import ReturnExchangeForm from './ReturnExchangeForm'

function ReturnExchangeEligibility({ eligibility, productId  }) {

    const [activeType, setActiveType] = useState(null)

    if (!eligibility) {
        return null
    }

    const { return: returnEligibility, exchange: exchangeEligibility } =
        eligibility

    // Return and exchange share the same delivery/window eligibility.
    const isEligible =
        returnEligibility.eligible || exchangeEligibility.eligible

    const formatDate = (date) =>
        new Date(date).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        })

    const getAvailabilityText = () => {
        if (isEligible) {
        // Both actions use the same policy window.
        const windowEnd =
            returnEligibility.windowEnd || exchangeEligibility.windowEnd

        return `Until ${formatDate(windowEnd)}`
        }

        if (
        returnEligibility.reason === 'not_delivered' ||
        exchangeEligibility.reason === 'not_delivered'
        ) {
        return 'Available after delivery'
        }

        if (
        returnEligibility.reason === 'window_expired' ||
        exchangeEligibility.reason === 'window_expired'
        ) {
        const windowEnd =
            returnEligibility.windowEnd || exchangeEligibility.windowEnd

        return `Closed ${formatDate(windowEnd)}`
        }

        if (
        returnEligibility.reason === 'quantity_exhausted' ||
        exchangeEligibility.reason === 'quantity_exhausted'
        ) {
        return 'Quantity exhausted'
        }

        if (
        returnEligibility.reason === 'active_request' ||
        exchangeEligibility.reason === 'active_request'
        ) {
        return 'Request already active'
        }

        return 'Currently unavailable'
    }

    return (
        <div className="mt-4 border-t border-neutral-200 pt-4">
        {/* Single compact availability summary for Return & Exchange. */}
        <div className="flex items-center justify-between">
            <div>
            <p className="flex items-center gap-2 text-sm font-medium text-neutral-900">
                <LuRefreshCw size={15} />
                Return & Exchange
            </p>

            <p className="mt-1 text-xs text-neutral-500">
                {getAvailabilityText()}
            </p>
            </div>

            {/* Actions appear only when the backend confirms eligibility. */}
            {isEligible && (
            <div className="flex gap-2">
                {returnEligibility.eligible && (
                <Button
                    type="button"
                    onClick={() => setActiveType('return')}
                    className="rounded-full border border-neutral-900 px-3 py-1.5 text-xs 
                    font-medium transition hover:bg-neutral-900 hover:text-white"
                >
                    Return
                </Button>
                )}

                {exchangeEligibility.eligible && (
                <Button
                    type="button"
                    onClick={() => setActiveType('exchange')}
                    className="rounded-full border border-neutral-900 px-3 py-1.5 text-xs font-medium
                    transition hover:bg-neutral-900 hover:text-white"
                >
                    Exchange
                </Button>
                )}
            </div>
            )}
        </div>
        {activeType && (
                <div className="mt-6 grid gap-8 sm:grid-cols-2">
                    {/* Contextual guidance for the selected action. */}
                    <div className="flex min-h-full items-center">
                        <div className="max-w-sm">
                            <p className="text-2xl font-medium tracking-tight uppercase text-neutral-900">
                                {activeType === 'return'
                                    ? '↻ Not the right fit?'
                                    : '↔ Need another size?'}
                            </p>

                            <p className="mt-3 text-xs leading-6 tracking-wider uppercase
                            text-neutral-500">
                                {activeType === 'return'
                                    ? "Tell us what went wrong and we'll take it from here."
                                    : 'Choose your preferred color and size for the exchange.'}
                            </p>
                        </div>
                    </div>

                    {/* The actual form stays unchanged and uses the right column on desktop. */}
                    <div className="w-full">
                        <ReturnExchangeForm
                            type={activeType}
                            productId={productId}
                            onClose={() => setActiveType(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReturnExchangeEligibility