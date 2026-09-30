import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './BarChart.module.css';

function BarChart({ data, title }) {
  // 🔒 ГАРАНТИЯ: превращаем всё, что пришло, в безопасный массив
  const safeData = Array.isArray(data) ? data : [];

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
        <RechartsBarChart data={safeData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `${value / 1000}к`} />
          <Tooltip formatter={(value) => `${value.toLocaleString('ru-RU')} ₽`} />
          <Legend />
          <Bar dataKey="income" name="Доходы" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Расходы" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;