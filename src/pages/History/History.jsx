// src/pages/History/History.jsx

import React, { useState } from 'react'
import styles from './History.module.css'

function History() {
  // Заглушки данных (будут заменены на реальные данные в Фазе F)
  const [transactions] = useState([])
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPeriod, setFilterPeriod] = useState('all')

  const handleResetFilters = () => {
    setFilterType('all')
    setFilterCategory('all')
    setFilterPeriod('all')
  }

  return (
    <div className={styles.history}>
      {/* Заголовок страницы */}
      <div className={styles.header}>
        <h1 className={styles.title}>История операций</h1>
      </div>

      {/* Панель фильтров */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип операции</label>
          <select 
            className={styles.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select 
            className={styles.filterSelect}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Все категории</option>
            <option value="salary">Зарплата</option>
            <option value="groceries">Продукты</option>
            <option value="utilities">Коммуналка</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Период</label>
          <select 
            className={styles.filterSelect}
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="all">Всё время</option>
            <option value="today">Сегодня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
          </select>
        </div>

        <button 
          className={styles.resetButton}
          onClick={handleResetFilters}
        >
          Сбросить фильтры
        </button>
      </div>

      {/* Список операций */}
      <div className={styles.listContainer}>
        {transactions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-2xl)', 
            color: 'var(--color-text-secondary)' 
          }}>
            <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>📭</div>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
              Нет операций
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)' }}>
              Добавьте первую операцию, чтобы начать учёт
            </div>
          </div>
        ) : (
          <div>Список операций (скоро)</div>
        )}
      </div>
    </div>
  )
}

export default History