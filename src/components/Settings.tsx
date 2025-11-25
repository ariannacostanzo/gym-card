import type { FC } from "react";
const Settings: FC = () => {
  return (
    <>
      <div className="settings">
        <a href="#popup">
          <img className="settings__icon" src="Gear-icon.jpg" alt="" />
        </a>
      </div>

      <div id="popup" className="settings__popup">
        <a href="#timer" className="settings__popup__close">
          &times;
        </a>
        <div className="setting__popup__content">
          <div className="setting__popup__content__setting">Cambia il tema</div>
          <div className="setting__popup__content__setting">Cambia il colore primario</div>
        </div>
      </div>
    </>
  );
};
export default Settings;
