interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'error' | 'neutral'
  className?: string
}

export default function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const variantClasses = {
    success: 'badge-success',
    error: 'badge-error',
    neutral: 'badge-neutral'
  }

  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
