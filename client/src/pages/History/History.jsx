import React, { useState, useEffect } from 'react';
import styles from './History.module.css';
import TransactionList from '../../components/TransactionList/TransactionList';
import Modal from '../../components/Modal/Modal';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import { getAllTransactions } from '../../services/summaryService';
import { addIncome, updateIncome, deleteIncome } from '../../services/incomeService';
import { addExpense, updateExpense, deleteExpense } from '../../services/expenseService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/constants';

function History() {
  // Состояние фильтров
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  // Состояние модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Состояние данных (гарантированно инициализируем пустым массивом)
  const [allTransactions, setAllTransactions] = useState([]);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadData();
  }, []);

  // 🔒 Асинхронная функция загрузки данных
  const loadData = async () => {
    try {
      const transactions = await getAllTransactions();
      // Гарантируем, что сохраняем именно массив
      setAllTransactions(Array.isArray(transactions) ? transactions : []);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
      setAllTransactions([]);
    }
  };

  // 🔒 Получаем категории с удаленными дубликатами (например, 'other')
  const getCategoriesForFilter = () => {
    if (typeFilter === 'income') {
      return INCOME_CATEGORIES;
    } else if (typeFilter === 'expense') {
      return EXPENSE_CATEGORIES;
    } else {
      // Объединяем и убираем дубликаты по id
      const combined = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
      return combined.filter((cat, index, self) => 
        index === self.findIndex((c) => c.id === cat.id)
      );
    }
  };

  // Фильтрация операций (теперь allTransactions точно массив)
  const filteredTransactions = allTransactions.filter((transaction) => {
    if (typeFilter !== 'all' && transaction?.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && transaction?.category !== categoryFilter) return false;
    
    // Простая фильтрация по периоду (можно расширить при необходимости)
    if (periodFilter !== 'all' && transaction?.date) {
      const txDate = new Date(transaction.date);
      const now = new Date();
      if (periodFilter === 'today' && txDate.toDateString() !== now.toDateString()) return false;
      if (periodFilter === 'month' && txDate.getMonth() !== now.getMonth()) return false;
      if (periodFilter === 'year' && txDate.getFullYear() !== now.getFullYear()) return false;
    }
    
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingTransaction?.id) {
        if (data.type === 'income') {
          await updateIncome(editingTransaction.id, data);
        } else {
          await updateExpense(editingTransaction.id, data);
        }
      } else {
        if (data.type === 'income') {
          await addIncome(data);
        } else {
          await addExpense(data);
        }
      }
      await loadData(); // Перезагружаем данные после успешного сохранения
      handleCloseModal();
    } catch (error) {
      console.error('Ошибка сохранения операции:', error);
      alert('Не удалось сохранить операцию. Проверьте данные.');
    }
  };

  const handleDelete = async (transaction) => {
    if (!transaction?.id) return;

    const confirmed = window.confirm('Вы уверены, что хотите удалить эту операцию?');
    if (!confirmed) return;

    try {
      if (transaction.type === 'income') {
        await deleteIncome(transaction.id);
      } else {
        await deleteExpense(transaction.id);
      }
      await loadData(); // Перезагружаем данные после удаления
    } catch (error) {
      console.error('Ошибка удаления операции:', error);
      alert('Не удалось удалить операцию.');
    }
  };

  const handleResetFilters = () => {
    setTypeFilter('all');
    setCategoryFilter('all');
    setPeriodFilter('all');
  };

  const handleTypeFilterChange = (newType) => {
    setTypeFilter(newType);
    setCategoryFilter('all');
  };

  return (
    <div className={styles.history}>
      <h1 className={styles.title}>История операций</h1>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Тип операции</label>
          <select
            className={styles.filterInput}
            value={typeFilter}
            onChange={(e) => handleTypeFilterChange(e.target.value)}
          >
            <option value="all">Все</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Категория</label>
          <select
            className={styles.filterInput}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Все категории</option>
            {getCategoriesForFilter().map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Период</label>
          <select
            className={styles.filterInput}
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <option value="all">Всё время</option>
            <option value="today">Сегодня</option>
            <option value="month">Этот месяц</option>
            <option value="year">Этот год</option>
          </select>
        </div>

        <button className={styles.resetButton} onClick={handleResetFilters}>
          Сбросить
        </button>
      </div>

      <div className={styles.listContainer}>
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      </div>

      <button className={styles.addButton} onClick={handleOpenAddModal}>
        + Добавить операцию
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Редактировать операцию' : 'Новая операция'}
      >
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          editData={editingTransaction}
        />
      </Modal>
    </div>
  );
}

export default History;