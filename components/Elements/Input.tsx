import React from 'react';
import styles from '@/styles/Elements/input.module.css';


export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | string[];
  helperText?: string;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    helperText,
    id,
    name,
    required,
    className = '',
    icon,
    iconPosition = 'left',
    ...props
  }, ref) => {
    const inputId = id || name;
    const hasError = !!error;
    const errorArray = error ? (Array.isArray(error) ? error : [error]) : [];
    const hasIcon = !!icon;

    return (
      <div className={`${styles.inputWrapper} ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`${styles.inputLabel} ${required ? styles.required : ''}`}
          >
            {label}
            {required && <span className={styles.requiredAsterisk}>*</span>}
          </label>
        )}

        <div className={styles.inputContainer}>
          {hasIcon && iconPosition === 'left' && (
            <div className={`${styles.iconWrapper} ${styles.iconLeft}`}>
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            className={`${styles.input} ${hasError ? styles.error : ''} ${hasIcon && iconPosition === 'left' ? styles.inputWithIconLeft : ''
              } ${hasIcon && iconPosition === 'right' ? styles.inputWithIconRight : ''}`}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {hasIcon && iconPosition === 'right' && (
            <div className={`${styles.iconWrapper} ${styles.iconRight}`}>
              {icon}
            </div>
          )}
        </div>

        {helperText && !error && (
          <p id={`${inputId}-helper`} className={styles.helperText}>
            {helperText}
          </p>
        )}

        {hasError && (
          <div id={`${inputId}-error`} className={styles.errorContainer} role="alert">
            {errorArray.length === 1 ? (
              <p className={styles.errorText}>{errorArray[0]}</p>
            ) : (
              <div className={styles.errorList}>
                <p className={styles.errorTitle}>Please fix the following:</p>
                <ul>
                  {errorArray.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';