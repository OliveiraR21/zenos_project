'use client';
import { usePathname } from 'next/navigation';

export function OnboardingProgress() {
  const pathname = usePathname();

  const getProgress = () => {
    if (pathname.includes('/task')) return 100;
    if (pathname.includes('/roles')) return 75;
    if (pathname.includes('/project')) return 50;
    // Default for the first step at /onboarding
    return 25;
  };

  return <div className="absolute top-0 left-0 h-1 bg-volt transition-all duration-500" style={{ width: `${getProgress()}%` }} />;
}
