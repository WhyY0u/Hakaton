import React, { createContext, useState, useContext } from 'react';

// Создаем контекст для модального окна
const ModalContext = createContext();

// Поставщик контекста
export const ModalProvider = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <ModalContext.Provider value={{ isModalVisible, setIsModalVisible }}>
      {children}
    </ModalContext.Provider>
  );
};

// Хук для использования контекста в компонентах
export const useModal = () => useContext(ModalContext);
