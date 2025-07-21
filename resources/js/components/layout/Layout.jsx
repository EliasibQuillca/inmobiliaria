import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, auth }) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar auth={auth} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
