import React from 'react'
import Background from '../../components/Background/Background'
import styles from './styles/SavedCardsPage.module.css'
import Header from '../../components/Header/Header'
import SavedCards from '../../components/SavedCards/SavedCards'
import background from '../../../images/background.png'

function SavedCardsPage() {
  return (
    <div className={styles.saved__cards__page}>
        <Background src={background}>
            <Header />
            <SavedCards />
        </Background>
    </div>
  )
}

export default SavedCardsPage
