import React from 'react'
import Background from '../../components/Background/Background'
import styles from './styles/MainPage.module.css'
import background from '../../../images/background.png'
import Header from '../../components/Header/Header'
import Forms from '../../components/Forms/Forms'
import NotLoaded from '../../components/NotLoaded/NotLoaded'

function MainPage() {
  return (
    <div className={styles.main__page}>
      <Background src={background}>
            <Header />
            <Forms />
            <NotLoaded />
      </Background>
    </div>
  )
}

export default MainPage
