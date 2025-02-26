import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import NotFound from './pages/NotFound';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PasswordReset from './pages/PasswordReset';
import PrivacyPolicy from './pages/PrivacyPolicy';
import GlobalStyle from './styles/globalStyles';
import PasswordChange from './pages/PasswordChange';
import ChooseAvatar from './pages/ChooseAvatar';
import Dummy from './pages/Dummy';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />,
    errorElement: <NotFound />
  },
  {
    path: '/signup',
    element: <SignUp />,
    errorElement: <NotFound />
  },
  {
    path: '/pwreset',
    element: <PasswordReset />,
    errorElement: <NotFound />
  },
  {
    path: '/privacypolicy',
    element: <PrivacyPolicy />,
    errorElement: <NotFound />
  },
  {
    path: '/pwchange',
    element: <PasswordChange />,
    errorElement: <NotFound />
  },
  {
    path: '/choose-avatar',
    element: <ChooseAvatar />,
    errorElement: <NotFound />
  },
  {
    path: '/dummy',
    element: <Dummy />,
    errorElement: <NotFound />
  }
]);

const container = document.getElementById('app-root')!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <RouterProvider router={router} />
  </React.StrictMode>
);
