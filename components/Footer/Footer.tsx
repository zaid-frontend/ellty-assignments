import styles from "@/styles/footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>

        <div className={styles.email}>
          <a
            href="mailto:muhammadzaid.dev@gmail.com"
            title="Send email"
          >
            muhammadzaid.dev@gmail.com
          </a>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.bottomSection}>
          <div className={styles.createdBy}>
            <p>
              Powered by <strong>Muhammad Zaid</strong>
            </p>
          </div>
          <div className={styles.copyright}>
            <p>
              © {currentYear} Ellty Assignment. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}