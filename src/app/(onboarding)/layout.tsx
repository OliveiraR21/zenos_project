import type { Metadata } from 'next';
import '../globals.css';
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
  // Este layout é aninhado dentro do layout raiz, que já fornece <html>, <body>,
  // o provedor Firebase e o Toaster. Aqui, apenas fornecemos a UI exclusiva para esta seção.
  return (
    <div className="bg-white text-black">
      <div className="relative min-h-screen flex flex-col">
        <OnboardingProgress />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-full max-w-lg mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
