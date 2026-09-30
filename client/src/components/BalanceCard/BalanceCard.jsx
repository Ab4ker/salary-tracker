import React from 'react';
import styles from './BalanceCard.module.css';

function BalanceCard({ title, amount, color = '#3b82f6' }) {
  // 🔒 Гарантируем, что amount — это число
  const numericAmount = typeof amount === 'number' ? amount : Number(amount) || 0;
  
  // Форматируем сумму с разделителями тысяч
  const formattedAmount = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);

  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper} style={{ background: `${color}20` }}>
        <div className={styles.icon} style={{ color }}>
          {title === 'Доходы' ? '💰' : title === 'Расходы' ? '💸' : '💎'}
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.amount} style={{ color }}>
          {formattedAmount}
        </p>
      </div>
    </div>
  );
}

export default BalanceCard;