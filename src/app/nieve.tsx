import React from "react";
import "./nieve.css"; // Asegúrate de tener este archivo de CSS en tu proyecto

const nieve: React.FC = () => {
  const createSnowflakes = () => {
    const snowflakesCount = 20; // Número de copos de nieve
    const snowflakes: JSX.Element[] = [];

    for (let i = 0; i < snowflakesCount; i++) {
      const style = {
        animationDuration: `${random(5, 12)}s`,
        opacity: Math.random(),
        left: `${random(0, 100)}vw`,
      };
      snowflakes.push(
        <div className="snowflake" style={style} key={i}>
          ❅
        </div>,
      );
    }

    return snowflakes;
  };

  return (
    <div className="snowflakes" aria-hidden="true">
      {createSnowflakes()}
    </div>
  );
};

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default nieve;
