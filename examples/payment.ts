import { NetsEasy } from "../src/index.ts";

const netsEasy = new NetsEasy({
  secretKey: "your-secret-key",
  environment: "test",
});

async function createPayment() {
  const paymentResult = await netsEasy.payment.create({
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
      termsUrl: "https://example.com/terms",
    },
    notifications: netsEasy.utils.webhooks.create(
      ["payment.checkout.completed", "payment.charge.created.v2"],
      "https://example.com/webhooks/nets",
      "MySecretAuth12",
    ),
  });

  if (!paymentResult.success) {
    console.error("Payment creation failed:", paymentResult.error);
    return;
  }

  console.log("Payment created successfully!");
  console.log("Payment ID:", paymentResult.data.paymentId);
  console.log("Checkout URL:", paymentResult.data.hostedPaymentPageUrl);
}

async function getPayment(paymentId: string) {
  const paymentInfo = await netsEasy.payment.get(paymentId);

  if (!paymentInfo.success) {
    console.error("Failed to get payment:", paymentInfo.error);
    return;
  }

  const payment = paymentInfo.data.payment;
  console.log("Payment ID:", payment.paymentId);
  console.log("Order details:", payment.orderDetails);
  console.log("Charged amount:", payment.summary?.chargedAmount);
}

async function updateOrder(paymentId: string) {
  const updateResult = await netsEasy.payment.updateOrder(paymentId, {
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

  if (!updateResult.success) {
    console.error("Order update failed:", updateResult.error);
    return;
  }

  console.log("Order updated successfully.");
}

async function chargePayment(paymentId: string) {
  const chargeResult = await netsEasy.payment.charge(paymentId, {
    amount: 1250,
  });

  if (!chargeResult.success) {
    console.error("Payment charge failed:", chargeResult.error);
    return;
  }

  console.log("Payment charged successfully!");
  console.log("Charge ID:", chargeResult.data.chargeId);
}

async function cancelPayment(paymentId: string) {
  const cancelResult = await netsEasy.payment.cancel(paymentId, {
    amount: 1250,
  });

  if (!cancelResult.success) {
    console.error("Payment cancellation failed:", cancelResult.error);
    return;
  }

  console.log("Payment cancelled successfully.");
}

async function refundPayment(paymentId: string) {
  const refundResult = await netsEasy.refund.create(paymentId, {
    amount: 1250,
  });

  if (!refundResult.success) {
    console.error("Payment refund failed:", refundResult.error);
    return;
  }

  console.log("Payment refunded successfully!");
  console.log("Refund ID:", refundResult.data.refundId);
}

// Run examples (uncomment to execute)
// createPayment();
// getPayment("payment-id");
// updateOrder("payment-id");
// chargePayment("payment-id");
// cancelPayment("payment-id");
// refundPayment("payment-id");
