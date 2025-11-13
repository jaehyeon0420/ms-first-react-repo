
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore"; //Store import
import PageNavi from "../common/PageNavi";

export default function MycarInfo(){
    const serverUrl = import.meta.env.VITE_SPRING_CONTAINER_SERVER;
    const axiosInstance = createInstance();

    const [carList, setCarList] = useState([]);     //차량 리스트
    const [reqPage, setReqPage] = useState(1);      //요청 페이지
    const [pageInfo, setPageInfo] = useState({});   //페이지 네비게이션
    const {isLogined, loginMember} = useUserStore();             //로그인 여부(작성하기 버튼 표출 여부용)

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/mycar?reqPage=" + reqPage + '&memberId=' + loginMember.memberId;
        options.method = 'get'; //조회 == GET
        
        axiosInstance(options)
        .then(function(res){
            setCarList(res.data.resData.carList);
            setPageInfo(res.data.resData.pageInfo);
        })
        .catch(function(error){
            console.log(error);
        });

        
    },[reqPage]); //reqPage 변경 시, useEffect 함수 재호출



    
    return(
        <> 
            <section className="section section-info">
                <div className="page-title">내 차 정보</div>
                <div className="board-list-wrap">
                    <ul className="posting-wrap">
                        {carList.map(function(car, idx){
                            return (
                                <Car key={"car"+idx} car={car} serverUrl={serverUrl}/>
                            )
                        })}
                    </ul>
                </div>
                <div className="board-paging-wrap">
                    {/* 페이지 네비게이션 컴포넌트 별도 분리하여, 필요 시 재사용 */}
                    {/* 페이지 네비게이션 제작 후, 페이지 번호 클릭 시 reqPage가 변경되어 요청해야 함 */}
                    <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
                </div>
            </section>
        </>
    );
}


function Car(props) {
    const car = props.car;
    const serverUrl = props.serverUrl;
    const navigate = useNavigate();

    return (
        <li className="posting-item" onClick={function(){
            //URL과 매핑되어 있는 컴포넌트로 이동하며, 차량ID 전달.
            //navigate('/car/view/'+car.carId);
        }}>
            <div className="posting-img">
                <img src={car.carFilePath 
                    ? serverUrl+ "/car/" + car.carFilePath.substring(0, 8) + "/" + car.carFilePath
                    : "/images/default_img.png"} />
            </div>
            <div className="posting-info">
                <div className="posting-title">{car.carNo}</div>
                <div className="posting-sub-info">
                    <span>{car.carKind}</span> 
                    <span>{car.carAlias}</span>
                </div>
            </div>
        </li>
    );
}