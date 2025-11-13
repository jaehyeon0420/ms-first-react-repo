
import { Link } from "react-router-dom";

export default function Footer () {
    return (
        <footer className="footer">
            <div>
                <ul>
                    <li>
                        <Link to="#">모바일 App</Link>
                    </li>
                    <li>
                        <Link to="#">저작권안내</Link>
                    </li>
                    <li>
                        <Link to="#">개인정보 처리방침</Link>
                    </li>
                    <li>
                        <Link to="#">이용약관</Link>
                    </li>
                    <li>
                        <Link to="#">제휴문의</Link>
                    </li>
                    <li>
                        <Link to="#">프라이버시 센터</Link>
                    </li>
                </ul>
                <p>COPYRIGHT ⓒ Microsoft AI School - Team 3. ALL RIGHTS RESERVED.</p>
                <p>고객센터 : 010 - 9431 - 9315 (배재현)</p>
            </div>
        </footer>
    );
}