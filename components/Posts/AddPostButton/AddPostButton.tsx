"use client";

import styles from "@/styles/modal.module.css"

import { createStartingNumber } from "@/app/action/post";
import { useState } from "react";
import { Button } from "../../Elements/Button";
import Modal from "../../Elements/Modal";

export default function AddPostButton() {
  const [showModal, setShowModal] = useState(false);
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createStartingNumber(parseFloat(number));
      setShowModal(false);
      setNumber("");
    } catch (error) {
      console.log("Failed to create starting number", error);
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) {
    return (
      <Button onClick={() => setShowModal(true)}>
        + Create Post
      </Button>
    );
  }

  return (
    <Modal title="Create Your Post" onClose={() => setShowModal(false)}>
      <form onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label>Starting Number</label>
          <input
            type="number"
            step="any"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter a number"
            required
            autoFocus
          />
        </div>

        <div className={styles["modal-actions"]}>
          <Button type="button" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
