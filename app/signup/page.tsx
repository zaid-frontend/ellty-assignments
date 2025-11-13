import Link from 'next/link';
import { SignupForm } from '@/app/signup/form';

export default function Page() {
  return (
    <div className='wrapper'>
      <div>
        <h1>Create an account</h1>
        <p>Enter your information to get started</p>
      </div>
      <SignupForm />
      <div>
        Already have an account?{' '}
        <Link href="/login">
          Login
        </Link>
      </div>
    </div>
  );
}
