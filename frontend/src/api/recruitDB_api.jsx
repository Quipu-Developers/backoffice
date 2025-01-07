import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

// 일반부원 데이터 호출 함수
export const fetchGeneralData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/bo/data/joinquipu_general`, {
      headers: {
        accept: "application/json",
        Origin: FRONTEND_URL,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching general data:", err);
    throw err;
  }
};

// 개발부원 데이터 호출 함수
export const fetchDevData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/bo/data/joinquipu_dev`, {
      headers: {
        accept: "application/json",
        Origin: FRONTEND_URL,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching dev data:", err);

    throw err;
  }
};

const getPdf = async (filename) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/bo/data/joinquipu_dev_file/${filename}`,
      {
        headers: {
          accept: "application/json",
          Origin: FRONTEND_URL,
        },
        responseType: "blob", // 파일 다운로드를 위해 blob 타입으로 받기
        withCredentials: true, // 쿠키를 전송하기 위해 설정
      }
    );
    return response;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      // 404 에러 처리
      return { status: 404 };
    } else {
      console.error("Error fetching PDF:", err);
      throw err; // 다른 오류가 발생하면 호출한 함수로 전달
    }
  }
};

const downloadPdf = (filename, blob) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename; // 파일 이름 설정
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url); // 메모리 해제
};

export const fetchAndSavePortfolio = async (filename) => {
  try {
    const response = await getPdf(filename);
    if (response.status === 200) {
      downloadPdf(filename, response.data);
    } else if (response.status === 404) {
      alert("파일이 존재하지 않습니다.");
    }
  } catch (error) {
    alert("서버 에러");
  }
};
