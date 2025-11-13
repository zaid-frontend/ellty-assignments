import { IPost, TreeNodeType } from "@/types/post";

// Build tree structure from flat posts array
export const buildTree = (posts: IPost[]): TreeNodeType[] => {
  const postMap = new Map<number, TreeNodeType>();
  const roots: TreeNodeType[] = [];

  // Initialize all posts with empty children array
  posts.forEach((post) => {
    postMap.set(post.id, { ...post, children: [] });
  });

  // Build tree structure
  posts.forEach((post) => {
    const node = postMap.get(post.id)!;
    if (post.parentId === null) {
      roots.push(node);
    } else {
      const parent = postMap.get(post.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return roots;
};
