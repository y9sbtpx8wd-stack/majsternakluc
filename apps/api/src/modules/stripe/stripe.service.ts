import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
  });

  async createCheckoutSession(body: CreateCheckoutDto) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name:
                body.period === 'month'
                  ? 'Mesačné členstvo'
                  : 'Ročné členstvo',
            },
            unit_amount: body.amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: body.userId,
        period: body.period,
      },
      success_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    });

    return { url: session.url };
  }
}
