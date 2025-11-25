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

/**
 * L'idea è quella di dare un messaggio iniziale e fare scegliere all'utente
 * quante colonne vuole in base a quanti esercizi ha, in caso resettare gli esercizi
 * Salvare con lo storage del web
 *  useEffect(() => {
    localStorage.setItem("mealNotes", JSON.stringify(texts));
  }, [texts]);

  const [savedMeals, setSavedMeals] = useState<Day[]>(() => {
    const saved = localStorage.getItem("SavedMeals");
    return saved ? JSON.parse(saved) : emptyMeals;
  });
 */
