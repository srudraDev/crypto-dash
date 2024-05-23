import '../App.css';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <>
            <p>Nothing to see here!</p>
            <Link  id="home" style={{ color: "white" }} to="/">
                Return Home
            </Link>
        </>
    )
}

export default NotFound;