// //Samp lePage
import MainPage from "../Pages/MainPage/MainPage";
import MapPage from "../Pages/MapPage/MapPage";
import SchedulePage from "../Pages/SchedulePage/SchedulePage";
import CaravansPage from "../Pages/analiticsPages/CaravansPage/CaravansPage";
import AlgorithmPage from "../Pages/documentationPages/AlgorithmPage/AlgorithmPage";
import ShipPage from "../Pages/ShipPage/ShipPage";
import ShipsPlacementPage from "../Pages/tablePages/ShipsPlacementPage/ShipsPlacementPage";
import CompoundRoutesPage from "../Pages/tablePages/CompoundRoutesPage/CompoundRoutesPage";
import ShipsHistoryPage from "../Pages/tablePages/ShipsHistoryPage/ShipsHistoryPage";
import ModelMetricsPage from "../Pages/tablePages/ModelMetricsPage/ModelMetricsPage";
import IceConditionsPage from "../Pages/analiticsPages/IceConditionsPage/IceConditionsPage";
import RoutesGraphPage from "../Pages/analiticsPages/RoutesGraphPage/RoutesGraphPage";
import MetricsPage from "../Pages/analiticsPages/MetricsPage/MetricsPage";
import BlockSchemePage from "../Pages/documentationPages/BlockSchemePage/BlockSchemePage";
import PresentationPage
  from "../Pages/documentationPages/PresentationPage/PresentationPage";
import SpeedControlPage from "../Pages/tablePages/SpeedControlPage/SpeedControlPage";
import IntegralSpeedPage from "../Pages/analiticsPages/IntegralSpeedPage/IntegralSpeedPage";
import ShipTrajectoryPage
  from "../Pages/realMovementPages/ShipTrajectoryPage/ShipTrajectoryPage";
import RealShipHistoryPage
  from "../Pages/realMovementPages/RealShipHistoryPage/RealShipHistoryPage";
import RequestsPage from "../Pages/controlPanelPages/RequestsPage/RequestsPage";
import ModelsPage from "../Pages/controlPanelPages/ModelsPage/ModelsPage";
import ConditionsPage from "../Pages/controlPanelPages/ConditionsPage/ConditionsPage";
import BestRoutesPage from "../Pages/analiticsPages/BestRoutesPage/BestRoutesPage";
import VideoPage from "../Pages/VideoPage/VideoPage";

export const routes = [
    //page
  { path: `${process.env.PUBLIC_URL}/main`, Component: <MainPage /> },
  { path: `${process.env.PUBLIC_URL}/map`, Component: <MapPage /> },

  { path: `${process.env.PUBLIC_URL}/schedule/:imo`, Component: <SchedulePage /> },
  { path: `${process.env.PUBLIC_URL}/schedule`, Component: <SchedulePage /> },

  { path: `${process.env.PUBLIC_URL}/controlpanel/requests`, Component: <RequestsPage /> },
  { path: `${process.env.PUBLIC_URL}/controlpanel/models`, Component: <ModelsPage /> },
  { path: `${process.env.PUBLIC_URL}/controlpanel/conditions`, Component: <ConditionsPage /> },

  { path: `${process.env.PUBLIC_URL}/tables/placement`, Component: <ShipsPlacementPage /> },
  { path: `${process.env.PUBLIC_URL}/tables/routes`, Component: <CompoundRoutesPage /> },
  { path: `${process.env.PUBLIC_URL}/tables/history`, Component: <ShipsHistoryPage /> },
  { path: `${process.env.PUBLIC_URL}/tables/metrics`, Component: <ModelMetricsPage /> },
  { path: `${process.env.PUBLIC_URL}/tables/speed`, Component: <SpeedControlPage /> },

  { path: `${process.env.PUBLIC_URL}/analytics/iceconditions`, Component: <IceConditionsPage /> },
  { path: `${process.env.PUBLIC_URL}/analytics/routes`, Component: <RoutesGraphPage /> },
  { path: `${process.env.PUBLIC_URL}/analytics/bestroutes`, Component: <BestRoutesPage /> },
  { path: `${process.env.PUBLIC_URL}/analytics/caravans`, Component: <CaravansPage /> },
  { path: `${process.env.PUBLIC_URL}/analytics/metrics`, Component: <MetricsPage /> },
  { path: `${process.env.PUBLIC_URL}/analytics/integralspeed`, Component: <IntegralSpeedPage /> },

  { path: `${process.env.PUBLIC_URL}/realmovement/shiptrajectory`, Component: <ShipTrajectoryPage /> },
  { path: `${process.env.PUBLIC_URL}/realmovement/shiphistory`, Component: <RealShipHistoryPage /> },

  { path: `${process.env.PUBLIC_URL}/blockScheme`, Component: <BlockSchemePage /> },
  { path: `${process.env.PUBLIC_URL}/algorithm`, Component: <AlgorithmPage /> },
  { path: `${process.env.PUBLIC_URL}/presentation`, Component: <PresentationPage /> },

  { path: `${process.env.PUBLIC_URL}/video`, Component: <VideoPage /> },

  { path: `${process.env.PUBLIC_URL}/ship/:id`, Component: <ShipPage /> },
];
