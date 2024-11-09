import SavedCards from "./components/SavedCards/SavedCards";
import CardsPage from "./pages/CardsPage/CardsPage";
import MainPage from "./pages/MainPage/MainPage"
import { Routes, Route } from 'react-router-dom';
import SavedCardsPage from "./pages/SavedCardsPage/SavedCardsPage";

function App() {

  return (
    <div className="wrapper">
      <Routes>
        <Route path={'/'} element={<MainPage />} />
        <Route path={'/cards-page'} element={<CardsPage />} />
        <Route path={'/savedcards-page'} element={<SavedCardsPage />} />
      </Routes>
    </div>
  )
}

export default App
