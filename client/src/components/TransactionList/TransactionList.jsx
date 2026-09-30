import React from 'react';
import styles from './TransactionList.module.css';
import EmptyState from '../EmptyState/EmptyState';
import { formatDate, formatTransactionAmount } from '../../utils/formatters';
import { getCategoryLabel, CATEGORY_ICONS } from '../../utils/constants';

function TransactionList({ transactions, onEdit, onDelete }) {
  // Гарантируем, что transactions — это массив
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  // Если операций нет, показываем заглушку
  if (safeTransactions.length === 0) {
    return (
      <EmptyState
        title="Нет операций"
        description="Добавьте первую операцию или измените фильтры"
        icon="📭"
      />
    );
  }

  return (
    <ul className={styles.list}>
      {safeTransactions.map((transaction) => {
        // Пропускаем невалидные объекты
        if (!transaction || !transaction.id) return null;

        const isIncome = transaction.type === 'income';
        const icon = CATEGORY_ICONS[transaction.category] || '📦';
        const label = getCategoryLabel(transaction.category, transaction.type);
        const formattedDate = formatDate(transaction.date);
        const formattedAmount = formatTransactionAmount(transaction.amount, transaction.type);

        return (
          <li key={transaction.id} className={styles.item}>
            <div className={styles.icon}>{icon}</div>
            
            <div className={styles.info}>
              <div className={styles.category}>{label}</div>
              <div className={styles.date}>{formattedDate}</div>
              {transaction.comment && (
                <div className={styles.comment}>{transaction.comment}</div>
              )}
            </div>

            <div className={styles.amountWrapper}>
              <span className={`${styles.amount} ${isIncome ? styles.income : styles.expense}`}>
                {formattedAmount}
              </span>
              
              <div className={styles.actions}>
                {onEdit && (
                  <button 
                    className={styles.actionButton} 
                    onClick={() => onEdit(transaction)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                )}
                {onDelete && (
                  <button 
                    className={styles.actionButton} 
                    onClick={() => onDelete(transaction)}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ⚠️ ВАЖНО: Эта строка должна быть в самом конце файла!
export default TransactionList;