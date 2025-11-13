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
                <table className="tbl">
                    <thead>
                        <tr>
                            <th style={{width:"10%"}}>번호</th>
                            <th style={{width:"30%"}}>견적일시</th>
                            <th style={{width:"15%"}}>차량번호</th>
                            <th style={{width:"10%"}}>차량이름</th>
                            <th style={{width:"15%"}}>예상견적비</th>
                            <th style={{width:"20%"}}>파손이미지</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {estimateList.map(function(estimate, index){
                            return <EstimateItem key={"estimate" + index} estimate={estimate} index={index} estimateList={estimateList} setEstimateList={setEstimateList}/>
                        })}
                    </tbody>
                </table>
                <div className="admin-page-wrap" style={{marginTop : "30px"}}>
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
    const serverUrl = process.env.VITE_SPRING_CONTAINER_SERVER;
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <tr>
            <td>{estimate.rnum}</td>
            <td>{estimate.estimateDate}</td>
            <td>{estimate.carNo}</td>
            <td>{estimate.carAlias}</td>
            <td>{estimate.repairCost}</td>
            <td><button type="button" className="btn-primary sm" onClick={() => setIsModalOpen(true)}>이미지 보기</button> </td>
            <td><ImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} brokenFileList={estimate.brokenFileList} /></td>
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
    padding: "30px 40px",
    maxWidth: "90%",
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

function ImageModal({ isOpen, onClose, brokenFileList }) {
  if (!isOpen) return null;
  const serverUrl = process.env.VITE_SPRING_CONTAINER_SERVER;

  return (
    <div style={styles.overlay}>
      {/* 닫기 버튼 — 스크롤과 무관하게 항상 상단 중앙 */}
      <button className='btn-close' onClick={onClose} style={styles.closeBtn}>
        ✖
      </button>

      <div style={styles.modal}>
        <div style={styles.imageGrid}>
          {brokenFileList.map((file, idx) => (
            <div key={idx} style={styles.imageItem}>
              <img className="modal-img"
                src={
                  serverUrl +
                  "/car/broken/" +
                  file.brokenFilePath.substring(0, 8) +
                  "/" +
                  file.brokenFilePath
                }
                alt="파손이미지"
                style={styles.image}
              />
              <span style={styles.imageName}>{file.brokenFileName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}