import { NetsEasy } from "../src/index.ts";

const nets = new NetsEasy({
  secretKey: "your-secret-key",
  environment: "test",
});

async function createPayment() {
  const result = await nets.payment.create({
    order: {
      items: [
        {
          reference: "product-1",
          name: "Example Product",
          quantity: 1,
          unit: "pcs",
          unitPrice: 1000,
          taxRate: 2500,
          taxAmount: 250,
          grossTotalAmount: 1250,
          netTotalAmount: 1000,
        },
      ],
      amount: 1250,
      currency: "EUR",
      reference: `order-${Date.now()}`,
    },
    checkout: {
      integrationType: "HostedPaymentPage",
      returnUrl: "https://example.com/checkout/thank-you",
      cancelUrl: "https://example.com/checkout/cancelled",
      termsUrl: "https://example.com/terms",
    },
    notifications: nets.utils.webhooks.create(
      [
        "payment.checkout.completed",
        "payment.reservation.created.v2",
        "payment.charge.created.v2",
      ],
      "https://example.com/webhooks/nets",
      "MySecretAuth12",
    ),
  });

  if (!result.success) {
    console.error("Payment creation failed:", result.error);
    return;
  }

  console.log("Payment created successfully!");
  console.log("Payment ID:", result.data.paymentId);
  console.log("Checkout URL:", result.data.hostedPaymentPageUrl);
}

async function getPayment(paymentId: string) {
  const result = await nets.payment.get(paymentId);

  if (!result.success) {
    console.error("Failed to get payment:", result.error);
    return;
  }

  const payment = result.data.payment;
  console.log("Payment ID:", payment.paymentId);
  console.log("Order amount:", payment.orderDetails.amount);
  console.log("Charged amount:", payment.summary?.chargedAmount);
  console.log("Cancelled amount:", payment.summary?.cancelledAmount);
}

async function chargePayment(paymentId: string) {
  const result = await nets.payment.charge(paymentId, {
    amount: 1250,
  });

  if (!result.success) {
    console.error("Charge failed:", result.error);
    return;
  }

  console.log("Charged successfully! Charge ID:", result.data.chargeId);
}

async function cancelPayment(paymentId: string) {
  const result = await nets.payment.cancel(paymentId, { amount: 1250 });

  if (!result.success) {
    console.error("Cancellation failed:", result.error);
    return;
  }

  console.log("Payment cancelled successfully.");
}

async function updateReferenceInfo(paymentId: string) {
  const result = await nets.payment.updateReferenceInfo(paymentId, {
    checkoutUrl: "https://example.com/checkout",
    reference: "order-new-ref-123",
  });

  if (!result.success) {
    console.error("Update reference info failed:", result.error);
    return;
  }

  console.log("Reference info updated.");
}

async function updateOrder(paymentId: string) {
  const result = await nets.payment.updateOrder(paymentId, {
    amount: 2500,
    items: [
      {
        reference: "product-1",
        name: "Example Product",
        quantity: 2,
        unit: "pcs",
        unitPrice: 1000,
        taxRate: 2500,
        taxAmount: 500,
        grossTotalAmount: 2500,
        netTotalAmount: 2000,
      },
    ],
  });

  if (!result.success) {
    console.error("Order update failed:", result.error);
    return;
  }

  console.log("Order updated.");
}

async function terminatePayment(paymentId: string) {
  const result = await nets.payment.terminate(paymentId);

  if (!result.success) {
    console.error("Termination failed:", result.error);
    return;
  }

  console.log("Checkout session terminated.");
}

async function refundPayment(paymentId: string) {
  const result = await nets.refund.create(paymentId, { amount: 1250 });

  if (!result.success) {
    console.error("Refund failed:", result.error);
    return;
  }

  console.log("Refund created. Refund ID:", result.data.refundId);
}

async function refundCharge(chargeId: string) {
  const result = await nets.refund.createFromCharge(chargeId, { amount: 500 });

  if (!result.success) {
    console.error("Charge refund failed:", result.error);
    return;
  }

  console.log("Charge refunded. Refund ID:", result.data.refundId);
}

async function createSubscriptionPayment() {
  const result = await nets.payment.create({
    order: {
      items: [
        {
          reference: "subscription-1",
          name: "Monthly Plan",
          quantity: 1,
          unit: "pcs",
          unitPrice: 2000,
          taxRate: 2500,
          taxAmount: 500,
          grossTotalAmount: 2500,
          netTotalAmount: 2000,
        },
      ],
      amount: 2500,
      currency: "EUR",
      reference: `sub-order-${Date.now()}`,
    },
    checkout: {
      integrationType: "HostedPaymentPage",
      returnUrl: "https://example.com/subscription/thank-you",
      termsUrl: "https://example.com/terms",
    },
    subscription: {
      interval: 30,
      endDate: "2026-12-31T23:59:59Z",
    },
  });

  if (!result.success) {
    console.error("Subscription payment creation failed:", result.error);
    return;
  }

  console.log("Subscription payment created!");
  console.log("Payment ID:", result.data.paymentId);
}

async function chargeSubscription(subscriptionId: string) {
  const result = await nets.subscription.charge(subscriptionId, {
    order: {
      items: [
        {
          reference: "subscription-1",
          name: "Monthly Plan",
          quantity: 1,
          unit: "pcs",
          unitPrice: 2000,
          taxRate: 2500,
          taxAmount: 500,
          grossTotalAmount: 2500,
          netTotalAmount: 2000,
        },
      ],
      amount: 2500,
      currency: "EUR",
    },
    notifications: nets.utils.webhooks.subscriptionCharge(
      "https://example.com/webhooks/nets",
    ),
  });

  if (!result.success) {
    console.error("Subscription charge failed:", result.error);
    return;
  }

  console.log("Subscription charged successfully!");
  console.log("Payment ID:", result.data.paymentId);
  console.log("Charge ID:", result.data.chargeId);
}

async function bulkChargeSubscriptions() {
  const result = await nets.subscription.bulkCharge({
    externalBulkChargeId: `bulk-${Date.now()}`,
    notifications: nets.utils.webhooks.subscriptionCharge(
      "https://example.com/webhooks/nets",
    ),
    subscriptions: [
      {
        subscriptionId: "some-subscription-uuid",
        order: {
          items: [
            {
              reference: "sub-product-1",
              name: "Monthly Plan",
              quantity: 1,
              unit: "pcs",
              unitPrice: 2000,
              taxRate: 2500,
              taxAmount: 500,
              grossTotalAmount: 2500,
              netTotalAmount: 2000,
            },
          ],
          amount: 2500,
          currency: "EUR",
        },
      },
    ],
  });

  if (!result.success) {
    console.error("Bulk charge failed:", result.error);
    return;
  }

  console.log("Bulk charge initiated. Bulk ID:", result.data.bulkId);
}

// Run examples (uncomment to execute):
// createPayment();
// getPayment("payment-id");
// chargePayment("payment-id");
// cancelPayment("payment-id");
// updateReferenceInfo("payment-id");
// updateOrder("payment-id");
// terminatePayment("payment-id");
// refundPayment("payment-id");
// refundCharge("charge-id");
// createSubscriptionPayment();
// chargeSubscription("subscription-id");
// bulkChargeSubscriptions();
