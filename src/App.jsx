import Header from './component/common/Header';
import Footer from './component/common/Footer';
import { Route, Routes } from 'react-router-dom';
import JoinMain from './component/member/JoinMain';
import Login from './component/member/Login';
import MycarMain from './component/mycar/MycarMain';


function App() {

  return (
    <div className="wrap">
      <Header />
      <main className="content">
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/join/*' element={<JoinMain />} />
          <Route path='/login' element={<Login />} />
          <Route path='/mycar/*' element={<MycarMain />} /> {/* mycar로 시작하는 URL은 MycarMain을 라우팅 */}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
