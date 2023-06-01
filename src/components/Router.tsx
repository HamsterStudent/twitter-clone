import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "./Navigation";
import Profile from "routes/Profile";

interface IAny {
  isLoggedIn: any;
  userObj: any;
  refreshUser: any;
}

const AppRouter = ({ refreshUser, isLoggedIn, userObj }: IAny) => {
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj} />}

      {isLoggedIn ? (
        <div
          style={{
            maxWidth: 890,
            width: "100%",
            margin: "0 auto",
            marginTop: 80,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Routes>
            <Route path="/" element={<Home userObj={userObj} />} />

            <Route
              path="/profile"
              element={<Profile userObj={userObj} refreshUser={refreshUser} />}
            />
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Auth />} />
        </Routes>
      )}
    </Router>
  );
};

export default AppRouter;
