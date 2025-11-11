import Header from './component/common/Header';
import Footer from './component/common/Footer';
import { Route, Routes } from 'react-router-dom';
import Join from './component/member/Join';
import Login from './component/member/Login';
import MypageMain from './component/mypage/MypageMain';


function App() {

  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/join' element={<Join />} />
          <Route path='/login' element={<Login />} />
          <Route path='/mypage/*' element={<MypageMain />} /> {/* mypage로 시작하는 URL은 MypageMain을 라우팅 */}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
