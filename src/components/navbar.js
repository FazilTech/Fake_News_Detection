import '../App.css'

function TopBar(){
    return(
        <div className="top-bar">
            <nav>
                <ul>
                    <li className='logo'>FNDS</li>
                    <li>All +</li>
                    <li>News +</li>
                    <li>Exclusives +</li>
                    <li>Grades +</li>
                    <li>Recommended +</li>
                    <li className='lang-select'>En🔻</li>
                </ul>
            </nav>
        </div>
    )
}

export default TopBar;