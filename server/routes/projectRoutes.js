const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, projectController.createProject);
router.get('/', authenticateToken, projectController.getProjects);
router.get('/:id', authenticateToken, projectController.getProjectById);
router.put('/:id/accept', authenticateToken, projectController.acceptProject);
router.put('/:id/status', authenticateToken, projectController.updateStatus);
router.post('/:id/deliverables', authenticateToken, projectController.addDeliverable);
router.put('/deliverables/:deliverableId/status', authenticateToken, projectController.updateDeliverableStatus);
router.post('/deliverables/:deliverableId/revisions', authenticateToken, projectController.addRevision);

// Proposals for customer design choices (Staircase, Roof, Layout, etc.)
router.get('/:id/proposals', authenticateToken, projectController.getProposals);
router.post('/:id/proposals', authenticateToken, projectController.createProposal);
router.put('/:id/proposals/:proposalId/choose', authenticateToken, projectController.chooseProposalOption);
router.post('/:id/proposals/:proposalId/choose', authenticateToken, projectController.chooseProposalOption);

module.exports = router;
