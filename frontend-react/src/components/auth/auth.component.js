import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


// Valid routes for access.
const validRoutes = [
  '/',
  '/register',
  '/404',
  '/*',
  '/user', 
  '/militaries/create',
  '/militaries/list',
  '/militaries/presence', 
  '/militaries/edit/:id',
  '/militaries/report',
  '/layoff/create/:id',
  '/layoff/presence',
  '/layoff/list',
  '/layoff/edit/:id',
  '/admin',
  '/destiny/create',
];


function Authentication({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userSubunit, setUserSubunit] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user_role = localStorage.getItem('user_role');
    const user_subunit = localStorage.getItem('user_subunit');
    const currentRoute = window.location.pathname;

    if (token) {
      setIsLoggedIn(true);
      setUserRole(user_role);
      setUserSubunit(user_subunit);
    } else if (currentRoute === '/') {
      navigate('/');
    } else if (!validRoutes.includes(currentRoute)) {
      navigate('/404');
    } else {
      Swal.fire({
        text:'Acesso negado!',
        icon:"error",
        showConfirmButton: false,
        timer: 1500
      })
      navigate('/');
    }
  }, [navigate]);

  const Logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_subunit');
    Swal.fire({
      text:'Usuário desconectado do sistema.',
      icon:"info",
      showConfirmButton: false,
      timer: 1500
    })
    navigate('/');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return isLoggedIn ? (
    <div>
      {children(Logout, userRole, userSubunit)}
    </div>
  ) : null;
}

export default Authentication;