'use client';

import React, { useRef, useState } from 'react';
import { deleteAvatar, uploadAvatar } from '@/app/action/avatar';
import styles from '@/styles/avatar.module.css';
import { Avatar } from '../Avatar/Avatar';

export function AvatarUpload({
  currentAvatar,
  userName,
  userEmail
}: {
  currentAvatar?: string | null;
  userName: string;
  userEmail: string;
}) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [upLoading, setUpLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: 'File too large. Maximum size is 5MB.' });
      return;
    }

    // Show preview while uploading
    const reader = new FileReader();
    reader.onloadend = async () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Auto-upload immediately
    setUpLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const result = await uploadAvatar({}, formData);

      if (result.success) {
        setMessage({ type: 'success', text: 'Avatar uploaded successfully!' });
        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to upload avatar' });
        // Revert preview on error
        setPreview(currentAvatar || null);
      }
    } catch (error) {
      console.log('Failed to delete avatar', error)
      setMessage({ type: 'error', text: 'Failed to upload avatar. Please try again.' });
      setPreview(currentAvatar || null);
    } finally {
      setUpLoading(false);
    }
  };

  const handleDeleteClick = async () => {

    setDeleting(true);
    setMessage(null);

    try {
      const result = await deleteAvatar();

      if (result.success) {
        setPreview(null);
        setMessage({ type: 'success', text: 'Avatar deleted successfully!' });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to delete avatar' });
      }
    } catch (error) {
      console.log('Failed to delete avatar', error)
      setMessage({ type: 'error', text: 'Failed to delete avatar. Please try again.' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.container}>

      <div className={styles.avatarWrapper}>
        <div className={styles['userInfoContainer']}>
          <div className={styles.avatarContainer}>
            <Avatar src={preview} alt={userName} />
            {upLoading && <div className={styles.uploadingOverlay}>Uploading...</div>}
            {deleting && <div className={styles.uploadingOverlay}>Deleting...</div>}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.username}>
              {userName}
            </span>
            <span className={styles.email}>{userEmail}</span>
          </div>
        </div>
        {/* Edit/Delete Icon Button - Bottom Right */}
        <div className={styles.iconButtonWrapper}>
          {preview ? (
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={upLoading || deleting}
              className={styles.iconButton}
              title="Delete avatar"
              aria-label="Delete avatar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          ) : (
            <label htmlFor="avatar-upload" className={styles.iconButton} title="Upload avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </label>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        id="avatar-upload"
        name="avatar"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className={styles.fileInput}
        disabled={upLoading || deleting}
      />

      {message && (
        <p className={message.type === 'success' ? styles.success : styles.error}>
          {message.text}
        </p>
      )}

    </div>
  );
}