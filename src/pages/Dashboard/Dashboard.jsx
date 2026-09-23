// src/pages/Dashboard/Dashboard.jsx

import React from 'react'
import styles from './Dashboard.module.css'

function Dashboard() {
  // Заглушки данных (будут заменены на реальные данные в Фазе F)
  const totalIncome = 0
  const totalExpense = 0
  const balance = 0
  const recentTransactions = []

  return (
    <div className={styles.dashboard}>
      {/* Заголовок с кнопкой добавления */}
      <div className={styles.header}>
        <h1 className={styles.title}>Главная</h1>
        <button className={styles.addButton}>
          <span>+</span>
          <span>Добавить операцию</span>
        </button>
      </div>

      {/* Сетка карточек баланса */}
      <div className={styles.grid}>
        {/* Карточка доходов */}
        <div style={{ 
          backgroundColor: 'var(--color-income-bg)', 
          padding: 'var(--spacing-lg)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-income)'
        }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
            Доходы
          </div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-income)' }}>
            {totalIncome.toLocaleString('ru-RU')} ₽
          </div>
        </div>

        {/* Карточка расходов */}
        <div style={{ 
          backgroundColor: 'var(--color-expense-bg)', 
          padding: 'var(--spacing-lg)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-expense)'
        }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
            Расходы
          </div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-expense)' }}>
            {totalExpense.toLocaleString('ru-RU')} ₽
          </div>
        </div>

        {/* Карточка баланса */}
        <div style={{ 
          backgroundColor: 'var(--color-balance-bg)', 
          padding: 'var(--spacing-lg)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-balance)'
        }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
            Баланс
          </div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-balance)' }}>
            {balance.toLocaleString('ru-RU')} ₽
          </div>
        </div>
      </div>

      {/* Последние операции */}
      <div className={styles.recentTransactions}>
        <h2 className={styles.recentTitle}>Последние операции</h2>
        {recentTransactions.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-2xl)', 
            color: 'var(--color-text-secondary)' 
          }}>
            <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>📭</div>
            <div>Нет операций</div>
            <div style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
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

export default Dashboard