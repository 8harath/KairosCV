import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border-2 border-primary px-3 py-1 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-secondary text-primary",
        success: "bg-green-100 text-green-800 border-green-800 dark:bg-green-900 dark:text-green-100",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        destructive: "bg-red-100 text-red-800 border-red-800 dark:bg-red-900 dark:text-red-100",
        outline: "bg-transparent text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={badgeVariants({ variant })} {...props} />
  )
}

export { Badge, badgeVariants }
