import React from 'react';
import styles from './styles/Background.module.css';

function Background({ src, alt, className,children }) {
  return (
    <div 
        className={`${styles.background__wrapper}`}
        style={{ backgroundImage: `url(${src})` }} 
        aria-label={alt} 
    >
        <div
            className={className ? `${className}` : styles.background}

        >
         <div className={styles.content}> {/* Оборачиваем детей в отдельный div */}
              {children}
          </div>
          </div>
    </div>
  );
}

export default Background;
