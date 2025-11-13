import { LoginForm } from './form';
import Link from 'next/link';

export default function Page() {
  return (
    <div className='wrapper'>
      <div>
        <h1>Login</h1>
        <p>
          Enter your email below to login to your account
        </p>
      </div>
      <LoginForm />
      <div>
        Don&apos;t have an account?{' '}
        <Link href="/signup">
          Sign up
        </Link>
      </div>
    </div>
  );
}
