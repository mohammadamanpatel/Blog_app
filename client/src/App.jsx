import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary'; // Ensure correct path
import { useSelector } from 'react-redux';

// Lazy load your non-protected components
const Header = lazy(() => import('./components/Header'));
const About = lazy(() => import('./pages/About'));
const Home = lazy(() => import('./pages/Home'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Search = lazy(() => import('./pages/Search'));
const Projects = lazy(() => import('./pages/Projects'));
const PostPage = lazy(() => import('./pages/PostPage'));

// Direct imports for protected routes
import Dashboard from './pages/Dashboard';
import CreatePost from './components/CreatePost';
import UpdatePost from './pages/UpdatePost';

const App = () => {
  // Get the current user from the Redux store
  const { currentUser } = useSelector((state) => state.user);

  // Function to check if the user is authenticated
  const isAuthenticated = currentUser && Object.keys(currentUser).length > 0;
  const isAdmin = currentUser && currentUser.user.isAdmin;

  // Private Route component
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to='/sign-in' />;
  };

  // OnlyAdminPrivateRoute component
  const OnlyAdminPrivateRoute = ({ children }) => {
    return isAdmin ? children : <Navigate to='/sign-in' />;
  };

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/search" element={<Search />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/post/:postSlug" element={<PostPage />} />
          </Routes>
        </Suspense>
        
        {/* Private Routes */}
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/create-post"
            element={
              <OnlyAdminPrivateRoute>
                <CreatePost />
              </OnlyAdminPrivateRoute>
            }
          />
          <Route
            path="/update-post/:postId"
            element={
              <OnlyAdminPrivateRoute>
                <UpdatePost />
              </OnlyAdminPrivateRoute>
            }
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
