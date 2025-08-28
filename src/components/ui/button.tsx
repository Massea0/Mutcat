import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-senegal-green-500 text-white shadow hover:bg-senegal-green-600 hover:shadow-lg hover:scale-105",
        destructive:
          "bg-senegal-red-500 text-white shadow-sm hover:bg-senegal-red-600 hover:shadow-lg hover:scale-105",
        outline:
          "border-2 border-senegal-green-500 bg-background text-senegal-green-600 hover:bg-senegal-green-50 hover:scale-105",
        secondary:
          "bg-senegal-yellow-500 text-black shadow-sm hover:bg-senegal-yellow-600 hover:shadow-lg hover:scale-105",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-senegal-green-600 underline-offset-4 hover:underline hover:text-senegal-green-700",
        gradient:
          "bg-gradient-to-r from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }