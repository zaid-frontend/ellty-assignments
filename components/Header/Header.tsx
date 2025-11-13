import styles from "@/styles/header.module.css";
import Link from "next/link";
import { getCurrentUser } from "@/app/action/user";
import { logout } from "@/app/action/01-auth";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className={styles.header}>
      <div className={styles.container}>

        <Link href="/" className={styles.brand}>
          <span className={styles.logo}>Ellty Assignment (Muhammad Zaid)</span>
        </Link>

        <div className={styles.rightSection}>
          {user ? (
            <button onClick={logout} type="submit" className={styles.logoutButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginButton}>
                Log In
              </Link>
              <Link href="/signup" className={styles.signupButton}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}