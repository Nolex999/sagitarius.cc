import LoginForm from '@/components/auth/LoginForm';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
      <div className="flex w-full max-w-[400px] flex-col items-center px-8 py-8">
        <div className="mb-8 text-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={150}
            height={120}
            className="mx-auto"
            priority
          />
        </div>
        <div className="mb-8 w-full text-center">
          <h1 className="font-mono text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            SAGITARIUS.CC
          </h1>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
            Authentication
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
