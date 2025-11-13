"use client";

import styles from "@/styles/modal.module.css"
import { GenericElements } from "@/types";

interface IModalProps {
  title: string;
  children: GenericElements
  onClose: () => void
}

export default function Modal({
  title,
  children,
  onClose,
}: IModalProps) {
  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
      </div >
    </div >
  );
}