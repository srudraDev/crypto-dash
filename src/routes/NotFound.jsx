import '../App.css';

const NotFound = () => {
    return (
        <>
            <p>Nothing to see here!</p>
            <button id='home'>
                <Link style={{ color: "white" }} to="/">
                    Return Home
                </Link>
            </button>
        </>
    )
}

export default NotFound;