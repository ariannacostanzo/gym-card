/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

interface TableProps {
  tableNumber: number | null;
}

type TableRowData = {
  nome: string;
  ripetizioni: string;
  recupero: string;
};

const Table: React.FC<TableProps> = ({ tableNumber }) => {
  const [tableData, setTableData] = useState<TableRowData[]>(() => {
    const savedData = localStorage.getItem("tableData");
    if (savedData) return JSON.parse(savedData);

    if (tableNumber && tableNumber > 0) {
      return Array.from({ length: tableNumber }, () => ({
        nome: "",
        ripetizioni: "",
        recupero: "",
      }));
    }
    return [];
  });

  useEffect(() => {
    if (!tableNumber || tableNumber <= 0) return;

    setTableData((prev) => {
      const newData = [...prev];

      while (newData.length < tableNumber) {
        newData.push({ nome: "", ripetizioni: "", recupero: "" });
      }

      if (newData.length > tableNumber) {
        newData.splice(tableNumber);
      }

      return newData;
    });
  }, [tableNumber]);

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
  }, [tableData]);

  const handleInputChange = (index: number, field: keyof TableRowData, value: string) => {
    setTableData((prev) => {
      const newData = [...prev];
      newData[index][field] = value;
      return newData;
    });
  };

  const generateTable = () => {
    console.log("genera tabella");
  };

  useEffect(() => {
    if (tableNumber != null && tableNumber > 0) {
      generateTable();
    }
  }, [tableNumber]);

  return (
    <>
      {tableNumber && tableNumber > 0 && (
        <div className="table">
          <div className="tableHead">
            <div>Esercizio</div>
            <div>Numero ripetizioni</div>
            <div>Recupero</div>
          </div>
          <div className="tableBody">
            {tableData.map((row, index) => (
              <div key={index} className="tableRow">
                <input
                  className="inputTable"
                  type="text"
                  placeholder="Nome Esercizio"
                  value={row.nome}
                  onChange={(e) => handleInputChange(index, "nome", e.target.value)}
                />
                <input
                  className="inputTable"
                  type="text"
                  placeholder="Ripetizioni"
                  value={row.ripetizioni}
                  onChange={(e) => handleInputChange(index, "ripetizioni", e.target.value)}
                />
                <input
                  className="inputTable"
                  type="text"
                  placeholder="Tempo Recupero"
                  value={row.recupero}
                  onChange={(e) => handleInputChange(index, "recupero", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Table;
