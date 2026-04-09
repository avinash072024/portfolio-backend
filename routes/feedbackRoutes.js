const express = require('express');
const router = express.Router();
const {
  getFeedbacks,
  getFeedback,
  createFeedback,
  updateFeedback,
  updateFeedbackVerified,
  deleteFeedback,
} = require('../controllers/feedbackController');

router.route('/').get(getFeedbacks).post(createFeedback);
router.route('/:id/verified').patch(updateFeedbackVerified);
router.route('/:id').get(getFeedback).put(updateFeedback).delete(deleteFeedback);

module.exports = router;
