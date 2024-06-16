import React from 'react';
import { Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Loader from '../Layout/Loader';
import LayoutRoutes from '../Route/LayoutRoutes';
import { errorRoutes } from './ErrorRoutes';

const Routers = () => {

  return (
    <BrowserRouter basename={'/'}>
      <>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route exact path={`${process.env.PUBLIC_URL}`} element={<Navigate to={`${process.env.PUBLIC_URL}/main`} />} />
            <Route exact path={`/`} element={<Navigate to={`${process.env.PUBLIC_URL}/main`} />} />
            <Route path={`/*`} element={<LayoutRoutes />} />
            {errorRoutes.map(({ path, Component }, i) => (
              <Route path={path} element={Component} key={i} />
            ))}
          </Routes>
        </Suspense>
      </>
    </BrowserRouter>
  );
};

export default Routers;
