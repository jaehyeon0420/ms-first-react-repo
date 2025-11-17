
import Swal from "sweetalert2";                 //sweetalert
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
    const [estimateResList, setEstimateResList] = useState([]);             //견적 결과 리스트
    const [buttonFlag, setButtonFlag] = useState(false);                    //견적 요청 후, '견적 요청' 버튼 숨기기
    const [isModalOpen, setIsModalOpen] = useState(false);                  //모달 on/off 상태 체크
    const [selectedResIdx, setSelectedResIdx] = useState(null);
  
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
            setEstimateResList(res.data.resData);
            setButtonFlag(true);
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
                        ?  estimateResList.length > 0
                                ?
                                brokenFileThumbList.map(function(thumb, idx){
                                    return  <li key={"thumb"+idx} className="posting-item" style={{textAlign : 'center'}}>
                                                <div className="posting-img">
                                                    <img key={"thumb"+idx} src={thumb} style={{marginRight:"10px", cursor:"pointer", width : '200px'}} onClick={function(e){
                                                        //brokenFileEl.current.click(); //결과 나오면 재업로드 불가
                                                    }
                                                    }/>
                                                    
                                                </div>
                                                <div className="posting-info">
                                                    <div className="posting-title">
                                                        {brokenFileNameList[idx]} &nbsp;
                                                        <button type="button" className="btn-primary sm" onClick={() => {setSelectedResIdx(idx); setIsModalOpen(true);}}>
                                                            결과 확인
                                                        </button>
                                                        {isModalOpen && selectedResIdx !== null && (
                                                            <EstimateResultModal
                                                                isOpen={isModalOpen}
                                                                onClose={() => setIsModalOpen(false)}
                                                                res={estimateResList[selectedResIdx]} // 선택된 객체만 보여주기
                                                            />
                                                        )}
                                                    </div>                                                       
                                                </div>
                                            </li>
                                })
                                :
                                brokenFileThumbList.map(function(thumb, idx){
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
                        : 
                        <div className="img-wrapper">
                          <h3 style={{color : 'red', marginTop : '20px'}}>※ 아래 예시 이미지와 같이, 자동차의 전체 외관이 보이도록 업로드해주시기 바랍니다.</h3>
                          <img src="/images/example.PNG" className="pay-img" onClick={function(e){
                              brokenFileEl.current.click(); //아래 input type=file 클릭
                          }}/>
                          <div class="hover-text">클릭하여 이미지 업로드!</div>
                        </div>
                    }
                </ul>
                <div style={{width : "60%", margin : "0 auto"}}>
                </div>
                <input type="file" accept="image/*" style={{display:"none"}} ref={brokenFileEl} onChange={chgBrokenFileList} multiple/>
                { //견적 요청 결과 받은 이후, '견적 요청' 버튼 숨기기
                buttonFlag
                ? null
                :
                <div className="button-zone">
                    <button type="button" className="btn-primary lg" onClick={reqEstimate}>
                        견적 요청
                    </button>
                </div>
                }

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

// 견적 결과 확인 모달
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px 30px",
    maxWidth: "90%",
    maxHeight: "90vh",
    width: "80%",
    display: "flex",
    flexDirection: "row",
    overflowY: "auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    position: "relative",
    animation: "fadeIn 0.3s ease-in-out",
    zIndex: 2000,
  },
  closeBtn: {
    position: "absolute",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    border: "none",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
    cursor: "pointer",
    zIndex: 2000,
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    transition: "all 0.25s ease",
  },
  imageContainer: {
    flex: 1,
    height: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "20px",
    overflow: "hidden",  // 부모 요소에서 overflow hidden 처리
    position: "relative",  // 이미지가 확대될 때 부모 요소가 영향을 미치지 않도록
  },
  image: {
    objectFit: "contain",
    width: "100%",
    height: "auto",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    position: "absolute", // 이미지를 부모 div와 분리
    transition: "transform 0.2s ease",
  },
  infoContainer: {
    flex: 1,
    maxHeight: "80vh",
    overflowY: "auto",
    paddingRight: "10px",
    textAlign: "left",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
    textAlign: "center",
    letterSpacing: "0.5px",
    lineHeight: "1.4",
  },
   textSection: {
    marginBottom: '20px',
  },
  text: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.8",
    marginBottom: "18px",
    wordBreak: "break-word",
    textAlign: "left",
    fontFamily: "'Noto Sans', sans-serif",
    letterSpacing: "0.25px",
  },
   textTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
  textBody: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.5',
  },
  strong: {
    fontWeight: "bold",
    color: "#3e8e41", // 강조 색상 (녹색)
  },
};

