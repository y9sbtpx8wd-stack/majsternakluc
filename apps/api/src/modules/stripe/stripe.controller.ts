import { Controller, Post, Req, Headers, Body } from '@nestjs/common';
import Stripe from 'stripe';
import { InvoiceService } from '../invoice/invoice.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
  });

  constructor(
    private readonly invoice: InvoiceService,
    private readonly stripeService: StripeService,
  ) {}

  // ---------------------------------------------------------
  // CHECKOUT – jednorazová platba (mesačné / ročné obdobie)
  // ---------------------------------------------------------
  @Post('checkout')
  async createCheckout(@Body() body: CreateCheckoutDto) {
    return this.stripeService.createCheckoutSession(body);
  }

  // ---------------------------------------------------------
  // CUSTOMER PORTAL (zmena karty, faktúry, billing)
  // ---------------------------------------------------------
  @Post('customer-portal')
  async customerPortal(@Body() body: { customerId: string }) {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: body.customerId,
      return_url: process.env.STRIPE_CUSTOMER_PORTAL_RETURN_URL!,
    });

    return { url: session.url };
  }

  // ---------------------------------------------------------
  // WEBHOOK – automatická faktúra po úspešnej platbe
  // ---------------------------------------------------------
  @Post('webhook')
  async webhook(@Req() req, @Headers('stripe-signature') signature: string) {
    const rawBody = req.rawBody;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      console.error('❌ Stripe webhook signature error:', err);
      return { error: 'Invalid signature' };
    }

    // ---------------------------------------------------------
    // CHECKOUT SESSION COMPLETED → vytvor faktúru
    // ---------------------------------------------------------
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;

      const userId = session.metadata?.userId;
      const amount = session.amount_total / 100;

      if (!userId || !amount) {
        console.error('❌ Missing metadata in checkout.session.completed');
        return { error: 'Missing metadata' };
      }

      await this.invoice.createInvoice(userId, amount);
    }

    // ---------------------------------------------------------
    // INÉ EVENTY – pripravené na rozšírenie
    // ---------------------------------------------------------
    if (event.type === 'invoice.payment_succeeded') {
      // subscription billing (nepoužívaš)
    }

    if (event.type === 'customer.subscription.deleted') {
      // zrušenie predplatného (nepoužívaš)
    }

    return { received: true };
  }
}
