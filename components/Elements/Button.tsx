import { GenericElements } from '@/types'
import styles from "@/styles/Elements/button.module.css"

interface IButtonProps extends
  React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: GenericElements
}

export function Button({ children, className, onClick, ...props }: IButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${styles['button']} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
}
