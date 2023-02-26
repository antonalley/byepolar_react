import Navbar from '../components/navbar';

const NotFound = () => {
    return ( 
        <div className="not-found">
            <Navbar></Navbar>
            <h1>Page Not Found</h1>
            <a href="/">
                Return to Homepage
            </a>
        </div>
     );
}
 
export default NotFound;