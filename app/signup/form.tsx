'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { signup } from '@/app/action/01-auth';
import { Box } from '@/components/Elements/Box';
import { Button } from '@/components/Elements/Button';
import { Input } from '@/components/Elements/Input';

type ErrorsType = Record<string, string[] | undefined>;

export function SignupForm() {
  const [state, action] = useFormState(signup, undefined);
  const [errors, setErrors] = useState<ErrorsType | undefined>();

  // useEffect(() => {
  if (state?.errors) setErrors(state?.errors);
  // }, [state?.errors]);

  const clearError = (field: keyof ErrorsType) => {
    setErrors((prev) => prev ? { ...prev, [field]: undefined } : undefined);
  };

  const fields = [
    { id: 'name', label: 'Name', placeholder: 'John Doe' },
    { id: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
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
            required
            {...props}
          />
        ))}
        {state?.message && <p className="text-error">{state.message}</p>}
        <SignupButton />
      </form>
    </Box>
  );
}

export function SignupButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? 'Submitting...' : 'Sign Up'}
    </Button>
  );
}