import { Link } from "react-router-dom";
import useUserStore from "../../store/useUserStore"; //Store import

export default function Header () {
    const {isLogined} = useUserStore(); 

    return (
        <header className="header">
            <div>
                <div className="logo">
                    {isLogined 
                    ?
                    <Link to="/mycar/info">Snap Q</Link>
                    :
                    <Link to="/">Snap Q</Link>
                    }
                </div>
            </div>
        </header>
    );
}
