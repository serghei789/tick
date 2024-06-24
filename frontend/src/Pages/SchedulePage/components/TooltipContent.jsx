import React from "react";
import './TooltipContent.scss';

export const TooltipContent = ({task}) => {
    return (
        <div className="info-card" style={{backgroundColor: task.color}}>
            <h4>{task.name}</h4>
            <p>Продолжительность: {Math.ceil((task.end - task.start) / (60 * 60 * 1000))} часов</p>
            <p>Старт: {task.start.toLocaleString()}</p>
            <p>Прибытие: {task.end.toLocaleString()}</p>
            <p>Пункт отправления: {task.point_begin}</p>
            <p>Пункт назначения: {task.point_end}</p>
            <p>Расстояние (км): {task.distance/1000}</p>
            <p>Время (часов): {(task.time/3600).toFixed(1)}</p>
            <p>Максимальная скорость (м/с): {(+task.speed_m_s).toFixed(1)}</p>
            <p>Средняя скорость (м/с): {Math.floor(task.distance/task.time).toFixed(1)}</p>
            <p>Процент от максимальной скорости %: {task.progress}</p>
            <p>Ледовый класс: {task.ice_class}</p>
        </div>
    )
}
