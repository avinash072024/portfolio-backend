const express = require('express');
const router = express.Router();
const {
  getFeedbacks,
  getFeedback,
  createFeedback,
  updateFeedback,
  updateFeedbackVerified,
  deleteFeedback,
  deleteMultipleFeedbacks,
  updateMultipleFeedbackVerified,
} = require('../controllers/feedbackController');

router.route('/').get(getFeedbacks).post(createFeedback);
router.route('/bulk').delete(deleteMultipleFeedbacks);
router.route('/bulk/verified').patch(updateMultipleFeedbackVerified);
router.route('/:id/verified').patch(updateFeedbackVerified);
router.route('/:id').get(getFeedback).put(updateFeedback).delete(deleteFeedback);

module.exports = router;
