import { GearIcon } from "./Icons";

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => (
  <header className="header">
    <h1 className="header__title">Scheda palestra</h1>
    <button type="button" className="icon-button" onClick={onOpenSettings} aria-label="Impostazioni">
      <GearIcon />
    </button>
  </header>
);

export default Header;
