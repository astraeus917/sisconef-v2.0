import server_ip from '../config';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Authentication from '../auth/auth.component';


function NavMain() {
    return (
        <Authentication>
            {(Logout, userRole, userSubunit) => (
                <Navbar fixed="top" key={false} expand={false} className="nav-main mb-3">
                    <Container fluid>

                        <Navbar.Brand href="/">
                            <img height={30} src={`${server_ip}/storage/logo.png`} alt="Logo" />
                            SISCONEF 2.0
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${false}`} />

                        <Navbar.Offcanvas id={`offcanvasNavbar-expand-${false}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${false}`} placement="end">

                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${false}`}>
                                    <img height={50} src={`${server_ip}/storage/logo.png`} alt="Logo" />
                                    SISCONEF 2.0
                                </Offcanvas.Title>
                            </Offcanvas.Header>

                            <Offcanvas.Body>
                                <Nav className="justify-content-end flex-grow-1 pe-3 text-center">
                                    <Nav.Link href="/user">Usuário</Nav.Link>

                                    {userRole === "Admin" && (
                                        <Nav>
                                            <Nav.Link className="nav-link" href="/militaries/list">Militares</Nav.Link>
                                            <Nav.Link href="/militaries/presence">Mapa da Força</Nav.Link>
                                            <Nav.Link href="/layoff/list">Férias e Dispensas</Nav.Link>
                                            <Nav.Link href="/militaries/create">Cadastrar Militar</Nav.Link>
                                            <Nav.Link href="/register">Cadastrar Usuário</Nav.Link>
                                            <Nav.Link href="/destiny/create">Cadastrar Destino</Nav.Link>
                                            <Nav.Link href="/militaries/report">Relatórios</Nav.Link>
                                        </Nav>
                                    )}

                                    {userRole === "Brigada" && (
                                        <Nav>
                                            <Nav.Link href="/militaries/report">Efetivo do Grupo</Nav.Link>
                                            <Nav.Link href="/militaries/presence">Mapa da Força</Nav.Link>
                                            <Nav.Link href="/layoff/list">Férias e Dispensas</Nav.Link>
                                            <Nav.Link className="nav-link" href="/militaries/list">Militares</Nav.Link>
                                            <Nav.Link href="/militaries/create">Cadastrar Militar</Nav.Link>
                                        </Nav>
                                    )}

                                    {userRole === "Sgte" && (
                                        <Nav>
                                            <Nav.Link href="/militaries/presence">Mapa da Força</Nav.Link>
                                            <Nav.Link href="/layoff/list">Férias e Dispensas</Nav.Link>
                                            <Nav.Link className="nav-link" href="/militaries/list">Militares</Nav.Link>
                                            <Nav.Link href="/militaries/create">Cadastrar Militar</Nav.Link>
                                        </Nav>
                                    )}

                                    {userRole === "Visitor" && (
                                        <Nav>
                                            <Nav.Link href="/militaries/report">Relatórios</Nav.Link>
                                        </Nav>
                                    )}

                                    <Nav.Link className="nav-link" onClick={Logout}>Sair</Nav.Link>
                                </Nav>

                                <hr></hr>

                                <div className="mt-6 text-center">
                                    <p className="mb-0">Cb Leandro Santos</p>
                                    <p className="mb-0">Sgt Jhonathan</p>
                                    <p className="mb-0">&copy; 2024, all rights</p>
                                </div>

                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            )}
        </Authentication>
    );
};

export default NavMain;

