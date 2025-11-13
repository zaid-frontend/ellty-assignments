"use client";

import styles from "@/styles/post-Tree.module.css"

import { IPost, TreeNodeType } from "@/types/post";
import { useState } from "react";
import TreeNode from "../PostTreeNode/PostTreeNode";
import AddOperationModal from "../AddOperationModal/AddOperationModal";
import { buildTree } from "@/helper/post";

export default function TreeView({
  posts,
  isAuthenticated,
  currentUserId,
}: {
  posts: IPost[];
  isAuthenticated: boolean;
  currentUserId?: number | null;
}) {
  const [selectedNode, setSelectedNode] = useState<TreeNodeType | null>(null);

  const tree = buildTree(posts);

  return (
    <>
      <div className={styles["tree-container"]}>
        {tree.length === 0 ? (
          <div className={styles["empty-state"]}>
            <p>No posts yet. Create a starting number to begin!</p>
          </div>
        ) : (
          tree.map((root) => (
            <TreeNode
              key={root.id}
              node={root}
              isAuthenticated={isAuthenticated}
              currentUserId={currentUserId}
              onAddOperation={(node) => setSelectedNode(node)}
              isReply={false}
            />
          ))
        )}
      </div>

      {selectedNode && (
        <AddOperationModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </>
  );
}

