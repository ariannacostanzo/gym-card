import { useEffect, useState } from "react";
import "./App.css";
import Table from "./components/Table";
import Welcome from "./components/Welcome";

function App() {
  const [tableNumber, setTableNumber] = useState<number | null>(() => {
    const number = localStorage.getItem("tableNumber");
    return number && number !== "null" ? JSON.parse(number) : null;
  });

  useEffect(() => {
    localStorage.setItem("tableNumber", JSON.stringify(tableNumber));
  }, [tableNumber]);

  return (
    <>
      <Welcome inputNumber={tableNumber} setInputNumber={setTableNumber}></Welcome>
      <div className="container">
        <Table tableNumber={tableNumber}></Table>
      </div>
    </>
  );
}

export default App;
