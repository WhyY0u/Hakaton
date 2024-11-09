import React from 'react'
import styles from './styles/NotLoaded.module.css'
import drugalek from '../../../images/drugalek.gif'

function NotLoaded() {
  return (
    <div className={styles.not__loaded}>
        <div className={styles.not__loaded__text__block}>
            <div className={styles.not__loaded__text__block__question}>Вы уже загружали?</div>
            <p className={styles.not__loaded__text__block__parg}>Если вы уже загружали вы можете вставить ID загрузки и получить доступ к файлам</p>
        </div>
        <input
          className={styles.not__loaded__input}
          placeholder='Введите...' 
          type="number"
        />
        <button className={styles.not__loaded__button__signin}>Открыть</button>
    </div>
  )
}

export default NotLoaded
