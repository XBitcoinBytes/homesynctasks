import { MailService } from '@sendgrid/mail';

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class ProductionEmailService {
  private mailService: MailService | null = null;
  private isConfigured = false;
  private verifiedSender = 'test@example.com'; // Placeholder - requires user's verified domain

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    const apiKey = process.env.SENDGRID_API_KEY;
    
    if (apiKey) {
      this.mailService = new MailService();
      this.mailService.setApiKey(apiKey);
      this.isConfigured = true;
      console.log('✅ Production email service initialized');
      console.log('⚠️ Email delivery requires verified sender domain in SendGrid');
    }
  }

  async sendInvitationEmail(params: EmailParams): Promise<boolean> {
    if (!this.isConfigured || !this.mailService) {
      return false;
    }

    try {
      const msg: any = {
        to: params.to,
        from: this.verifiedSender,
        subject: params.subject
      };

      if (params.html) {
        msg.html = params.html;
      }
      if (params.text) {
        msg.text = params.text;
      }

      await this.mailService.send(msg);
      console.log('✅ Email delivered successfully to:', params.to);
      return true;
    } catch (error: any) {
      console.error('❌ Email delivery failed:', error.response?.body || error.message);
      return false;
    }
  }

  getVerifiedSender(): string {
    return this.verifiedSender;
  }

  isReady(): boolean {
    return this.isConfigured;
  }
}

export const productionEmailService = new ProductionEmailService();