import Navbar from "./components/Navbar";

function Layout({ children }) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Navbar />
            <main style={{
                flexGrow: 1
            }}>
                {children}
            </main>
        </div>
    );
}

export default Layout;