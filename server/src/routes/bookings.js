const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Create new booking
router.post('/', authMiddleware, [
  body('listing').isMongoId().withMessage('Valid listing ID required'),
  body('checkIn').isISO8601().withMessage('Valid check-in date required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date required'),
  body('guests').isNumeric().isInt({ min: 1 }).withMessage('Number of guests must be at least 1'),
  body('guestDetails.name').trim().notEmpty().withMessage('Guest name is required'),
  body('guestDetails.email').isEmail().withMessage('Valid guest email required'),
  body('guestDetails.phone').trim().notEmpty().withMessage('Guest phone is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { listing: listingId, checkIn, checkOut, guests, guestDetails, specialRequests } = req.body;

    // Find the listing
    const listing = await Listing.findById(listingId).populate('host', 'name email');
    if (!listing || !listing.isActive) {
      return res.status(404).json({ message: 'Listing not found or not available' });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(400).json({ message: 'Check-in date must be in the future' });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Calculate number of nights
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    // Check minimum/maximum stay requirements
    if (nights < listing.rules.minStay) {
      return res.status(400).json({ 
        message: `Minimum stay is ${listing.rules.minStay} night${listing.rules.minStay > 1 ? 's' : ''}` 
      });
    }

    if (nights > listing.rules.maxStay) {
      return res.status(400).json({ 
        message: `Maximum stay is ${listing.rules.maxStay} night${listing.rules.maxStay > 1 ? 's' : ''}` 
      });
    }

    // Check guest capacity
    if (guests > listing.capacity.guests) {
      return res.status(400).json({ 
        message: `This property can accommodate maximum ${listing.capacity.guests} guest${listing.capacity.guests > 1 ? 's' : ''}` 
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      listing: listingId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Selected dates are not available' });
    }

    // Calculate total price
    const totalPrice = listing.price * nights;

    // Create booking
    const booking = new Booking({
      listing: listingId,
      guest: req.user._id,
      host: listing.host._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      guestDetails,
      specialRequests: specialRequests || ''
    });

    await booking.save();

    // Populate booking with listing and host details
    await booking.populate([
      { path: 'listing', select: 'title images location price' },
      { path: 'host', select: 'name email' },
      { path: 'guest', select: 'name email' }
    ]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
});

// Get user's bookings
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user._id })
      .populate('listing', 'title images location price')
      .populate('host', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

// Get host's bookings
router.get('/host-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ host: req.user._id })
      .populate('listing', 'title images location price')
      .populate('guest', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error('Get host bookings error:', error);
    res.status(500).json({ message: 'Server error fetching host bookings' });
  }
});

// Get single booking
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing', 'title images location price host')
      .populate('guest', 'name email avatar')
      .populate('host', 'name email avatar');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access to this booking
    if (booking.guest._id.toString() !== req.user._id.toString() && 
        booking.host._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error fetching booking' });
  }
});

// Update booking status (host only)
router.patch('/:id/status', authMiddleware, [
  body('status').isIn(['confirmed', 'cancelled']).withMessage('Status must be confirmed or cancelled')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the host
    if (booking.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only host can update booking status' });
    }

    // Can only update pending bookings
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Can only update pending bookings' });
    }

    booking.status = status;
    await booking.save();

    await booking.populate([
      { path: 'listing', select: 'title images location price' },
      { path: 'guest', select: 'name email avatar' }
    ]);

    res.json({
      message: `Booking ${status} successfully`,
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error updating booking status' });
  }
});

// Cancel booking (guest only)
router.patch('/:id/cancel', authMiddleware, [
  body('reason').optional().trim()
], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the guest
    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only guest can cancel their booking' });
    }

    // Can only cancel pending or confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by guest';
    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
});

// Update booking payment status
router.patch('/:id/payment', authMiddleware, [
  body('paymentId').trim().notEmpty().withMessage('Payment ID is required'),
  body('paymentStatus').isIn(['pending', 'paid', 'refunded', 'failed']).withMessage('Invalid payment status'),
  body('paymentMethod').optional().isIn(['credit_card', 'paypal', 'bank_transfer']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { paymentId, paymentStatus, paymentMethod } = req.body;

    const booking = await Booking.findById(id)
      .populate('listing', 'title')
      .populate('guest', 'name email')
      .populate('host', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the guest who made the booking
    if (booking.guest._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update payment for your own bookings' });
    }

    // Update payment details
    booking.paymentStatus = paymentStatus;
    if (paymentMethod) booking.paymentMethod = paymentMethod;
    
    // Add payment reference (in a real app, you'd store more payment details)
    booking.paymentReference = paymentId;

    // If payment is successful, confirm the booking
    if (paymentStatus === 'paid') {
      booking.status = 'confirmed';
    }

    await booking.save();

    res.json({
      message: 'Payment status updated successfully',
      booking: await Booking.findById(id)
        .populate('listing', 'title images location price')
        .populate('guest', 'name email')
        .populate('host', 'name email')
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ message: 'Server error updating payment status' });
  }
});

// Add review to completed booking
router.post('/:id/review', authMiddleware, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rating, comment } = req.body;

    const booking = await Booking.findById(id)
      .populate('listing', 'title')
      .populate('guest', 'name')
      .populate('host', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the guest
    if (booking.guest._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only review your own bookings' });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed bookings' });
    }

    // Check if already reviewed
    if (booking.review && booking.review.rating) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }

    // Add review
    booking.review = {
      rating,
      comment,
      createdAt: new Date()
    };

    await booking.save();

    // Update listing rating
    const listing = await Listing.findById(booking.listing._id);
    if (listing) {
      // Get all completed bookings with reviews for this listing
      const reviewedBookings = await Booking.find({
        listing: listing._id,
        status: 'completed',
        'review.rating': { $exists: true, $ne: null }
      });

      if (reviewedBookings.length > 0) {
        const totalRating = reviewedBookings.reduce((sum, booking) => sum + booking.review.rating, 0);
        const averageRating = totalRating / reviewedBookings.length;

        listing.rating = {
          average: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          count: reviewedBookings.length
        };

        await listing.save();
      }
    }

    res.json({
      message: 'Review submitted successfully',
      booking: await Booking.findById(id)
        .populate('listing', 'title')
        .populate('guest', 'name')
        .populate('host', 'name')
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error adding review' });
  }
});

// Update booking (guest can cancel, host can confirm/cancel)
router.put('/:id', authMiddleware, [
  body('status').optional().isIn(['confirmed', 'cancelled']).withMessage('Status must be confirmed or cancelled'),
  body('cancellationReason').optional().trim().isLength({ max: 500 }).withMessage('Cancellation reason must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('listing', 'title host')
      .populate('guest', 'name email')
      .populate('host', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has permission to update this booking
    const isGuest = booking.guest._id.toString() === req.user._id.toString();
    const isHost = booking.host._id.toString() === req.user._id.toString();

    if (!isGuest && !isHost) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Guests can only cancel their own bookings
    if (isGuest && status !== 'cancelled') {
      return res.status(403).json({ message: 'Guests can only cancel bookings' });
    }

    // Can only update pending bookings (or confirmed bookings for cancellation)
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot update completed booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Update booking
    booking.status = status;
    if (status === 'cancelled' && cancellationReason) {
      booking.cancellationReason = cancellationReason;
    }

    await booking.save();

    res.json({
      message: `Booking ${status} successfully`,
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error updating booking' });
  }
});

module.exports = router;
