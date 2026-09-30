import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import styles from './PieChart.module.css';

// Цвета для диаграммы
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

function PieChart({ data, title }) {
  // 🔒 ГАРАНТИЯ: превращаем всё, что пришло, в безопасный массив
  const safeData = Array.isArray(data) ? data : [];

  // Если данных нет, показываем заглушку
  if (safeData.length === 0) {
    return (
      <div className={styles.emptyChart}>
        <p>Нет данных для отображения</p>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={safeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {safeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value.toLocaleString('ru-RU')} ₽`} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChart;