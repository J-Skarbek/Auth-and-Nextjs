import AuthForm from '@/components/auth-form';

export default async function Home({ searchParams }) {
  // searchParams prop is a special prop on all page files in next.js - with one key/value for each
  //url param

  const formMode = searchParams.mode || 'login';
  return <AuthForm mode={formMode}/>;
}
