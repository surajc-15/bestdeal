export function Footer() {
    return (
        <footer className="border-t border-neutral-900 bg-neutral-950 py-12 text-center text-neutral-500 text-sm">
            <p>&copy; {new Date().getFullYear()} BestDeal India Pvt Ltd. All rights reserved.</p>
            <p className="text-xs mt-2 text-neutral-600">Made with ❤️ for Indian Farmers.</p>
        </footer>
    );
}
