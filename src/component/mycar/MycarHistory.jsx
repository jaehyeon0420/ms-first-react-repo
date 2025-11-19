import PageNavi from "../common/PageNavi";
import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore"; //Store import
import createInstance from "../../axios/Interceptor";

export default function MycarHistory(){
    const serverUrl = import.meta.env.VITE_SPRING_CONTAINER_SERVER;
    const axiosInstance = createInstance();

    const [estimateList, setEstimateList] = useState([]); //견적 이력 리스트
    const [reqPage, setReqPage] = useState(1);      //요청 페이지
    const [pageInfo, setPageInfo] = useState({});   //페이지 네비게이션
    const {loginMember} = useUserStore();             //로그인 회원
    
    
    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/mycar/estimate?memberId=" + loginMember.memberId + "&reqPage=" + reqPage;
        options.method = 'get'; //조회 == GET
        
        axiosInstance(options)
        .then(function(res){
            //응답 게시글 리스트
            setEstimateList(res.data.resData.estimateList);
            //응답 페이지 네비게이션
            setPageInfo(res.data.resData.pageInfo);
        })
        .catch(function(error){
            console.log(error);
        });

        
    },[reqPage]); //reqPage 변경 시, useEffect 함수 재호출


    return(
        <>  <section className="section section-info">
                <div className="page-title">수리비 견적 이력</div>
                <table className="tbl" >
                    <thead>
                        <tr>
                            <th style={{width:"10%"}}>번호</th>
                            <th style={{width:"25%"}}>견적일시</th>
                            <th style={{width:"15%"}}>차량번호</th>
                            <th style={{width:"10%"}}>차량이름</th>
                            <th style={{width:"25%"}}>총 적정 예상 견적(단위:원)</th>
                            <th style={{width:"10%"}}>상세보기</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {estimateList.map(function(estimate, index){
                            return <EstimateItem key={"estimate" + index} estimate={estimate} index={index} estimateList={estimateList} setEstimateList={setEstimateList}/>
                        })}
                    </tbody>
                </table>
                <div className="admin-page-wrap" style={{marginTop : "20px"}}>
                    {/* 페이지 네비게이션 컴포넌트 별도 분리하여, 필요 시 재사용 */}
                    {/* 페이지 네비게이션 제작 후, 페이지 번호 클릭 시 reqPage가 변경되어 요청해야 함 */}
                    <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
                </div>
            </section>
        </>
    );
}


