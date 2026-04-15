'use client';

import { ReactNode } from 'react';

type EmptySalesProps = {
    /** Page context, tweaks copy/CTAs */
    /** Big headline */
    title?: string;
    /** Subheadline */
    subtitle?: string;
    /** Show the three small “what to do next” cards */
    showTips?: boolean;
    /** Optional extra actions (e.g., “Turn on notifications”) */
    extraActions?: ReactNode;
    /** Optional footer below CTAs */
    footer?: ReactNode;
    /** Optional className overrides */
    className?: string;
};

export default function EmptySales({
    title = "No sales yet",
    subtitle = "We’re building a free, open directory of estate sales. Check back soon — or help seed the map by inviting local operators.",
    showTips = true,
    extraActions,
    footer,
    className = '',
}: EmptySalesProps) {
    return (
        <div className={`max-w-4xl mx-auto text-center ${className}`}>
            {/* Illustration */}
            <div className="mb-8">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-zinc-800 bg-zinc-950/40 flex items-center justify-center mx-auto mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                        <span className="text-accent font-bold">+</span>
                    </div>
                </div>
            </div>

            {/* Copy */}
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3">
                {title}
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
                {subtitle}
            </p>

            {/* Next steps tips (optional) */}
            {showTips && (
                <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
                    <TipCard
                        icon={<span className="text-accent font-bold">+</span>}
                        title="Invite operators"
                        body="Know a local sale company? Send them the link to post."
                        tone={'accent'}
                    />
                    <TipCard
                        icon={<span className="text-accent font-bold">◎</span>}
                        title="Get Notified"
                        body="Turn on alerts for your city and distance."
                        tone="neutral"
                    />
                    <TipCard
                        icon={<span className="text-accent font-bold">↗</span>}
                        title="Spread the Word"
                        body="Star the repo and share the project."
                        tone="neutral"
                    />
                </div>
            )}

            {/* Primary + extra actions */}
            <div className="space-y-4">
                {/* Optional secondary/extra actions */}
                {extraActions}

                {/* Optional small footer */}
                {footer ?? (
                    <div className="text-xs sm:text-sm text-zinc-500">
                        Open source. Community built. AGPL-3.0.
                    </div>
                )}
            </div>
        </div>
    );
}

function TipCard({
    icon,
    title,
    body,
    tone = 'neutral',
}: {
    icon: ReactNode;
    title: string;
    body: string;
    tone?: 'neutral' | 'accent';
}) {
    const toneClasses: Record<string, string> = {
        neutral: 'bg-zinc-900/70 border border-zinc-800 text-zinc-200',
        accent: 'bg-accent/15 border border-accent/30 text-accent',
    };

    return (
        <div className="rounded-xl p-5 sm:p-6 border border-zinc-800 bg-zinc-950/40">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${toneClasses[tone]} rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                {icon}
            </div>
            <h3 className="font-semibold text-zinc-100 mb-1 sm:mb-2">{title}</h3>
            <p className="text-xs sm:text-sm text-zinc-400">{body}</p>
        </div>
    );
}