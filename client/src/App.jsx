import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Header from "./components/Header";
import Home from "./pages/Home"
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./components/CreatePost";
import PostPage from "./pages/PostPage";
import UpdatePost from "./pages/UpdatePost";
import Projects from "./pages/Projects";
import Search from "./pages/Search";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About></About>} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn></SignIn>} />
        <Route path="/search" element={<Search />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
