import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/SavedCards.module.css';
import loop from '../../../images/loop.svg';
import arrow from '../../../images/arrow-back.svg';
import trash from '../../../images/trash.svg';
import axios from 'axios';
import CardItem from '../Cards/CardItem';

function SavedCards() {
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [data, setData] = useState([]); 
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState(''); 
  const [isFocused, setIsFocused] = useState({
    search: false,
  }); 
  const [clickTimeout, setClickTimeout] = useState(null);
  const [swipeStart, setSwipeStart] = useState(null); 
  const [swipeDistance, setSwipeDistance] = useState(0); 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const handleBlur = async (field) => {
    const id = localStorage.getItem('id');
    if(search.length != 0) {
      await axios.get(`http://localhost:8081/api/resumes/favorites/search`, {
        headers: { uuid: id },
        params: { text: search }  
    }).then(response => setData(response.data))
      .catch(error => console.error(error));
    } else {
      axios.get('http://localhost:8081/api/resumes/getAllFavorites', {
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
    }
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
    axios.get('http://localhost:8081/api/resumes/getAllFavorites', {
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

            <Link to={'/cards-page'}>
              <img className={styles.search__arrow} src={arrow} alt="" />
            </Link>
          <div
            className={styles.cards__input__block}
          >
            <input
              onFocus={() => handleFocus('search')}
              onBlur={() => handleBlur('search')}
              value={search}
              onChange={handleSearchChange}
              className={styles.cards__input__clicked}
              name="search"
              type="text"
            />
            {isFocused.search || isSearchEmpty() && <p onChange={() => setIsFocused(prevState => ({
  ...prevState,
  search: true,
}))} className={styles.vedite}>Мне нужен...</p> }
            {isFocused.search || isSearchEmpty() && <img  onClick={() => setIsFocused(prevState => ({
  ...prevState,
  search: true,
}))} className={styles.search__loop} src={loop} alt="" />}
          </div>
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

export default SavedCards;
