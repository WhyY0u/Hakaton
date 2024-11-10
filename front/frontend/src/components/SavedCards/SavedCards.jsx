import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/SavedCards.module.css';
import loop from '../../../images/loop.svg';
import arrow from '../../../images/arrow-back.svg';
import trash from '../../../images/trash.svg';
import axios from 'axios';

function SavedCards() {
  const [loading, setLoading] = useState(true); // Состояние для отслеживания загрузки данных
  const [error, setError] = useState(null); // Для обработки ошибок
  const [data, setData] = useState([]); // Данные о карточках
  const [favorites, setFavorites] = useState([]); // Избранные карточки
  const [search, setSearch] = useState(''); // Строка поиска
  const [isFocused, setIsFocused] = useState({
    search: false,
  }); // Для фокуса на поле поиска
  const [clickTimeout, setClickTimeout] = useState(null); // Для отслеживания кликов
  const [swipeStart, setSwipeStart] = useState(null); // Для отслеживания начала свайпа
  const [swipeDistance, setSwipeDistance] = useState(0); // Для хранения расстояния свайпа
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Проверка на мобильность

  // Обновляем состояние isMobile при изменении размера экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Обработчики фокуса на поле поиска
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

  // Обработчик кликов по карточке
  const handleCardClick = async (index) => {
    const card = data?.resume[index]; // Получаем карточку по индексу
    const id = localStorage.getItem('id'); // Получаем uuid из localStorage

    if (clickTimeout) {
      // Отправляем запрос на удаление карточки из избранного
      try {
        await axios.delete('http://localhost:8081/api/resumes/favorites/remove', {
          headers: {
            uuid: id,
            id: card.id,
          },
        });

        // Обновляем состояние data, удаляя карточку из списка
        const updatedData = data?.resume.filter((_, idx) => idx !== index);
        setData({ resume: updatedData });

        // Обновляем состояние избранных карточек
        setFavorites(favorites.filter((fav) => fav !== index));

        console.log(`Карточка ${index + 1} удалена из избранного.`);
      } catch (error) {
        console.error('Ошибка при удалении карточки:', error);
      }

      clearTimeout(clickTimeout); // Если был одиночный клик, очищаем таймер
      setClickTimeout(null); // Сбрасываем таймер
    } else {
      // Устанавливаем таймер для отслеживания двойного клика
      setClickTimeout(
        setTimeout(() => {
          setClickTimeout(null); // Очищаем таймер
          console.log(`Открывается файл с индексом ${index}`);
        }, 300) // Таймер для ожидания второго клика
      );
    }
  };

  // Обработчик для удаления карточки из списка (например, с помощью свайпа)
  const handleRemoveCard = (index) => {
    console.log(`Карточка ${index + 1} удалена!`);
    // Можно добавить логику для удаления карточки из cardData или других состояний
  };

  // Обработчики свайпа
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
      handleRemoveCard(index); // Удаляем карточку при свайпе
    }
    // Обнуляем значения после завершения свайпа
    setSwipeStart(null);
    setSwipeDistance(0);
  };

  useEffect(() => {
    const id = localStorage.getItem('id');

    if (!id) {
      setError('ID не найден. Пожалуйста, авторизуйтесь.');
      return;
    }

    // Загружаем избранные карточки с сервера
    axios
      .get('http://localhost:8081/api/resumes/getAllFavorites', {
        headers: {
          'Content-Type': 'multipart/form-data',
          uuid: id,
        },
      })
      .then((response) => {
        setData(response?.data); // Устанавливаем полученные данные
        setLoading(false);
      })
      .catch((err) => {
        setError('Ошибка загрузки данных');
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.cards}>
      <div className={`${styles.cards__container} _container`}>
        <div className={styles.cards__search__block}>
          {isFocused.search || isSearchEmpty() && (
            <Link to={'/cards-page'}>
              <img className={styles.search__arrow} src={arrow} alt="" />
            </Link>
          )}
          {isFocused.search || isSearchEmpty() && (
            <div className={styles.search__text}>В избранном 13 вакансий</div>
          )}
          <div
            className={`${isFocused.search || !isSearchEmpty() ? styles.cards__input__block__whole : styles.cards__input__block}`}
          >
            <input
              onFocus={() => handleFocus('search')}
              onBlur={() => handleBlur('search')}
              value={search}
              onChange={handleSearchChange}
              className={`${isFocused.search || !isSearchEmpty() ? styles.cards__input__clicked : styles.cards__input__not__clicked}`}
              name="search"
              type="text"
            />
            {isFocused.search || isSearchEmpty() && <img className={styles.search__loop} src={loop} alt="" />}
          </div>
        </div>
        <div className={styles.cards__main__block}>
          {data?.resume?.map((card, index) => (
            <div
              key={index}
              className={styles.card}
              onClick={() => handleCardClick(index)} // Обработчик клика
              onTouchStart={handleTouchStart} // Начало свайпа
              onTouchMove={handleTouchMove} // Движение свайпа
              onTouchEnd={() => handleTouchEnd(index)} // Завершение свайпа
            >
              <div className={styles.card__container}>
                <div className={styles.card__fio__rate}>
                  <div className={styles.fio}>{card.name}</div>
                  <div className={styles.rate} style={getColor(card.sum)}>
                    {card.sum.toFixed(1)}
                  </div>
                </div>
                <div className={styles.card__crucial__info}>{card.desciption}</div>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SavedCards;
