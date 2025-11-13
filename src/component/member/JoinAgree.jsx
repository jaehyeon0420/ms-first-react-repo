import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";               
import Checkbox from '@mui/material/Checkbox';
import "./join.css";

export default function JoinAgree (props) {

    const navigate = useNavigate();

    const [agree1, setAgree1] = useState(false); // 개인정보 수집 동의
    const [agree2, setAgree2] = useState(false); // 개인정보 제3자 제공 동의
    const [agreeAll, setAgreeAll] = useState(false); // 모두 동의

    // 모두 동의 체크 시
    const handleAgreeAllChange = (e) => {
      const checked = e.target.checked;
      setAgreeAll(checked);
      setAgree1(checked);
      setAgree2(checked);
    };

    // 개별 체크박스
    const handleAgree1Change = (e) => setAgree1(e.target.checked);
    const handleAgree2Change = (e) => setAgree2(e.target.checked);
    
     useEffect(() => {
      setAgreeAll(agree1 && agree2);
    }, [agree1, agree2]);

    const label1 = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };
    const label2 = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };
    const label3 = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };

    function nextJoin(){
      //약관 동의 모두 체크했는지 검증
      if (!agree1 || !agree2) {
        Swal.fire({
            title: "알림",
            text : "모든 개인정보 동의 항목에 체크해야 합니다.",
            icon : "warning",
            confirmButtonText: "확인",
        });
        
        return false;
      }
      
      navigate('/join/info')
    }
    return (
        <section className="section join-wrap">
            <div className="page-title">약관동의</div>
            <form onSubmit={function(e){
                /*
                - form 태그 사용이유
                    (1) Tab 누르면 다음 input 태그로 포커스 잡히도록
                    (2) 모두 입력 후, 엔터 입력 시 join()과 연결하려고
                - submit 동작 방지.
                */
                e.preventDefault();
                nextJoin();
            }}>
                <div className="terms-container">
                  <div className="term-box">
                    <label className="term-header">
                      <Checkbox id='agree-1' {...label1} checked={agree1} onChange={handleAgree1Change}/> <span style={{color :'red'}}>[필수] </span>&nbsp;&nbsp;개인정보 수집 및 이용 동의
                    </label>
                    <div className="term-content">
{`
㈜Snap Q(이하 “회사”)는 「개인정보 보호법」 및 관련 법령을 준수하여 이용자의 개인정보를 안전하게 관리하며, 다음과 같은 목적 범위 내에서 개인정보를 수집하고 이용합니다.

[수집 항목]

필수 정보: 아이디, 비밀번호, 이름, 휴대전화번호, 차량정보(차량번호, 차량 유형, 차량 별칭, 차량 이미지)
자동 수집 정보: 접속 IP, 쿠키, 접속 로그, 이용 기록, 단말기 정보 (서비스 최적화 및 통계 목적)

[이용 목적]

회원가입, 본인확인, 회원관리, 서비스 이용에 따른 본인 식별
차량 파손 이미지 기반 견적 예측, 정비 예약, 결제 처리, 정비 이력 관리
고객 문의, 불만 접수, 공지사항 전달 등 고객 응대
관련 법령에 따른 의무 이행 및 부정 이용 방지

[보관 기간]

이용자의 개인정보는 원칙적으로 회원 탈퇴 시 즉시 파기됩니다.
다만, 관계 법령에 따라 보관이 필요한 경우 아래와 같이 일정 기간 동안 보존합니다.
계약 또는 청약철회 관련 기록: 5년
대금 결제 및 재화·서비스 제공 관련 기록: 5년
소비자 불만 또는 분쟁 처리 관련 기록: 3년
접속 기록: 3개월

[동의 거부 권리 및 불이익 안내]

이용자는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.
필수 항목에 동의하지 않을 경우 회원가입 및 차량 견적 조회, 정비 예약 등의 서비스 이용이 제한될 수 있습니다.
선택 항목에 동의하지 않더라도 기본 서비스 이용에는 제한이 없습니다.`}

                    </div>
                  </div>

                  <div className="term-box">
                    <label className="term-header">
                      <Checkbox id='agree-2' {...label2} checked={agree2} onChange={handleAgree2Change}/><span style={{color :'red'}}>[필수] </span>&nbsp;&nbsp;개인정보 제3자 제공 동의
                    </label>
                    <div className="term-content">
{`
㈜Snap Q는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
다만, 이용자의 명시적인 동의가 있거나 법령에 따라 예외적으로 허용되는 경우에 한하여 제3자에게 개인정보를 제공합니다.

회사는 다음과 같은 경우에 이용자의 개인정보를 제3자에게 제공합니다.
첫째, 견적 요청 또는 정비 서비스 예약을 위해 제휴 정비업체에게 성명, 연락처, 차량정보, 요청내용을 제공합니다. 제공받은 업체는 상담 및 예약 목적으로만 해당 정보를 이용하며, 서비스 완료 후 일정 기간이 지나면 즉시 파기합니다.
둘째, 결제 처리 및 환불 업무 수행이 필요한 경우 결제대행업체(PG사)에게 성명, 연락처, 결제금액, 결제수단 등의 정보를 제공합니다.
셋째, 부품 배송 또는 차량 픽업 등 물류 서비스가 필요한 경우 택배·운송업체에 성명, 주소, 연락처를 제공합니다.

제공된 개인정보는 목적이 달성된 후 즉시 파기되며, 관련 법령에서 정한 기간 동안만 보관됩니다.
또한, 이용자는 언제든지 제3자 제공에 대한 동의를 철회할 수 있습니다.
동의를 철회하는 경우 해당 제휴 서비스 이용이 제한될 수 있으나, 기본적인 회원 서비스에는 영향이 없습니다.

회사는 개인정보를 제공받는 자가 해당 정보를 목적 외로 이용하거나 제3자에게 재제공하지 않도록 관리·감독하며, 개인정보가 안전하게 처리될 수 있도록 계약 및 절차를 마련합니다.
`}
                    </div>
                  </div>
                </div>
                <div style={{textAlign:'center'}}>
                  <label>
                    <Checkbox {...label3} checked={agreeAll} onChange={handleAgreeAllChange}/>  
                    <span style={{fontWeight : '600' , fontSize : '16px'}}>모두 동의합니다. </span>
                  </label>
                </div>
                <div className="join-button-box">
                    <button type="submit" className="btn-primary lg">
                        다음
                    </button>
                </div>
            </form>
        </section>
    );
}