function EstimateItem(props) {
    const estimate = props.estimate; 
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <tr>
            <td>{estimate.rnum}</td>
            <td>{estimate.estimateDate}</td>
            <td>{estimate.carNo}</td>
            <td>{estimate.carAlias}</td>
            <td>{Number(estimate.totalRecommendedCostSum).toLocaleString()}</td>
            <td><button type="button" className="btn-primary sm" style={{fontWeight : 'bold'}} onClick={() => setIsModalOpen(true)}>확인</button> </td>
            <td><ImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} estimate={estimate} /></td>
        </tr>
    );
}

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
    backdropFilter: "blur(4px)", // 배경 흐림 효과
  },
  modal: {
    background: "#ffffff",
    borderRadius: "12px",
    maxWidth: "90%",
    width: "80%",
    padding: "30px 40px",
    maxHeight: "80%",
    overflowY: "auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    position: "relative",
    animation: "fadeIn 0.3s ease-in-out",
  },
  closeBtn: {
  position: "fixed", // 모달과 무관하게 화면 기준 고정
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  border: "none",
  borderRadius: "50%",
  width: "48px",
  height: "48px",
  display: "flex",              // ✨ 가운데 정렬 핵심
  alignItems: "center",         // 수직 중앙
  justifyContent: "center",     // 수평 중앙
  fontSize: "22px",
  fontWeight: "bold",
  color: "#333",
  cursor: "pointer",
  zIndex: 2000,
  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  transition: "all 0.25s ease",
},
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 250px)",
    gap: "20px",
    justifyContent: "center",
  },
  imageItem: {
    textAlign: "center",
  },
  image: {
    width: "250px",
    height: "250px",
    objectFit: "cover",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
    display: "block",
    margin: "0 auto 8px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  imageName: {
    fontSize: "14px",
    color: "#444",
    display: "block",
    wordBreak: "break-all",
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

function ImageModal({ isOpen, onClose, estimate }) {
  if (!isOpen) return null;
  const serverUrl = import.meta.env.VITE_SPRING_CONTAINER_SERVER;

  // jsonStr 파싱
  const imageData = JSON.parse(estimate.jsonStr);

  // 전체 합계 계산
  const totalRecommended = Number(estimate.totalRecommendedCostSum);
  const totalMin = imageData.reduce((acc, img) => acc + img.summary.total_min_cost, 0);
  const totalMax = imageData.reduce((acc, img) => acc + img.summary.total_max_cost, 0);

  return (
    <div style={styles.overlay}>
      {/* 닫기 버튼 */}
      <button className='btn-close' onClick={onClose} style={styles.closeBtn}>✖</button>

      <div style={{ ...styles.modal, maxHeight: "80vh", overflowY: "auto", padding: "20px" }}>
        {/* 모달 최상단 정보 */}
        <div style={{ ...styles.title, borderBottom: '2px solid #ddd', paddingBottom: '15px', marginBottom: '15px' }}>
          <div style={{display : 'flex', justifyContent : 'center', alignItems : 'center', marginBottom : '20px'}}>
            <h2>견적 이력 상세보기</h2>
          </div>
          <div>
            <div style={{display : 'flex', justifyContent : 'center', alignItems : 'center', paddingBottom: '15px', marginBottom: '15px'}}>
              <div style={{ fontWeight: 'bold', fontSize : '20px'}}>
                  차량번호 : [{estimate.carNo}] &nbsp;&nbsp; 차량명 : [{estimate.carAlias }] &nbsp;&nbsp; 총 적정 예상 견적 : [{totalRecommended.toLocaleString()}원]
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent : 'center'}}>
                <span style={{fontWeight : 'bold'}}>신뢰도 기준 : </span>
                <div style={{ color: 'rgb(0, 255, 0)' }}>50% 이상 : 초록</div>
                <div style={{ color: 'rgb(255, 165, 0)' }}>40 ~ 49% : 주황</div>
                <div style={{ color: 'rgb(255, 255, 0)' }}>30 ~ 39% : 노랑</div>
                <div style={{ color: 'rgb(255, 0, 0)' }}>0 ~ 29% : 빨강</div>
              </div>
            </div>
          </div>
        </div>


        {/* 이미지 + regions 그룹 */}
        {estimate.brokenFileList.map((file) => {
          const currentImageData = imageData.find(img => img.image_file === file.brokenFilePath);
          if (!currentImageData) return null;

          return (
            <div key={file.brokenFileNo} style={{ display: 'flex', gap: '20px', marginBottom: '40px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
              {/* 좌측 이미지 */}
              <div style={{ flexShrink: 0 }}>
                <img
                  src={serverUrl + "/car/broken/result/" + file.brokenFilePath.substring(0, file.brokenFilePath.indexOf('.')) + "_image.jpg"}
                  alt={file.brokenFileName}
                  style={{
                    width: '730px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
                <div style={{ textAlign: 'center', marginTop: '8px' }}>{file.brokenFileName}</div>
              </div>

              {/* 우측 테이블 */}
              <div style={{ flex: 1, overflowX: 'auto' }}>
                <table className="tbl" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ width:"10%", border: "1px solid #ddd", padding: "8px" }}>번호</th>
                      <th style={{ width:"25%", border: "1px solid #ddd", padding: "8px" }}>분류</th>
                      <th style={{ width:"10%", border: "1px solid #ddd", padding: "8px" }}>신뢰도</th>
                      <th style={{ width:"18%", border: "1px solid #ddd", padding: "8px" }}>적정 예상 견적</th>
                      <th style={{ width:"18%", border: "1px solid #ddd", padding: "8px" }}>최소 예상 견적</th>
                      <th style={{ width:"18%", border: "1px solid #ddd", padding: "8px" }}>최대 예상 견적</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentImageData.regions.map((region, idx) => (
                      <tr key={region.id}>
                        <td style={{ ...styles.textTitle, color: region.color, border: "1px solid #ddd", padding: "8px" }}># {region.id}</td>
                        <td style={{ ...styles.textBody, border: "1px solid #ddd", padding: "8px" }}>{region.type_kr} [{region.type}]</td>
                        <td style={{ ...styles.textBody, color: region.color, border: "1px solid #ddd", padding: "8px" }}>{(region.confidence.model2_conf * 100).toFixed(1)}%</td>
                        <td style={{ ...styles.textBody, border: "1px solid #ddd", padding: "8px" }}>{Number(region.recommended_cost).toLocaleString()}원</td>
                        <td style={{ ...styles.textBody, border: "1px solid #ddd", padding: "8px" }}>{Number(region.min_cost).toLocaleString()}원</td>
                        <td style={{ ...styles.textBody, border: "1px solid #ddd", padding: "8px" }}>{Number(region.max_cost).toLocaleString()}원</td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: 'bold', borderTop: '2px solid #000' }}>
                      <td style={styles.textTitle} colSpan={3}>합계</td>
                      <td style={styles.textBody}>{currentImageData.summary.total_recommended_cost.toLocaleString()}원</td>
                      <td style={styles.textBody}>{currentImageData.summary.total_min_cost.toLocaleString()}원</td>
                      <td style={styles.textBody}>{currentImageData.summary.total_max_cost.toLocaleString()}원</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}