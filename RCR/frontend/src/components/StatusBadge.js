import React from 'react';
import { Badge } from './ui/Badge';

function StatusBadge({ status }) {
    const variants = {
        OPEN: 'danger',
        IN_PROGRESS: 'amber',
        RESOLVED: 'emerald',
        CLOSED: 'neutral',
    };

    return (
        <Badge variant={variants[status] || 'neutral'}>
            {status === 'OPEN' && <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"></span>}
            {status}
        </Badge>
    );
}

export default StatusBadge;
