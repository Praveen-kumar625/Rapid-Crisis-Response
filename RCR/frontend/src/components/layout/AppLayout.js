import React from 'react';
import { Navbar } from './Navbar';

export const AppLayout = ({ children, user, login }) => {
    return (
        <div className="min-h-screen flex flex-col bg-navy-950">
            {/* ATMOSPHERIC BACKGROUND */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-electric/5 rounded-full blur-[140px] animate-slow-drift"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-danger/5 rounded-full blur-[140px] animate-slow-drift" style={{ animationDirection: 'reverse', animationDuration: '25s' }}></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTU5LjUgMEw1OS41IDYwTTAgNTkuNUw2MCA1OS41IiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] opacity-40"></div>
            </div>

            <Navbar user={user} login={login} />
            
            <main className="flex-1 flex flex-col relative z-10">
                {children}
            </main>
        </div>
    );
};
