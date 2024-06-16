import ErrorPage1 from '../Components/CommonPages/ErrorPages/ErrorPage400';
import ErrorPage2 from '../Components/CommonPages/ErrorPages/ErrorPage401';
import ErrorPage3 from '../Components/CommonPages/ErrorPages/ErrorPage403';
import ErrorPage4 from '../Components/CommonPages/ErrorPages/ErrorPage404';
import Error500 from '../Components/CommonPages/ErrorPages/ErrorPage500';
import Error503 from '../Components/CommonPages/ErrorPages/ErrorPage503';

export const errorRoutes = [
  //Error
  { path: `${process.env.PUBLIC_URL}/pages/errors/error400`, Component: <ErrorPage1 /> },
  { path: `${process.env.PUBLIC_URL}/pages/errors/error401`, Component: <ErrorPage2 /> },
  { path: `${process.env.PUBLIC_URL}/pages/errors/error403`, Component: <ErrorPage3 /> },
  { path: `${process.env.PUBLIC_URL}/pages/errors/error404`, Component: <ErrorPage4 /> },
  { path: `${process.env.PUBLIC_URL}/pages/errors/error500`, Component: <Error500 /> },
  { path: `${process.env.PUBLIC_URL}/pages/errors/error503`, Component: <Error503 /> },
];
