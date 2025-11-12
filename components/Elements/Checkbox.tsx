"use client"

import styles from "@/styles/Elements/checkbox.module.css"

interface ICheckBoxProps {
  id: string;
  label: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

export function CheckBox({ id, label, checked, setChecked }: ICheckBoxProps) {
  return (
    <label className={styles["checkbox-container"]} htmlFor={id}>
      <span className={styles["checkbox-label-text"]}>{label}</span>

      <div className={styles["checkbox-wrapper"]}>
        <input
          type="checkbox"
          id={id}
          className={styles["checkbox-input"]}
          checked={checked}
          onChange={(e) => setChecked?.(e.target.checked)}
        />
        <span className={styles["checkbox-custom"]}>
          <span className={styles["checkbox-glow"]}></span>
          <span className={styles["checkbox-border"]}></span>
          <span className={styles["checkbox-checkmark"]}>
            <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.5 7.1L6.53451 12.4672C6.55497 12.4854 6.58626 12.4837 6.6047 12.4635L17.5 0.5" stroke="#E3E3E3" strokeLinecap="round" />
            </svg>
          </span>
        </span>
      </div>
    </label>
  )
}
