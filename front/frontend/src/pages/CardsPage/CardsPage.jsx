import React, { useState } from 'react';
import Background from '../../components/Background/Background';
import Header from '../../components/Header/Header';
import styles from './styles/CardsPage.module.css';
import background from '../../../images/background.png';
import Cards from '../../components/Cards/Cards';
import MyModal from '../../components/MyModal/MyModal';

function CardsPage() {
  const [modal, setModal] = useState(false);

  const handleCopy = () => {
    const inputElement = document.getElementById('copyInput'); 
    inputElement.select(); 
    inputElement.setSelectionRange(0, 99999); 

    navigator.clipboard.writeText(inputElement.value)
      .then(() => {
        alert('Текст скопирован!'); 
      })
      .catch((err) => {
        console.error('Ошибка при копировании: ', err);
      });
  };

  return (
    <div className={styles.cards__page}>
      <Background src={background}>
        <Header />
        <Cards />
        <MyModal visible={modal} setVisible={setModal}>
          <div className={styles.text__block}>
            <div className={styles.ready}>Готово!</div>
            <p className={styles.paragraph}>
              Для вас был сгенерирован уникальный ID. Он будет действителен 24 часа. Копируйте его, чтобы использовать файлы вновь.
            </p>
          </div>
          <input
            id="copyInput" 
            type="text"
            value="0a2c2124-b906-4d82-9b5f-2d6138383a0a"
            readOnly
            className={styles.inputWithEllipsis} 
          />
          <div className={styles.button__block}>
            {/* Кнопка с обработчиком события */}
            <button className={styles.button} onClick={handleCopy}>
              Скопировать
            </button>
          </div>
        </MyModal>
      </Background>
    </div>
  );
}

export default CardsPage;
