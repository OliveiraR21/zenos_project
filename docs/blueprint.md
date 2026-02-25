# **App Name**: Zenos Project

## Core Features:

- Project & Goal Management: Create and oversee projects, defining sponsors, global responsible, deadlines, and linking them to specific target gains (e.g., increased sales, cost reduction).
- Task & Dependency Tracking: Define tasks with titles, unique responsible persons, baseline and dynamic deadlines, actual completion dates, and manage interdependencies (e.g., Task A blocks Task B).
- Real-time Cost of Delay Calculation: Automatically calculate daily financial impact (prejuízo diário) when critical path task delays push the project's final deadline, based on the project's target gain. This calculated value will be presented within the UI.
- Executive Health Dashboard: Provide an executive overview of 'Profit Health' and 'Final Deadline', visualizing the cascade of impact from task interdependencies with a focus on actionability.
- Niko AI Assistant for Risk Insight: A generative AI tool that acts as a consultant, proactively surfacing messages and alerts only when there is a risk of delay significantly affecting the project's ROI.
- Task Quality Assurance Check: Implement a brief confirmation step before a task is finalized, to ensure quality and control before releasing dependent tasks, aligned with user hierarchy permissions.
- Secure Authentication & User Roles: Support zero-friction login via Magic Link/Email for individual users and SSO/SAML for enterprise clients, alongside a robust hierarchy for user permissions (Admin, Sponsor, Manager, Executor).

## Style Guidelines:

- Main background: Pure black (#000000) for a foundation of authority and professionalism, providing high contrast for content. Text primary color: Pure white (#FFFFFF).
- Secondary UI backgrounds (e.g., content cards, side panels): A very dark, subtle cool gray-blue (#161A1D) derived from HSL(210, 15%, 10%) for a modern, textured layer upon the pure black base.
- Primary accent for interactive elements (e.g., active states, main CTAs that aren't 'Volt' elements, important headings): A strong yet refined blue (#2A89D4) derived from HSL(210, 70%, 55%), symbolizing trust and clarity against dark backgrounds.
- Secondary accent for data visualization, highlights, and complementary actions: A vibrant but sophisticated lavender (#8585EB) derived from HSL(240, 70%, 70%), offering a clear visual contrast to the primary blue without being overwhelming.
- Volt Color (Action/Insight): As per user request, a striking neon green/yellow (#CCFF00) to be used exclusively and sparingly for critical calls to action, profit indicators, real risk alerts, and insights from the Niko AI assistant.
- Secondary Information ('Ruído'): Various tones of gray to subtly present non-critical information that does not demand immediate user action, maintaining visual hierarchy as requested by the user.
- Headline font: 'Space Grotesk' (sans-serif), for a modern, technical, and authoritative feel, used for primary headings and prominent display text.
- Body font: 'Inter' (sans-serif), for its clear, neutral, and highly readable qualities, suitable for all body text, task descriptions, and dashboard content, pairing seamlessly with 'Space Grotesk'.
- Highly minimalist and functional icons. Avoid all unnecessary visual embellishments, ensuring each icon serves a direct purpose for clarity or profit, consistent with the 'Sofisticação da Simplicidade' philosophy. Colors for icons should be white/gray, reserving the 'Volt' neon for critical status indicators or interactive elements.
- Employ generous whitespace throughout the interface to prevent visual clutter and reduce cognitive load. Strategic spacing will guide user focus, embodying the principle 'a tecnologia que não aparece'.
- Implement subtle, swift, and purpose-driven animations. Prioritize instant loading and smooth transitions to create a responsive and efficient user experience, avoiding any animation that does not directly contribute to clarity or actionability.