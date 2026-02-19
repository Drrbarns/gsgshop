import React from 'react';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
}

export default function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
    return (
        <div className="relative bg-gsg-purple overflow-hidden">
            {/* Background Pattern/Image */}
            <div className="absolute inset-0">
                {backgroundImage ? (
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-30" 
                        style={{ backgroundImage: `url(${backgroundImage})` }} 
                    />
                ) : (
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-gsg-purple/90 to-gsg-purple"></div>
            </div>

            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-white/10 to-transparent rounded-bl-[100px] -z-0"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-black/10 to-transparent rounded-tr-[100px] -z-0"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center z-10">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-100">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
