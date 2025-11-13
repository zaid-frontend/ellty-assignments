"use client";
import { useFormState, useFormStatus } from "react-dom";
import { signup } from "@/app/action/01-auth";
import { Box } from "@/components/Elements/Box";
import { Button } from "@/components/Elements/Button";
import { Input } from "@/components/Elements/Input";

export function SignupForm() {
  const [state, action] = useFormState(signup, undefined);

  const fields = [
    { id: "name", label: "Name", placeholder: "John Doe", type: "string" },
    {
      id: "email",
      label: "Email",
      placeholder: "john@example.com",
      type: "email",
    },
    {
      id: "password",
      label: "Password",
      placeholder: "Enter password",
      type: "password",
    },
  ] as const;

  return (
    <Box maxWidth={400}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Sign Up</h2>
      <form style={{ padding: 10 }} action={action}>
        {fields.map(({ id, label, placeholder, type }) => (
          <Input
            key={id}
            id={id}
            name={id}
            label={label}
            placeholder={placeholder}
            type={type || "text"}
            error={state?.errors?.[id]}
            required
          />
        ))}
        {state?.message && (
          <p
            style={{
              color: "#ef4444",
              fontSize: "14px",
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            {state.message}
          </p>
        )}
        <SignupButton />
      </form>
    </Box>
  );
}

export function SignupButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? "Submitting..." : "Sign Up"}
    </Button>
  );
}