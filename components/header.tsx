import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { adminMode, setAdminMode } = useAuth();
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {

    if (adminMode) {
      setAdminMode(false);
    } else if (clickCount < 5) {
      setClickCount(clickCount + 1);
      setTimeout(() => setClickCount(0), 10000 )
    } else {
      setClickCount(0);
      setAdminMode(true);
    }

  }
  return (
    <h1 className="Title" onClick={handleClick}>Good Game Cafe</h1>
  )
}

export default Header;