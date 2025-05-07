// import React from 'react';
// import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
// import { ScoreContext } from '../../context/ScoreContext';
// import { TrendingUp, LogOut } from 'lucide-react';

// const Header = () => {
//   const { score } = React.useContext(ScoreContext);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem('user'));

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   return (
//     <header>
//       <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
//         <div className="container">
//           <Link className="navbar-brand d-flex align-items-center" to="/">
//             <TrendingUp size={28} className="me-2 text-primary" />
//             <span className="fw-bold">FIERCE Finance</span>
//           </Link>
          
//           <button 
//             className="navbar-toggler" 
//             type="button" 
//             data-bs-toggle="collapse" 
//             data-bs-target="#navbarNav" 
//             aria-controls="navbarNav" 
//             aria-expanded="false" 
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
          
//           <div className="collapse navbar-collapse" id="navbarNav">
//             <ul className="navbar-nav me-auto">
//               <li className="nav-item">
//                 <NavLink className="nav-link" to="/">Home</NavLink>
//               </li>
//               {user && (
//                 <>
//                   <li className="nav-item">
//                     <NavLink className="nav-link" to="/calculate-score">Calculate Score</NavLink>
//                   </li>
//                   {score && (
//                     <>
//                       <li className="nav-item">
//                         <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
//                       </li>
//                       <li className="nav-item">
//                         <NavLink className="nav-link" to="/available-loans">Loans</NavLink>
//                       </li>
//                       <li className="nav-item">
//                         <NavLink className="nav-link" to="/loan-calculator">Calculator</NavLink>
//                       </li>
//                     </>
//                   )}
//                 </>
//               )}
//             </ul>
            
//             <div className="d-flex align-items-center">
//               {score && (
//                 <span className="me-3">
//                   <span className="me-2">Your Score:</span>
//                   <span className={`badge ${
//                     score < 500 ? 'bg-danger' : 
//                     score < 650 ? 'bg-warning' : 
//                     score < 750 ? 'bg-success' : 
//                     'bg-primary'
//                   } fs-6`}>
//                     {score}
//                   </span>
//                 </span>
//               )}
              
//               {user ? (
//                 <button 
//                   className="btn btn-outline-danger d-flex align-items-center"
//                   onClick={handleLogout}
//                 >
//                   <LogOut size={18} className="me-2" />
//                   Logout
//                 </button>
//               ) : (
//                 <Link to="/login" className="btn btn-primary">Login</Link>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;
import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ScoreContext } from '../../context/ScoreContext';
import { TrendingUp, LogOut } from 'lucide-react';

const Header = () => {
  const { score } = React.useContext(ScoreContext);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <TrendingUp size={28} className="me-2 text-primary" />
            <span className="fw-bold">FIERCE Finance</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Home</NavLink>
              </li>
              {user && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/calculate-score">Calculate Score</NavLink>
                  </li>
                  {score && (
                    <>
                      <li className="nav-item">
                        <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink className="nav-link" to="/available-loans">Loans</NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink className="nav-link" to="/loan-calculator">Calculator</NavLink>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>

            <div className="d-flex align-items-center">
              {/* Only show score if user is logged in AND score exists */}
              {user && score && (
                <span className="me-3">
                  <span className="me-2">Your Score:</span>
                  <span className={`badge ${
                    score < 500 ? 'bg-danger' :
                      score < 650 ? 'bg-warning' :
                        score < 750 ? 'bg-success' :
                          'bg-primary'
                    } fs-6`}>
                    {score}
                  </span>
                </span>
              )}

              {user ? (
                <button
                  className="btn btn-outline-danger d-flex align-items-center"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="me-2" />
                  Logout
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;