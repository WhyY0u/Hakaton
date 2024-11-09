import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/SavedCards.module.css';
import loop from '../../../images/loop.svg';
import arrow from '../../../images/arrow-back.svg';
import trash from '../../../images/trash.svg';

function SavedCards() {
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState({
    search: false,
  });
  const [clickTimeout, setClickTimeout] = useState(null); // Для отслеживания двойного клика
  const [swipeStart, setSwipeStart] = useState(null); // Для отслеживания начала свайпа
  const [swipeEnd, setSwipeEnd] = useState(null); // Для отслеживания конца свайпа
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

  const isSearchEmpty = () => {
    return search.trim() === '';
  };

  const cardData = [
    { fio: 'Александр Алексадров Алксандрович', rate: 80 },
    { fio: 'Мария Иванова', rate: 45.5 },
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
  
    // Возвращаем объект с границей и box-shadow
    return {
      border: `2px solid ${color}`, // Граница с цветом
      boxShadow: `0 0px 10px rgba(${red}, ${green}, 0, 0.3)`, // box-shadow с тем же цветом
    };
  }

  // Функция для обработки кликов
  const handleCardClick = (index) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout); // Если был одиночный клик, очищаем таймер
      setClickTimeout(null); // Сбрасываем таймер
      console.log(`Карточка ${index + 1} удалена из избранного.`); // Удаляем карточку при двойном клике
    } else {
      // Устанавливаем таймер для отслеживания двойного клика
      setClickTimeout(
        setTimeout(() => {
          setClickTimeout(null); // Очищаем таймер
          console.log(`Открывается файл с индексом ${index}`); // Выводим в консоль индекс
        }, 300) // Таймер для ожидания второго клика
      );
    }
  };

  const handleRemoveCard = (index) => {
    console.log(`Карточка ${index + 1} удалена!`);
    // Можно добавить логику для удаления карточки из cardData или других состояний
  };

  // Обработчик начала свайпа
  const handleTouchStart = (e) => {
    setSwipeStart(e.touches[0].clientX); // Запоминаем начальную позицию свайпа
    setSwipeDistance(0); // Обнуляем расстояние свайпа
  };

  // Обработчик движения свайпа
  const handleTouchMove = (e) => {
    if (!swipeStart) return;

    const distance = e.touches[0].clientX - swipeStart; // Считаем расстояние по оси X
    setSwipeDistance(distance); // Обновляем текущее расстояние
  };

  // Обработчик окончания свайпа
  const handleTouchEnd = (index) => {
    // Если свайп был достаточно длинным (например, более 100px)
    if (Math.abs(swipeDistance) > 100) {
      handleRemoveCard(index); // Удаляем карточку при жестком свайпе
    }
    // Обнуляем значения после завершения свайпа
    setSwipeStart(null);
    setSwipeEnd(null);
    setSwipeDistance(0);
  };

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
            {isFocused.search || isSearchEmpty() && (
              <img className={styles.search__loop} src={loop} alt="" />
            )}
          </div>
        </div>
        <div className={styles.cards__main__block}>
          {cardData.map((card, index) => (
            <div
              key={index}
              className={styles.card}
              onClick={() => handleCardClick(index)} // Обработчик клика
              onTouchStart={(e) => handleTouchStart(e)} // Начало свайпа
              onTouchMove={(e) => handleTouchMove(e)} // Движение свайпа
              onTouchEnd={() => handleTouchEnd(index)} // Завершение свайпа
            >
              <div className={styles.card__container}>
                <div className={styles.card__fio__rate}>
                  <div className={styles.fio}>{card.fio}</div>
                  <div
                    className={styles.rate}
                    style={{
                        ...getColor(card.rate), // Применяем как border, так и box-shadow
                    }}
                  >
                    {card.rate}
                  </div>
                </div>
                <div className={styles.card__crucial__info}>
                  Специализации: Руководитель проектов
                  Занятость: полная занятость
                  График работы: полный день
                  Желательное время в пути до работы: не более часа
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SavedCards;
