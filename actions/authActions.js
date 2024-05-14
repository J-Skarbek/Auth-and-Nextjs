'use server';

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

}