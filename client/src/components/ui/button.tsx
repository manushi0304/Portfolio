// client/src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Centralized button styles for the whole project.
 * Variants:
 *  - primary: gradient → turns solid white on hover (like “View My Work”)
 *  - outline: dark outline pill with subtle hover (like “Download Resume”)
 *
 * Also sets cursor overrides so the blob looks white/translucent on buttons.
 */

const buttonVariants = cva(
  // base
  "inline-flex items-center justify-center whitespace-nowrap select-none " +
    "rounded-xl font-semibold transition-[background-image,color,box-shadow,border-color] " +
    "duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        // gradient that becomes solid white on hover
        primary:
          "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg " +
          "hover:from-white hover:to-white hover:text-black hover:shadow-xl",

        // dark outline pill
        outline:
          "border border-gray-600 text-white hover:border-white hover:bg-gray-800",

        // keep shadcn compatibility if some places still pass "default"/"ghost"
        default:
          "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg " +
          "hover:from-white hover:to-white hover:text-black hover:shadow-xl",
        ghost: "bg-transparent hover:bg-gray-800/60",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        // Make the cursor look right over all buttons without per-usage attrs
        data-cursor-color="#ffffff"
        data-cursor-blend="normal"
        data-cursor-opacity="0.35"
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
