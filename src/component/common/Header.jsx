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
                    <Link to="/mycar/info">Snap</Link>
                    :
                    <Link to="/">Snap</Link>
                    }
                    <img src='/logo.png' alt="로고이미지" style={{width:50}}></img>
                </div>
            </div>
        </header>
    );
}
