import { VERSION } from '../version';

export default function Footer() {
    return (
        <footer className="text-center text-gray-500 text-sm py-4 mt-8">
            <p>v{VERSION} • © {new Date().getFullYear()} Duff Development</p>
        </footer>
    );
} 