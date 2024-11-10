import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/Cards.module.css';
import loop from '../../../images/loop.svg';
import saved from '../../../images/saved.svg';
import savedleft from '../../../images/Saved Left.svg';
import savedright from '../../../images/Saved Right.svg';
import trash from '../../../images/trash.svg';
import axios from 'axios';
import CardItem from './CardItem';

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

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const isSearchEmpty = () => search.trim() === '';



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
  const handleCardDoubleClick = (index) => {
    if (favorites.includes(index)) {
      setFavorites(favorites.filter((fav) => fav !== index));
      console.log(`Карточка ${index + 1} удалена из избранного.`);
    } else {
      setFavorites([...favorites, index]);
      console.log(`Карточка ${index + 1} добавлена в избранное.`);
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
    axios.get("http://localhost:8081/api/resumes/getAllResume", {
      headers: {
        "Content-Type": "multipart/form-data",
        "uuid": "0bf4ff92-dea8-4860-b058-1ee2265f48bd",
      },
    })
      .then(response => {
        console.log(response.data?.resume)
        setData(response?.data); // Устанавливаем полученные данные
        setLoading(false); // Завершаем процесс загрузки
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
            {isFocused.search || isSearchEmpty() && <img className={styles.search__loop} src={loop} alt="" /> }
          </div>
          {isFocused.search || isSearchEmpty() && <div className={styles.search__text}>Отобрaно 3.495 из 20.000</div>}
          {isFocused.search || isSearchEmpty() && (
            <Link to={'/savedcards-page'}>
              <img className={styles.search__saved} src={saved} alt="" />
            </Link>
          )}
        </div>

        <div className={styles.cards__main__block}>
          {data?.resume?.map((card, index) => 
           <CardItem
           key={index}
           card={card}
           index={index}
           handleCardClick={handleCardClick}
           handleTouchStart={handleTouchStart}
           handleTouchMove={handleTouchMove}
           handleTouchEnd={handleTouchEnd}
           isMobile={isMobile}
           favorites={favorites}
           handleRemoveCard={handleRemoveCard}
           getColor={getColor}
       />
      )}
        </div>
      </div>
    </div>
  );
}

export default Cards;
