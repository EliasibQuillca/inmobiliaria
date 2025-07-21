import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, auth, hideNavbar = false }) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {!hideNavbar && <Navbar auth={auth} />}
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
