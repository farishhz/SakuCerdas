import express from 'express';
import { authMiddleware } from './authMiddleware.js';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { getFinancialHealth } from '../controllers/healthController.js';
import { getTransactions, createTransaction, deleteTransaction } from '../controllers/transactionController.js';
import { getTargets, createTarget, deleteTarget, depositTarget } from '../controllers/targetController.js';
import { getBudgets, createBudget, deleteBudget } from '../controllers/budgetController.js';
import { getEmergencyFund, saveEmergencyFund } from '../controllers/emergencyFundController.js';
import { getDebts, createDebt, toggleDebtPaid, deleteDebt } from '../controllers/debtController.js';
import { getRecurring, createRecurring, toggleRecurringActive, deleteRecurring } from '../controllers/recurringController.js';
import { getCategories } from '../controllers/categoryController.js';
import { getProfile, updateProfile, getBadges, getActivityLogs } from '../controllers/userController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/dashboard', getDashboardSummary);
router.get('/financial-health', getFinancialHealth);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.get('/badges', getBadges);
router.get('/activity-logs', getActivityLogs);

router.get('/transactions', getTransactions);
router.post('/transactions', createTransaction);
router.delete('/transactions/:id', deleteTransaction);

router.get('/targets', getTargets);
router.post('/targets', createTarget);
router.post('/targets/deposit', depositTarget);
router.delete('/targets/:id', deleteTarget);

router.get('/budgets', getBudgets);
router.post('/budgets', createBudget);
router.delete('/budgets/:id', deleteBudget);

router.get('/emergency-fund', getEmergencyFund);
router.post('/emergency-fund', saveEmergencyFund);

router.get('/debts', getDebts);
router.post('/debts', createDebt);
router.patch('/debts/:id', toggleDebtPaid);
router.delete('/debts/:id', deleteDebt);

router.get('/recurring', getRecurring);
router.post('/recurring', createRecurring);
router.patch('/recurring/:id', toggleRecurringActive);
router.delete('/recurring/:id', deleteRecurring);

router.get('/categories', getCategories);

export default router;