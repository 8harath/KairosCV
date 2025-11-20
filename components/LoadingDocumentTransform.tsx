"use client"

/**
 * Document Transform Loading Animation
 * Shows a resume being transformed from basic to optimized
 * Perfect for file upload and processing states
 */
export default function LoadingDocumentTransform() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-32 h-40 mb-6">
        {/* Original document (fading out) */}
        <div
          className="absolute inset-0 border-2 border-gray-30 bg-white animate-fade-out"
          style={{
            clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 0 100%)'
          }}
        >
          {/* Document lines - messy/unoptimized */}
          <div className="p-3 space-y-2">
            <div className="h-1 bg-gray-20 w-full" />
            <div className="h-1 bg-gray-20 w-4/5" />
            <div className="h-1 bg-gray-20 w-full" />
            <div className="h-1 bg-gray-20 w-3/4" />
            <div className="h-1 bg-gray-20 w-2/3" />
            <div className="h-1 bg-gray-20 w-full" />
          </div>

          {/* Folded corner */}
          <div
            className="absolute top-0 right-0 w-6 h-6 bg-gray-10 border-l-2 border-b-2 border-gray-30"
            style={{
              clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
            }}
          />
        </div>

        {/* Optimized document (fading in) */}
        <div
          className="absolute inset-0 border-2 border-primary bg-white animate-fade-in"
          style={{
            clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 0 100%)'
          }}
        >
          {/* Document lines - clean/optimized */}
          <div className="p-3 space-y-2">
            <div className="h-1.5 bg-primary w-full" />
            <div className="h-1 bg-gray-60 w-full" />
            <div className="h-1 bg-gray-60 w-full" />
            <div className="h-1 bg-gray-60 w-full" />
            <div className="h-1.5 bg-primary w-full mt-3" />
            <div className="h-1 bg-gray-60 w-full" />
          </div>

          {/* Folded corner */}
          <div
            className="absolute top-0 right-0 w-6 h-6 bg-secondary border-l-2 border-b-2 border-primary"
            style={{
              clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
            }}
          />
        </div>

        {/* Sparkle overlay */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl animate-sparkle"
        >
          ✨
        </div>
      </div>

      <p className="text-sm font-semibold text-muted-foreground animate-pulse">
        Optimizing your resume...
      </p>
    </div>
  )
}
