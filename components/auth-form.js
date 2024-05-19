'use client';

import { auth, signup } from '@/actions/authActions';
import Link from 'next/link';
import { useFormState } from 'react-dom';

export default function AuthForm({ mode }) {
  //Due to the fact the server action file where the 'auth() function is 
  //declared, we need to actually use the .bind() method on auth to affix
  //the mode prop to the auth() function
  const [formState, formAction] = useFormState(auth.bind(null, mode), {});
  return (
    <form id="auth-form" action={formAction}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {formState.errors && (
        <ul id='form-errors'>
          {Object.keys(formState.errors).map(error => {
            return (
              <li key={error}>{formState.errors[error]}</li>
            )}
          )}
        </ul>
      )}
      <p>
        <button type="submit">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </p>
      <p>
        {mode === 'login' && <Link href="/?mode=signup">Create an account.</Link>}
        {mode === 'signup' && <Link href="/?mode=login">Login with existing account.</Link>}
      </p>
    </form>
  );
}
