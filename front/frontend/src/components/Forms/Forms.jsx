import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import JSZip from "jszip"; // Импортируем библиотеку для работы с zip-архивами
import { useNavigate } from 'react-router-dom'
import styles from "./styles/Forms.module.css";
import plus_icon from "../../../images/plus_icon.svg";

const allowedFileTypes = [
  ".pdf",
  ".docx",
  ".doc",
  ".jpg",
  ".jpeg",
  ".png",
  ".rtf",
  ".txt",
];

function Forms() {
  const [requirements, setRequirements] = useState("");
  const [file, setFile] = useState(null);
  const [isFocused, setIsFocused] = useState({
    requirements: false,
  });
  const [error, setError] = useState(""); // Состояние для ошибки
  const requirementsRef = useRef();

  const navigate = useNavigate()

  // Обновление высоты textarea по мере изменения текста
  useEffect(() => {
    if (requirementsRef.current) {
      requirementsRef.current.style.height = "50px"; // Устанавливаем начальную высоту
      requirementsRef.current.style.height = `${requirementsRef.current.scrollHeight}px`; // Устанавливаем высоту по содержимому
    }
  }, [requirements]);

  const handleBlur = (field) => {
    setIsFocused((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleRequirementsChange = (event) => {
    setRequirements(event.target.value);
  };

  const isRequirementsEmpty = () => {
    return requirements.trim() === "";
  };

  // Обработчик для загрузки файла
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Берем первый выбранный файл
    if (file && file.name.endsWith(".zip")) {
      setFile(file);
      setError(""); // Очищаем ошибку, если файл выбран
    } else {
      setError("Пожалуйста, выберите файл .zip");
    }
  };

  // Проверка допустимых файлов внутри архива
  const checkFilesInZip = async (zipFile) => {
    const zip = await JSZip.loadAsync(zipFile); // Загружаем архив
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

    // Если всё в порядке, отправляем данные на сервер
    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", requirements);

    try {
      await axios.post("http://localhost:8081/api/resumes/loadResume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(response => {
        console.log(response)
      })
      console.log("Резюме успешно загружено!");
      navigate('/cards-page')
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
            onBlur={() => handleBlur("requirements")}
            onFocus={() => handleFocus("requirements")}
            onChange={handleRequirementsChange}
            className={styles.requirements__block__input}
          ></textarea>
          <label
            className={
              !isRequirementsEmpty() || isFocused.requirements
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
            onChange={handleFileChange} // Добавляем обработчик для изменения файла
          />
          <div className={styles.forms__loading__placeholder__container}>
            <label
              htmlFor="upload"
              className={styles.forms__loading__placeholder}
            >
              Загрузить резюме
            </label>
            <img
              className={styles.forms__loading__placeholder__img}
              src={plus_icon}
              alt=""
            />
          </div>
        </div>

        {/* Вывод ошибки, если она есть */}
        {error && <div className={styles.error}>{error}</div>}

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
