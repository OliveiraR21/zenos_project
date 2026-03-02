'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type OnboardingData = {
    companyName: string;
    logoUrl: string;
    primaryColor: string;
    projectObjective: string;
    projectGainValue: number;
    projectGainDeadline: Date | undefined;
    sponsorEmail: string;
    managerEmail: string;
    taskName: string;
    taskResponsibleEmail: string;
    taskDeadline: Date | undefined;
};

type OnboardingContextType = {
    onboardingData: Partial<OnboardingData>;
    updateOnboardingData: (data: Partial<OnboardingData>) => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});

    const updateOnboardingData = (data: Partial<OnboardingData>) => {
        setOnboardingData(prev => ({ ...prev, ...data }));
    };

    return (
        <OnboardingContext.Provider value={{ onboardingData, updateOnboardingData }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
