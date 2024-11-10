import React, { useEffect, useRef, useState } from 'react';
import styles from './styles/Cards.module.css';
import savedleft from '../../../images/Saved Left.svg';
import savedright from '../../../images/Saved Right.svg';
import trash from '../../../images/trash.svg';

const CardItem = ({
    card,
    index,
    handleCardClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isMobile,
    favorites,
    handleRemoveCard,
    getColor,
    setFavorites,
}) => {
    const cardRef = useRef(null); 
    const [isVisible, setIsVisible] = useState(false); 
    const [isRmove, setRmove] = useState(false);
  
    useEffect(() => {
        if(card.favorites) {
        setFavorites([...favorites, index]);
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            { threshold: 0.1 } 
        );

        if (cardRef.current) {
            observer.observe(cardRef.current); 
        }

        return () => {
            if (cardRef.current) {
                observer.disconnect(); 
            }
        };
    }, [index]);

    const handleClick = (e, index) => {
      setRmove(true);
      setTimeout(() => {
        console.log("wooooork")
          handleRemoveCard(index); 
        }, 2000);
      };
    return (
        
        <div
            ref={cardRef}
            className={`${styles.card}` + " " + (isVisible ? styles.card_visible : " ") + " " + (isRmove ? (isMobile ?  styles.removecard_moblie : styles.removecard_pc): " ")}
            style={{ animationDelay: `${index * 0.3}s` }}
            onClick={() => handleCardClick(index)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleTouchEnd(index)}
        >
            <div className={styles.card__container}>
                <div className={styles.card__fio__rate}>
                    <div className={styles.fio}>{card.name}</div>
                    <div className={styles.rate} style={getColor(card.sum)}>
                        {card.sum.toFixed(1)}
                    </div>
                </div>
                <div className={styles.card__crucial__info}>
                    {card.desciption}
                </div>
            </div>

            {/* Отображение кнопки удаления на десктопе */}
            {!isMobile && (
                <img
                    src={trash}
                    className={styles.deleteButton}
                    onClick={(e) => handleClick(e, index)}
                />
            )}

            {/* Отображение иконок при добавлении в избранное */}
            {favorites.includes(index) && (
                <>
                    <img className={styles.saved__left} src={savedleft} alt="Saved Left" />
                    <img className={styles.saved__right} src={savedright} alt="Saved Right" />
                </>
            )}
        </div>
    );
};

export default CardItem;