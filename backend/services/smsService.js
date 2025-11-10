const twilio = require('twilio');

class SMSService {
  constructor() {
    this.isEnabled = false;
    this.client = null;
    this.initialize();
  }

  initialize() {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

      // Check if all required Twilio credentials are present and valid
      if (!accountSid || !authToken || !phoneNumber) {
        console.warn('⚠️  Twilio credentials missing. SMS service will run in development mode.');
        return;
      }

      if (!accountSid.startsWith('AC')) {
        console.warn('⚠️  Invalid Twilio Account SID format. SMS service will run in development mode.');
        return;
      }

      this.client = twilio(accountSid, authToken);
      this.isEnabled = true;
      console.log('✅ SMS Service initialized successfully');
      
    } catch (error) {
      console.warn('⚠️  Twilio initialization failed. SMS service will run in development mode:', error.message);
      this.isEnabled = false;
    }
  }

  async sendAlert({ to, message }) {
    try {
      // In development or when Twilio is not enabled, log instead of sending actual SMS
      if (!this.isEnabled || process.env.NODE_ENV === 'development') {
        console.log('📱 SMS Alert (Development Mode):', { 
          to, 
          message: message.substring(0, 100) + '...',
          timestamp: new Date().toISOString()
        });
        return { 
          success: true, 
          sid: 'dev_' + Date.now(),
          mode: 'development'
        };
      }

      // Production: Send actual SMS
      const result = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });

      console.log('✅ SMS sent successfully:', result.sid);
      return { 
        success: true, 
        sid: result.sid,
        mode: 'production'
      };
    } catch (error) {
      console.error('❌ SMS sending error:', error.message);
      return { 
        success: false, 
        error: error.message,
        mode: this.isEnabled ? 'production' : 'development'
      };
    }
  }

  async sendBulkAlerts(alerts) {
    const results = await Promise.all(
      alerts.map(alert => this.sendAlert(alert))
    );
    
    const summary = {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      mode: this.isEnabled ? 'production' : 'development'
    };

    console.log(`📱 Bulk SMS Summary: ${summary.successful}/${summary.total} sent successfully`);
    return summary;
  }

  getStatus() {
    return {
      isEnabled: this.isEnabled,
      mode: process.env.NODE_ENV,
      hasCredentials: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
      service: 'Twilio'
    };
  }
}

// Create singleton instance
const smsService = new SMSService();

module.exports = smsService;