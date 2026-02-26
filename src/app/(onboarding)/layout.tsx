import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress';

export const metadata: Metadata = {
  title: 'Onboarding - Zenos Project',
  description: 'Configuração inicial da sua conta Zenos.',
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body bg-white text-black antialiased">
        <FirebaseClientProvider>
          <div className="relative min-h-screen flex flex-col">
            <OnboardingProgress />
            <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-full max-w-lg mx-auto">
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
