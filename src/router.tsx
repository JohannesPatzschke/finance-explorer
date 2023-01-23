import React from 'react';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';

import SimpleSidebar from './components/navigation/SimpleSidebar';

import Accounts from './pages/Accounts';
import Categories from './pages/Categories';
import Explore from './pages/Explore';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Transactions from './pages/Transactions';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SimpleSidebar>
        <Outlet />
      </SimpleSidebar>
    ),
    children: [
      {
        path: 'accounts',
        element: <Accounts />,
      },
      {
        path: 'categories',
        element: <Categories />,
      },
      {
        path: 'explore',
        element: <Explore />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'transactions',
        element: <Transactions />,
      },
    ],
  },
]);

export default () => <RouterProvider router={router} />;
