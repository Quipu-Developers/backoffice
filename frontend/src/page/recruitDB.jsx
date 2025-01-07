import * as XLSX from "xlsx";
import React, { useState, useEffect, useCallback } from "react";
import "../style/recruitDB.css";
import {
  fetchGeneralData,
  fetchDevData,
  fetchAndSavePortfolio,
} from "../api/recruitDB_api";
import { logout } from "../api/logout_api";
import { useNavigate } from "react-router-dom";

// 엑셀 파일로 내보내기
function ExcelExporter({ buttonText, generalData, devData }) {
  const [fileName, setFileName] = useState("퀴푸 지원 명단.xlsx");

  const exportToExcel = () => {
    const newFileName = window.prompt("저장할 파일명을 입력하세요.", fileName);
    if (newFileName) {
      setFileName(newFileName);

      const generalWorksheet = XLSX.utils.json_to_sheet(generalData);
      const devWorksheet = XLSX.utils.json_to_sheet(devData);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, generalWorksheet, "GeneralData"); // GeneralData 시트 추가
      XLSX.utils.book_append_sheet(workbook, devWorksheet, "DevData"); // DevData 시트 추가

      XLSX.writeFile(workbook, newFileName);
    }
  };

  return (
    <div>
      <button onClick={exportToExcel}>{buttonText}</button>
    </div>
  );
}

