// Header.tsx (senza headHidden state)
interface HeaderProps {
  inputNumber: number | null;
  setInputNumber: (value: number | null) => void;
}

const Header: React.FC<HeaderProps> = ({ inputNumber, setInputNumber }) => {
  return (
    <div className="header-wrapper">
      <input type="checkbox" id="hide-header" className="hide-header__checkbox" />

      <div className="header">
        <p>Scegli il numero degli esercizi</p>

        <div className="header__controls">
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

            <label htmlFor="hide-header" className="hide-header__hide-button">
              Nascondi
            </label>
          </div>
        </div>
      </div>

      <label htmlFor="hide-header" className="arrow__button" aria-hidden="true">
        &darr;
      </label>
    </div>
  );
};
export default Header;
