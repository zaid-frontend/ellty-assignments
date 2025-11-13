'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { login } from '@/app/action/01-auth';
import { Box } from '@/components/Elements/Box';
import { Button } from '@/components/Elements/Button';
import { Input } from '@/components/Elements/Input';

type ErrorsType = Record<string, string[] | undefined>;

export function LoginForm() {
  const [state, action] = useFormState(login, undefined);
  const [errors, setErrors] = useState<ErrorsType | undefined>();

  if (state?.errors) setErrors(state.errors);

  const clearError = (field: keyof ErrorsType) => {
    setErrors((prev) => prev ? { ...prev, [field]: undefined } : undefined);
  };

  const fields = [
    { id: 'email', label: 'Email', placeholder: 'julia@ellty.com', type: 'email' },
    { id: 'password', label: 'Password', placeholder: 'Enter password', type: 'password' },
  ] as const;

  return (
    <Box maxWidth={400}>
      <form style={{ padding: 10 }} action={action}>
        {fields.map(({ id, ...props }) => (
          <Input
            key={id}
            id={id}
            name={id}
            error={errors?.[id]}
            onChange={() => clearError(id as keyof ErrorsType)}
            {...props}
          />
        ))}
        {state?.message && <p className="text-error">{state.message}</p>}
        <LoginButton />
      </form>
    </Box>
  );
}

export function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="mt-4 w-full"
      aria-disabled={pending}
    >
      {pending ? 'Logging...' : 'Log In'}
    </Button>
  );
}