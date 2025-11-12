"use client";

import { useState } from "react";
import { Button } from "@/components/Elements/Button"
import { CheckBox } from "@/components/Elements/Checkbox";
import styles from "@/components/LandingPage/landing-page.module.css";
import { Separator } from "@/components/Elements/Separator";

const checkboxOptions = [
  { label: "Page 1", checked: false },
  { label: "Page 2", checked: false },
  { label: "Page 3", checked: false },
  { label: "Page 4", checked: false },
  { label: "Page 5", checked: false },
  { label: "Page 6", checked: false },
]

const LandingPage = () => {
  const [pages, setPages] = useState(checkboxOptions);

  const [allChecked, setAllChecked] = useState(false);
  const [message, setMessage] = useState("");

  const handleAllPagesToggle = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    setPages(pages.map((page) => ({ ...page, checked: newCheckedState })));
    setMessage("");
  };

  const handlePageToggle = (label: string) => {
    const updatedPages = pages.map((page) =>
      page.label === label ? { ...page, checked: !page.checked } : page
    );
    setPages(updatedPages);
    setAllChecked(updatedPages.every((page) => page.checked));
    setMessage("");
  };

  const handleDone = () => {
    const selectedPages = pages.filter((page) => page.checked);

    if (selectedPages.length === 0) {
      setMessage("Please selecte a page!");
    } else if (selectedPages.length === pages.length) {
      setMessage(`All ${pages.length} pages selected!`);
    } else {
      setMessage(
        `${selectedPages.length} page${selectedPages.length > 1 ? "s" : ""} selected: ${selectedPages.map((p) => p.label).join(", ")}`
      );
    }

    setTimeout(() => {
      setMessage("")
    }, 3000)
  };

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["box"]}>
        <div className={styles["box-title"]}>
          <CheckBox
            id="page-all"
            label="All pages"
            checked={allChecked}
            setChecked={handleAllPagesToggle}
          />
        </div>

        <Separator />

        <div className={styles["checkboxes-container"]}>
          {pages.map((page, i) => (
            <CheckBox
              key={`page_${i}`}
              id={`page_${i}`}
              label={page.label}
              checked={page.checked}
              setChecked={() => handlePageToggle(page.label)}
            />
          ))}
        </div>

        <Separator />

        <Button className={styles["box-button"]} onClick={handleDone}>
          Done
        </Button>

        {message && (
          <div
            className={`${styles["toast-message"]} ${message.startsWith("Please") && styles["error"]}`}
          >
            {message}
          </div>
        )}

      </div>

    </div>
  );
};

export default LandingPage;