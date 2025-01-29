import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 4000);
    
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div id="notfound" className="container-fluid d-flex justify-content-center align-items-center text-center rounded text-light">
      <div className="container">
        <h2>404 - Página não encontrada</h2>
        <p>Desculpe, a página que você está procurando não existe.</p>
        <p>Você será redirecionado para a página de login em alguns segundos.</p>
      </div>
    </div>
  );
}

export default NotFound;


