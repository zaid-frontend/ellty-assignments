export type IPost = {
  id: number;
  userId: number;
  parentId: number | null;
  numberValue: number;
  operation: string;
  rightOperand: number | null;
  createdAt: Date;
  username: string;
  avatarUrl: string;
};

export type Operation = "add" | "subtract" | "multiply" | "divide";

export type TreeNodeType = IPost & {
  children: TreeNodeType[];
};
