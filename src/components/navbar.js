import { Link } from "react-router-dom";
import '../App.css';

function TopBar() {
  return (
    <div className="top-bar">
      <nav>
        <ul>
          <li className='logo'>FNDS</li>

          {/* FIXED LINKS */}
          <li><Link to="/about">All +</Link></li>
          <li>News +</li>
          <li><Link to="/dashboard">Grades +</Link></li>

          <li>Exclusives +</li>
          <li>Recommended +</li>

          <li className='lang-select'>En🔻</li>
        </ul>
      </nav>
    </div>
  );
}

export default TopBar;