import {
  isWebhookEventType,
  NetsEasy,
  PaymentReservationFailedEvent,
  WebhookEvent,
} from "../src/index.ts";

// Initialize the Nets Easy client
const nets = new NetsEasy({
  secretKey: "your-secret-key",
  environment: "test",
});

// Example non-retryable webhook data (with error code 54 - Expired card)
const nonRetryableWebhookSample: PaymentReservationFailedEvent = {
  id: "7a83e3d2b8794508804b9e6b250df753",
  event: "payment.reservation.failed",
  timestamp: "2025-04-20T05:03:23.0541+00:00",
  merchantId: 100242833,
  merchantNumber: 0,
  data: {
    error: {
      code: "54", // Non-retryable error code - Expired card
      message: "Expired card or expiration date missing",
      source: "Internal",
    },
    orderItems: [
      {
        grossTotalAmount: "10000",
        name: "Product 1",
        netTotalAmount: "8000",
        quantity: "2",
        reference: "Red shoe 12",
        taxRate: "20",
        taxAmount: "2000",
        unit: "pcs",
        unitPrice: "4000",
      },
    ],
    amount: {
      amount: "10000",
      currency: "SEK",
    },
    paymentId: "b015690c89d141f7b98b99dee769be62",
  },
};

// Example retryable webhook data (with generic error code)
const retryableWebhookSample: PaymentReservationFailedEvent = {
  id: "7a83e3d2b8794508804b9e6b250df753",
  event: "payment.reservation.failed",
  timestamp: "2025-04-20T05:03:23.0541+00:00",
  merchantId: 100242833,
  merchantNumber: 0,
  data: {
    error: {
      code: "91", // Retryable error code (e.g., insufficient funds)
      message: "Insufficient funds",
      source: "Internal",
    },
    amount: {
      amount: "10000",
      currency: "SEK",
    },
    paymentId: "b015690c89d141f7b98b99dee769be62",
  },
};

// Example of handling a webhook
async function handleWebhook(webhookData: string | object) {
  console.log("Handling webhook...");

  // Parse webhook data
  const webhookEvent = nets.verification.parseWebhookEvent(webhookData);

  if (!webhookEvent) {
    console.error("Invalid webhook data");
    return;
  }

  console.log(`Webhook event: ${webhookEvent.event}`);

  // Check if it's a failed reservation
  if (
    isWebhookEventType<PaymentReservationFailedEvent>(
      webhookEvent,
      "payment.reservation.failed",
    )
  ) {
    console.log("Processing failed reservation...");

    // Get detailed error information
    const errorDetails = nets.verification.getErrorDetails(webhookEvent);
    if (errorDetails) {
      console.log(`Error code: ${errorDetails.code}`);
      console.log(`Error message: ${errorDetails.message}`);
      console.log(`Is retryable: ${errorDetails.isRetryable}`);
    }

    // Check if we should retry this subscription (assuming it's the first retry)
    const retryDecision = nets.verification.shouldRetrySubscription(
      webhookEvent,
      0,
    );
    console.log(`Should retry: ${retryDecision.shouldRetry}`);
    console.log(`Reason: ${retryDecision.reason}`);

    if (retryDecision.shouldRetry) {
      console.log("Scheduling subscription retry...");
      // Here you would implement your retry logic
      // For example, schedule a retry attempt for later
    } else {
      console.log(
        "Subscription should not be retried. Notifying customer of payment failure...",
      );
      // Here you would implement notification logic
      // For example, send an email to the customer about their expired card
    }
  }
}

// Demonstrate with a non-retryable webhook sample
console.log("\n==== Testing with non-retryable webhook ====");
handleWebhook(nonRetryableWebhookSample);

// Demonstrate with a retryable webhook sample
console.log("\n==== Testing with retryable webhook ====");
handleWebhook(retryableWebhookSample);

// Example of handling webhooks from a request body (e.g., in an Express endpoint)
function webhookEndpointExample(requestBody: any) {
  console.log("\n==== Example webhook endpoint handler ====");

  // Parse and validate webhook
  const webhookEvent = nets.verification.parseWebhookEvent(requestBody);

  if (!webhookEvent) {
    console.log("Invalid webhook data received");
    return {
      status: 400,
      body: { error: "Invalid webhook data" },
    };
  }

  // Process webhook by event type
  switch (webhookEvent.event) {
    case "payment.reservation.failed":
      // Handle failed reservation
      const retryDecision = nets.verification.shouldRetrySubscription(
        webhookEvent,
      );

      if (retryDecision.shouldRetry) {
        // Add to retry queue
        console.log("Adding to retry queue:", webhookEvent.data.paymentId);
      } else {
        // Update subscription status and notify customer
        console.log(
          "Updating subscription status:",
          webhookEvent.data.paymentId,
        );
      }
      break;

    case "payment.checkout.completed":
      // Handle checkout completion
      console.log(
        "Checkout completed for payment:",
        webhookEvent.data.paymentId,
      );
      break;

    case "payment.reservation.created":
      // Handle successful reservation
      console.log("Payment reserved:", webhookEvent.data.paymentId);
      break;

    default:
      console.log("Unhandled webhook event:", webhookEvent.event);
  }

  // Return acknowledgement
  return {
    status: 200,
    body: { received: true },
  };
}

// Example call to webhook endpoint function with a webhook body
const exampleWebhookBody = {
  id: "5e94a4cab0cb446db266fd605b0c6793",
  event: "payment.reservation.failed",
  timestamp: "2025-04-20T05:03:23.0538+00:00",
  merchantId: 100242833,
  merchantNumber: 0,
  data: {
    error: {
      code: "54",
      message: "Expired card or expiration date missing",
      source: "Internal",
    },
    paymentId: "b015690c89d141f7b98b99dee769be62",
    amount: {
      amount: "10000",
      currency: "SEK",
    },
  },
};

webhookEndpointExample(exampleWebhookBody);
