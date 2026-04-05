import React from 'react';
import CrisisMap from '../components/CrisisMap';

function MapPage() {
    return (
        <div className="flex-1 w-full relative flex flex-col h-[calc(100dvh-80px)] overflow-hidden border-t border-white/5 shadow-inner">
            <CrisisMap />
        </div>
    );
}

export default MapPage;
