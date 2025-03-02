import "../style/login.css";
import { useState, useRef, useEffect } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDownloadForOffline } from "react-icons/md";
import toast from "../hook/toastUtil";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export default function Login() {
  const [password, setPassword] = useState("");
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false); // 설치 여부 상태 추가

  const pwFocus = useRef(true);
  const navigate = useNavigate();

  const LoginFunc = (e) => {
    e.preventDefault();

    if (!password) {
      return toast.error("비밀번호를 입력하세요");
    } else {
      const body = {
        username: "admin",
        password: password,
      };

      axios
        .post(`${BASE_URL}/bo/auth/login`, body, {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === 200) {
            navigate("/recruitDB");
          }
        })
        .catch((error) => {
          console.error("Login Error:", error);

          if (error.response && error.response.status === 401) {
            toast.error("비밀번호가 틀렸어요");
          } else if (error.response && error.response.status === 403) {
            navigate("/recruitDB");
          } else {
            toast.error("문제가 발생했어요. 다시 시도해 주세요.");
          }
        });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      LoginFunc(e);
    }
  };

  useEffect(() => {
    if (pwFocus.current) {
      pwFocus.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true); // 설치 후 버튼 숨김 처리
    };

    // PWA 설치 이벤트 등록
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 설치 여부 초기 확인 (이미 설치된 경우 처리)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = () => {
    if (installPrompt) {
      installPrompt.prompt();
    } else {
      toast.error("설치 실패했어요");
    }
  };

  return (
    <div className="lg_container">
      <header className="lg_logo_Quipu">Quipu Admin</header>
      <div className="lg_box_login">
        <form>
          <span className="lg_password">
            <label>e n t e r</label>
            <input
              className="lg_input_password"
              id="password"
              type="password"
              value={password}
              ref={pwFocus}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyDown={(e) => handleKeyPress(e)}
            ></input>
            <button onClick={(e) => LoginFunc(e)}>login</button>
            <label htmlFor="password">p a s s w o r d</label>
          </span>
        </form>
      </div>
      <footer className="lg_copyright">
        Copyright {new Date().getFullYear()}.&nbsp;
        <span className="Quipu">QUIPU.</span>&nbsp;
        <br></br>All rights reserved.
      </footer>

      {!isInstalled && ( // 설치되지 않은 경우에만 버튼 표시
        <MdDownloadForOffline className="install-button" onClick={installApp} />
      )}
    </div>
  );
}
