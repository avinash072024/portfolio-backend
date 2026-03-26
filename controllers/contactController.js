const Contact = require('../models/Contact');

// @desc    Get contact details
// @route   GET /api/contact
// @access  Public
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact details not found' });
    }
    res.status(200).json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update or create contact details
// @route   POST /api/contact
// @access  Private
const updateContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();

    if (contact) {
      // Update existing
      contact = await Contact.findByIdAndUpdate(
        contact._id,
        req.body,
        { new: true, runValidators: true }
      );
      res.status(200).json({ success: true, message: 'Contact details updated successfully', contact });
    } else {
      // Create new
      contact = await Contact.create(req.body);
      res.status(201).json({ success: true, message: 'Contact details created successfully', contact });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getContact,
  updateContact,
};
