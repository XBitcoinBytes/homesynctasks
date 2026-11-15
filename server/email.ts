import { MailService } from '@sendgrid/mail';

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private mailService: MailService | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    const apiKey = process.env.SENDGRID_API_KEY;
    
    if (apiKey) {
      this.mailService = new MailService();
      this.mailService.setApiKey(apiKey);
      this.isInitialized = true;
      console.log('✅ SendGrid email service initialized');
      console.log('📧 Important: To send emails, verify a sender address at https://app.sendgrid.com/settings/sender_auth');
    } else {
      console.log('❌ SENDGRID_API_KEY not found');
    }
  }

  async sendEmail(params: EmailParams): Promise<boolean> {
    if (!this.isInitialized || !this.mailService) {
      console.log('❌ Email service not configured. SendGrid API key required.');
      return false;
    }

    try {
      // Use the simplified SendGrid message format
      const msg: any = {
        to: params.to,
        from: params.from,
        subject: params.subject,
      };

      // Add content based on what's provided
      if (params.html) {
        msg.html = params.html;
      }
      if (params.text) {
        msg.text = params.text;
      }

      await this.mailService.send(msg);
      console.log('✅ Email sent successfully to:', params.to);
      return true;
    } catch (error: any) {
      // Handle sender verification errors gracefully
      const errorMessage = error.response?.body || error.message;
      if (errorMessage && typeof errorMessage === 'object' && errorMessage.errors) {
        const senderError = errorMessage.errors.find((e: any) => 
          e.field === 'from' && (
            e.message.includes('verified Sender Identity') ||
            e.message.includes('free email address domain')
          )
        );
        if (senderError) {
          console.log('⚠️  SendGrid requires domain verification. For production use:');
          console.log('   1. Get your own domain (like yourapp.com)');
          console.log('   2. Verify it in SendGrid dashboard');
          console.log('   3. Update the from address to use your domain');
          console.log('   Email content logged below for manual sending.');
          return false; // Will trigger fallback logging
        }
      }
      console.error('❌ SendGrid email failed:', errorMessage);
      return false;
    }
  }

  isConfigured(): boolean {
    return this.isInitialized;
  }
}

export const emailService = new EmailService();