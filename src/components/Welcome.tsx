import { useState } from "react";

interface WelcomeProps {
  inputNumber: number | null;
  setInputNumber: (value: number | null) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ inputNumber, setInputNumber }) => {
  const [headHidden, setHeadHidden] = useState(false);

  return (
    <>
      {!headHidden && (
        <>
          <p>Scegli il numero degli esercizi</p>
          <div className="manageRow">
            <input
              className="inputNumber"
              type="number"
              value={inputNumber ?? ""}
              onChange={(e) => setInputNumber(parseInt(e.target.value) || null)}
              name="tableNumber"
            />
            <div className="buttonManager">
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
          <button onClick={() => setHeadHidden(false)}>&darr;</button>
        </div>
      )}
    </>
  );
};
export default Welcome;
