import React from 'react'
import styles from './styles/Header.module.css'
import freedom from '../../../images/freedom.svg'

function Header() {
  return (
    <div className={styles.header}>
        <div className={`${styles.header__container} _container`}>
            <img className={styles.header__logo} src={freedom} alt="" />
            <div className={styles.header__text__block}>
                <div className={styles.header__title}>FREEDOM</div>
                <div className={styles.header__title__mini}>searcher</div>
            </div>
        </div>
    </div>
  )
}

export default Header
