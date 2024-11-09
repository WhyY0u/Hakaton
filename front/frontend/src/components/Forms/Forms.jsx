import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Forms.module.css";
import plus_icon from '../../../images/plus_icon.svg';

function Forms() {
  const [requirements, setRequirements] = useState("");
  const [isFocused, setIsFocused] = useState({
    requirements: false,
  });
  const requirementsRef = useRef();

  // Обновление высоты textarea по мере изменения текста
  useEffect(() => {
    if (requirementsRef.current) {
      requirementsRef.current.style.height = '50px'; // Устанавливаем начальную высоту
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

        <div className={styles.forms__button__block}>
            <button className={styles.forms__button}>Загрузить</button>
        </div>
      </div>
    </div>
  );
}

export default Forms;
