import '../styles/globals.css';
import NavBar from '../component/NavBar';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <NavBar />
            <Component {...pageProps} />
        </>
    );
}
export default MyApp;
