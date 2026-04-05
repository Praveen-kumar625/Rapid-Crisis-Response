import React from 'react';
import CrisisMap from '../components/CrisisMap';

function MapPage() {
    return (
        <div className="flex-1 w-full relative flex flex-col min-h-[500px] h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-hidden border-t border-white/5 shadow-inner">
            <CrisisMap />
        </div>
    );
}

export default MapPage;
