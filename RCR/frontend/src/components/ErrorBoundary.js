import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ShieldAlert } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_error) { // 🚨 FIXED: Prefix with _
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-navy-950 p-6 text-center">
                    <Card className="max-w-md p-10 border-danger/30">
                        <ShieldAlert size={48} className="text-danger mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">System Interrupted</h2>
                        <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                            A critical runtime exception occurred in the terminal. Please attempt to re-initialize the connection.
                        </p>
                        <Button onClick={() => window.location.reload()}>
                            Re-Initialize Terminal
                        </Button>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
