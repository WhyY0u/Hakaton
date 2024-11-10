import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/Cards.module.css';
import loop from '../../../images/loop.svg';
import saved from '../../../images/saved.svg';
import savedleft from '../../../images/Saved Left.svg';
import savedright from '../../../images/Saved Right.svg';
import trash from '../../../images/trash.svg';
import axios from 'axios';

function Cards() {
  const [loading, setLoading] = useState(true); // Состояние для отслеживания загрузки данных
  const [error, setError] = useState(null); // Для обработки ошибок
  const [data, setData] = useState([])
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState({
    search: false,
  });
  const [favorites, setFavorites] = useState([]); // Массив избранных карточек
  const [clickTimeout, setClickTimeout] = useState(null); // Для отслеживания двойного клика
  const [swipeStart, setSwipeStart] = useState(null); // Для отслеживания начала свайпа
  const [swipeDistance, setSwipeDistance] = useState(0); // Для хранения расстояния свайпа
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Изначально проверяем размер экрана

  // Обновляем isMobile при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Если ширина экрана меньше или равна 768px, считаем это мобильным устройством
    };

    window.addEventListener('resize', handleResize); // Добавляем обработчик события изменения размера окна

    return () => {
      window.removeEventListener('resize', handleResize); // Убираем обработчик при размонтировании компонента
    };
  }, []); // Пустой массив зависимостей, чтобы подписка происходила один раз

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

  // Обработчик для изменения поискового запроса
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const isSearchEmpty = () => search.trim() === '';

  // Массив с данными для карточек
  const cardData = [
    { fio: 'Александр Алексадров Алксандрович', rate: 80 },
    { fio: 'Мария Иванова', rate: 55 },
    { fio: 'Иван Петров', rate: 30 },
  ];

  // Функция для получения цвета на основе рейтинга
  function getColor(score) {
    let red, green;
    if (score <= 50) {
      red = 255;
      green = 0;
    } else if (score < 70) {
      red = 255;
      green = Math.floor(150 + ((score - 50) / 20) * (255 - 150));
    } else {
      green = 255;
      red = Math.floor(255 - ((score - 70) / 40) * 255);
    }
    const color = `rgb(${red}, ${green}, 0)`;

    return {
      border: `2px solid ${color}`,
      boxShadow: `0 0px 10px rgba(${red}, ${green}, 0, 0.3)`,
    };
  }

  // Функция для удаления карточки
  const handleRemoveCard = (index) => {
    console.log(`Карточка ${index + 1} удалена!`);
    // Логика для удаления карточки
  };

  // Обработчик для кликов по карточке
  const handleCardClick = (index) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleCardDoubleClick(index);
    } else {
      // Одиночный клик
      setClickTimeout(
        setTimeout(() => {
          setClickTimeout(null);
          console.log(`Открывается файл с индексом ${index}`); // Выводим в консоль индекс
        }, 300)
      );
    }
  };

  // Обработчик для двойного клика по карточке
  const handleCardDoubleClick = async (index) => {
    const card = data?.resume[index]; // Получаем данные карточки по индексу
    const id = localStorage.getItem("id"); // Получаем uuid из localStorage
  
    try {
      if (favorites.includes(index)) {
        // Если карточка уже в избранном, удаляем ее из избранного с помощью DELETE
        await axios.delete("http://localhost:8081/api/resumes/favorites/remove", {
          headers: {
            uuid: id,      // Передаем uuid пользователя
            id: card.id,   // Передаем id карточки для удаления
          },
        });
        setFavorites(favorites.filter((fav) => fav !== index)); // Обновляем локальное состояние
        console.log(`Карточка ${index + 1} удалена из избранного.`);
      } else {
        // Если карточка не в избранном, добавляем ее с помощью POST
        await axios.post("http://localhost:8081/api/resumes/favorites/add", {
          resume_id: card.id, // Отправляем идентификатор карточки
          uuid: id
        });
        setFavorites([...favorites, index]); // Обновляем локальное состояние
        console.log(`Карточка ${index + 1} добавлена в избранное.`);
      }
    } catch (error) {
      console.error("Ошибка при добавлении/удалении из избранного:", error);
    }
  };

  // Обработчики для свайпов
  const handleTouchStart = (e) => {
    setSwipeStart(e.touches[0].clientX); // Запоминаем начальную позицию свайпа
    setSwipeDistance(0); // Обнуляем расстояние свайпа
  };

  const handleTouchMove = (e) => {
    if (!swipeStart) return;

    const distance = e.touches[0].clientX - swipeStart; // Считаем расстояние по оси X
    setSwipeDistance(distance); // Обновляем текущее расстояние
  };

  const handleTouchEnd = (index) => {
    if (Math.abs(swipeDistance) > 100) {
      handleRemoveCard(index); // Если свайп больше 100px, удаляем карточку
    }
    // Обнуляем значения после завершения свайпа
    setSwipeStart(null);
    setSwipeDistance(0);
  };

  useEffect(() => {
    const id = localStorage.getItem("id");

    if (!id) {
      setError("ID не найден. Пожалуйста, авторизуйтесь.");
      return;
    }

    axios.get("http://localhost:8081/api/resumes/getAllResume", {
      headers: {
        "Content-Type": "multipart/form-data",
        "uuid": id,
      },
    })
      .then(response => {
        setData(response?.data); // Устанавливаем полученные данные
        setLoading(false); // Завершаем процесс загрузки
        console.log(response?.data)
      })
      .catch(err => {
        setError('Ошибка загрузки данных'); // Обрабатываем ошибку
        setLoading(false); // Завершаем процесс загрузки
      });
  }, []);

  return (
    <div className={styles.cards}>
      <div className={`${styles.cards__container} _container`}>
        <div className={styles.cards__search__block}>
          <div
            className={`${
              isFocused.search || !isSearchEmpty()
                ? styles.cards__input__block__whole
                : styles.cards__input__block
            }`}
          >
            <input
              onFocus={() => handleFocus('search')}
              onBlur={() => handleBlur('search')}
              value={search}
              onChange={handleSearchChange}
              className={`${
                isFocused.search || !isSearchEmpty()
                  ? styles.cards__input__clicked
                  : styles.cards__input__not__clicked
              }`}
              name="search"
              type="text"
            />
            {isFocused.search || isSearchEmpty() && <img className={styles.search__loop} src={loop} alt="" />}
          </div>
          {isFocused.search || isSearchEmpty() && <div className={styles.search__text}>Отобрaно 3.495 из 20.000</div>}
          {isFocused.search || isSearchEmpty() && (
            <Link to={'/savedcards-page'}>
              <img className={styles.search__saved} src={saved} alt="" />
            </Link>
          )}
        </div>

        <div className={styles.cards__main__block}>
          {data?.resume?.map((card, index) => (
            <div
              key={index}
              className={styles.card}
              onClick={() => handleCardClick(index)} // Используем onClick вместо onDoubleClick
              onTouchStart={handleTouchStart} // Начало свайпа
              onTouchMove={handleTouchMove} // Движение свайпа
              onTouchEnd={() => handleTouchEnd(index)} // Завершение свайпа
            >
              <div className={styles.card__container}>
                <div className={styles.card__fio__rate}>
                  <div className={styles.fio}>{card.name}</div>
                  <div
                    className={styles.rate}
                    style={getColor(card.sum)}
                  >
                    {card.sum.toFixed(1)}
                  </div>
                </div>
                <div className={styles.card__crucial__info}>
                  {card?.desciption}
                </div>
              </div>

              {/* Отображение кнопки удаления на десктопе */}
              {!isMobile && (
                <img
                  src={trash}
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Чтобы не вызывался click-обработчик карточки
                    handleRemoveCard(index);
                  }}
                />
              )}

              {/* Отображение иконок при добавлении в избранное */}
              {favorites.includes(index) && (
                <img className={styles.saved__left} src={savedleft} alt="Saved Left" />
              )}
              {favorites.includes(index) && (
                <img className={styles.saved__right} src={savedright} alt="Saved Right" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cards;
