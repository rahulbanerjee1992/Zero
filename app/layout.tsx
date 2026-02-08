import { PathFinderProvider } from '@/context/PathFinderContext';
import './globals.css';

export const metadata = {
    title: 'Zero - Career PathFinder',
    description: 'Discover your career journey',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <div className="noise-overlay" />
                <PathFinderProvider>
                    {children}
                </PathFinderProvider>
            </body>
        </html>
    );
}
