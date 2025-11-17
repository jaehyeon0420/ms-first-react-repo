
import axios from "axios";
import { useEffect, useState } from "react";
import {Link, Route, Routes, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore"; //Store import
import LeftMenu from "../common/LeftMenu";
import MycarInfo from "./MycarInfo";
import MycarPay from "./MycarPay";
import MycarHistory from "./MycarHistory";
import "./mycar.css";
import Swal from "sweetalert2";                 //sweetalert

export default function MycarMain() {
    //스토리지 저장 정보
    const {isLogined, setIsLogined, loginMember, setAccessToken, setRefreshToken} = useUserStore();
    const navigate = useNavigate();
    
    //로그아웃 클릭 시, 동작 함수
    function logout(e){
        e.preventDefault(); //작성하지 않으면 a 태그 기본 이벤트 동작으로, 아래 navigate 동작하지 않음.
        
        /* 
        기존 스토어에 setIsLogined에서 전달값이 false면 loginMember를 null로 만들었음.
        마이페이지(MemberMain.js) 작업 이후, 로그아웃하면 오류 발생함.
        아래 setter로 loginMember를 null로 상태 변경 시, 
        해당 state를 가지고 있는 MemberMain이 리랜더링 되어서..
        로그인에 대한 isLogined만 변경 후, 로그인 컴포넌트에서 처리
        */
       
        setIsLogined(false);
        setAccessToken(null);
        setRefreshToken(null);
        delete axios.defaults.headers.common["Authorization"];

        navigate("/login");
    }
    
    //화면 좌측에 보여질 메뉴 리스트
    const [menuList, setMenuList] = useState([
        {url : "/mycar/info" , text : "🚗 ssssssssssssssssssssssssssssssssssss"},
        {url : "/mycar/pay", text : "🔧 수리비 견적 받기"},
        {url : "/mycar/history", text : "📜 견적 이력 보기"}
    ]);

    useEffect(function(){
        if(!isLogined){
            Swal.fire({
                title: "알림",
                text : "로그인이 필요한 서비스입니다.",
                icon : "warning",
                confirmButtonText: "확인",
            });

            navigate('/login');
        }
        navigate('/mycar/info');
    },[]);

    //로그인 안 된 경우, JSX 그리지 않음
    if(!isLogined){
        navigate('/login');
        return null;
    }



    return(
        <div className="mycar-wrap">
            <div className="mycar-side">
                <section className="section account-box">
                    <div className="account-info">
                        <span className="material-icons">account_circle</span>
                        <span className="user-info"><span style={{fontWeight : 'bold', color: 'var(--main2)'}}>"{loginMember.memberName}"</span>님, 환영합니다!</span>
                        <Link className="logout" to="#" onClick={logout}>로그아웃</Link>
                    </div>
                </section>
                <section className="section left-menu">
                    <LeftMenu menuList={menuList} />
                </section>
            </div>
            <div className="mycar-content">
                <Routes>
                    <Route path='info' element={<MycarInfo />} />
                    <Route path='pay' element={<MycarPay />} />
                    <Route path='history' element={<MycarHistory />} />
                </Routes>
            </div>
        </div>
    );
}