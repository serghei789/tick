import {
  AlgorithmName,
  BlockSchemeName,
  CaravansName,
  CompoundRoutesName,
  ConditionsName, IceConditionsName, IntegralSpeedName, MetricsName, ModelMetricsName,
  ModelsName, PresentationName, RealShipHistoryName,
  RequestsName, RoutesGraphName, SheduleGanttName, SheduleTableName, ShipHistoryName,
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
        type: 'sub',
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/schedule/gantt`, title: SheduleGanttName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/schedule/table`, title: SheduleTableName, type: "link" },
        ]
      },
      {
        icon: 'charts',
        title: 'Аналитика',
        type: "sub",
        active: false,
        children: [
          { path: `${process.env.PUBLIC_URL}/analytics/iceconditions`, title: IceConditionsName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/analytics/routes`, title: RoutesGraphName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/analytics/caravans`, title: CaravansName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/analytics/metrics`, title: MetricsName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/analytics/integralspeed`, title: IntegralSpeedName, type: "link" },
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
        type: 'sub',
        children: [
          { path: `${process.env.PUBLIC_URL}/documentation/blockScheme`, title: BlockSchemeName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/documentation/algorithm`, title: AlgorithmName, type: "link" },
          { path: `${process.env.PUBLIC_URL}/documentation/presentation`, title: PresentationName, type: "link" },
        ],
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
    ],
  }, {
    menutitle: 'Контакты',
    Items:[{
      title: 'Телеграм',
      icon: 'support-tickets',
      type: 'link',
      path: `https://t.me/mgarbuzenko`
      // children: [
      //   {
      //     active: false,
      //     path: `http://google.com`,
      //     title: 'Гугл',
      //     type: 'link',
      //   },
      // ],
    },]
  }
];
