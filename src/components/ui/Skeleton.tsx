import { cn } from "@/lib/utils"
import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"

function Skeleton({
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={cn("rounded-md bg-[#1a1a1a]", className)}
      {...props}
    />
  )
}

export { Skeleton }
