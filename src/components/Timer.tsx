/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef, type FC } from "react";
const Timer: FC = () => {
  const [timer, setTimer] = useState<number>(0);
  const [text, setText] = useState<string>("Avvia Timer");

  const intervalRef = useRef<number | null>(null);

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setTimer(0);
    } else {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      setText("Reset");
    } else {
      setText("Avvia Timer");
    }
  }, [timer]);

  return (
    <>
      <div>
        <div className="timerButton">
          <button className="button" onClick={startTimer}>
            {text}
          </button>
        </div>
        {timer > 0 && (
          <div className="timer">
            <span>{timer} s</span>
          </div>
        )}
      </div>
    </>
  );
};
export default Timer;
