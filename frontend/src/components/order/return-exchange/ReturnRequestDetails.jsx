function ReturnRequestDetails({ request, item }) {
  return (
    <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5">
      {/* Request header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Return Request
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            Requested on{" "}
            {new Date(request.requestedAt).toLocaleDateString()}
          </p>
        </div>

        <p className="text-sm font-medium capitalize">
          {request.status.replaceAll("_", " ")}
        </p>
      </div>

      {/* Returned item */}
      <div className="mt-5 flex gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="h-20 w-16 shrink-0 rounded-lg object-cover"
        />

        <div className="min-w-0">
          <p className="text-sm font-medium">
            {item.name}
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            {item.color} · {item.size}
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            Quantity: {request.quantity}
          </p>
        </div>
      </div>

      {/* Request information */}
      <div className="mt-5 space-y-3 border-t border-neutral-200 pt-5 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Reason
          </p>

          <p className="mt-1 capitalize">
            {request.reason.replaceAll("_", " ")}
          </p>
        </div>

        {request.comment && (
          <div>
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              Comment
            </p>

            <p className="mt-1 text-neutral-700">
              {request.comment}
            </p>
          </div>
        )}
      </div>

      {/* Proof */}
      {request.proof?.length > 0 && (
        <div className="mt-5 border-t border-neutral-200 pt-5">
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Proof
          </p>

          <div className="mt-3 flex flex-wrap gap-3">
            {request.proof.map((proof, index) => (
              <a
                key={`${proof.url}-${index}`}
                href={proof.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium underline underline-offset-4"
              >
                {proof.type === "image"
                  ? `View Image ${index + 1}`
                  : `View Video ${index + 1}`}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReturnRequestDetails