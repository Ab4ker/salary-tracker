import { get } from './api';
import { getIncomes } from './incomeService';
import { getExpenses } from './expenseService';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';
import { isDateInPeriod, getMonthNameShort } from '../utils/formatters';

/**
 * Получить общий баланс (сумма доходов, расходов и разницу)
 * @returns {Promise<Object>} { totalIncome, totalExpense, balance }
 */
export const getBalance = async () => {
  try {
    const data = await get('/summary/balance');
    return data || { totalIncome: 0, totalExpense: 0, balance: 0 };
  } catch (error) {
    console.error('Ошибка получения баланса:', error);
    return { totalIncome: 0, totalExpense: 0, balance: 0 };
  }
};

/**
 * Получить все операции (доходы + расходы), отсортированные по дате (новые сначала)
 * @param {number} limit - максимальное количество операций (по умолчанию без ограничений)
 * @returns {Promise<Array>} массив операций
 */
export const getAllTransactions = async (limit = null) => {
  try {
    // Получаем доходы и расходы параллельно
    const [incomes, expenses] = await Promise.all([
      getIncomes({ limit: 1000 }),
      getExpenses({ limit: 1000 }),
    ]);

    // Объединяем в один массив
    const allTransactions = [...incomes, ...expenses];

    // Сортировка по дате (новые сначала)
    allTransactions.sort((a, b) => {
      const dateA = new Date(a?.date || a?.createdAt || 0);
      const dateB = new Date(b?.date || b?.createdAt || 0);
      return dateB - dateA;
    });

    // Ограничиваем количество, если указан limit
    if (limit && limit > 0) {
      return allTransactions.slice(0, limit);
    }

    return allTransactions;
  } catch (error) {
    console.error('Ошибка получения всех операций:', error);
    return [];
  }
};

/**
 * Получить сумму по категориям (для круговой диаграммы)
 * @param {string} type - тип операции ('income' или 'expense')
 * @param {string} period - период ('all', 'today', 'week', 'month', 'year')
 * @returns {Promise<Array>} массив объектов { name, value } для recharts
 */
export const getByCategory = async (type = 'expense', period = 'all') => {
  try {
    // Формируем параметры запроса
    const params = { type };
    
    // Преобразуем период в даты
    if (period !== 'all') {
      const now = new Date();
      let dateFrom;
      
      switch (period) {
        case 'today':
          dateFrom = now.toISOString().split('T')[0];
          break;
        case 'week':
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          dateFrom = weekAgo.toISOString().split('T')[0];
          break;
        case 'month':
          dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          break;
        case 'year':
          dateFrom = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
          break;
      }
      
      if (dateFrom) {
        params.dateFrom = dateFrom;
      }
    }

    const data = await get('/summary/by-category', params);
    
    // Преобразуем формат ответа для recharts
    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    
    return (data || []).map(item => ({
      name: item.label || 'Прочее',
      value: item.total || 0,
    })).filter(item => item.value > 0);
  } catch (error) {
    console.error('Ошибка получения данных по категориям:', error);
    return [];
  }
};

/**
 * Получить помесячную статистику (для столбчатого графика)
 * @param {number} monthsCount - количество последних месяцев (по умолчанию 6)
 * @returns {Promise<Array>} массив объектов { month, income, expense } для recharts
 */
export const getMonthlySummary = async (monthsCount = 6) => {
  try {
    const data = await get('/summary/by-month', { months: monthsCount });
    
    // Преобразуем формат ответа для recharts
    return (data || []).map(item => ({
      month: getMonthNameShort(new Date(item.month + '-01').getMonth()),
      income: item.income || 0,
      expense: item.expense || 0,
    }));
  } catch (error) {
    console.error('Ошибка получения помесячной статистики:', error);
    return [];
  }
};

/**
 * Получить операцию по ID (из доходов или расходов)
 * @param {string} id - идентификатор операции
 * @returns {Promise<Object|null>} объект операции или null
 */
export const getTransactionById = async (id) => {
  if (!id) return null;

  try {
    // Пробуем получить из доходов
    const income = await getIncomes({ limit: 1000 });
    const foundIncome = income.find(i => i?.id === id);
    if (foundIncome) return foundIncome;

    // Пробуем получить из расходов
    const expense = await getExpenses({ limit: 1000 });
    const foundExpense = expense.find(e => e?.id === id);
    if (foundExpense) return foundExpense;

    return null;
  } catch (error) {
    console.error(`Ошибка получения операции ${id}:`, error);
    return null;
  }
};