import express from 'express';

import { getDashboardSummary, depositTarget } from '../controllers/dashboardController.js';

const router = express.Router();

// rute buat dashboard summary
router.get('/dashboard', getDashboardSummary);

// rute buat nabung kilat
router.post('/targets/deposit', depositTarget);

export default router;