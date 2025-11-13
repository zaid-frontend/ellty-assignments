"use client";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "@/app/action/01-auth";
import { Box } from "@/components/Elements/Box";
import { Button } from "@/components/Elements/Button";
import { Input } from "@/components/Elements/Input";

export function LoginForm() {
  const [state, action] = useFormState(login, undefined);

  return (
    <Box maxWidth={400}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h2>
      <form style={{ padding: 10 }} action={action}>
        <Input
          id="email"
          name="email"
          label="Email"
          placeholder="john@example.com"
          type="email"
          error={state?.errors?.email}
          required
        />
        <Input
          id="password"
          name="password"
          label="Password"
          placeholder="Enter password"
          type="password"
          error={state?.errors?.password}
          required
        />
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
        <LoginButton />
      </form>
    </Box>
  );
}

export function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
}