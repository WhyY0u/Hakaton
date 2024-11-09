import React from 'react'
import Background from '../../components/Background/Background'
import Header from '../../components/Header/Header'
import styles from './styles/CardsPage.module.css'
import background from '../../../images/background.png'
import Cards from '../../components/Cards/Cards'


function CardsPage() {
  return (
    <div className={styles.cards__page}>
        <Background src={background}>
            <Header />
            <Cards />
        </Background>
    </div>
  )
}

export default CardsPage
