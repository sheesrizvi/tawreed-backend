const express = require('express')
const { adminDashboard, ecomDashboard } = require('../controller/dashboardController')
const router = express.Router()

router.get('/admin-dashboard', adminDashboard)
router.get('/ecom-dashboard', ecomDashboard)

module.exports = router
