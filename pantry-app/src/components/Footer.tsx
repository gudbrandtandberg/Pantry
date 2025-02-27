import { version } from '../version';

export default function Footer() {
    return (
        <footer className="mt-8 text-center text-gray-500 text-sm">
            <p>Family Pantry {version.number}</p>
            <p>© {version.year} {version.company}</p>
        </footer>
    );
} 