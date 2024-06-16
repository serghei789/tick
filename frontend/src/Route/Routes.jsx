// //Samp lePage
import MainPage from "../Components/CommonPages/PageLayout/MainPage/MainPage";
import MapPage from "../Components/CommonPages/PageLayout/MapPage/MapPage";
import SchedulePage from "../Components/CommonPages/PageLayout/SchedulePage/SchedulePage";
import CaravansPage from "../Components/CommonPages/PageLayout/analiticsPages/CaravansPage/CaravansPage";
import AlgorithmPage from "../Components/CommonPages/PageLayout/documentationPages/AlgorithmPage/AlgorithmPage";
import ShipPage from "../Components/CommonPages/PageLayout/ShipPage/ShipPage";
import ShipsPlacementPage from "../Components/CommonPages/PageLayout/tablePages/ShipsPlacementPage/ShipsPlacementPage";
import CompoundRoutesPage from "../Components/CommonPages/PageLayout/tablePages/CompoundRoutesPage/CompoundRoutesPage";
import ShipsHistoryPage from "../Components/CommonPages/PageLayout/tablePages/ShipsHistoryPage/ShipsHistoryPage";
import ModelMetricsPage from "../Components/CommonPages/PageLayout/tablePages/ModelMetricsPage/ModelMetricsPage";
import IceConditionsPage from "../Components/CommonPages/PageLayout/analiticsPages/IceConditionsPage/IceConditionsPage";
import RoutesGraphPage from "../Components/CommonPages/PageLayout/analiticsPages/RoutesGraphPage/RoutesGraphPage";
import MetricsPage from "../Components/CommonPages/PageLayout/analiticsPages/MetricsPage/MetricsPage";
import BlockSchemePage from "../Components/CommonPages/PageLayout/documentationPages/BlockSchemePage/BlockSchemePage";
import PresentationPage
  from "../Components/CommonPages/PageLayout/documentationPages/PresentationPage/PresentationPage";
import SpeedControlPage from "../Components/CommonPages/PageLayout/tablePages/SpeedControlPage/SpeedControlPage";
import IntegralSpeedPage from "../Components/CommonPages/PageLayout/analiticsPages/IntegralSpeedPage/IntegralSpeedPage";
import ShipTrajectoryPage
  from "../Components/CommonPages/PageLayout/realMovementPages/ShipTrajectoryPage/ShipTrajectoryPage";
import RealShipHistoryPage
  from "../Components/CommonPages/PageLayout/realMovementPages/RealShipHistoryPage/RealShipHistoryPage";
import RequestsPage from "../Components/CommonPages/PageLayout/controlPanelPages/RequestsPage/RequestsPage";
import ModelsPage from "../Components/CommonPages/PageLayout/controlPanelPages/ModelsPage/ModelsPage";
import ConditionsPage from "../Components/CommonPages/PageLayout/controlPanelPages/ConditionsPage/ConditionsPage";
import ScheduleTablePage from "../Components/CommonPages/PageLayout/ScheduleTablePage/ScheduleTablePage";

export const routes = [
    //page
  { path: `${process.env.PUBLIC_URL}/main`, Component: <MainPage /> },
  { path: `${process.env.PUBLIC_URL}/map`, Component: <MapPage /> },

  { path: `${process.env.PUBLIC_URL}/schedule/gantt/:imo`, Component: <SchedulePage /> },
  { path: `${process.env.PUBLIC_URL}/schedule/gantt`, Component: <SchedulePage /> },
  { path: `${process.env.PUBLIC_URL}/schedule/table`, Component: <ScheduleTablePage /> },

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
  { path: `${process.env.PUBLIC_URL}/analytics/caravans`, Component: <CaravansPage /> },
  { path: `${process.env.PUBLIC_URL}/analytics/metrics`, Component: <MetricsPage /> },
  { path: `${process.env.PUBLIC_URL}/analytics/integralspeed`, Component: <IntegralSpeedPage /> },

  { path: `${process.env.PUBLIC_URL}/realmovement/shiptrajectory`, Component: <ShipTrajectoryPage /> },
  { path: `${process.env.PUBLIC_URL}/realmovement/shiphistory`, Component: <RealShipHistoryPage /> },

  { path: `${process.env.PUBLIC_URL}/documentation/blockScheme`, Component: <BlockSchemePage /> },
  { path: `${process.env.PUBLIC_URL}/documentation/algorithm`, Component: <AlgorithmPage /> },
  { path: `${process.env.PUBLIC_URL}/documentation/presentation`, Component: <PresentationPage /> },

  { path: `${process.env.PUBLIC_URL}/ship/:id`, Component: <ShipPage /> },
];
