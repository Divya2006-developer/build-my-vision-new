const express = require('express');
const router = express.Router();
const designerController = require('../controllers/designerController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', designerController.getDesigners);
router.get('/portfolios', designerController.getPortfolios);
router.get('/portfolios/my', authenticateToken, designerController.getMyPortfolios);
router.post('/portfolios', authenticateToken, designerController.createPortfolio);
router.put('/portfolios/:id', authenticateToken, designerController.updatePortfolio);
router.delete('/portfolios/:id', authenticateToken, designerController.deletePortfolio);
router.get('/:id', designerController.getDesignerById);
router.put('/profile', authenticateToken, designerController.updateProfile);

module.exports = router;
