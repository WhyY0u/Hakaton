import React, { useState } from 'react'
import styles from './styles/NotLoaded.module.css'
import drugalek from '../../../images/drugalek.gif'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function NotLoaded() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true); // Состояние для отслеживания загрузки данных
  const [error, setError] = useState(null); // Для обработки ошибок
  const [data, setData] = useState([])

  const navigate = useNavigate()


  const handleInputChange = (event) => {
    setInput(event.target.value)
  }


  const handleSend = () => {
    if (!input.trim()) {  // Проверка на пустое поле ввода
      setError('ID не может быть пустым'); // Выводим ошибку, если поле пустое
      return;
    }
  
    axios.get("http://localhost:8081/api/resumes/getAllResume", {
      headers: {
        "Content-Type": "multipart/form-data",
        "uuid": input, // Отправляем введённый UUID
      },
    })
      .then(response => {
        if (response?.data) {
          setData(response.data); // Устанавливаем полученные данные
          setLoading(false); // Завершаем процесс загрузки
          console.log(response.data);
          navigate("/cards-page");
        } else {
          console.error("Ошибка с получением ответа");
        }
        localStorage.setItem("id", input)
      })
      .catch(err => {
        setError('Ошибка загрузки данных'); // Обрабатываем ошибку
        setLoading(false); // Завершаем процесс загрузки
      });
  };

  return (
    <div className={styles.not__loaded}>
        <div className={styles.not__loaded__text__block}>
            <div className={styles.not__loaded__text__block__question}>Вы уже загружали?</div>
            <p className={styles.not__loaded__text__block__parg}>Если вы уже загружали вы можете вставить ID загрузки и получить доступ к файлам</p>
        </div>
        <input
          className={styles.not__loaded__input}
          placeholder='Введите...' 
          value={input}
          onChange={handleInputChange}
          type="text"
        />
        <button 
          onClick={() => handleSend()}
          className={styles.not__loaded__button__signin}
        >
          Открыть
        </button>
    </div>
  )
}

export default NotLoaded
