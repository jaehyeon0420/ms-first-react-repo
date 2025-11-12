import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";                 //sweetalert
import createInstance from "../../axios/Interceptor";

export default function Join (props) {
    //.env 파일 내부 변수 값 읽기
    const serverUrl = 'http://localhost:9999';
    const navigate = useNavigate();

    //토큰 만료 시, axios 인터셉터 설정된 axios 인스턴스 사용하기!
    const axiosInstance = createInstance();

    //각 입력 값 변경 시, 저장 변수(서버 전송용)
    const [member, setMember] = useState({
        memberId : "",
        memberPw : "",
        memberName : "",
        memberPhone : ""
    });

    
    //회원정보 입력 값 변경 시, 호출 함수
    function chgMember(e){
        const id = e.target.id;
        member[id] = e.target.value;
        setMember({...member});
    }

    //차량 1대에, 첨부파일 여러개 업로드 가능하도록 구현
    const [carFileList, setCarFileList] = useState([]);

    //차량정보 배열 저장 변수(차 번호, 차 종류, 차 별명, 차 연식)
    const [carList, setCarList] = useState([
        { carNo : '', carKind : '', carAlias : '', carYear : ''}
    ]);

    //차량정보 입력 값 변경 시, 호출 함수
    function chgCarInfo(index, e){
        const { name, value } = e.target;
        const updatedCars = [...carList];
        updatedCars[index][name] = value;
        setCarList(updatedCars);
    }

    // 차량 추가
    const addCar = () => {
        setCarList([...carList, { carNo: '', carKind: '', carAlias: '', carYear: '' }]);
    };

    // 차량 삭제
    const removeCar = (index) => {
        const updatedCars = carList.filter((_, i) => i !== index);
        setCarList(updatedCars);
    };

    /*MemberId 중복검사 및 유효성체크 (입력마다 클래스가 변경되어야 함. 중복체크 할때마다 표기 메시지도 변경되어야 함. State 사용)
    0 : 검사 이전 상태
    1 : 회원가입 가능 (유효성체크 통과 && 중복체크 통과)
    2 : 유효성체크 실패
    3 : 중복체크 실패
    */
   const [idChk, setIdChk] = useState(0);
    function idChkFunc() {
        //정규표현식 검사 -> 통과 시, DB 중복체크
        const regExp= /^[a-zA-Z0-9]{8,20}$/;

        if(!regExp.test(member.memberId)){
            setIdChk(2);
        }else{
            let options = {};
            options.url = serverUrl + "/members/" + member.memberId + "/id-check";
            options.method = "get"; //조회 == GET
            
            //axios(options)
            axiosInstance(options)
            .then(function(res){
                if(res.data.resData == 1){
                    setIdChk(3);
                }else if(res.data.resData == 0){
                    setIdChk(1);
                }
            })
            .catch(function(error){
                console.log('idDuplChk axios error !');
            });
        }
    }

    //비밀번호 확인 값 입력 시, 저장 변수(서버에 전송하지 않아, 별도의 변수로 정의)
    const [memberPwRe, setMemberPwRe] = useState("");
    function chgMemberPwRe(e) {
        setMemberPwRe(e.target.value);
    }

    /*비밀번호 유효성체크
    0 : 검사 이전 상태
    1 : 유효성체크 통과 && 비밀번호 확인값 일치
    2 : 유효성체크 실패
    3 : 비밀번호 확인값 불일치
    */
   const [pwChk, setPwChk] = useState(0);
    function pwChkFunc(e) {

        const regExp = /^[a-zA-Z0-9!@#$]{6,30}$/; //영어 대/소문자와 특수문자

        if(e.target.id == 'memberPw'){

            if(!regExp.test(e.target.value)){
                setPwChk(2);
            }else if(memberPwRe != ''){ //비밀번호 검증 통과. 확인값이 입력되었을 때만 일치성 검사
                if(member.memberPw == memberPwRe) {
                    setPwChk(1);
                }else{
                    setPwChk(3);
                }
            }else{
                //비밀번호 검증 통과. 비밀번호 확인값은 입력되지 않은 상태.
                setPwChk(3);
            }

        }else if(e.target.id == 'memberPwRe'){
            if(member.memberPw == memberPwRe) {
                //비밀번호 확인값 입력 시, 비밀번호와 일치
                //비밀번호와 확인값 일치하지만, 유효성 검증 실패일 수 있으므로, 재검증
                if(regExp.test(member.memberPw)){
                    setPwChk(1);
                }
            }else{
                //비밀번호 확인값 입력 시, 비밀번호와 일치하지 않음.
                setPwChk(3);
            }
        }
        
    }

    //회원가입 요청
    function join() {
        console.log(member);
        console.log(carList);
        console.log(carFileList);

        //아이디 및 비밀번호 입력 값 유효성 체크
        if(idChk == 1 && pwChk == 1){
            const form = new FormData();
            
            form.append("memberId", member.memberId);
            form.append("memberPw", member.memberPw);
            form.append("memberName", member.memberName);
            form.append("memberPhone", member.memberPhone);

            carFileList.forEach((file, index) => {
                form.append("carFiles", file); //첨부파일 배열 전송
            });
            
            carList.forEach((car, index) => {
                form.append(`carList[${index}].carNo`, car.carNo);
                form.append(`carList[${index}].carKind`, car.carKind);
                form.append(`carList[${index}].carAlias`, car.carAlias);
                form.append(`carList[${index}].carYear`, car.carYear);
            });
   
            
            let options = {};
            options.method = "POST"; //등록 == POST
            options.url = serverUrl + "/members";
            options.data = form;
            options.headers = {};
            options.headers.contentType = "multipart/form-data";
            options.headers.processData = false; //전송 데이터 쿼리 스트링 변환 여부(기본값 true). 폼 데이터 전송 시 false
            
            axiosInstance(options)
            .then(function(res){
                /* 회원가입 정상 => 이후, 컴포넌트 전환을 위해 Interceptor에 작성된 alert 사용 안함
                    회원가입 비정상 => 처리안하면, 서버에서 응답한 객체 내용대로 Interceptor에서 alert 처리.
                */
                if(res.data.resData){
                    Swal.fire({
                        title: "알림",
                        text : res.data.clientMsg,
                        icon : res.data.alertIcon,
                        confirmButtonText: "확인",
                    }).then((result) => {
                        if (result.isConfirmed) { //확인 버튼 클릭
                            navigate("/login"); //성공 시, 로그인 컴포넌트로
                        }
                    });
                    
                }
            })
            .catch(function(error){
                //서버에서 응답한 객체 내용대로 Interceptor에서 alert 처리.
            });

        }else {
            Swal.fire({
                title: "알림",
                text : "입력값이 유효하지 않습니다.",
                icon : "warning",
                confirmButtonText: "확인",
            });
        }
    }

    //첨부파일 업로드 시, 화면에 업로드 파일명칭 목록 보여주기 위한 State (서버로 데이터 전송 X)
    const [carFileName, setCarFileName] = useState([]); //input type=file 요소 속성이 multiple 이므로 배열로 선언

    //첨부파일 업로드 시, 동작 함수
    function chgCarFile(e, index){
        const files = e.currentTarget.files;//콘솔에는 배열처럼 보이지만 유사 배열이라 map 함수 사용못함.

        console.log(index)
        console.log(files[0]);
        console.log(files[0].name);

        //전송할 파일 배열과 화면에 보여줄 파일 이름 배열에 복사하며 요소 추가.
        /* fileArr, fileNameArr 앞에 전개 연산자 생략하면, 배열 자체가 하나의 요소로 추가됨.
           
           let aArr = ['a', 'b'];
           let bArr = ['c', 'd'];
           
           [...aArr, bArr]  =>   ['a', 'b', ['c', 'd']]  => X
           [...aArr, ...bArr]  =>   ['a', 'b', 'c', 'd'] => O
        */
        carFileList[index] = files[0]; //특정 index 위치에 파일 객체 저장
        setCarFileList([...carFileList]); //State 갱신
        setCarFileName(files[0].name);
    }
    
    return (
        <section className="section join-wrap">
            <div className="page-title">회원가입</div>
            <form onSubmit={function(e){
                /*
                - form 태그 사용이유
                    (1) Tab 누르면 다음 input 태그로 포커스 잡히도록
                    (2) 모두 입력 후, 엔터 입력 시 join()과 연결하려고
                - submit 동작 방지.
                */
                e.preventDefault();
                join();
            }}>
            
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberId">아이디</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="memberId" value={member.memberId} onChange={chgMember} onBlur={idChkFunc}/>
                    </div>
                    <p className={"input-msg" + (idChk == 0 ? "" : idChk == 1 ? " valid" : " invalid")}>
                        {idChk == 0 
                            ? ""
                         : idChk == 1 
                            ? "사용 가능한 아이디입니다."
                         : idChk == 2 
                            ? "아이디는 영어 대/소문자 8~20글자 입니다."
                         : "사용중인 아이디입니다."
                        }
                    </p>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberPw">비밀번호</label>
                    </div>
                    <div className="input-item">
                        <input type="password" id="memberPw" value={member.memberPw} onChange={chgMember} onBlur={pwChkFunc}/>
                    </div>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberPwRe">비밀번호 확인</label>
                    </div>
                    <div className="input-item">
                        <input type="password" id="memberPwRe" value={memberPwRe} onChange={chgMemberPwRe} onBlur={pwChkFunc}/>
                    </div>
                    <p className={"input-msg" + (pwChk == 0 ? "" : pwChk == 1 ? " valid" : " invalid")}>
                        {pwChk == 0 
                            ? "" 
                        : pwChk == 1 
                            ? "비밀번호가 정상 입력되었습니다."
                        : pwChk == 2
                            ? "비밀번호는 영어, 숫자, 특수문자(!,@,#,$) 6~30글자 사이로 입력하세요."
                        : pwChk == 3
                            ? "비밀번호와 비밀번호 확인값이 일치하지 않습니다."
                        : ""}
                    </p>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberName">이름</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="memberName" value={member.memberName} onChange={chgMember} />
                    </div>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberPhone">전화번호</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="memberPhone" value={member.memberPhone} onChange={chgMember} />
                    </div>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label>차량 정보</label>
                    </div>
                    {carList.map(function(car, index){
                        return (
                                    <div className="input-item">
                                <input type='text' name='carNo' placeholder="차 번호(ex. 19머 1234)" value={car.carNo} onChange={(e) => chgCarInfo(index, e)} />
                                <input type='text' name='carKind' placeholder="차 종류(ex. SUV)" value={car.carKind} onChange={(e) => chgCarInfo(index, e)} />
                                <input type='text' name='carAlias' placeholder="차 별명(ex. 나의 첫차)" value={car.carAlias} onChange={(e) => chgCarInfo(index, e)} />
                                <input type='text' name='carYear' placeholder="차 연식(ex. 2020)" value={car.carYear} onChange={(e) => chgCarInfo(index, e)} />
                                <button type="button" className="btn-secondary sm" onClick={() => removeCar(index)}>차량 삭제</button>
                                <label htmlFor={"carFile"+index} className="btn-primary sm">파일첨부</label>
                                <input type="file" id={"carFile"+index} style={{display:"none"}} onChange={(e) => chgCarFile(e, index)}/>
                                </div>
                            )
                        })}
                </div>
                <div className="join-button-box">
                    <button type="button" className="btn-primary md" onClick={addCar}>차량 추가</button>
                    <button type="submit" className="btn-primary lg">
                        회원가입
                    </button>
                </div>
            </form>
        </section>
    );
}