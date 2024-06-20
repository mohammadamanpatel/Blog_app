import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  console.log("currentUser in OnlyAdminPrivateRoute",currentUser);
  return currentUser && currentUser.user.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
}
