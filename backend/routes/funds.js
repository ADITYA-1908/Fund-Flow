import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/funds/save
// @desc    Save a mutual fund for the authenticated user
// @access  Private
router.post('/save', [
  authMiddleware,
  body('schemeCode')
    .notEmpty()
    .withMessage('Scheme code is required'),
  body('schemeName')
    .notEmpty()
    .withMessage('Scheme name is required'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { schemeCode, schemeName } = req.body;
    const userId = req.user._id;

    // Check if fund is already saved
    const user = await User.findById(userId);
    const existingFund = user.savedFunds.find(
      fund => fund.schemeCode === schemeCode
    );

    if (existingFund) {
      return res.status(400).json({
        message: 'Fund is already saved',
      });
    }

    // Add fund to user's saved funds
    user.savedFunds.push({
      schemeCode,
      schemeName,
      savedAt: new Date(),
    });

    await user.save();

    res.status(201).json({
      message: 'Fund saved successfully',
      fund: {
        schemeCode,
        schemeName,
        savedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Save fund error:', error);
    res.status(500).json({
      message: 'Server error while saving fund',
    });
  }
});

// @route   GET /api/funds/saved
// @desc    Get all saved funds for the authenticated user
// @access  Private
router.get('/saved', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json(user.savedFunds.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt)));
  } catch (error) {
    console.error('Get saved funds error:', error);
    res.status(500).json({
      message: 'Server error while fetching saved funds',
    });
  }
});

// @route   DELETE /api/funds/saved/:schemeCode
// @desc    Remove a saved fund
// @access  Private
router.delete('/saved/:schemeCode', authMiddleware, async (req, res) => {
  try {
    const { schemeCode } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const fundIndex = user.savedFunds.findIndex(
      fund => fund.schemeCode === schemeCode
    );

    if (fundIndex === -1) {
      return res.status(404).json({
        message: 'Saved fund not found',
      });
    }

    user.savedFunds.splice(fundIndex, 1);
    await user.save();

    res.json({
      message: 'Fund removed successfully',
    });
  } catch (error) {
    console.error('Remove saved fund error:', error);
    res.status(500).json({
      message: 'Server error while removing saved fund',
    });
  }
});

export default router;