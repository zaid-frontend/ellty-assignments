import { Operation } from "@/types/post";

export function calculatePreview(
  baseNumber: number,
  operation: Operation,
  operand: number
): number {
  switch (operation) {
    case "add":
      return baseNumber + operand;
    case "subtract":
      return baseNumber - operand;
    case "multiply":
      return baseNumber * operand;
    case "divide":
      return baseNumber / operand;
  }
}
