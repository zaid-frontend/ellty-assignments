import { GenericElements } from "@/types"
import { CSSProperties } from "react"
import defaultStyles from "@/styles/Elements/box.module.css"

interface IBoxProps {
  children: GenericElements
  maxWidth?: number
  className?: string,
  styles?: CSSProperties
}

export function Box({ children, maxWidth, className, styles }: IBoxProps) {
  return (
    <div
      style={{ maxWidth, ...styles }}
      className={`${defaultStyles.box}  ${className}`}
    >
      {children}
    </div>
  )
}
