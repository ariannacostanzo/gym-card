import { useEffect, useState } from "react";
import "./App.scss";
import Table from "./components/Table";
import Timer from "./components/Timer";
import Header from "./components/Header";
import Settings from "./components/Settings";

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
      <Header inputNumber={tableNumber} setInputNumber={setTableNumber}></Header>
      <div className="container">
        <Table tableNumber={tableNumber}></Table>
      </div>
      <div className="container">
        <Timer></Timer>
      </div>
      <Settings></Settings>
    </>
  );
}

export default App;
