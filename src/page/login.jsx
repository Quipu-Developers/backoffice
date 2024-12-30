import "../style/login.css";
import { useState, useRef, useEffect } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdDownloadForOffline } from "react-icons/md";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

export default function Login() {
  const [password, setPassword] = useState("");
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false); // 설치 여부 상태 추가

  const pwFocus = useRef(true);
  const navigate = useNavigate();

  const LoginFunc = (e) => {
    e.preventDefault();

    if (!password) {
      return alert("Enter PW!");
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
            Origin: FRONTEND_URL,
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.status === 200) {
            navigate("/recruitDB");
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert("Wrong PW!");
          } else if (error.response && error.response.status === 403) {
            navigate("/recruitDB");
          } else {
            alert("서버 오류!");
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
      alert("바로가기를 추가할 수 없습니다.");
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
        Copyright 2024.&nbsp;<span className="Quipu">QUIPU.</span>&nbsp;
        <br></br>All rights reserved.
      </footer>

      {!isInstalled && ( // 설치되지 않은 경우에만 버튼 표시
        <MdDownloadForOffline className="install-button" onClick={installApp} />
      )}
    </div>
  );
}
