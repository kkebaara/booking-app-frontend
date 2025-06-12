// services/bookeoService.js
class BookeoService {
    constructor() {
      this.appId = process.env.EXPO_PUBLIC_BOOKEO_APP_ID;
      this.secretKey = process.env.EXPO_PUBLIC_BOOKEO_SECRET_KEY;
      this.baseURL = 'https://api.bookeo.com/v2';
      
      // Validate credentials are available
      if (!this.appId || !this.secretKey) {
        throw new Error('BookEO credentials not found in environment variables');
      }
    }
  
    // Helper method to make authenticated requests to BookEO API
    async makeRequest(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`;
      
      const defaultHeaders = {
        'X-Bookeo-appId': this.appId,
        'X-Bookeo-secretKey': this.secretKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
  
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...defaultHeaders,
            ...options.headers,
          },
        });
  
        // Handle different response types
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`BookEO API Error: ${response.status} - ${errorText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('BookEO API Request failed:', error);
        throw error;
      }
    }
  
    // Get all products/services available for booking
    async getProducts() {
      try {
        return await this.makeRequest('/products');
      } catch (error) {
        console.error('Failed to get products:', error);
        throw new Error('Unable to load services. Please try again.');
      }
    }
  
    // Get availability slots for a specific product
    async getAvailability(productId, startDate, endDate) {
      try {
        const params = new URLSearchParams({
          productId,
          startTime: startDate,
          endTime: endDate,
        });
        
        return await this.makeRequest(`/availability/slots?${params}`);
      } catch (error) {
        console.error('Failed to get availability:', error);
        throw new Error('Unable to load available times. Please try again.');
      }
    }
  
    // Create a new booking
    async createBooking(bookingData) {
      try {
        return await this.makeRequest('/bookings', {
          method: 'POST',
          body: JSON.stringify(bookingData),
        });
      } catch (error) {
        console.error('Failed to create booking:', error);
        throw new Error('Unable to create booking. Please try again.');
      }
    }
  
    // Get existing bookings with optional filters
    async getBookings(params = {}) {
      try {
        const searchParams = new URLSearchParams(params);
        return await this.makeRequest(`/bookings?${searchParams}`);
      } catch (error) {
        console.error('Failed to get bookings:', error);
        throw new Error('Unable to load bookings. Please try again.');
      }
    }
  
    // Get or create a customer
    async getOrCreateCustomer(customerData) {
      try {
        // First, try to find existing customer by email
        const existingCustomers = await this.makeRequest('/customers');
        const existingCustomer = existingCustomers.data?.find(
          customer => customer.emailAddress === customerData.email
        );
  
        if (existingCustomer) {
          return existingCustomer;
        }
  
        // Create new customer if not found
        const newCustomer = await this.makeRequest('/customers', {
          method: 'POST',
          body: JSON.stringify({
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            emailAddress: customerData.email,
            phoneNumber: customerData.phone || '',
          }),
        });
  
        return newCustomer;
      } catch (error) {
        console.error('Failed to get/create customer:', error);
        throw new Error('Unable to process customer information.');
      }
    }
  
    // Cancel a booking
    async cancelBooking(bookingId, reason = '') {
      try {
        return await this.makeRequest(`/bookings/${bookingId}`, {
          method: 'DELETE',
          body: JSON.stringify({ reason }),
        });
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        throw new Error('Unable to cancel booking. Please try again.');
      }
    }
  
    // Get booking details by ID
    async getBookingDetails(bookingId) {
      try {
        return await this.makeRequest(`/bookings/${bookingId}`);
      } catch (error) {
        console.error('Failed to get booking details:', error);
        throw new Error('Unable to load booking details.');
      }
    }
  
    // Test API connection
    async testConnection() {
      try {
        const response = await this.makeRequest('/products');
        return {
          success: true,
          message: `Connected successfully! Found ${response.data?.length || 0} services.`,
          data: response
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          error: error
        };
      }
    }
  
    // Format booking data for BookEO API
    formatBookingData(serviceId, dateTime, customer, additionalInfo = {}) {
      return {
        productId: serviceId,
        startTime: dateTime,
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          emailAddress: customer.email,
          phoneNumber: customer.phone || '',
        },
        participantDetails: [{
          personId: 1,
          details: {
            firstName: customer.firstName,
            lastName: customer.lastName,
          }
        }],
        ...additionalInfo
      };
    }
  
    // Convert BookEO product to app service format
    convertProductToService(product) {
      return {
        id: product.productId,
        name: product.name,
        description: product.description || 'Professional service',
        duration: product.duration || '30 min',
        price: product.price?.amount || 0,
        currency: product.price?.currency || 'USD',
        icon: this.getServiceIcon(product.name),
        category: product.category || 'General',
      };
    }
  
    // Get appropriate icon for service type
    getServiceIcon(serviceName) {
      const name = serviceName.toLowerCase();
      if (name.includes('hair') || name.includes('cut')) return 'cut';
      if (name.includes('massage') || name.includes('spa')) return 'flower';
      if (name.includes('nail') || name.includes('mani') || name.includes('pedi')) return 'hand-left';
      if (name.includes('facial') || name.includes('beauty')) return 'sparkles';
      if (name.includes('fitness') || name.includes('training')) return 'fitness';
      return 'calendar'; // default icon
    }
  }
  
  // Export singleton instance
  export default new BookeoService();