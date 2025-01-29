import * as React from "react";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import { BrowserRouter as Router , Routes, Route } from "react-router-dom";


// Auth components.
import Register from "./components/user/register.component";
import Login from "./components/user/login.component";
import NotFound from './components/auth/notfound.component';
import User from "./components/user/user.component";


// Military and Presence components.
import NavMain from "./components/layouts/NavMain";
import PresenceMilitary from "./components/militaries/presence.component";
import CreateMilitary from "./components/militaries/create.component";
import MilitaryList from "./components/militaries/list.component";
import EditMilitary from "./components/militaries/edit.component";
import ReportGenerator from "./components/militaries/report.component";


// Layoff components.
import CreateLayoff from "./components/layoff/create.component";
import PresenceLayoff from "./components/layoff/presence.component";
import LayoffList from "./components/layoff/list.component";
import EditLayoff from "./components/layoff/edit.component";


// Admin components.
import AdminPanel from "./components/user/admin.component";
import CreateDestiny from "./components/destiny/create.component";


function App() {
    document.title = 'SISCONEF'
return (
<Router>
    <NavMain />
        <div className="mt-6 mb-4">
            <Col className="mt-5">
            <Routes>
                <Route exact path = '/' element = {<Login />} />
                <Route path = '/register' element = {<Register />} />
                <Route path = "404" element={<NotFound />} />
                <Route path = "*" element={<NotFound />} />
                <Route path="/user" element={<User />} />

                {/* Military and presence routes */}
                <Route path="/militaries/create" element={<CreateMilitary />} />
                <Route path="/militaries/list" element={<MilitaryList />} />
                <Route path="/militaries/presence" element={<PresenceMilitary />} />
                <Route path="/militaries/edit/:id" element={<EditMilitary />} />
                <Route path="/militaries/report" element={<ReportGenerator />} />

                {/* Layoff routes */}
                <Route path="/layoff/create/:id" element={<CreateLayoff />} />
                <Route path="/layoff/presence" element={<PresenceLayoff />} />
                <Route path="/layoff/list" element={<LayoffList />} />
                <Route path="/layoff/edit/:id" element={<EditLayoff />} />

                {/* Admin routes */}
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/destiny/create" element={<CreateDestiny />} />
            </Routes>
            </Col>
        </div>
</Router>);
}

export default App;

