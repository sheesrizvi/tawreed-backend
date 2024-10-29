const express = require('express')
const { adminDashboard, ecomDashboard, maintenanceDashboard, propertyDashboard, companyDashboard } = require('../controller/dashboardController')
const router = express.Router()

router.get('/admin-dashboard', adminDashboard)
router.get('/ecom-dashboard', ecomDashboard)
router.get('/maintenance-dashboard', maintenanceDashboard)
router.get('/property-dashboard', propertyDashboard)
router.get('/company-dashboard', companyDashboard)

module.exports = router
