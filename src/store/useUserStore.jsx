
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
      (set) => ({
          /*
          isLogined    : 로그인 상태인지 로그아웃 상태인지
          setIsLogined : 외부 컴포넌트에서 로그인 or 로그아웃 시 호출할 함수
          loginMember : 로그인 성공 시 회원 객체
          setLoginMember : 회원 객체 변경 함수
          accessToken : 서버 요청 시, 전송할 토큰
          refreshToken : 액세스 토큰 만료 시, 재발급 용도의 토큰
          */
          isLogined: false, 
          setIsLogined: (loginChk) => set({
            isLogined: loginChk
          }), 
          loginMember : null,
          setLoginMember: (memberObj) => set({
            loginMember : memberObj
          }),
          accessToken : null,
          setAccessToken : (accessToken) => set({
            accessToken: accessToken
          }),
          refreshToken : null,
          setRefreshToken : (refreshToken) => set({
            refreshToken: refreshToken
          }),
      })
  )
)

export default useUserStore;