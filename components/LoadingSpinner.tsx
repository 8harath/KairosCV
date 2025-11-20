"use client"

/**
 * Confident Pulse Loading Spinner
 * Minimal, professional spinner for general loading states
 */

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  label?: string
}

export default function LoadingSpinner({ size = "md", label }: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  }

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3"
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizes[size]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 border-2 border-gray-20 rounded-full" />

        {/* Animated arc */}
        <div
          className="absolute inset-0 border-2 border-primary rounded-full border-t-transparent border-r-transparent animate-spin"
          style={{ animationDuration: '1s' }}
        />

        {/* Center pulse dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${dotSizes[size]} bg-primary rounded-full animate-pulse`} />
        </div>
      </div>

      {label && (
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">
          {label}
        </p>
      )}
    </div>
  )
}
