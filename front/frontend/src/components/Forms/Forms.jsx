import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import JSZip from "jszip";
import { useNavigate } from 'react-router-dom';
import styles from "./styles/Forms.module.css";
import plus_icon from "../../../images/plus_icon.svg";
import { useModal } from "../../context/ModalContext"; // Импортируем хук для контекста

const allowedFileTypes = [
  ".pdf", ".docx", ".doc", ".jpg", ".jpeg", ".png", ".rtf", ".txt",
];

function Forms() {
  const [requirements, setRequirements] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const requirementsRef = useRef();
  const navigate = useNavigate();
  const { setIsModalVisible } = useModal(); // Получаем функцию для управления модальным окном

  useEffect(() => {
    if (requirementsRef.current) {
      requirementsRef.current.style.height = "50px";
      requirementsRef.current.style.height = `${requirementsRef.current.scrollHeight}px`;
    }
  }, [requirements]);

  const handleRequirementsChange = (event) => {
    setRequirements(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".zip")) {
      setFile(file);
      setError("");
    } else {
      setError("Пожалуйста, выберите файл .zip");
    }
  };

  const checkFilesInZip = async (zipFile) => {
    const zip = await JSZip.loadAsync(zipFile);
    const files = Object.keys(zip.files);
    let valid = true;

    for (const fileName of files) {
      const fileExtension = fileName.slice(fileName.lastIndexOf("."));
      if (!allowedFileTypes.includes(fileExtension)) {
        valid = false;
        break;
      }
    }

    return valid;
  };

  const handleSend = async () => {
    if (!file) {
      setError("Пожалуйста, выберите ZIP-файл для загрузки.");
      return;
    }

    const valid = await checkFilesInZip(file);
    if (!valid) {
      setError("В архиве содержатся недопустимые файлы.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", requirements);

    try {
      await axios.post("http://localhost:8081/api/resumes/loadResume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(response => {
        localStorage.setItem("id", response?.data);
      });
      console.log("Резюме успешно загружено!");
      setIsModalVisible(true); // Открываем модальное окно после загрузки
      navigate('/cards-page');
    } catch (error) {
      console.error("Ошибка при загрузке резюме:", error);
    }
  };

  return (
    <div className={styles.forms}>
      <div className={`${styles.forms__container} _container`}>
        <div className={`${styles.requirements__block}`}>
          <textarea
            type="text"
            name="requirements"
            ref={requirementsRef}
            value={requirements}
            onChange={handleRequirementsChange}
            className={styles.requirements__block__input}
          ></textarea>
          <label
            className={
              requirements.trim() || requirementsRef.current?.isFocused
                ? styles.requirements__block__placeholder__top
                : styles.requirements__block__placeholder
            }
          >
            Введите требования
          </label>
        </div>

        <div className={`${styles.forms__loading}`}>
          <input
            type="file"
            className={styles.forms__loading__input}
            accept=".zip"
            id="upload"
            onChange={handleFileChange}
          />
          <div className={styles.forms__loading__placeholder__container}>
            <label htmlFor="upload" className={styles.forms__loading__placeholder}>
              Загрузить резюме
            </label>
            <img className={styles.forms__loading__placeholder__img} src={plus_icon} alt="" />
          </div>
        </div>

        <div className={styles.forms__button__block}>
          <button className={styles.forms__button} onClick={handleSend}>
            Загрузить
          </button>
        </div>
      </div>
    </div>
  );
}

export default Forms;
