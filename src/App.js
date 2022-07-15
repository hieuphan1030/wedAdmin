import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import BoardAdmin from "./components/BoardAdmin";
import ListUser from "./components/ListUser";
import ListMovie from "./components/ListMovie";
import AddMovie from "./components/AddMovie";
import Movie from "./components/movie";
// import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";

const App = () => {
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        
        <div className="navbar-nav mr-auto">
          
          {showAdminBoard && (
            <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin 
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/listUser"} className="nav-link">
                Danh sách User
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/movies"} className="nav-link">
                Danh sách phim
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/addMovie"} className="nav-link">
                Thêm phim
              </Link>
            </li>

            </div>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
              Hello  {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                Đăng xuất
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Đăng nhập
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/signup"} className="nav-link">
                Đăng kí
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes> 
          <Route exact path={"/"} element={<Login />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Register />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/admin" element={<BoardAdmin />} />
          <Route path="/listUser" element={<ListUser />} />
          <Route path="/movies" element={<ListMovie />} />
          <Route path="/addMovie" element={<AddMovie />} />
          <Route path="/movie/:id" element={<Movie />} />
        </Routes>
      </div>

      {/* <AuthVerify logOut={logOut}/> */}
    </div>
  );
};

export default App;
