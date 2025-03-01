import "./App.css";
import { useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import RecruitDB from "./page/recruitDB";
import Login from "./page/login";
import { Toaster, toast } from "react-hot-toast";

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path={"/"} element={<Login />} />
          <Route path={"/recruitDB"} element={<RecruitDB />} />
        </Routes>
        <Toaster />
        <ToastAutoDismiss />
      </Router>
    </div>
  );
}

export default App;

const ToastAutoDismiss = () => {
  const location = useLocation();

  // 페이지 이동 후 1초 뒤 자동 제거
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.dismiss();
    }, 1000); // 1초 후 자동 삭제

    return () => clearTimeout(timer);
  }, [location]);

  // 화면 클릭 시 토스트 즉시 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      toast.dismiss();
    };

    document.addEventListener("click", handleClickOutside, { capture: true });

    return () => {
      document.removeEventListener("click", handleClickOutside, {
        capture: true,
      });
    };
  }, []);

  return null;
};
