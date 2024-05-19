import '../globals.css';

export const metadata = {
  title: 'Next Auth',
  description: 'Next.js Authentication',
};

export default function AuthRootLayout({ children }) {
  return (
    <html lang="en">
      <header id='auth-header'>
        <p>Welcome Back!</p>
        <form action="">
          <button type="button">Log Out</button>
        </form>
      </header>
      <body>{children}</body>
    </html>
  );
}