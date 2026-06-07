# Nets Easy API Handler

A TypeScript library for the Nets Easy payment API, built with a
resource-oriented structure for intuitive API usage.

## Installation

```bash
npm install nets-easy
```

## Features

- Resource-oriented API structure for intuitive usage
- TypeScript type definitions for all API requests and responses
- Separation by resource type (payment, subscription, refund, verification)
- Safe discriminated API responses:
  `{ success: true, data } | { success: false, error }`
- Configurable timeout and custom base URLs
- Webhook verification for subscription retries
- Webhook notification utility helpers
- Error handling with non-retryable error code detection

## Usage

### Initialization

```typescript
import { NetsEasy } from "nets-easy";

const nets = new NetsEasy({
  secretKey: "your-secret-key",
  environment: "test", // or 'prod'
});
```

### Response Shape

All API methods return a discriminated union:

```typescript
const result = await nets.payment.get("payment-id");

if (result.success) {
  console.log(result.data.payment.paymentId);
} else {
  console.error(result.error.message);
}
```

### Webhook Utilities

When multiple webhook events should use the same endpoint and token:

```typescript
const notifications = nets.utils.webhooks.create(
  ["payment.checkout.completed", "payment.charge.created.v2"],
  "https://example.com/webhooks/nets",
  "MySecretAuth12",
);
```

You can also omit the token:

```typescript
const notifications = nets.utils.webhooks.create(
  ["payment.checkout.completed"],
  "https://example.com/webhooks/nets",
);
```

There are also preset helpers:

```typescript
nets.utils.webhooks.all("https://example.com/webhooks/nets", "MySecretAuth12");
nets.utils.webhooks.paymentLifecycle("https://example.com/webhooks/nets");
nets.utils.webhooks.subscriptionCharge("https://example.com/webhooks/nets");
```

### Payment Operations

#### Create a Payment

```typescript
const paymentResult = await nets.payment.create({
  order: {
    items: [
      {
        reference: "product-1",
        name: "Product 1",
        quantity: 1,
        unit: "pcs",
        unitPrice: 1000, // Amount in smallest unit (10.00)
        taxRate: 2500, // 25.00%
        taxAmount: 200,
        grossTotalAmount: 1200,
        netTotalAmount: 1000,
      },
    ],
    amount: 1200,
    currency: "EUR",
    reference: "order-123",
  },
  checkout: {
    returnUrl: "https://example.com/thank-you",
    termsUrl: "https://example.com/terms",
    merchantHandlesConsumerData: false,
    integrationType: "HostedPaymentPage",
  },
  notifications: nets.utils.webhooks.create(
    ["payment.checkout.completed", "payment.charge.created.v2"],
    "https://example.com/webhooks/nets",
    "MySecretAuth12",
  ),
});

if (!paymentResult.success) {
  console.error("Payment creation failed:", paymentResult.error);
} else {
  console.log("Payment created:", paymentResult.data);
  if (paymentResult.data.hostedPaymentPageUrl) {
    window.location.href = paymentResult.data.hostedPaymentPageUrl;
  }
}
```

#### Get Payment Information

```typescript
const paymentInfo = await nets.payment.get("payment-id");

if (!paymentInfo.success) {
  console.error("Failed to get payment:", paymentInfo.error);
} else {
  console.log("Payment details:", paymentInfo.data.payment);
}
```

#### Update a Payment

```typescript
const updateResult = await nets.payment.updateOrder("payment-id", {
  items: [
    // Updated items
  ],
  amount: 1500,
});

if (!updateResult.success) {
  console.error("Payment update failed:", updateResult.error);
} else {
  console.log("Payment updated");
}
```

#### Charge a Payment

```typescript
const chargeResult = await nets.payment.charge("payment-id", {
  amount: 1200,
});

if (!chargeResult.success) {
  console.error("Payment charge failed:", chargeResult.error);
} else {
  console.log("Payment charged:", chargeResult.data.chargeId);
}
```

#### Cancel a Payment

```typescript
const cancelResult = await nets.payment.cancel("payment-id", { amount: 1200 });

if (!cancelResult.success) {
  console.error("Payment cancellation failed:", cancelResult.error);
} else {
  console.log("Payment cancelled");
}
```

### Refund Operations

#### Refund a Payment

```typescript
const refundResult = await nets.refund.create("payment-id", {
  amount: 1200,
});

if (!refundResult.success) {
  console.error("Payment refund failed:", refundResult.error);
} else {
  console.log("Payment refunded:", refundResult.data.refundId);
}
```

### Subscription Operations

#### Create a Subscription

Subscriptions are created through `nets.payment.create()` by including a
`subscription` object in the request.

```typescript
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
  },
  checkout: {
    integrationType: "HostedPaymentPage",
    returnUrl: "https://example.com/thank-you",
    termsUrl: "https://example.com/terms",
  },
  subscription: {
    interval: 30,
    endDate: "2026-12-31T23:59:59Z",
  },
});
```

#### Get Subscription Information

```typescript
const subscriptionInfo = await nets.subscription.get("subscription-id");
```

#### Charge a Subscription

```typescript
const chargeResult = await nets.subscription.charge("subscription-id", {
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
```

#### Bulk Charge Subscriptions

```typescript
const bulkChargeResult = await nets.subscription.bulkCharge({
  externalBulkChargeId: `bulk-${Date.now()}`,
  notifications: nets.utils.webhooks.subscriptionCharge(
    "https://example.com/webhooks/nets",
  ),
  subscriptions: [
    {
      subscriptionId: "subscription-id",
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
    },
  ],
});
```

### Checkout Notes

There is no separate `checkout` handler in this library. Checkout configuration
is part of `nets.payment.create()`.

### Webhook Verification

The library provides tools to handle webhooks from Nets Easy, especially for
determining if failed subscription payments should be retried.

#### Parsing Webhook Events

```typescript
// In your webhook endpoint handler
app.post("/webhook/nets-easy", (req, res) => {
  const webhookEvent = nets.verification.parseWebhookEvent(req.body);

  if (!webhookEvent) {
    return res.status(400).json({ error: "Invalid webhook data" });
  }

  // Process the webhook based on event type
  if (webhookEvent.event === "payment.reservation.failed") {
    // Check if we should retry this payment
    const retryDecision = nets.verification.shouldRetrySubscription(
      webhookEvent,
    );

    if (retryDecision.shouldRetry) {
      // Schedule a retry
      console.log("Scheduling payment retry");
    } else {
      // Handle permanent failure (e.g., notify customer about expired card)
      console.log("Payment cannot be retried:", retryDecision.reason);
    }
  }

  // Acknowledge receipt of webhook
  res.status(200).json({ received: true });
});
```

#### Non-Retryable Error Codes

The library includes a list of error codes that should never be retried
according to Nets Easy documentation:

```typescript
import { NON_RETRYABLE_ERROR_CODES } from "nets-easy";

console.log(
  "Error codes that should not be retried:",
  NON_RETRYABLE_ERROR_CODES,
);
// Output: ["04", "14", "15", "41", "43", "46", "54", "57"]
```

These error codes represent permanent failures such as expired cards, invalid
account numbers, stolen cards, etc.

## Full Documentation

Please refer to the
[Nets Easy API documentation](https://developer.nexigroup.com/nexi-checkout/en-EU/api/payment-v1/)
for complete API reference.

## License

MIT
