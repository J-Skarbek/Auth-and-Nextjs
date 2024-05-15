'use server';

import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signup(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  //store the retrieved values in the db (create a new db)

  let errors = {};

  if (!email.includes('@')) {
    errors.email = 'Please enter a valid email address.'
  }

  if (password.trim().length < 8) {
    errors.password = 'Password must be at least eight characters long.'
  }

  if (Object.keys(errors).length > 0) {
    return {
      // errors: errors --> can shorten this because key/value pair are the same
      errors,
    }
  }

  const hashedPassword = hashUserPassword(password);

  try {
    createUser(email, hashedPassword);
  } catch(error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        errors: {
          email: 'It seems like an account for the chosen email already exists.'
        }
      }
    }
    throw error;
  }

  redirect('/training');
}