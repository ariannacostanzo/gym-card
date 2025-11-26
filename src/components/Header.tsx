// Header.tsx (senza headHidden state)
interface HeaderProps {
  inputNumber: number | null;
  setInputNumber: React.Dispatch<React.SetStateAction<number | null>>;
  primaryColor: string;
  secondaryColor: string;
}

const Header: React.FC<HeaderProps> = ({
  inputNumber,
  setInputNumber,
  primaryColor,
  secondaryColor,
}) => {
  const changeInputNumber = (direction: "up" | "down") => {
    setInputNumber((prev) => {
      if (prev === null) return direction === "down" ? 0 : 1;
      return direction === "down" ? prev - 1 : prev + 1;
    });
  };

  return (
    <div className="header-wrapper">
      <input type="checkbox" id="hide-header" className="hide-header__checkbox" />

      <div className="header">
        <p>Scegli il numero degli esercizi</p>

        <div className="header__controls">
          <div className="number-control">
            <div
              className="number-left"
              style={{ backgroundColor: secondaryColor }}
              onClick={() => changeInputNumber("down")}
            ></div>
            <input
              type="number"
              name="tableNumber"
              className="number-quantity"
              value={inputNumber ?? ""}
              onChange={(e) => setInputNumber(parseInt(e.target.value) || null)}
            />
            <div
              className="number-right"
              style={{ backgroundColor: secondaryColor }}
              onClick={() => changeInputNumber("up")}
            ></div>
          </div>
          {/* <input
            className="header__input"
            type="number"
            value={inputNumber ?? ""}
            onChange={(e) => setInputNumber(parseInt(e.target.value) || null)}
            name="tableNumber"
          /> */}
          <div className="header__button-container">
            <button
              className="button"
              style={{ backgroundColor: primaryColor }}
              onClick={() => setInputNumber(null)}
            >
              Reset
            </button>

            <label
              htmlFor="hide-header"
              className="hide-header__hide-button"
              style={{ backgroundColor: secondaryColor }}
            >
              Nascondi
            </label>
          </div>
        </div>
      </div>

      <label
        htmlFor="hide-header"
        className="arrow__button"
        aria-hidden="true"
        style={{ backgroundColor: secondaryColor }}
      >
        &darr;
      </label>
    </div>
  );
};
export default Header;
