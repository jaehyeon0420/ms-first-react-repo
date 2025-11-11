import { Link } from "react-router-dom";

export default function Header () {
    return (
        <header className="header">
            <div>
                <div className="logo">
                    <Link to="/">Snap Q</Link>
                </div>
            </div>
        </header>
    );
}
