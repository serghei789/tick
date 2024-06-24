import {
  BestRoutesName,
  CaravansName,
  CompoundRoutesName,
  ConditionsName, IceConditionsName, IntegralSpeedName, MetricsName, ModelMetricsName,
  ModelsName, RealShipHistoryName,
  RequestsName, RoutesGraphName, ShipHistoryName,
  ShipsPlacementName, ShipTrajectoryName,
  SpeedControlName
} from "../../Constant";

export const MENUITEMS = [
  {
    menutitle: 'Страницы',
    menucontent: 'Dashboards,Widgets',
    Items: [
      {
        icon: 'home',
        path: `${process.env.PUBLIC_URL}/main`,
        title: 'Главная',
        type: 'link',
      },
      {
        icon: 'maps',
        path: `${process.env.PUBLIC_URL}/map`,
        title: 'Карта',
        type: 'link',
      },
      {
        icon: 'calendar',
        title: 'Расписание',
        type: 'link',
        path: `${process.env.PUBLIC_URL}/schedule`,
        active: false
      },
      {
        icon: 'charts',
        title: 'Аналитика',
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/analytics/integralspeed`, title: IntegralSpeedName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/analytics/iceconditions`, title: IceConditionsName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/analytics/routes`, title: RoutesGraphName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/analytics/bestroutes`, title: BestRoutesName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/analytics/caravans`, title: CaravansName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/analytics/metrics`, title: MetricsName, type: "link" },
        ],
      },
      {
        icon: 'project',
        title: 'История',
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/realmovement/shiptrajectory`, title: ShipTrajectoryName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/realmovement/shiphistory`, title: RealShipHistoryName, type: "link" },
        ],
      },
      {
        icon: 'table',
        title: 'Настройки',
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/controlpanel/requests`, title: `✎${RequestsName}`, type: "link" },
          { path: `${process.env.PUBLIC_URL}/controlpanel/models`, title: `✎${ModelsName}`, type: "link" },
          { path: `${process.env.PUBLIC_URL}/controlpanel/conditions`, title: `✎${ConditionsName}`, type: "link" },
        ],
      },
      {
        icon: 'form',
        title: 'Документация',
        path: `${process.env.PUBLIC_URL}/algorithm`,
        type: 'link',
      },
      {
        icon: 'learning',
        title: 'Блок-схема',
        path: `${process.env.PUBLIC_URL}/blockScheme`,
        type: 'link',
      },
      {
        icon: 'gallery',
        title: 'Презентация',
        path: `${process.env.PUBLIC_URL}/presentation`,
        type: 'link',
      },
      {
        icon: 'file',
        title: 'Данные',
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/tables/placement`, title: ShipsPlacementName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/tables/routes`, title: CompoundRoutesName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/tables/history`, title: ShipHistoryName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/tables/metrics`, title: ModelMetricsName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/tables/speed`, title: SpeedControlName, type: "link" },
        ],
      },
      {
        icon: 'gallery',
        title: 'Видео',
        type: "link",
        path: `${process.env.PUBLIC_URL}/video`,
        active: false,
      },
    ],
  }, {
    menutitle: 'Контакты',
    Items:[{
      title: 'Телеграм',
      icon: 'support-tickets',
      type: 'link',
      path: `https://t.me/mgarbuzenko`
    },]
  }
];
