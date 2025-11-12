import { GenericElements } from '@/types'
import styles from "@/styles/Elements/button.module.css"

interface IButtonProps {
  children: GenericElements
  className?: string
  onClick?: () => void
}

export function Button({ children, className, onClick }: IButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${styles['button']} ${className || ''}`}
    >
      {children}
    </button>
  )
}
