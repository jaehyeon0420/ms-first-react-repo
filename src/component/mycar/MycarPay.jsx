
import Swal from "sweetalert2";                 //sweetalert
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore"; //Store import
import createInstance from "../../axios/Interceptor";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function MycarPay(){
    const serverUrl = import.meta.env.VITE_SPRING_CONTAINER_SERVER;
    const axiosInstance = createInstance();
    const {loginMember} = useUserStore();
    const [carList, setCarList] = useState([]);     //차량 리스트

    const [selectedCar, setSelectedCar] = useState('');                     //선택된 차량
    const [brokenFileList, setBrokenFileList] = useState([]);               //파손 이미지 파일 객체 리스트
    const [brokenFileThumbList, setBrokenFileThumbList] = useState([]);     //파손 이미지 파일 썸네일 리스트(화면 표시용)
    const [brokenFileNameList, setBrokenFileNameList] = useState([]);       //파손 이미지 이름 리스트(화면 표시용)

    //내 차량 리스트 조회
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/mycar/all?memberId=" + loginMember.memberId;
        options.method = 'get'; //조회 == GET
        
        axiosInstance(options)
        .then(function(res){
            setCarList(res.data.resData);
        })
        .catch(function(error){
            console.log(error);
        });
        
    },[]);

    function handleChange(e){
        setSelectedCar(e.target.value);
    }

    //파일 객체 연결
    const brokenFileEl = useRef(null); 

    //파손 이미지 파일 선택 시
    function chgBrokenFileList(e){
        const files = e.target.files;
        const fileArr = new Array();
        const thumbArr = new Array();
        const fileNameArr = new Array();

        if(files.length != 0 && files[0] != null){
            //파손 이미지들
            for(let i=0; i<files.length; i++){
                fileArr.push(files[i]);
                fileNameArr.push(files[i].name);

                //화면에 파손 이미지들 보여주기
                const reader = new FileReader();
                reader.readAsDataURL(files[i]);
                reader.onloadend = function(){
                    thumbArr.push(reader.result);
                    setBrokenFileThumbList([...thumbArr]);
                }
            }
            

            //서버에 전송할 파일 리스트에 추가
            setBrokenFileList([...fileArr]);
            setBrokenFileNameList([...fileNameArr]);
        }else{
            //업로드 팝업에서 취소 버튼 클릭 시, 파일들 제거
            setBrokenFileList([]);
            setBrokenFileNameList([]);
        }
    }

    //차량 선택 및 파손 이미지 엄로드 검증
    function validateReq(){
        if(selectedCar == ''){
             Swal.fire({
                title: "알림",
                text : "견적을 요청할 차량을 선택하세요.",
                icon : "warning",
                confirmButtonText: "확인",
            });

            return;
        }
        if(brokenFileList.length == 0){
             Swal.fire({
                title: "알림",
                text : "파손 이미지를 업로드 하세요.",
                icon : "warning",
                confirmButtonText: "확인",
            });

            return;
        }

        return true;
    }

    //견적 요청
    const [loading, setLoading] = useState(false); //서버 요청중 상태값(false : 요청 전/요청 완료, true : 요청 중)에 따라, 로딩 모달 표시용
    function reqEstimate(){
        if(!validateReq()){
            return;
        }

        //견적 요청 중 상태로 변경
        setLoading(true);

        let formData = new FormData();

        //차량 ID
        formData.append("carId", selectedCar);

        //파손 이미지 파일들
        for(let i=0; i<brokenFileList.length; i++){
            formData.append("brokenFiles", brokenFileList[i]);
        }   

        let options = {};
        options.url = serverUrl + "/mycar";
        options.method = 'post'; 
        options.data = formData;
        options.headers = {};
        options.headers.contentType = "multipart/form-data";
        options.headers.processData = false; //전송 데이터 쿼리 스트링 변환 여부(기본값 true). 폼 데이터 전송 시 false
        
        axiosInstance(options)
        .then(function(res){
            //견적비 화면에 보여주기
        })
        .catch(function(error){
        })
        .finally(function(){
            //견적 요청 중 상태 해제
            setLoading(false);
        });
    }

    return(
        <>  <section className="section section-info">
                <div className="page-title">수리비 견적 받기</div>
                <div style={{width : "60%", margin : "0 auto"}}>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">차량선택</InputLabel>
                        {/* Select : select, MenuItem : option 역할. 나머지 감싸는 태그들은 디자인 역할이므로 선택 사항 */}
                        <Select labelId="demo-simple-select-label" 
                                id="demo-simple-select"
                                label="Grade"
                                value={selectedCar}
                                onChange={handleChange}>
                                    {carList ? carList.map(function(car, idx){
                                        return (
                                            <MenuItem key={"car"+idx} value={car.carId}>
                                                {car.carAlias} [{car.carNo}]
                                            </MenuItem>
                                        )
                                    }) : null}
                        </Select>
                    </FormControl>
                </Box>
                </div>
                <ul className="posting-wrap" style={{textAlign:'center'}}>
                    {brokenFileThumbList.length > 0 
                        ?  brokenFileThumbList.map(function(thumb, idx){
                            return  <li key={"thumb"+idx} className="posting-item" style={{textAlign : 'center'}}>
                                        <div className="posting-img">
                                            <img key={"thumb"+idx} src={thumb} style={{marginRight:"10px", cursor:"pointer", width : '200px'}} onClick={function(e){
                                                brokenFileEl.current.click(); //아래 input type=file 클릭
                                            }
                                            }/>
                                            
                                        </div>
                                        <div className="posting-info">
                                            <div className="posting-title">{brokenFileNameList[idx]}</div>
                                        </div>
                                    </li>
                        })
                        : <img src="/images/default_img.png" className="pay-img" onClick={function(e){
                            brokenFileEl.current.click(); //아래 input type=file 클릭
                        }}/>
                    } 
                </ul>
                <div style={{width : "60%", margin : "0 auto"}}>
                </div>
                <input type="file" accept="image/*" style={{display:"none"}} ref={brokenFileEl} onChange={chgBrokenFileList} multiple/>
                <div className="button-zone">
                    <button type="button" className="btn-primary lg" onClick={reqEstimate}>
                        견적 요청
                    </button>
                </div>

                {/* 로딩 중일 때 모달 표시 */}
                {loading && <LoadingModal />}
            </section>
        </>
    );
}

/* --- 로딩 모달 컴포넌트 --- */
function LoadingModal() {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-text">수리비 견적 계산 중...</p>
      </div>
    </div>
  );
}