function RecruitDB() {
  const [buttonText, setButtonText] = useState("엑셀 파일로 내보내기");
  const [norordev, setNorordev] = useState("일반");
  const [generalData, setGeneralData] = useState([]);
  const [devData, setDevData] = useState([]);
  const [data, setData] = useState([]);
  const [highlightedRowIndex, setHighlightedRowIndex] = useState(0); // 모달이 닫힌 후에도 색상이 유지되도록 저장
  const [selectedRowIndex, setSelectedRowIndex] = useState(0); // 클릭된 행을 표시

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGeneralData();
        setGeneralData(data);
        setData(data);
        setNorordev("일반");
        setHighlightedRowIndex(0); // 첫 번째 행을 하이라이트
        setSelectedRowIndex(0); // 첫 번째 행을 선택된 상태로 설정
      } catch (error) {
        console.error("Error");
        navigate("/");
      }
    };
    fetchData();
  }, [navigate]);

  // 일반/개발부원 선택 이벤트
  const loadData = async (selectedValue) => {
    try {
      if (selectedValue === "일반") {
        // 일반부원 데이터 불러오기
        const data = await fetchGeneralData();
        setGeneralData(data);
        setData(data);
        setNorordev("일반");
        setHighlightedRowIndex(0); // 첫 번째 행을 하이라이트
        setSelectedRowIndex(0); // 첫 번째 행을 선택된 상태로 설정
      } else if (selectedValue === "개발") {
        // 개발부원 데이터 불러오기
        const data = await fetchDevData();
        setDevData(data);
        setData(data);
        setNorordev("개발");
        setHighlightedRowIndex(0); // 첫 번째 행을 하이라이트
        setSelectedRowIndex(0); // 첫 번째 행을 선택된 상태로 설정
      }
    } catch (error) {
      console.error("Error");
      navigate("/");
    }
  };

  const handleRadioChange = (e) => {
    setNorordev(e.target.value);
  };

  const handleLoadDataClick = () => {
    loadData(norordev); // 선택된 옵션에 따라 데이터 로드
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0); // 선택한 학생의 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);

  // 전화번호 셀 클릭 시 클립보드에 복사
  const handlePhoneNumberClick = (phoneNumber) => {
    navigator.clipboard
      .writeText(phoneNumber)
      .then(() => {
        alert("전화번호가 클립보드에 복사되었습니다.");
      })
      .catch((err) => {
        console.error("클립보드 복사를 실패하였습니다.: ", err);
      });
  };

  const handleCopy = (string) => {
    navigator.clipboard
      .writeText(string)
      .then(() => {
        alert("클립보드에 복사되었습니다.");
      })
      .catch((err) => {
        console.error("클립보드 복사를 실패하였습니다.: ", err);
      });
  };

  // 이름 셀 클릭 시 모달창 구현
  const handleNameClick = (student, index) => {
    setSelectedStudent(student);
    setSelectedIndex(index);
    setCurrentIndex(index); // 클릭된 학생의 인덱스 저장
    setShowModal(true);
    setHighlightedRowIndex(index); // 모달을 열었을 때 색상 유지
    setSelectedRowIndex(index); // 클릭된 행 색상 유지
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const nextStudent = useCallback(() => {
    const newIndex = (currentIndex + 1) % data.length;
    setCurrentIndex(newIndex);
    setSelectedStudent(data[newIndex]);
    setHighlightedRowIndex(newIndex); // 모달이 이동할 때도 색상 유지
    setSelectedRowIndex(newIndex); // 선택된 행 색상 유지
  }, [currentIndex, data]);

  const prevStudent = useCallback(() => {
    const newIndex = (currentIndex - 1 + data.length) % data.length;
    setCurrentIndex(newIndex);
    setSelectedStudent(data[newIndex]);
    setHighlightedRowIndex(newIndex); // 모달이 이동할 때도 색상 유지
    setSelectedRowIndex(newIndex); // 선택된 행 색상 유지
  }, [currentIndex, data]);

  // 키보드 이벤트 핸들러 추가
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") {
        const newIndex = (selectedRowIndex - 1 + data.length) % data.length;
        setSelectedRowIndex(newIndex);
        setHighlightedRowIndex(newIndex);
      } else if (event.key === "ArrowDown") {
        const newIndex = (selectedRowIndex + 1) % data.length;
        setSelectedRowIndex(newIndex);
        setHighlightedRowIndex(newIndex);
      } else if (event.key === "Enter") {
        handleNameClick(data[selectedRowIndex], selectedRowIndex);
      } else if (showModal) {
        if (event.key === "ArrowLeft") {
          prevStudent();
        } else if (event.key === "ArrowRight") {
          nextStudent();
        } else if (
          event.key === "p" ||
          event.key === "P" ||
          event.key === "ㅔ"
        ) {
          handlePhoneNumberClick(selectedStudent.phone_number);
        } else if (event.keyCode === 27) {
          closeModal();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedRowIndex,
    showModal,
    currentIndex,
    nextStudent,
    prevStudent,
    selectedStudent,
    data,
  ]);

  // 화면 크기에 따라 버튼 텍스트 변경
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setButtonText("Excel");
      } else {
        setButtonText("엑셀 파일로 내보내기");
      }
    };

    // 초기 실행
    handleResize();

    // 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);
    return () => {
      // 이벤트 리스너 제거
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onClickLogout = async () => {
    const response = await logout();
    if (response.status === 200) {
      navigate("/");
    } else {
      alert("로그아웃 실패!");
    }
  };

  return (
    <div className="db-container">
      <div className="db-logo">
        <span> Quipu </span>
        <span className="db-logout" onClick={onClickLogout}>
          {" "}
          logout{" "}
        </span>
      </div>
      <div className="bottombox">
        <div className="buttonlist">
          <div className="upload-buttons">
            <ExcelExporter
              buttonText={buttonText}
              generalData={generalData}
              devData={devData}
            />
            <button onClick={handleLoadDataClick}>불러오기</button>
          </div>
          {/* 일반/개발부원 라디오 버튼 */}
          <div className="radio-buttons">
            <label>
              <input
                type="radio"
                value="일반"
                checked={norordev === "일반"}
                onChange={handleRadioChange}
              />
              일반
            </label>
            <label>
              <input
                type="radio"
                value="개발"
                checked={norordev === "개발"}
                onChange={handleRadioChange}
              />
              개발
            </label>
          </div>
        </div>

        <div className="dbbox">
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>이름</th>
                <th>학번</th>
                <th>학과</th>
                <th>전화번호</th>
                <th>제출시간</th>
              </tr>
            </thead>
            <tbody>
              {data.map((student, index) => (
                <tr
                  key={index}
                  className={`table-row ${
                    highlightedRowIndex === index ? "highlighted" : ""
                  }`}
                  onClick={() => {
                    setHighlightedRowIndex(index);
                    setSelectedRowIndex(index);
                  }}
                >
                  <td>
                    <p>{index + 1}</p>
                  </td>
                  <td onClick={() => handleNameClick(student, index)}>
                    <p className="name">{student.name}</p>
                  </td>
                  <td>
                    <p>{student.student_id}</p>
                  </td>
                  <td>
                    <p>{student.major}</p>
                  </td>
                  <td
                    className="phonenumber"
                    onClick={() => handlePhoneNumberClick(student.phone_number)}
                  >
                    <p>{student.phone_number}</p>
                  </td>
                  <td>
                    <p>
                      {new Date(student.createdAt).toLocaleDateString("ko-KR", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      })}{" "}
                      {new Date(student.createdAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <h6 className="prev-button" onClick={prevStudent}>
            &#60;
          </h6>
          <div className="modal-content">
            <h6 className="closebutton" onClick={closeModal}>
              x
            </h6>
            <h2>{selectedStudent.name}</h2>
            <p className="category">학번</p>
            <p className="content">{selectedStudent.student_id}</p>
            <p className="category">학과</p>
            <p className="content">{selectedStudent.major}</p>
            <p className="category">전화번호</p>
            <p
              className="click-value"
              onClick={() =>
                handlePhoneNumberClick(selectedStudent.phone_number)
              }
            >
              {selectedStudent.phone_number}
            </p>
            <p className="category">지원동기</p>
            <p className="content">{selectedStudent.motivation}</p>
            {norordev === "개발" && selectedIndex !== null && (
              <>
                <p className="category">지원분야</p>
                <p className="content">{selectedStudent.department}</p>
                <p className="category">포트폴리오 PDF</p>
                <p
                  className="click-value"
                  onClick={() =>
                    fetchAndSavePortfolio(selectedStudent.portfolio_pdf)
                  }
                >
                  {selectedStudent.portfolio_pdf}
                </p>
                <p className="category">개발 경험 소개</p>
                <p className="content">{selectedStudent.project_description}</p>
                <p className="category">깃허브 프로필 URL</p>
                <p className="content">
                  <a href={selectedStudent.github_profile}>
                    {selectedStudent.github_profile}
                  </a>
                </p>
                <p className="category">깃허브 이메일</p>
                <p
                  className="click-value"
                  onClick={() => handleCopy(selectedStudent.github_email)}
                >
                  {selectedStudent.github_email}
                </p>
                <p className="category">슬랙 이메일</p>
                <p
                  className="click-value"
                  onClick={() => handleCopy(selectedStudent.slack_email)}
                >
                  {selectedStudent.slack_email}
                </p>
                <p className="category">일반부원 희망 여부</p>
                <p className="content">
                  {selectedStudent.willing_general_member ? "예" : "아니오"}
                </p>
              </>
            )}
            <p className="category">제출시간</p>
            <p className="content">
              {new Date(selectedStudent.createdAt).toLocaleDateString("ko-KR", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              })}{" "}
              {new Date(selectedStudent.createdAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <h6 className="next-button" onClick={nextStudent}>
            &#62;
          </h6>
        </div>
      )}
    </div>
  );
}

export default RecruitDB;
