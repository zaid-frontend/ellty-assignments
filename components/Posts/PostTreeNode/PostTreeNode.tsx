"use client";

import styles from "@/styles/post-Tree.module.css";

import { TreeNodeType } from "@/types/post";
import { useState } from "react";
import Image from "next/image";

interface TreeNodeProps {
  node: TreeNodeType;
  isAuthenticated: boolean;
  currentUserId?: number | null;
  onAddOperation: (node: TreeNodeType) => void;
  isReply?: boolean;
}

export default function TreeNode({
  node,
  isAuthenticated,
  currentUserId,
  onAddOperation,
  isReply = false,
}: TreeNodeProps) {
  const [showChildren, setShowChildren] = useState(false);

  const getOperationSymbol = (operation: string): string => {
    const symbols: { [key: string]: string } = {
      add: "+",
      subtract: "-",
      multiply: "×",
      divide: "÷",
      start: "",
    };
    return symbols[operation] || operation;
  };

  const getCalculationDisplay = (): string => {
    return `${getOperationSymbol(node.operation)} ${node.rightOperand} = ${node.numberValue}`;
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasChildren = node.children && node.children.length > 0;


  return (
    <div className={`${styles.postContainer} ${isReply ? styles.replyPost : styles.mainPost}`}>
      <div className={styles.postCard}>

        <div className={styles.postContent}>
          <div className={styles.postHeader}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarContainer}>
                {node.avatarUrl ?
                  <Image
                    src={node.avatarUrl}
                    alt={node.username}
                    className={styles.avatar}
                    width={80}
                    height={80}
                  /> : <div className={styles.avatarPlaceholder}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.username}>
                  {node.username || "Anonymous"}
                </span>
                <span className={styles.timestamp}>{formatDate(node.createdAt)}</span>
              </div>
            </div>

            {/* Delete button - only show if user owns the post */}
            {/* {isAuthenticated && isOwnPost && (
              <button
                className={styles.btnDelete}
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete this post and all replies"
              >
                {isDeleting ? "..." : "×"}
              </button>
            )} */}
          </div>

          {node.operation === "start" ?
            <div className={styles.mainPostBody}>
              <div className={styles.mainCalculation}>
                The post start with the number
                <span className={styles.mainCalculationText}>
                  {node.numberValue}
                </span>
              </div>
            </div>
            :
            <div className={styles.postBody}>
              <div className={styles.calculation}>
                <span className={styles.calculationText}>
                  {getCalculationDisplay()}
                </span>
              </div>
            </div>
          }

          <div className={styles.postFooter}>
            {isAuthenticated && (
              <button
                className={styles.btnReply}
                onClick={() => onAddOperation(node)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                Reply
              </button>
            )}

            {hasChildren && (
              <button
                className={styles.btnToggleReplies}
                onClick={() => setShowChildren(!showChildren)}
              >
                {showChildren ? "▼" : "▶"} {node.children.length}{" "}
                {node.children.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>

          {hasChildren && showChildren && (
            <div className={styles.repliesContainer}>
              {node.children.map((child) => (
                <TreeNode
                  key={child.id}
                  node={child}
                  isAuthenticated={isAuthenticated}
                  currentUserId={currentUserId}
                  onAddOperation={onAddOperation}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
