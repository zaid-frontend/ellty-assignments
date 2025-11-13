import styles from '@/styles/avatar.module.css';
import Image from 'next/image';
import { useState } from 'react';

interface IAvatarProps {
  src: string | null;
  alt: string;
  dim?: number
}

export function Avatar({ src, alt, dim = 128 }: IAvatarProps) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className={styles.avatarPlaceholder}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={styles.avatar}
      width={dim}
      height={dim}
      onError={() => setImageError(true)}
    />
  );
};