// 🔹 hover 효과 추가 (JSX 외부에서 전역 CSS로 적용)
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
  .btn-close:hover {
    background-color: #f05454 !important;
    color: white !important;
    transform: translateX(-50%) scale(1.1);
  }

  .modal-img:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(styleSheet);

function EstimateResultModal({ isOpen, onClose, res }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
        }, [isOpen]);

    if (!isOpen) return null;

    const serverUrl = import.meta.env.VITE_SPRING_CONTAINER_SERVER;
    
    // 합계 계산
    const totalMin = res.regions.reduce((sum, region) => sum + Number(region.min_cost), 0);
    const totalMax = res.regions.reduce((sum, region) => sum + Number(region.max_cost), 0);
    const totalRecommended = res.regions.reduce((sum, region) => sum + Number(region.recommended_cost), 0);

  return (
    <div style={styles.overlay}>
      <button className="btn-close" onClick={onClose} style={styles.closeBtn}>
        ✖
      </button>

      <div style={styles.modal}>
        {/* 이미지 컨테이너 */}
        <div style={styles.imageContainer}>
          <ZoomableImage
            src={`${serverUrl}/car/broken/result/${res.image_file.substring(0, res.image_file.indexOf('.'))}_image.jpg`}
            alt="견적 결과 이미지"
          />
        </div>

        {/* 상세 정보 */}
        <div style={styles.infoContainer}>
          <div style={{...styles.title, borderBottom: '2px solid #ddd', paddingBottom: '15px', marginBottom: '15px'}}>차량 파손 견적 결과</div>
          <div style={{ display: 'flex', marginBottom: '20px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>신뢰도 기준 안내&nbsp;&nbsp;:&nbsp;&nbsp;</div>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ color: 'rgb(0, 255, 0)' }}>50% 이상 : 초록</div>
                    <div style={{ color: 'rgb(255, 165, 0)' }}>40 ~ 49% : 주황</div>
                    <div style={{ color: 'rgb(255, 255, 0)' }}>30 ~ 39% : 노랑</div>
                    <div style={{ color: 'rgb(255, 0, 0)' }}>0 ~ 29% : 빨강</div>
                </div>
          </div>
          <table className="tbl">
            <thead>
                <tr>
                    <th style={{width:"10%"}}>번호</th>
                    <th style={{width:"30%"}}>분류</th>
                    <th style={{width:"15%"}}>신뢰도</th>
                    <th style={{width:"15%"}}>적정 예상 견적</th>
                    <th style={{width:"15%"}}>최소 예상 견적</th>
                    <th style={{width:"15%"}}>최대 예상 견적</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {res.regions.map(function(region, idx){
                    return  <tr>
                                <td style={{...styles.textTitle, color : region.color}}># {region.id}</td>
                                <td style={styles.textBody}>{region.type_kr} [{region.type}]</td>
                                <td style={styles.textBody}>{(region.confidence.model2_conf * 100).toFixed(1)}%</td>
                                <td style={styles.textBody}>{Number(region.recommended_cost).toLocaleString()}원</td>
                                <td style={styles.textBody}>{Number(region.min_cost).toLocaleString()}원</td>
                                <td style={styles.textBody}>{Number(region.max_cost).toLocaleString()}원</td>
                            </tr>
                })}   
                 <tr style={{ fontWeight: 'bold', borderTop: '2px solid #000' }}>
                    <td style={styles.textTitle} colSpan={2}>합계</td>
                    <td style={styles.textBody}></td>
                    <td style={styles.textBody}>{totalRecommended.toLocaleString()}원</td>
                    <td style={styles.textBody}>{totalMin.toLocaleString()}원</td>
                    <td style={styles.textBody}>{totalMax.toLocaleString()}원</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ZoomableImage 컴포넌트
function ZoomableImage({ src, alt }) {
  const [scale, setScale] = useState(1);
  const imageRef = useRef(null);

  // 확대/축소 처리
   useEffect(() => {
    const imgContainer = imageRef.current.parentElement;

    const handleWheel = (e) => {
      e.preventDefault(); // 이제 경고 없음
      let newScale = scale + (e.deltaY < 0 ? 0.1 : -0.1);
      newScale = Math.min(Math.max(newScale, 1), 3);
      setScale(newScale);
    };

    imgContainer.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      imgContainer.removeEventListener("wheel", handleWheel);
    };
  }, [scale]);

  // 마우스 위치 기반으로 확대 지점만 설정 (이미지 이동 X)
  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    imageRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "zoom-in",
      }}
    >
    <div 
      onMouseMove={handleMouseMove}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{
          width: "730px",
          height: "auto",
          transition: "transform 0.15s ease-out",
          transform: `scale(${scale})`,
          objectFit: "contain",
          pointerEvents: "none",  // 상위 div만 이벤트 처리
        }}
      />
      </div>
    </div>
  );
}
