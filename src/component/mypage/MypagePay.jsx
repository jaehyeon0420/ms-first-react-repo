
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useUserStore from "../../store/useUserStore"; //Store import
import createInstance from "../../axios/Interceptor";
import Swal from "sweetalert2"; 


export default function MemberPwChg(){
    const serverUrl = 'http://localhost:9999';
    const axiosInstance = createInstance();

    return(
        <>  <section className="section section-info">
                <div className="page-title">수리비 견적 받기</div>
                <div style={{width : "60%", margin : "0 auto"}}>
                    
                </div>
            </section>
        </>
    );
}