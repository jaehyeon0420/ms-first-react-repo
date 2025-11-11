
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore"; //Store import
import Swal from "sweetalert2"; 

export default function MemberInfo(){
    const serverUrl = 'http://localhost:9999';
    const axiosInstance = createInstance();
    const {loginMember, setLoginMember, setIsLogined, setAccessToken, setRefreshToken} = useUserStore();


    useEffect(function(){
        

    }, []);

    
    return(
        <> 
            <section className="section section-info">
                <div className="page-title">내 차 정보</div>
                <form onSubmit={function(e){
                    e.preventDefault();

                }}>
                </form>
            </section>
        </>
    );
}