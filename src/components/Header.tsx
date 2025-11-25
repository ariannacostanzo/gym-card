import { useState } from "react";

interface HeaderProps {
  inputNumber: number | null;
  setInputNumber: (value: number | null) => void;
}

const Header: React.FC<HeaderProps> = ({ inputNumber, setInputNumber }) => {
  const [headHidden, setHeadHidden] = useState(false);

  return (
    <>
      {!headHidden && (
        <>
          <p>Scegli il numero degli esercizi</p>
          <div className="header">
            <input
              className="header__input"
              type="number"
              value={inputNumber ?? ""}
              onChange={(e) => setInputNumber(parseInt(e.target.value) || null)}
              name="tableNumber"
            />
            <div className="header__button-container">
              <button className="button" onClick={() => setInputNumber(null)}>
                Reset
              </button>
              <button onClick={() => setHeadHidden(true)}>Nascondi</button>
            </div>
          </div>
        </>
      )}
      {headHidden && (
        <div className="arrow">
          <button className="arrow__button" onClick={() => setHeadHidden(false)}>
            &darr;
          </button>
        </div>
      )}
    </>
  );
};
export default Header;
