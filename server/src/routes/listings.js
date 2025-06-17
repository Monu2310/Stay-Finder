const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Listing = require('../models/Listing');
const { authMiddleware, optionalAuth, requireHost } = require('../middleware/auth');

const router = express.Router();

// Get all listings with optional filters
router.get('/', [
  query('city').optional().trim(),
  query('state').optional().trim(),
  query('country').optional().trim(),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('guests').optional().isNumeric(),
  query('type').optional().isIn(['apartment', 'house', 'villa', 'studio', 'loft', 'cabin', 'other']),
  query('checkIn').optional().isISO8601(),
  query('checkOut').optional().isISO8601(),
  query('amenities').optional(),
  query('page').optional().isNumeric(),
  query('limit').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      city,
      state,
      country,
      minPrice,
      maxPrice,
      guests,
      type,
      checkIn,
      checkOut,
      amenities,
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Location filters
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (country) filter['location.country'] = new RegExp(country, 'i');
    
    // Property type filter
    if (type) filter.type = type;
    
    // Capacity filter
    if (guests) filter['capacity.guests'] = { $gte: parseInt(guests) };

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Amenities filter
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      filter.amenities = { $all: amenitiesArray };
    }

    // Date availability filter
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      // Check if listing is available during the requested dates
      filter.$and = [
        {
          $or: [
            { bookedDates: { $exists: false } },
            { bookedDates: { $size: 0 } },
            {
              bookedDates: {
                $not: {
                  $elemMatch: {
                    $or: [
                      // Requested dates don't overlap with booked dates
                      {
                        $and: [
                          { startDate: { $lte: checkInDate } },
                          { endDate: { $gte: checkInDate } }
                        ]
                      },
                      {
                        $and: [
                          { startDate: { $lte: checkOutDate } },
                          { endDate: { $gte: checkOutDate } }
                        ]
                      },
                      {
                        $and: [
                          { startDate: { $gte: checkInDate } },
                          { endDate: { $lte: checkOutDate } }
                        ]
                      }
                    ]
                  }
                }
              }
            }
          ]
        }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const listings = await Listing.find(filter)
      .populate('host', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Listing.countDocuments(filter);

    res.json({
      listings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      filters: {
        city,
        state,
        country,
        minPrice,
        maxPrice,
        guests,
        type,
        checkIn,
        checkOut,
        amenities
      }
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error fetching listings' });
  }
});

// Get single listing by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('host', 'name avatar bio createdAt');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (!listing.isActive && (!req.user || req.user._id.toString() !== listing.host._id.toString())) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json({ listing });
  } catch (error) {
    console.error('Get listing error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(500).json({ message: 'Server error fetching listing' });
  }
});

// Create new listing (host only)
router.post('/', authMiddleware, requireHost, [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description').trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be 20-2000 characters'),
  body('type').isIn(['apartment', 'house', 'villa', 'studio', 'loft', 'cabin', 'other']),
  body('location.address').trim().notEmpty().withMessage('Address is required'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.state').trim().notEmpty().withMessage('State is required'),
  body('location.country').trim().notEmpty().withMessage('Country is required'),
  body('location.zipCode').trim().notEmpty().withMessage('ZIP code is required'),
  body('price').isNumeric().isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
  body('capacity.guests').isNumeric().isInt({ min: 1 }).withMessage('Guest capacity must be at least 1'),
  body('capacity.bedrooms').isNumeric().isInt({ min: 0 }).withMessage('Bedrooms must be 0 or more'),
  body('capacity.bathrooms').isNumeric().isFloat({ min: 0 }).withMessage('Bathrooms must be 0 or more'),
  body('capacity.beds').isNumeric().isInt({ min: 1 }).withMessage('Beds must be at least 1'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const listingData = {
      ...req.body,
      host: req.user._id
    };

    const listing = new Listing(listingData);
    await listing.save();

    await listing.populate('host', 'name avatar');

    res.status(201).json({
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error creating listing' });
  }
});

// Update listing (host only)
router.put('/:id', authMiddleware, requireHost, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user owns this listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('host', 'name avatar');

    res.json({
      message: 'Listing updated successfully',
      listing: updatedListing
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Server error updating listing' });
  }
});

// Delete/deactivate listing (host only)
router.delete('/:id', authMiddleware, requireHost, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user owns this listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Soft delete - just mark as inactive
    listing.isActive = false;
    await listing.save();

    res.json({ message: 'Listing deactivated successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error deleting listing' });
  }
});

// Get host's listings
router.get('/host/my-listings', authMiddleware, requireHost, async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ listings });
  } catch (error) {
    console.error('Get host listings error:', error);
    res.status(500).json({ message: 'Server error fetching your listings' });
  }
});

module.exports = router;
