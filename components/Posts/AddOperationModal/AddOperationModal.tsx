"use client";

import styles from "@/styles/modal.module.css"

import { addOperation } from "@/app/action/post";
import { useState } from "react";
import { Button } from "../../Elements/Button";
import { Operation, TreeNodeType } from "@/types/post";
import { calculatePreview } from "@/helper/calculate-operation";
import { OPERATION_SYMBOLS } from "@/constants";
import Modal from "../../Elements/Modal";

export default function AddOperationModal({
  node,
  onClose,
}: {
  node: TreeNodeType;
  onClose: () => void;
}) {
  const [operation, setOperation] = useState<Operation>("add");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addOperation(node.id, operation, parseFloat(number));
      onClose();
    } catch (error) {
      console.log("Failed to add operation", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} title={`Add Operation to ${node.numberValue}`}>
      <form onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label>Operation</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as Operation)}
          >
            <option value="add">+ Add</option>
            <option value="subtract">- Subtract</option>
            <option value="multiply">× Multiply</option>
            <option value="divide">÷ Divide</option>
          </select>
        </div>

        <div className={styles["form-group"]}>
          <label>Number</label>
          <input
            type="number"
            step="any"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter a number"
            required
          />
        </div>

        <div className={styles["preview"]} >
          Result: {node.numberValue} {OPERATION_SYMBOLS[operation]}{" "}
          {number || "?"} ={" "}
          {number
            ? calculatePreview(node.numberValue, operation, parseFloat(number))
            : "?"}
        </div>

        <div className={styles["modal-actions"]} >
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Operation"}
          </Button>
        </div>
      </form >
    </Modal>
  );
}