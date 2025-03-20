/**
 * Circus Schedule Manager
 * 
 * A demo JavaScript module for managing circus show schedules and bookings.
 */

class CircusScheduler {
  /**
   * Constructor initializes the scheduler with show and venue data
   * @param {Array} shows - Array of show objects
   * @param {Array} venues - Array of venue objects
   */
  constructor(shows = [], venues = []) {
    this.shows = shows;
    this.venues = venues;
    this.bookings = [];
  }

  /**
   * Load data from JSON sources
   * @param {string} showsUrl - URL to shows data
   * @param {string} venuesUrl - URL to venues data
   * @returns {Promise} Promise that resolves when all data is loaded
   */
  async loadData(showsUrl, venuesUrl) {
    try {
      // Fetch and parse shows data
      const showsResponse = await fetch(showsUrl);
      const showsData = await showsResponse.json();
      this.shows = showsData;

      // Fetch and parse venues data
      const venuesResponse = await fetch(venuesUrl);
      const venuesData = await venuesResponse.json();
      this.venues = venuesData.venues;

      console.log(`Loaded ${this.shows.length} shows and ${this.venues.length} venues`);
      return true;
    } catch (error) {
      console.error('Error loading schedule data:', error);
      return false;
    }
  }

  /**
   * Get all upcoming shows after a given date
   * @param {Date} afterDate - Starting date for filtering shows
   * @returns {Array} Filtered list of upcoming shows
   */
  getUpcomingShows(afterDate = new Date()) {
    return this.shows.filter(show => {
      const startDate = new Date(show.start_date);
      return startDate >= afterDate;
    }).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  }

  /**
   * Get details about a specific show
   * @param {number} showId - ID of the show to retrieve
   * @returns {Object|null} Show details or null if not found
   */
  getShowDetails(showId) {
    const show = this.shows.find(s => s.show_id === showId);
    if (!show) return null;

    // Add venue information
    const venue = this.venues.find(v => v.id === show.venue_id);
    return {
      ...show,
      venue: venue || { name: 'Unknown venue' }
    };
  }

  /**
   * Check availability for a specific show date
   * @param {number} showId - ID of the show
   * @param {string} date - Date string in YYYY-MM-DD format
   * @returns {Object} Availability information
   */
  checkAvailability(showId, date) {
    const show = this.getShowDetails(showId);
    if (!show) return { available: false, reason: 'Show not found' };

    // Check if date is within show run
    const checkDate = new Date(date);
    const startDate = new Date(show.start_date);
    const endDate = new Date(show.end_date);

    if (checkDate < startDate || checkDate > endDate) {
      return { 
        available: false, 
        reason: 'Date is outside of show run',
        showPeriod: `${show.start_date} to ${show.end_date}`
      };
    }

    // Count existing bookings for this date
    const dateBookings = this.bookings.filter(
      b => b.showId === showId && b.date === date
    );
    
    const remainingSeats = show.capacity - dateBookings.reduce((sum, b) => sum + b.seats, 0);
    
    return {
      available: remainingSeats > 0,
      remainingSeats,
      totalCapacity: show.capacity,
      percentFull: Math.round((show.capacity - remainingSeats) / show.capacity * 100)
    };
  }

  /**
   * Create a new booking for a show
   * @param {number} showId - ID of the show
   * @param {string} date - Date string in YYYY-MM-DD format
   * @param {number} seats - Number of seats to book
   * @param {Object} customer - Customer information
   * @returns {Object} Booking confirmation or error
   */
  createBooking(showId, date, seats, customer) {
    const availability = this.checkAvailability(showId, date);
    
    if (!availability.available) {
      return { 
        success: false, 
        message: `Booking failed: ${availability.reason || 'No availability'}` 
      };
    }
    
    if (seats > availability.remainingSeats) {
      return { 
        success: false, 
        message: `Booking failed: Only ${availability.remainingSeats} seats available` 
      };
    }
    
    // Create booking object
    const bookingId = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const show = this.getShowDetails(showId);
    
    const booking = {
      bookingId,
      showId,
      showTitle: show.title,
      date,
      seats,
      customer,
      venue: show.venue.name,
      amount: seats * (show.ticket_price_min + show.ticket_price_max) / 2,
      createdAt: new Date().toISOString()
    };
    
    this.bookings.push(booking);
    
    return {
      success: true,
      booking,
      message: `Successfully booked ${seats} seats for ${show.title}`
    };
  }

  /**
   * Cancel an existing booking
   * @param {string} bookingId - ID of the booking to cancel
   * @returns {Object} Cancellation confirmation or error
   */
  cancelBooking(bookingId) {
    const index = this.bookings.findIndex(b => b.bookingId === bookingId);
    
    if (index === -1) {
      return {
        success: false,
        message: 'Booking not found'
      };
    }
    
    const booking = this.bookings[index];
    this.bookings.splice(index, 1);
    
    return {
      success: true,
      message: `Booking ${bookingId} has been cancelled`,
      refundAmount: booking.amount
    };
  }

  /**
   * Get revenue statistics by venue
   * @returns {Array} Revenue by venue
   */
  getRevenueByVenue() {
    const venueRevenue = {};
    
    // Initialize each venue with zero revenue
    this.venues.forEach(venue => {
      venueRevenue[venue.id] = {
        id: venue.id,
        name: venue.name,
        revenue: 0,
        bookings: 0
      };
    });
    
    // Sum up booking amounts by venue
    this.bookings.forEach(booking => {
      const show = this.shows.find(s => s.show_id === booking.showId);
      if (show && venueRevenue[show.venue_id]) {
        venueRevenue[show.venue_id].revenue += booking.amount;
        venueRevenue[show.venue_id].bookings += 1;
      }
    });
    
    return Object.values(venueRevenue)
      .sort((a, b) => b.revenue - a.revenue);
  }
}

// Example usage:
/*
const scheduler = new CircusScheduler();

// Load data
scheduler.loadData('/data/shows.json', '/data/venues.json')
  .then(() => {
    // Get upcoming shows
    const upcoming = scheduler.getUpcomingShows();
    console.log(`${upcoming.length} upcoming shows found`);
    
    // Check availability
    const availability = scheduler.checkAvailability(1, '2025-04-20');
    console.log(`Show #1 on April 20, 2025: ${availability.remainingSeats} seats available`);
    
    // Create a booking
    const booking = scheduler.createBooking(1, '2025-04-20', 2, {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-1234'
    });
    console.log(`Booking created: ${booking.success ? 'Success' : 'Failed'}`);
  });
*/

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CircusScheduler };
}
