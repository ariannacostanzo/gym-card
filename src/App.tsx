import { useEffect, useMemo, useState } from "react";
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

  const [primaryColor, setPrimaryColor] = useState<string>(() => {
    const color = localStorage.getItem("primaryColor");
    return color ? JSON.parse(color) : "purple";
  });

  const [secondaryColor, setSecondaryColor] = useState<string>(() => {
    const color = localStorage.getItem("secondaryColor");
    return color ? JSON.parse(color) : "#808080";
  });

  const [colorTheme, setColorTheme] = useState<string>(() => {
    const theme = localStorage.getItem("colorTheme");
    return theme ? JSON.parse(theme) : "dark";
  });

  const themeAttributes = useMemo(() => {
    return colorTheme === "dark"
      ? {
          backgroundColor: "#242424",
          color: "#ffffff",
          borderColor: "#242424",
          settingImage: "Gear-icon.jpg",
          boxShadow: "1px 1px 6px white",
        }
      : {
          backgroundColor: "#ffffff",
          color: "#242424",
          borderColor: "#242424",
          settingImage: "gear-icon-black.png",
          boxShadow: "1px 1px 13px black",
        };
  }, [colorTheme]);

  useEffect(() => {
    localStorage.setItem("tableNumber", JSON.stringify(tableNumber));
  }, [tableNumber]);

  useEffect(() => {
    localStorage.setItem("primaryColor", JSON.stringify(primaryColor));
  }, [primaryColor]);

  useEffect(() => {
    localStorage.setItem("secondaryColor", JSON.stringify(secondaryColor));
  }, [secondaryColor]);

  useEffect(() => {
    localStorage.setItem("colorTheme", JSON.stringify(colorTheme));
  }, [colorTheme]);

  return (
    <>
      <div
        className="body"
        style={
          colorTheme === "dark"
            ? { backgroundColor: themeAttributes.backgroundColor, color: themeAttributes.color }
            : { backgroundColor: themeAttributes.backgroundColor, color: themeAttributes.color }
        }
      >
        <Header
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          inputNumber={tableNumber}
          setInputNumber={setTableNumber}
        ></Header>
        <div className="container">
          <Table
            tableNumber={tableNumber}
            primaryColor={primaryColor}
            borderColor={themeAttributes.borderColor}
          ></Table>
        </div>
        <div className="container">
          <Timer primaryColor={primaryColor} borderColor={themeAttributes.color}></Timer>
        </div>
        <Settings
          setPrimaryColor={setPrimaryColor}
          setSecondaryColor={setSecondaryColor}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          setColorTheme={setColorTheme}
          colorTheme={colorTheme}
          boxShadow={themeAttributes.boxShadow}
        ></Settings>
      </div>
    </>
  );
}

export default App;
