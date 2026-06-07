Nets easy Payment API | Checkout | Nexi group This is the official documentation
from Nexi Group documentation portal.
https://developer.nexigroup.com/nexi-checkout/en-EU/api/payment-v1/

# Payment API

The Easy Payment API provides methods for managing one-time payments and
subscriptions (recurring payments).

Payment objects are the main entities that the Easy platform centers around.
Whenever a customer initiates either a one-time purchase or a subscription, a
new payment object is created. See the [Create payment](#v1-payments-post)
method for more details.

A payment object is always associated with the following entities:

- **Merchant** - the webshop that sells products. You provide the merchant
  identity by using the integration keys associated with your merchant account.
  Or, if you are a Nexi Group partner and use the keys belonging to a partner
  account, you can provide an optional `merchantNumber` to identify the
  merchant.
- **Customer** - a private or a business consumer that places the order.
  Checkout enables customers to collect customer data if the customer&#x27;s
  consent is obtained. This data makes future purchases easier. Checkout
  collects customer data directly from the customer. However, it is also
  possible for you to provide customer data that will initiate consumer
  information for the payment.
- **Order** - defines what the customer will be charged for. The order is always
  provided by you when [creating a payment object](#v1-payments-post) and can
  later be updated during the checkout using the
  [update order method](#v1-payments-paymentid-orderitems-put).

A payment object also contains information about the checkout, such as
**shipping options**, **payment methods**, and **currencies**.

You can track the **status changes** of a payment by using
[webhooks](#webhooks). The events that can be subscribed to roughly correspond
to the different states you can find in the
[payment section in Easy Portal](https://portal.dibspayment.eu/payments). If you
are new to Easy, we recommend spending some time in the Easy Portal to
familiarize yourself with the platform and what to expect from the API.

Scroll down for code samples, example requests and responses. Select a language
for code samples from the tabs or the mobile navigation menu.

## Payments

The methods listed under this section handle a single payment object.
[Create a new payment](#v1-payments-post) object whenever your customer places a
new order. This will reserve the amount specified in the order. The payment
object can be updated during the checkout using the methods:
[Update reference information](#v1) and [Update order](#v1).

When you ship the order, you should [charge the payment](#v1-payments). And if
you need, the API also allows you to [cancel a payment](#v1) or
[refund a customer](#v1-payments-refund-post). \n\n **Important note:** By
default, our system does not automatically charge/capture the amount which has
been reserved. Depending on your business model, you should decide on the way
how to handle this process. It is our recommendation to do the setup for
immediate charge/capture.

### Create payment

`POST /v1/payments`

Initializes a new payment object that becomes the object used throughout the
checkout flow for a particular customer and order. Creating a payment object is
the first step when you intend to accept a payment from your customer. Entering
the amount 100 corresponds to 1 unit of the currency entered, such as e.g. 1
NOK. Typically you provide the following information:

- The **order details** including order items, total amount, and currency.
- **Checkout page settings**, which specify what type of integration you want: a
  checkout page **embedded** on your site or a pre-built checkout page
  **hosted** by Nexi Group. You can also specify data about your customer so
  that your customer only needs to provide payment details on the checkout page.

Optionally, you can also provide information regarding:

- **Notifications** if you want to be notified through **webhooks** when the
  status of the payment changes.
- **Fees** added when using **payment methods** such as invoice.
- **Charge** set to true so you can enable autocapture for **subscriptions**.

On success, this method returns a `paymentId` that can be used in subsequent
requests to refer to the newly created payment object. Optionally, the response
object will also contain a `hostedPaymentPageUrl`, which is the URL you should
redirect to if using a hosted pre-built checkout page.

#### Parameters

- CommercePlatformTagstringoptional An identifier of the ecommerce platform.

#### Request body

Expand all orderobjectrequired Specifies an order associated with a payment. An
order must contain at least one order item. The `amount` of the order must match
the sum of the specified order items.

itemsarrayrequired A list of order items. At least one item must be specified.

referencestringrequiredA reference to recognize the product, usually the SKU
(stock keeping unit) of the product. For convenience in the case of refunds or
modifications of placed orders, the reference should be unique for each
variation of a product item (size, color, etc). The maximum length is 128
characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.
amountinteger (int32)requiredThe total base amount of the order including VAT,
if any. (Sum of all `grossTotalAmount`s in the order.) Must be higher than
0.currencystringrequiredThe [currency](../#currency-and-amount) of the payment,
for example &#x27;SEK&#x27;. The following special characters are not supported:
<, >, &#x27;, ", &, \referencestringoptionalA reference to recognize this order.
Usually a number sequence (order number). The maximum length is 128 characters.
The following special characters are not supported: <, >, &#x27;, ", &,\
checkoutobjectrequired Defines the behavior and style of the checkout page.

urlstringoptionalSpecifies where the checkout will be loaded if using an
embedded checkout page. See also the `integrationType` property. The maximum
length is 256 characters. The following special characters are not supported:
`<,>,’,”,\\`integrationTypestringoptionalDetermines whether the checkout should
be embedded in your webshop or if the checkout should be hosted by Nexi Group on
a separate page. Valid values are: `&#x27;EmbeddedCheckout&#x27;` (default), or
`&#x27;HostedPaymentPage&#x27;`. Please note that the string values are **case
sensitive**.

- returnUrlstringoptional Specifies where your customer will return after a
  completed payment when using a hosted checkout page. See also the
  `integrationType` property.

- cancelUrlstringoptional Specifies where your customer will return after a
  canceled payment when using a hosted checkout page. See also the
  `integrationType` property.

consumerobjectoptional Contains information about the customer. If provided,
this information will be used for initiating the consumer data of the payment
object. See also the property `merchantHandlesConsumerData` which controls what
fields to show on the checkout page.

referencestringoptionalThe maximum length is 128 characters. The following
special characters are not supported: <, >, &#x27;, ", &,

///- emailstringoptional The email address.

- shippingAddressobjectoptional addressLine1stringrequired The primary address
  line. Must be between 1 and 128 characters. The following special characters
  are not supported: <, >, &#x27;, ", &, \

- addressLine2stringoptional An additional address line. Must be between 1 and
  128 characters. The following special characters are not supported: <, >,
  &#x27;, ", &, \

postalCodestringrequiredThe postal code. Postal codes per each country: **NOR,
NO** - A four-digit code, for example, 0025. **SWE, SE** - A five-digit code,
for example, 11455. **DNK, DK** - A four-digit code, for example, 2600.
**Other** - Must be between 1 and 12 characters, the following special
characters are not supported: <, >, &#x27;, ", &, \- citystringrequired The
city. Must be between 1 and 128 characters. The following special characters are
not supported: <, >, &#x27;, ", &, \

countrystringrequiredA three-letter country code (ISO 3166-1), for example GBR.
See also the
[list of supported countries](/nexi-checkout/en-EU/api/#country-codes-and-phone-prefixes).
The following special characters are not supported: <, >, &#x27;, ", &, \

- billingAddressobjectoptional addressLine1stringrequired The primary address
  line. Must be between 1 and 128 characters. The following special characters
  are not supported: <, >, &#x27;, ", &, \

- addressLine2stringoptional An additional address line. Must be between 1 and
  128 characters. The following special characters are not supported: <, >,
  &#x27;, ", &, \

postalCodestringrequiredThe postal code. Postal codes per each country: **NOR,
NO** - A four-digit code, for example, 0025. **SWE, SE** - A five-digit code,
for example, 11455. **DNK, DK** - A four-digit code, for example, 2600.
**Other** - Must be between 1 and 12 characters, the following special
characters are not supported: <, >, &#x27;, ", &, \- citystringrequired The
city. Must be between 1 and 128 characters. The following special characters are
not supported: <, >, &#x27;, ", &, \

countrystringrequiredA three-letter country code (ISO 3166-1), for example GBR.
See also the
[list of supported countries](/nexi-checkout/en-EU/api/#country-codes-and-phone-prefixes).
The following special characters are not supported: <, >, &#x27;, ", &,\
phoneNumberobjectoptional An international phone number.

prefixstringoptionalThe
[country calling code](https://en.wikipedia.org/wiki/List_of_country_calling_codes),
for example +1. Pattern: @ `^[+]\\d{1,3}$`.numberstringoptionalThe phone number
(without the country code prefix). Pattern: @ `^[0-9]*$`
privatePersonobjectoptional The name of a natural person.

firstNamestringoptionalThe first name (also known as given name). Must be
between 1 and 128 characters. The following special characters are not
supported: <, >, &#x27;, ", &, \lastNamestringoptionalThe last name (also known
as surname/family name). Must be between 1 and 128 characters. The following
special characters are not supported: <, >, &#x27;, ", &,\
companyobjectoptional A business consumer.

namestringoptionalThe name of the company. Must be between 1 and 128
characters.contactobjectoptional The name of a natural person.

firstNamestringoptionalThe first name (also known as given name). Must be
between 1 and 128 characters. The following special characters are not
supported: <, >, &#x27;, ", &, \lastNamestringoptionalThe last name (also known
as surname/family name). Must be between 1 and 128 characters. The following
special characters are not supported: <, >, &#x27;, ", &, \

termsUrlstringrequiredThe URL to the terms and conditions of your webshop. The
following special characters are not supported:
`<,>,’,”,\\`merchantTermsUrlstringoptionalThe URL to the privacy and cookie
settings of your webshop. The following special characters are not supported:
`<,>,’,”,\\`shippingCountriesarrayoptional An array of countries that limits the
set of countries available for shipping. If left unspecified,
[all countries supported by Easy Checkout](/nexi-checkout/en-EU/api/#country-codes-and-phone-prefixes)
will be available for shipping on the checkout page.

countryCodestringoptionalA three-letter country code (ISO 3166-1), for example
GBR. See also the
[list of supported countries](/nexi-checkout/en-EU/api/#country-codes-and-phone-prefixes).
Important: For Klarna payments, the `countryCode` field is mandatory. If not
provided, Klarna will not be available as a payment method. The following
special characters are not supported: <, >, &#x27;, ", &,\
shippingobjectoptional countriesarrayoptional countryCodestringoptionalA
three-letter country code (ISO 3166-1), for example GBR. See also the
[list of supported countries](/nexi-checkout/en-EU/api/#country-codes-and-phone-prefixes).
Important: For Klarna payments, the `countryCode` field is mandatory. If not
provided, Klarna will not be available as a payment method. The following
special characters are not supported: <, >, &#x27;, ", &, \

- merchantHandlesShippingCostbooleanoptional If set to `true`, the payment order
  is required to be updated (using the
  [Update order](#v1-payments-paymentid-orderitems-put) method) with
  `shipping.costSpecified` set to `true` before the customer can complete a
  purchase. Defaults to `false` if not specified.

- enableBillingAddressbooleanoptional If set to `true`, the customer is provided
  an option to specify separate addresses for billing and shipping on the
  checkout page. If set to `false`, the billing address is used as the shipping
  address.

consumerTypeobjectoptional Configures which consumer types should be accepted.
Defaults to &#x27;B2C&#x27;.

These options are ignore if the property `merchantHandlesConsumerData` is set to
`true`.

- defaultstringoptional The checkout form defaults to this consumer type when
  first loaded.

- supportedTypesarrayoptional The array of consumer types that should be
  supported on the checkout page. Allowed values are: &#x27;B2B&#x27; and
  &#x27;B2C&#x27;.

- chargebooleanoptional If set to `true`, the transaction will be charged
  automatically after the reservation has been accepted. Default value is
  `false` if not specified.

- publicDevicebooleanoptional If set to `true`, the checkout will not load any
  user data, and also the checkout will not remember the current consumer on
  this device. Default value is `false` if not specified.

- merchantHandlesConsumerDatabooleanoptional Allows you to initiate the checkout
  with customer data so that your customer only need to provide payment details.
  It is possible to exclude all consumer and company information from the
  payment (only for certain payment methods) when it is set to true. If you
  still want to add consumer information to the payment you need to use the
  `consumer` object (either a `privatePerson` or a `company`, not both).

- appearanceobjectoptional Defines the appearance of the checkout page.

displayOptionsobjectoptional Controls what is displayed on the checkout page.

showMerchantNamebooleanoptional If set to `true`, displays the merchant name
above the checkout. Default value is `true` when using a `HostedPaymentPage`.

- showOrderSummarybooleanoptional If set to `true`, displays the order summary
  above the checkout. Default value is `true` when using a `HostedPaymentPage`.

- textOptionsobjectoptional Controls what text is displayed on the checkout
  page.

completePaymentButtonTextstringoptional Overrides payment button text. The
following predefined values are allowed: `pay`, `purchase`, `order`, `book`,
`reserve`, `signup`, `subscribe`, `accept`. The payment button text is
localized.

countryCodestringoptionalMerchant&#x27;s three-letter checkout country code (ISO
3166-1), for example GBR. See also the
[list of supported languages](/nexi-checkout/en-EU/api/#currency-and-amount).
Important: For Klarna payments, the `countryCode` field is mandatory. If not
provided, Klarna will not be available as a payment method. The following
special characters are not supported: <, >, &#x27;, ", &, \

- merchantNumberstringoptional The merchant number. Use this header only if you
  are a Nexi Group partner and initiating the checkout with your partner keys.
  If you are using the integration keys for your webshop, there is no need to
  specify this header.

notificationsobjectoptional Notifications allow you to subscribe to status
updates for a payment.

webHooksarrayoptional The list of webhooks. The maximum number of webhooks
is 32.

eventNamestringrequiredThe name of the event you want to subscribe to. See
[webhooks](#webhooks) for the complete list of events. The following special
characters are not supported: <, >, &#x27;, ", &, \urlstringrequiredThe callback
is sent to this URL. Must be HTTPS to ensure a secure communication. The maximum
allowed length of the URL is 256 characters. The following special characters
are not supported: <, >, &#x27;, ", &, \authorizationstringoptionalThe
credentials that will be sent in the HTTP Authorization request header of the
callback. Must be between **8** and **64** characters long and contain
**alphanumeric** characters.

- subscriptionobjectoptional Defines the duration and interval when creating or
  updating a [subscription](#subscriptions).

subscriptionIdstring (uuid)optional The identifier of the subscription to be
updated. If omitted, a new subscription will be created.

- endDatestring (date-time)optional The date and time when the subscription
  expires. It is not possible to charge this subscription after this date. The
  field has three components: date, time, and time zone (offset from GMT). For
  example: 2021-07-02T12:00:00.0000+02:00

- intervalinteger (int32)optional Defines the minimum number of days between
  each recurring charge. This interval commences from either the day the
  subscription was created or the most recent subscription charge, whichever is
  later. An interval value of 0 means that there are no payment interval
  restrictions.

- allowVariableAmountbooleanoptional Allow variable amount for the subscription.

- unscheduledSubscriptionobjectoptional Defines the payment as one that should
  initiate or update an unscheduled card on file agreement

createbooleanoptional A flag indicating if a new unscheduled card on file
agreement should be created. Can be omitted when updating an existing
unscheduled card on file agreement.

- unscheduledSubscriptionIdstring (uuid)optional The identifier of the
  unscheduled card on file agreement to be updated. If omitted, a new
  unscheduled card on file agreement will be created.

paymentMethodsConfigurationarrayoptionalSpecifies payment methods configuration
to be used for this payment, ignored if empty or null. All available and
configured payment methods are enabled by default. namestringoptionalThe name of
the payment method or payment type to be configured for payment. If the
specified payment method is not configured correctly in the merchant
configurations then this won&#x27;t take effect. Payment type cannot be
specified alongside payment methods that belong to it, if it happens the request
will fail with an error. Possible payment methods values: "Visa", "MasterCard",
"Dankort", "AmericanExpress", "Forbrugsforeningen", "PayPal", "Vipps",
"MobilePay", "Swish", "Arvato", "EasyInvoice", "EasyInstallment",
"EasyCampaign", "RatePayInvoice", "RatePayInstallment", "RatePaySepa", "Sofort",
"Trustly", "ApplePay", "Klarna", "GooglePay". Possible payment types values:
"Card", "Invoice", "Installment", "A2A",
"Wallet".enabledbooleanoptionalIndicates that the specified payment method/type
is allowed to be used for this payment, defaults to true. If one or more payment
method/type is configured in the parent array then this value will be considered
false for any other payment method that the parent array doesn&#x27;t cover.
paymentMethodsarrayoptional namestringoptionalThe name of the payment method.
Possible value currently is:
&#x27;easy-invoice&#x27;.feeobjectoptionalRepresents a line of a customer order.
An order item refers to a product that the customer has bought. A product can be
anything from a physical product to an online subscription or shipping.
referencestringrequiredA reference to recognize the product, usually the SKU
(stock keeping unit) of the product. For convenience in the case of refunds or
modifications of placed orders, the reference should be unique for each
variation of a product item (size, color, etc). The maximum length is 128
characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.

myReferencestringoptionalMerchant payment reference The maximum length is 36
characters. The following special characters are not supported: <, >, &#x27;, ",
&, \additionalPaymentMethodDataobjectoptional rivertyobjectoptional
orderReferencestringoptionalOptional order reference that is later mapped to the
parentTransactionReference in Riverty. It must be unique across all payments and
have a length less than 128 characters. payPalobjectoptional
orderReferencestringoptionalOrder reference that is later mapped to the
InvoiceId in PayPal. If not provided we will generate it ourselves. It must be
unique across all payments and have a length less than 128 characters.

### Request body

{ "order": { "items": [ { "reference": "string", "name": "string", "quantity":
0.1, "unit": "string", "unitPrice": 0, "taxRate": 0, "taxAmount": 0,
"grossTotalAmount": 0, "netTotalAmount": 0, "imageUrl": "string" } ], "amount":
0, "currency": "string", "reference": "string" }, "checkout": { "url": "string",
"integrationType": "string", "returnUrl": "string", "cancelUrl": "string",
"consumer": { "reference": "string", "email": "string", "shippingAddress": {
"addressLine1": "string", "addressLine2": "string", "postalCode": "string",
"city": "string", "country": "string" }, "billingAddress": { "addressLine1":
"string", "addressLine2": "string", "postalCode": "string", "city": "string",
"country": "string" }, "phoneNumber": { "prefix": "string", "number": "string"
}, "privatePerson": { "firstName": "string", "lastName": "string" }, "company":
{ "name": "string", "contact": { "firstName": "string", "lastName": "string" } }
}, "termsUrl": "string", "merchantTermsUrl": "string", "shippingCountries": [ {
"countryCode": "string" } ], "shipping": { "countries": [ { "countryCode":
"string" } ], "merchantHandlesShippingCost": true, "enableBillingAddress": true
}, "consumerType": { "default": "string", "supportedTypes": [ "string" ] },
"charge": true, "publicDevice": true, "merchantHandlesConsumerData": true,
"appearance": { "displayOptions": { "showMerchantName": true,
"showOrderSummary": true }, "textOptions": { "completePaymentButtonText":
"string" } }, "countryCode": "string" }, "merchantNumber": "string",
"notifications": { "webHooks": [ { "eventName": "string", "url": "string",
"authorization": "string", "headers": null } ] }, "subscription": {
"subscriptionId": "d079718b-ff63-45dd-947b-4950c023750f", "endDate":
"2019-08-24T14:15:22Z", "interval": 0, "allowVariableAmount": true },
"unscheduledSubscription": { "create": true, "unscheduledSubscriptionId":
"92143051-9e78-40af-a01f-245ccdcd9c03" }, "paymentMethodsConfiguration": [ {
"name": "string", "enabled": true } ], "paymentMethods": [ { "name": "string",
"fee": { "reference": "string", "name": "string", "quantity": 0.1, "unit":
"string", "unitPrice": 0, "taxRate": 0, "taxAmount": 0, "grossTotalAmount": 0,
"netTotalAmount": 0, "imageUrl": "string" } } ], "myReference": "string",
"additionalPaymentMethodData": { "riverty": { "orderReference": "string" },
"payPal": { "orderReference": "string" } } }

#### Responses

- 201Createdoptional paymentIdstringrequired The identifier (UUID) of the newly
  created payment object. Use this identifier in subsequent request when
  referring to the new payment.

- hostedPaymentPageUrlstringoptional The URL your website should redirect to if
  using a hosted pre-built checkout page.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 201
- 400
- 500

{ "paymentId": "string", "hostedPaymentPageUrl": "string" }

### Retrieve payment

`GET /v1/payments/{paymentId}`

Retrieves the details of an existing payment. The `paymentId` is obtained from
Nexi Group when [creating a payment object](#create-payment).

## Rate Limiting

This endpoint is subject to rate limiting. Merchants are limited to 30 calls to
retrieve a given payment per hour. Exceeding this limit will result in
throttling, and further requests will be denied until the rate limit window
resets.

#### Parameters

- paymentIdstringrequired The payment identifier.

- CommercePlatformTagstringoptional An identifier of the ecommerce platform.

#### Responses

- 200OKoptional paymentobjectoptional Contains all information about a payment.

paymentIdstring (uuid)required The payment identifier (a UUID). example:
0d0ed34848f545eaa7f9e07a6f6ff2d6

- summaryobjectoptional Summarizes the reserved, charged, refunded, and canceled
  amounts associated with a payment.

reservedAmountinteger (int32)optional The base [amount](../#currency-and-amount)
that has been reserved in the customer&#x27;s bank account at the time of the
purchase to make sure there are sufficient funds to charge the payment. See also
the [Create payment](#v1-payments-post) method.

- reservedSurchargeAmountinteger (int32)optional The surcharge
  [amount](../#currency-and-amount) that has been reserved on top of the base
  amount.

- chargedAmountinteger (int32)optional The base
  [amount](../#currency-and-amount) that has been charged. See also the
  [Charge payment](#v1-payments-paymentid-charges-post) method.

- chargedSurchargeAmountinteger (int32)optional The surcharge
  [amount](../#currency-and-amount) that has been charged on top of the base
  amount.

- refundedAmountinteger (int32)optional The base
  [amount](../#currency-and-amount) that has been refunded. See also the
  [Refund payment](#v1-payments-paymentid-refunds-post) method.

- refundedSurchargeAmountinteger (int32)optional The surcharge
  [amount](../#currency-and-amount) that has been refunded on top of the base
  amount.

- cancelledAmountinteger (int32)optional The base
  [amount](../#currency-and-amount) that has been cancelled. See also the
  [Cancel payment](#v1-payments-paymentid-cancels-post) method.

- cancelledSurchargeAmountinteger (int32)optional The surcharge
  [amount](../#currency-and-amount) that has been cancelled on top of the base
  amount.

- consumerobjectoptional shippingAddressobjectoptional
  addressLine1stringoptional The primary address line.

- addressLine2stringoptional An additional address line.

- receiverLinestringoptional The name (or company name) of the customer.

- postalCodestringoptional The postal code.

- citystringoptional The city.

- countrystringoptional A three-letter country code (ISO 3166-1), for example
  GBR. See also the [list of supported languages](../api-overview).

phoneNumberobjectoptional An international phone number.

prefixstringoptionalThe
[country calling code](https://en.wikipedia.org/wiki/List_of_country_calling_codes),
for example +1. Pattern: @ `^[+]\\d{1,3}$`.numberstringoptionalThe phone number
(without the country code prefix). Pattern: @ `^[0-9]*$`

- companyobjectoptional merchantReferencestringoptional
- namestringoptional The company name.

- registrationNumberstringoptional
- contactDetailsobjectoptional Information about the contact person for a
  company.

firstNamestringoptional The first name (also known as given name).

- lastNamestringoptional The last name (also known as surname/family name).

- emailstringoptional The email address.

phoneNumberobjectoptional An international phone number.

prefixstringoptionalThe
[country calling code](https://en.wikipedia.org/wiki/List_of_country_calling_codes),
for example +1. Pattern: @ `^[+]\\d{1,3}$`.numberstringoptionalThe phone number
(without the country code prefix). Pattern: @ `^[0-9]*$`

- privatePersonobjectoptional merchantReferencestringoptional
- dateOfBirthstring (date-time)optional The date on which the customer was born.

- firstNamestringoptional The first name (also known as given name).

- lastNamestringoptional The last name (also known as surname/family name).

- emailstringoptional The email address.

phoneNumberobjectoptional An international phone number.

prefixstringoptionalThe
[country calling code](https://en.wikipedia.org/wiki/List_of_country_calling_codes),
for example +1. Pattern: @ `^[+]\\d{1,3}$`.numberstringoptionalThe phone number
(without the country code prefix). Pattern: @ `^[0-9]*$`

- billingAddressobjectoptional addressLine1stringoptional The primary address
  line.

- addressLine2stringoptional An additional address line.

- receiverLinestringoptional The name (or company name) of the customer.

- postalCodestringoptional The postal code.

- citystringoptional The city.

- countrystringoptional A three-letter country code (ISO 3166-1), for example
  GBR. See also the [list of supported languages](../api-overview).

phoneNumberobjectoptional An international phone number.

prefixstringoptionalThe
[country calling code](https://en.wikipedia.org/wiki/List_of_country_calling_codes),
for example +1. Pattern: @ `^[+]\\d{1,3}$`.numberstringoptionalThe phone number
(without the country code prefix). Pattern: @ `^[0-9]*$`

- paymentDetailsobjectoptional paymentTypestringoptional The type of payment.
  Possible values are: &#x27;CARD&#x27;, &#x27;INVOICE&#x27;, &#x27;A2A&#x27;,
  &#x27;INSTALLMENT&#x27;, &#x27;WALLET&#x27;, and &#x27;PREPAID-INVOICE&#x27;.

- paymentMethodstringoptional The payment method, for example Visa or
  Mastercard.

- invoiceDetailsobjectoptional invoiceNumberstringoptional

- cardDetailsobjectoptional maskedPanstringoptional A masked version of the PAN
  (Primary Account Number). At maximum, only the first six and last four digits
  of the account number are displayed.

- expiryDatestringoptional The four-digit expiration date of the payment card.
  The format should be: MMYY.

- orderDetailsobjectrequired amountinteger (int32)required The total base
  [amount](../#currency-and-amount) of the order, for example 10000. Must be
  higher than 0.

currencystringrequiredThe [currency](../#currency-and-amount) of the payment,
for example &#x27;SEK&#x27;. The following special characters are not supported:
<, >, &#x27;, ", &, \- referencestringoptional The reference to recognize this
order. Usually a number sequence provided when
[creating](#v1-payments-create-payment-post) or [updating](#v1-update-order-put)
the payment.

- checkoutobjectrequired urlstringrequired The URL to the hosted or embedded
  checkout page.

- cancelUrlstringoptional The URL to the page responsible for handling a
  canceled checkout.

- createdstring (date-time)required The date and time when the payment was
  initiated.

- refundsarrayoptional An array of all the refunds associated with this payment.

refundIdstring (uuid)optional A unique identifier of this refund. example:
cba351eafdd04beabcdcd6e1154de7ae

- amountinteger (int32)optional The base [amount](../#currency-and-amount) of
  the refund.

- surchargeAmountinteger (int32)optional The surcharge
  [amount](../#currency-and-amount) of the refund. It might not be populated
  until the operation is completed.

- statestringoptional The current state of the refund. Possible values are:
  &#x27;Pending&#x27;, &#x27;Cancelled&#x27;, &#x27;Failed&#x27;,
  &#x27;Completed&#x27;, &#x27;Expired&#x27;.

- lastUpdatedstring (date-time)optional The date and time when the refund was
  last updated.

orderItemsarrayoptional The list of returned and canceled order items that are
associated with the refund. At least one order item is required.

referencestringrequiredA reference to recognize the product, usually the SKU
(stock keeping unit) of the product. For convenience in the case of refunds or
modifications of placed orders, the reference should be unique for each
variation of a product item (size, color, etc). The maximum length is 128
characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.

- chargesarrayoptional chargeIdstring (uuid)optional A unique identifier of the
  charge. example: d7a532b6037d4f5e864472c3b829d287
- amountinteger (int32)optional The base [amount](../#currency-and-amount) of
  the charge.

- surchargeAmountinteger (int32)optional The surcharge
  [amount](../#currency-and-amount) of the charge. It might not be populated
  until the operation is completed.

- createdstring (date-time)optional The date and time when the charge was
  initiated.

orderItemsarrayoptional The array of order items associated with the charge.

referencestringrequiredA reference to recognize the product, usually the SKU
(stock keeping unit) of the product. For convenience in the case of refunds or
modifications of placed orders, the reference should be unique for each
variation of a product item (size, color, etc). The maximum length is 128
characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.

- terminatedstring (date-time)optional The date and time of termination. Only
  present if the payment has been terminated.

- subscriptionobjectoptional The subscription identifier.

idstring (uuid)optional The subscription identifier (a UUID).

- unscheduledSubscriptionobjectoptional The unscheduled subscription identifier.

unscheduledSubscriptionIdstring (uuid)optional The unscheduled subscription
identifier (a UUID).

- myReferencestringoptional Merchant payment reference

- paymentAccountReferencestringoptional The merchant can use this field to
  recognize if the same cardholder is re-visiting.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 429Too Many Requestsoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

{ "payment": { "paymentId": "0d0ed34848f545eaa7f9e07a6f6ff2d6", "summary": {
"reservedAmount": 0, "reservedSurchargeAmount": 0, "chargedAmount": 0,
"chargedSurchargeAmount": 0, "refundedAmount": 0, "refundedSurchargeAmount": 0,
"cancelledAmount": 0, "cancelledSurchargeAmount": 0 }, "consumer": {
"shippingAddress": { "addressLine1": "string", "addressLine2": "string",
"receiverLine": "string", "postalCode": "string", "city": "string", "country":
"string", "phoneNumber": { "prefix": "string", "number": "string" } },
"company": { "merchantReference": "string", "name": "string",
"registrationNumber": "string", "contactDetails": { "firstName": "string",
"lastName": "string", "email": "string", "phoneNumber": { "prefix": "string",
"number": "string" } } }, "privatePerson": { "merchantReference": "string",
"dateOfBirth": "2019-08-24T14:15:22Z", "firstName": "string", "lastName":
"string", "email": "string", "phoneNumber": { "prefix": "string", "number":
"string" } }, "billingAddress": { "addressLine1": "string", "addressLine2":
"string", "receiverLine": "string", "postalCode": "string", "city": "string",
"country": "string", "phoneNumber": { "prefix": "string", "number": "string" } }
}, "paymentDetails": { "paymentType": "string", "paymentMethod": "string",
"invoiceDetails": { "invoiceNumber": "string" }, "cardDetails": { "maskedPan":
"string", "expiryDate": "string" } }, "orderDetails": { "amount": 0, "currency":
"string", "reference": "string" }, "checkout": { "url": "string", "cancelUrl":
"string" }, "created": "2019-08-24T14:15:22Z", "refunds": [ { "refundId":
"cba351eafdd04beabcdcd6e1154de7ae", "amount": 0, "surchargeAmount": 0, "state":
"string", "lastUpdated": "2019-08-24T14:15:22Z", "orderItems": [ { "reference":
"string", "name": "string", "quantity": 0.1, "unit": "string", "unitPrice": 0,
"taxRate": 0, "taxAmount": 0, "grossTotalAmount": 0, "netTotalAmount": 0,
"imageUrl": "string" } ] } ], "charges": [ { "chargeId":
"d7a532b6037d4f5e864472c3b829d287", "amount": 0, "surchargeAmount": 0,
"created": "2019-08-24T14:15:22Z", "orderItems": [ { "reference": "string",
"name": "string", "quantity": 0.1, "unit": "string", "unitPrice": 0, "taxRate":
0, "taxAmount": 0, "grossTotalAmount": 0, "netTotalAmount": 0, "imageUrl":
"string" } ] } ], "terminated": "2019-08-24T14:15:22Z", "subscription": { "id":
"497f6eca-6276-4993-bfeb-53cbbbba6f08" }, "unscheduledSubscription": {
"unscheduledSubscriptionId": "92143051-9e78-40af-a01f-245ccdcd9c03" },
"myReference": "string", "paymentAccountReference": "string" } }

### Update reference information

`PUT /v1/payments/{paymentId}/referenceinformation`

Updates the specified payment object with a new `reference` string and a
`checkoutUrl`.

If you instead want to update the **order** of a payment object, use the
[Update order](#update-order-items) method.

#### Parameters

- paymentIdstringrequired The payment identifier.

- CommercePlatformTagstringoptional An identifier of the ecommerce platform.

#### Request body

Expand all

- checkoutUrlstringrequired
- referencestringrequired

### Request body

{ "checkoutUrl": "string", "reference": "string" }

#### Responses

- 204No Contentoptional
- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 405Method Not Allowedoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 400
- 500

{ "errors": { "property1": [ "string" ], "property2": [ "string" ] } }

### Update order

`PUT /v1/payments/{paymentId}/orderitems`

Updates the order for the specified payment. This endpoint makes it possible to
change the order on the checkout page _after_ the payment object has been
created. This is typically used when managing destination-based shipping costs
at the checkout.

This endpoint can only be used as long as the checkout has not yet been
completed by the customer. (See the
[payment.checkout.completed](/nexi-checkout/en-EU/api/webhooks/#checkout-completed)
event.)

#### Parameters

- paymentIdstring (uuid)required The payment identifier.

#### Request body

Expand all

- amountinteger (int32)optional The base [amount](../#currency-and-amount), for
  example 10000.

itemsarrayoptional The array of order items.

referencestringrequiredA reference to recognize the product, usually the SKU
(stock keeping unit) of the product. For convenience in the case of refunds or
modifications of placed orders, the reference should be unique for each
variation of a product item (size, color, etc). The maximum length is 128
characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.

- shippingobjectoptional costSpecifiedbooleanoptional

- paymentMethodsarrayoptional Specifies an array of invoice fees added to the
  total price when invoice is used as the payment method.

namestringoptional feeobjectoptionalRepresents a line of a customer order. An
order item refers to a product that the customer has bought. A product can be
anything from a physical product to an online subscription or shipping.
referencestringrequiredA reference to recognize the product, usually the SKU
(stock keeping unit) of the product. For convenience in the case of refunds or
modifications of placed orders, the reference should be unique for each
variation of a product item (size, color, etc). The maximum length is 128
characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.

### Request body

{ "amount": 0, "items": [ { "reference": "string", "name": "string", "quantity":
0.1, "unit": "string", "unitPrice": 0, "taxRate": 0, "taxAmount": 0,
"grossTotalAmount": 0, "netTotalAmount": 0, "imageUrl": "string" } ],
"shipping": { "costSpecified": true }, "paymentMethods": [ { "name": "string",
"fee": { "reference": "string", "name": "string", "quantity": 0.1, "unit":
"string", "unitPrice": 0, "taxRate": 0, "taxAmount": 0, "grossTotalAmount": 0,
"netTotalAmount": 0, "imageUrl": "string" } } ] }

#### Responses

- 204No Contentoptional
- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 405Method Not Allowedoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 400
- 500

{ "errors": { "property1": [ "string" ], "property2": [ "string" ] } }

### Update myReference

`PUT /v1/payments/{paymentId}/myreference`

Updates myReference field on payment. The myReference can be used if you want to
create a myReference ID that can be used in your own accounting system to keep
track of the actions connected to the payment.

#### Parameters

- paymentIdstringrequired The payment identifier.

- CommercePlatformTagstringoptional An identifier of the ecommerce platform.

#### Request body

Expand all myReferencestringoptionalMerchant payment reference The maximum
length is 36 characters. The following special characters are not supported: <,

> , &#x27;, ", &, \

### Request body

{ "myReference": "string" }

#### Responses

- 204No Contentoptional
- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 405Method Not Allowedoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 400
- 500

{ "errors": { "property1": [ "string" ], "property2": [ "string" ] } }

### Terminate payment

`PUT /v1/payments/{paymentId}/terminate`

Terminates an ongoing checkout session. A payment can only be terminated
**before** the checkout has completed
([see the `payment.checkout` event](#webhooks)). Use this method to prevent a
customer from having multiple open payment sessions simultaneously.

#### Parameters

- paymentIdstringrequired The payment identifier.

- CommercePlatformTagstringoptional An identifier of the ecommerce platform.

#### Responses

- 204No Contentoptional
- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 405Method Not Allowedoptional
- 409Conflictoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 400
- 500

{ "errors": { "property1": [ "string" ], "property2": [ "string" ] } }

### Cancel payment

`POST /v1/payments/{paymentId}/cancels`

Important notes:

- Both full and partial cancellations are supported.

- Partial cancellations are only available for card payments and wallets.

- Partial cancellations are temporarily unavailable in combination with partial
  refunds

- If the `amount` does not match the total amount of the order, it is assumed
  that a partial cancellation is intended.

- Once a payment has been (fully or partially) captured, it can no longer be
  fully canceled. Only the remaining uncaptured amount can be partially
  canceled.

- After a payment is canceled, its status cannot be changed.

- Nexi Group will not charge a fee for a canceled payment.

#### Parameters

- paymentIdstringrequired The payment identifier.

- CommercePlatformTagstringoptional An identifier of the ecommerce platform.

#### Request body

Expand all

- amountinteger (int32)required The base [amount](../#currency-and-amount) to be
  cancelled.

orderItemsarrayoptional The order items to be canceled.

Note! OrderItems must be provided if the partial cancel is intended. For a full
cancellation, they can be omitted or provided in full.

referencestringrequiredA reference to recognize the product, usually the SKU
(stock keeping unit) of the product. For convenience in the case of refunds or
modifications of placed orders, the reference should be unique for each
variation of a product item (size, color, etc). The maximum length is 128
characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.

### Request body

{ "amount": 0, "orderItems": [ { "reference": "string", "name": "string",
"quantity": 0.1, "unit": "string", "unitPrice": 0, "taxRate": 0, "taxAmount": 0,
"grossTotalAmount": 0, "netTotalAmount": 0, "imageUrl": "string" } ] }

#### Responses

- 204No Contentoptional
- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 405Method Not Allowedoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 400
- 500

{ "errors": { "property1": [ "string" ], "property2": [ "string" ] } }

### Charge payment

`POST /v1/payments/{paymentId}/charges`

Charges the specified payment. Charge a payment on the same day as you ship the
matching order.A payment can be fully charged or partially charged:

- **Full charge**: Your customer will be charged the total amount of the
  payment. The `amount` must be specified in the request body and is required to
  match the total amount of the payment.
- **Partial charge**: Only charge for a subset of the order items. In this case
  you have to provide the `amount` and the `orderItems` you want to charge in
  the request body.

#### Parameters

- paymentIdstringrequired The payment identifier.

- Idempotency-Keystringoptional A string that uniquely identifies the charge you
  are attempting. Must be between 1 and 64 characters.

- CommercePlatformTagstringoptional An identifier of the ecommerce platform.

#### Request body

Expand all

- amountinteger (int32)required The base [amount](../#currency-and-amount) to be
  charged.

orderItemsarrayoptional The order items list to charge for. Only required for
partial charges.

referencestringrequiredA reference to recognize the product, usually the SKU
(stock keeping unit) of the product. For convenience in the case of refunds or
modifications of placed orders, the reference should be unique for each
variation of a product item (size, color, etc). The maximum length is 128
characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.

- shippingobjectoptional trackingNumberstringoptional The maximum length is 255
  characters.

- providerstringoptional The maximum length is 4 characters.

- finalChargebooleanoptional Flag to release remaining reservation

myReferencestringoptionalMerchant payment reference The maximum length is 36
characters. The following special characters are not supported: <, >, &#x27;, ",
&, \paymentMethodReferencestringoptionalAn optional unique reference per payment
method, its usage and restrictions are relevant to the payment method used in
reserving the payment. Ignored if not specified, otherwise it gets passed to the
payment method provider during capturing the payment. Currently, it affects the
following payment methods:

- Riverty/AfterPay/Arvato: It signifies the Riverty invoice number which must be
  unique and have a maximum character limit of 20.

### Request body

{ "amount": 0, "orderItems": [ { "reference": "string", "name": "string",
"quantity": 0.1, "unit": "string", "unitPrice": 0, "taxRate": 0, "taxAmount": 0,
"grossTotalAmount": 0, "netTotalAmount": 0, "imageUrl": "string" } ],
"shipping": { "trackingNumber": "string", "provider": "string" }, "finalCharge":
true, "myReference": "string", "paymentMethodReference": "string" }

#### Responses

- 201Createdoptional chargeIdstringrequired
- invoiceobjectoptional invoiceNumberstringoptional The invoice number.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 402Payment Requiredoptional messagestringoptional An internal error message.
  This message is not meant to be presented to the customer. Instead, this
  message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 201
- 400
- 402
- 500

{ "chargeId": "string", "invoice": { "invoiceNumber": "string" } }

### Retrieve charge

`GET /v1/charges/{chargeId}`

#### Parameters

- chargeIdstringrequired The identifier of the existing charge (a UUID).

#### Responses

- 200OKoptional chargeIdstring (uuid)required The charge identifier (a UUID).
  example: 1301a947c26842d3aeef240191fa788c
- amountinteger (int32)required The base [amount](../#currency-and-amount) of
  the charge.

- surchargeAmountinteger (int32)optional The surcharge
  [amount](../#currency-and-amount) of the charge. It might not be populated
  until the operation is completed.

- invoiceDetailsobjectoptional Information about a publicly accessible invoice.

linkstringoptional The URL of an invoice that is publicly accessible.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

{ "chargeId": "1301a947c26842d3aeef240191fa788c", "amount": 0,
"surchargeAmount": 0, "invoiceDetails": { "link": "string" } }

### Refund charge

`POST /v1/charges/{chargeId}/refunds`

Refunds a previously settled transaction (a charged payment). The refunded
amount will be transferred back to the customer&#x27;s account. The required
`chargeId` is returned from the [Charge payment method](#charge-payment)

A settled transaction can be fully or partially refunded:

- Full refund requires only the `amount` to be specified in the request body.
- Partial refund requires the `amount` and the `orderItems` to be refunded.

#### Parameters

- chargeIdstringrequired
- Idempotency-Keystringoptional A string that uniquely identifies the refund you
  are attempting. Must be between 1 and 64 characters.

#### Request body

Expand all

- amountinteger (int32)required The base [amount](../#currency-and-amount) to be
  refunded.

orderItemsarrayoptional referencestringrequiredA reference to recognize the
product, usually the SKU (stock keeping unit) of the product. For convenience in
the case of refunds or modifications of placed orders, the reference should be
unique for each variation of a product item (size, color, etc). The maximum
length is 128 characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.

- myReferencestringoptional Merchant payment reference

### Request body

{ "amount": 0, "orderItems": [ { "reference": "string", "name": "string",
"quantity": 0.1, "unit": "string", "unitPrice": 0, "taxRate": 0, "taxAmount": 0,
"grossTotalAmount": 0, "netTotalAmount": 0, "imageUrl": "string" } ],
"myReference": "string" }

#### Responses

- 201Createdoptional refundIdstringrequired

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 201
- 400
- 500

{ "refundId": "string" }

### Refund payment

`POST /v1/payments/{paymentId}/refunds`

Refunds a previously settled payment. The refunded amount will be transferred
back to the customer&#x27;s account.

A settled payment can be fully or partially refunded. Full refund requires only
the `amount` to be specified in the request body. Partial refund requires the
`amount` and the `orderItems` to be refunded. This end-point is not supported
for these payment methods:

- Arvato
- PayPal
- RatePayInvoice
- RatePaySepa
- RatePayInstallment
- EasyInvoice
- EasyCampaign
- EasyInstallment

#### Parameters

- paymentIdstringrequired
- Idempotency-Keystringoptional A string that uniquely identifies the refund you
  are attempting. Must be between 1 and 64 characters.

- CommercePlatformTagstringoptional An identifier of the ecommerce platform.

#### Request body

Expand all

- amountinteger (int32)required The base [amount](../#currency-and-amount) to be
  refunded.

orderItemsarrayoptional referencestringrequiredA reference to recognize the
product, usually the SKU (stock keeping unit) of the product. For convenience in
the case of refunds or modifications of placed orders, the reference should be
unique for each variation of a product item (size, color, etc). The maximum
length is 128 characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.

- myReferencestringoptional Merchant payment reference

### Request body

{ "amount": 0, "orderItems": [ { "reference": "string", "name": "string",
"quantity": 0.1, "unit": "string", "unitPrice": 0, "taxRate": 0, "taxAmount": 0,
"grossTotalAmount": 0, "netTotalAmount": 0, "imageUrl": "string" } ],
"myReference": "string" }

#### Responses

- 201Createdoptional refundIdstringrequired

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 201
- 400
- 500

{ "refundId": "string" }

### Retrieve refund

`GET /v1/refunds/{refundId}`

Retrieves the details of an existing refund. The `refundId` is obtained from
Nexi Group when [creating a new refund](#v1-charges-chargeid-refunds-post). The
primary usage of this method is to retrieve invoice details of a refund.

#### Parameters

- refundIdstringrequired The identifier of the existing refund (a UUID).

#### Responses

- 200OKoptional refundIdstring (uuid)required The refund identifier (a UUID).
  example: caa4efdfefd542baabed74e4e3382064
- amountinteger (int32)required The base [amount](../#currency-and-amount) of
  the refund.

- surchargeAmountinteger (int32)optional The surcharge
  [amount](../#currency-and-amount) of the refund. It might not be populated
  until the operation is completed.

- invoiceDetailsobjectoptional Information about a publicly accessible invoice.

linkstringoptional The URL of an invoice that is publicly accessible.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 405Method Not Allowedoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

{ "refundId": "caa4efdfefd542baabed74e4e3382064", "amount": 0,
"surchargeAmount": 0, "invoiceDetails": { "link": "string" } }

### Cancel pending refund

`POST /v1/pending-refunds/{refundId}/cancel`

Cancels a pending refund. A refund can be in a pending state when there are not
enough funds in the merchant&#x27;s account to make the refund.

The `refundId` is returned when [creating a new refund](#create-refund).

#### Parameters

- refundIdstringrequired The identifier of the pending refund (a UUID).

#### Responses

- 204No Contentoptional
- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 405Method Not Allowedoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 400
- 500

{ "errors": { "property1": [ "string" ], "property2": [ "string" ] } }

### Get payment methods for Merchant

`GET /v1/paymentmethods`

#### Parameters

- MerchantNumberstringoptional
- Currencystringoptional
- Enabledbooleanoptional

#### Responses

- 200OKoptional namestringoptional
- paymentTypestringoptional
- currencystringoptional
- enabledbooleanoptional

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

[ { "name": "string", "paymentType": "string", "currency": "string", "enabled":
true } ]

## Subscriptions

Subscriptions allow you to charge your customers on a regular basis, for example
a monthly subscription for a product the customer must pay for every month.

When a subscription is charged, a new payment object is created to represent the
purchase of the subscription product.

It is possible to verify and charge multiple subscriptions in bulk using the
[Bulk charge subscriptions method](#v1-subscription-charges-post).

### Retrieve subscription

`GET /v1/subscriptions/{subscriptionId}`

Retrieves an existing subscription by a `subscriptionId`. The `subscriptionId`
can be obtained from the [Retrieve payment](#get-payment) method.

#### Parameters

- subscriptionIdstring (uuid)required The subscription identifier (a UUID).

- MerchantNumberstringoptional The merchant number. Use this header only if you
  are a Nexi Group partner and initiating the checkout with your partner keys.
  If you are using the integration keys for your webshop, there is no need to
  specify this header.

#### Responses

- 200OKoptional subscriptionIdstring (uuid)required The subscription identifier.
  example: 4a74145b767d4c098040f4266cb619e8
- frequencyinteger (int32)optional
- intervalinteger (int32)required Defines the minimum number of days between
  each recurring charge. This interval commences from either the day the
  subscription was created or the most recent subscription charge, whichever is
  later. An interval value of 0 means that there are no payment interval
  restrictions.

- endDatestring (date-time)required Refers to the date and time the subscription
  will expire. The field has three components: date, time, and time zone (offset
  from GMT), for example: 2021-07-02T12:00:00.0000+02:00.

- paymentDetailsobjectrequired paymentTypestringrequired The type of payment.
  Possible values are: &#x27;CARD&#x27;, &#x27;INVOICE&#x27;, &#x27;A2A&#x27;,
  &#x27;INSTALLMENT&#x27;, &#x27;WALLET&#x27;, and &#x27;PREPAID-INVOICE&#x27;.

- paymentMethodstringrequired The payment method. For example Visa or
  Mastercard.

- cardDetailsobjectrequired expiryDatestringrequired The four-digit expiration
  date of the payment card. The format should be: MMYY.

- maskedPanstringrequired A masked version of the PAN (Primary Account Number).
  At maximum, only the first six and last four digits of the account number are
  displayed.

- importErrorobjectoptional Represents an error that occurred during the import
  of a subscription from an external ecommerce system.

importStepsResponseCodestringoptional The error code.

- importStepsResponseSourcestringoptional The source of the error.

- importStepsResponseTextstringoptional The error message.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

{ "subscriptionId": "4a74145b767d4c098040f4266cb619e8", "frequency": 0,
"interval": 0, "endDate": "2019-08-24T14:15:22Z", "paymentDetails": {
"paymentType": "string", "paymentMethod": "string", "cardDetails": {
"expiryDate": "string", "maskedPan": "string" } }, "importError": {
"importStepsResponseCode": "string", "importStepsResponseSource": "string",
"importStepsResponseText": "string" } }

### Charge subscription

`POST /v1/subscriptions/{subscriptionId}/charges`

Charges a single subscription. The `subscriptionId` can be obtained from the
[Retrieve payment](#get-payment) method. On success, this method creates a new
payment object and performs a charge of the specified amount. Both the new
`paymentId` and `chargeId` are returned in the response body.

#### Parameters

- subscriptionIdstring (uuid)required The subscription identifier (a UUID)
  returned from the [Retrieve payment](#v1-payments-paymentId-get) method.

- Idempotency-Keystringoptional A string that uniquely identifies the charge you
  are attempting. Must be between 1 and 64 characters.

- MerchantNumberstringoptional The merchant number. Use this header only if you
  are a Nexi Group partner and initiating the checkout with your partner keys.
  If you are using the integration keys for your webshop, there is no need to
  specify this header.

#### Request body

Expand all orderobjectrequired Specifies an order associated with a payment. An
order must contain at least one order item. The `amount` of the order must match
the sum of the specified order items.

itemsarrayrequired A list of order items. At least one item must be specified.

referencestringrequiredA reference to recognize the product, usually the SKU
(stock keeping unit) of the product. For convenience in the case of refunds or
modifications of placed orders, the reference should be unique for each
variation of a product item (size, color, etc). The maximum length is 128
characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.
amountinteger (int32)requiredThe total base amount of the order including VAT,
if any. (Sum of all `grossTotalAmount`s in the order.) Must be higher than
0.currencystringrequiredThe [currency](../#currency-and-amount) of the payment,
for example &#x27;SEK&#x27;. The following special characters are not supported:
<, >, &#x27;, ", &, \referencestringoptionalA reference to recognize this order.
Usually a number sequence (order number). The maximum length is 128 characters.
The following special characters are not supported: <, >, &#x27;, ", &,\
notificationsobjectoptional Notifications allow you to subscribe to status
updates for a payment.

webHooksarrayoptional The list of webhooks. The maximum number of webhooks
is 32.

eventNamestringrequiredThe name of the event you want to subscribe to. See
[webhooks](#webhooks) for the complete list of events. The following special
characters are not supported: <, >, &#x27;, ", &, \urlstringrequiredThe callback
is sent to this URL. Must be HTTPS to ensure a secure communication. The maximum
allowed length of the URL is 256 characters. The following special characters
are not supported: <, >, &#x27;, ", &, \authorizationstringoptionalThe
credentials that will be sent in the HTTP Authorization request header of the
callback. Must be between **8** and **64** characters long and contain
**alphanumeric** characters.

- myReferencestringoptional

### Request body

{ "order": { "items": [ { "reference": "string", "name": "string", "quantity":
0.1, "unit": "string", "unitPrice": 0, "taxRate": 0, "taxAmount": 0,
"grossTotalAmount": 0, "netTotalAmount": 0, "imageUrl": "string" } ], "amount":
0, "currency": "string", "reference": "string" }, "notifications": { "webHooks":
[ { "eventName": "string", "url": "string", "authorization": "string",
"headers": null } ] }, "myReference": "string" }

#### Responses

- 200OKoptional paymentIdstring (uuid)required The payment identifier of the new
  payment object created when charging for the subscription. example:
  e2c53ac616dd458d9655cc1fc9228b16
- chargeIdstring (uuid)required A unique identifier of the charge. example:
  beb59c4588c1460eb3e0d3503d5e280d

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 402Payment Requiredoptional
- 404Not Foundoptional
- 409Conflictoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

{ "paymentId": "e2c53ac616dd458d9655cc1fc9228b16", "chargeId":
"beb59c4588c1460eb3e0d3503d5e280d" }

### Retrieve subscription charge status

`GET /v1/subscriptions/{subscriptionId}/charges/status`

Retrieves an existing subscription charge status by a `subscriptionId`. The
`subscriptionId` can be obtained from the [Retrieve payment](#get-payment)
method.

#### Parameters

- subscriptionIdstring (uuid)required The subscription identifier (a UUID).

- Idempotency-Keystringoptional A string that uniquely identifies the charge you
  are attempting. Must be between 1 and 64 characters.

- MerchantNumberstringoptional The merchant number. Use this header only if you
  are a Nexi Group partner and initiating the checkout with your partner keys.
  If you are using the integration keys for your webshop, there is no need to
  specify this header.

#### Responses

- 200OKoptional paymentIdstring (uuid)required The payment identifier of the new
  payment object created when charging for the unscheduled subscription.
  example: ef4baad002f842728486f03d4073f5b7
- chargeIdstring (uuid)required A unique identifier of the charge. example:
  c5dce211eb034fbfa40edb65954a0b19
- completedbooleanrequired Whether the charge was completed.

- 401Unauthorizedoptional
- 404Not Foundoptional

### 200

{ "paymentId": "ef4baad002f842728486f03d4073f5b7", "chargeId":
"c5dce211eb034fbfa40edb65954a0b19", "completed": true }

### Retrieve subscription by external reference

`GET /v1/subscriptions`

Retrieves a subscription matching the specified `externalReference`. This method
can only be used for retrieving subscriptions that have been imported from a
payment platform other than Checkout. Subscriptions created within Checkout do
not have an `externalReference` value set.

#### Parameters

- externalReferencestringoptional The external reference to search for.

- MerchantNumberstringoptional The merchant number. Use this header only if you
  are a Nexi Group partner and initiating the checkout with your partner keys.
  If you are using the integration keys for your webshop, there is no need to
  specify this header.

#### Responses

- 200OKoptional subscriptionIdstring (uuid)required The subscription identifier.
  example: 4a74145b767d4c098040f4266cb619e8
- frequencyinteger (int32)optional
- intervalinteger (int32)required Defines the minimum number of days between
  each recurring charge. This interval commences from either the day the
  subscription was created or the most recent subscription charge, whichever is
  later. An interval value of 0 means that there are no payment interval
  restrictions.

- endDatestring (date-time)required Refers to the date and time the subscription
  will expire. The field has three components: date, time, and time zone (offset
  from GMT), for example: 2021-07-02T12:00:00.0000+02:00.

- paymentDetailsobjectrequired paymentTypestringrequired The type of payment.
  Possible values are: &#x27;CARD&#x27;, &#x27;INVOICE&#x27;, &#x27;A2A&#x27;,
  &#x27;INSTALLMENT&#x27;, &#x27;WALLET&#x27;, and &#x27;PREPAID-INVOICE&#x27;.

- paymentMethodstringrequired The payment method. For example Visa or
  Mastercard.

- cardDetailsobjectrequired expiryDatestringrequired The four-digit expiration
  date of the payment card. The format should be: MMYY.

- maskedPanstringrequired A masked version of the PAN (Primary Account Number).
  At maximum, only the first six and last four digits of the account number are
  displayed.

- importErrorobjectoptional Represents an error that occurred during the import
  of a subscription from an external ecommerce system.

importStepsResponseCodestringoptional The error code.

- importStepsResponseSourcestringoptional The source of the error.

- importStepsResponseTextstringoptional The error message.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

{ "subscriptionId": "4a74145b767d4c098040f4266cb619e8", "frequency": 0,
"interval": 0, "endDate": "2019-08-24T14:15:22Z", "paymentDetails": {
"paymentType": "string", "paymentMethod": "string", "cardDetails": {
"expiryDate": "string", "maskedPan": "string" } }, "importError": {
"importStepsResponseCode": "string", "importStepsResponseSource": "string",
"importStepsResponseText": "string" } }

### Bulk charge subscriptions

`POST /v1/subscriptions/charges`

Charges multiple subscriptions at once. The request body must contain:

- A unique string that identifies this bulk charge operation
- A set of subscription identifiers that should be charged.

To get status updates about the bulk charge you can subscribe to the webhooks
for charges and refunds (`payment.charges.*` and `payments.refunds.*`). See also
the [webhooks documentation](#webhooks).

#### Parameters

- MerchantNumberstringoptional The merchant number. Use this header only if you
  are a Nexi Group partner and initiating the checkout with your partner keys.
  If you are using the integration keys for your webshop, there is no need to
  specify this header.

#### Request body

Expand all

- externalBulkChargeIdstringrequired A string that uniquely identifies the bulk
  charge operation. Use this property for enabling safe retries. Must be between
  1 and 64 characters.

notificationsobjectoptional Notifications allow you to subscribe to status
updates for a payment.

webHooksarrayoptional The list of webhooks. The maximum number of webhooks
is 32.

eventNamestringrequiredThe name of the event you want to subscribe to. See
[webhooks](#webhooks) for the complete list of events. The following special
characters are not supported: <, >, &#x27;, ", &, \urlstringrequiredThe callback
is sent to this URL. Must be HTTPS to ensure a secure communication. The maximum
allowed length of the URL is 256 characters. The following special characters
are not supported: <, >, &#x27;, ", &, \authorizationstringoptionalThe
credentials that will be sent in the HTTP Authorization request header of the
callback. Must be between **8** and **64** characters long and contain
**alphanumeric** characters.

- subscriptionsarrayrequired The array of subscriptions that should be charged.
  Each item in the array should define either a `subscriptionId` or an
  `externalReference`, but not both.

subscriptionIdstring (uuid)optional The subscription identifier (a UUID)
returned from the [Retrieve payment](#v1-payments-paymentId-get) method.

- externalReferencestringoptional An external reference to identify a set of
  imported subscriptions. This parameter is only used if your subscriptions have
  been imported from a payment platform other than Checkout.

orderobjectrequired Specifies an order associated with a payment. An order must
contain at least one order item. The `amount` of the order must match the sum of
the specified order items.

itemsarrayrequired A list of order items. At least one item must be specified.

referencestringrequiredA reference to recognize the product, usually the SKU
(stock keeping unit) of the product. For convenience in the case of refunds or
modifications of placed orders, the reference should be unique for each
variation of a product item (size, color, etc). The maximum length is 128
characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.
amountinteger (int32)requiredThe total base amount of the order including VAT,
if any. (Sum of all `grossTotalAmount`s in the order.) Must be higher than
0.currencystringrequiredThe [currency](../#currency-and-amount) of the payment,
for example &#x27;SEK&#x27;. The following special characters are not supported:
<, >, &#x27;, ", &, \referencestringoptionalA reference to recognize this order.
Usually a number sequence (order number). The maximum length is 128 characters.
The following special characters are not supported: <, >, &#x27;, ", &, \

- myReferencestringoptional

### Request body

{ "externalBulkChargeId": "string", "notifications": { "webHooks": [ {
"eventName": "string", "url": "string", "authorization": "string", "headers":
null } ] }, "subscriptions": [ { "subscriptionId":
"d079718b-ff63-45dd-947b-4950c023750f", "externalReference": "string", "order":
{ "items": [ { "reference": "string", "name": "string", "quantity": 0.1, "unit":
"string", "unitPrice": 0, "taxRate": 0, "taxAmount": 0, "grossTotalAmount": 0,
"netTotalAmount": 0, "imageUrl": "string" } ], "amount": 0, "currency":
"string", "reference": "string" }, "myReference": "string" } ] }

#### Responses

- 202Acceptedoptional bulkIdstring (uuid)required The bulk charge identifier (a
  UUID). This identifier can be used when
  [retrieving all charges associated with a bulk charge operation](#v1-subscriptions-charges-bulkid-get).
  example: 733d68ab3be84d4695bf36eb39b05059

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 202
- 400
- 500

{ "bulkId": "733d68ab3be84d4695bf36eb39b05059" }

### Retrieve bulk charges

`GET /v1/subscriptions/charges/{bulkId}`

Retrieves charges associated with the specified bulk charge operation. The
`bulkId` is returned from Nexi Group in the response of the
[Bulk charge subscriptions](#v1-subscription-charges-post) method.

This method supports pagination. Specify the range of subscriptions to retrieve
by using either `skip` and `take` or `pageNumber` together with `pageSize`. The
boolean property named `more` in the response body, indicates whether there are
more subscriptions beyond the requested range.

#### Parameters

- bulkIdstringrequired The identifier of the bulk charge operation that was
  returned from the [Bulk charge subscriptions](#v1-subscriptions-charges-post)
  method.

- skipinteger (int32)optional The number of subscription entries to skip from
  the start. Use this property in combination with the `take` property.

- takeinteger (int32)optional The maximum number of subscriptions to be
  retrieved. Use this property in combination with the `skip` property.

- pageNumberinteger (int32)optional The page number to be retrieved. Use this
  property in combination with the `pageSize` property.

- pageSizeinteger (int32)optional The size of each page when specify the range
  of subscriptions using the `pageNumber` property.

- MerchantNumberstringoptional The merchant number. Use this header only if you
  are a Nexi Group partner and initiating the checkout with your partner keys.
  If you are using the integration keys for your webshop, there is no need to
  specify this header.

#### Responses

- 200OKoptional pagearrayoptional subscriptionIdstring (uuid)required The
  subscription identifier (a UUID) returned from the
  [Retrieve payment](#v1-payments-paymentid-get) method. example:
  82678698b83e476d8a2558d94b22d0e6
- paymentIdstring (uuid)optional The payment identifier.

- chargeIdstring (uuid)optional The charge identifier (a UUID) returned from the
  [Charge payment](#charge-payment) method.

- statusstringrequired The current processing status of the subscription.
  Possible values are: &#x27;Pending&#x27;, &#x27;Succeeded&#x27;, and
  &#x27;Failed&#x27;.

- messagestringoptional
- codestringoptional
- sourcestringoptional
- externalReferencestringoptional An external reference to identify a set of
  imported subscriptions. This parameter is only used if your subscriptions have
  been imported from a payment platform other than Checkout.

- morebooleanoptional Indicates whether there are more subscriptions beyond the
  requested range.

- statusstringoptional Indicates whether the operation has completed or is still
  processing subscriptions. Possible values are &#x27;Done&#x27; and
  &#x27;Processing&#x27;.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

{ "page": [ { "subscriptionId": "82678698b83e476d8a2558d94b22d0e6", "paymentId":
"472e651e-5a1e-424d-8098-23858bf03ad7", "chargeId":
"aec0aceb-a4db-49fb-b366-75e90229c640", "status": "string", "message": "string",
"code": "string", "source": "string", "externalReference": "string" } ], "more":
true, "status": "string" }

### Verify subscriptions

`POST /v1/subscriptions/verifications`

Verifies the specified set of subscriptions in bulk. The `bulkId` returned from
a successful request can be used for querying the status of the subscriptions.

#### Parameters

#### Request body

Expand all

- externalBulkVerificationIdstringoptional A string that uniquely identifies the
  verification operation. Use this property for enabling safe retries. Must be
  between 1 and 64 characters.

- subscriptionsarrayoptional The set of subscriptions that should be verified.
  Each item in the array should define either a `subscriptioId` or an
  `externalReference`, but not both.

subscriptionIdstring (uuid)optional The identifier of the subscription (a UUID).
The `subscriptionId` can be obtained using the
[Retrieve payment](#v1-payments-paymentid-get) method.

- externalReferencestringoptional An external reference to identify a set of
  imported subscriptions. This parameter is only used if your subscriptions have
  been imported from a payment platform other than Checkout.

### Request body

{ "externalBulkVerificationId": "string", "subscriptions": [ { "subscriptionId":
"d079718b-ff63-45dd-947b-4950c023750f", "externalReference": "string" } ] }

#### Responses

- 202Acceptedoptional bulkIdstring (uuid)requiredexample:
  9fa052c30d314352a9194eb944fb9e4f

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 202
- 400
- 500

{ "bulkId": "9fa052c30d314352a9194eb944fb9e4f" }

### Retrieve bulk verifications

`GET /v1/subscriptions/verifications/{bulkId}`

Retrieves verifications associated with the specified bulk verification
operation. The `bulkId` is returned from Nexi Group in the response of the
[Verify subscriptions](#v1-subscriptions-verifications-post) method.

This method supports pagination. Specify the range of subscriptions to retrieve
by using either `skip` and `take` or `pageNumber` together with `pageSize`. The
boolean property named `more` in the response body, indicates whether there are
more subscriptions beyond the requested range.

#### Parameters

- bulkIdstringrequired The identifier of the bulk verification operation that
  was returned from the
  [Verify subscriptions](#v1-subscriptions-verifications-post) method.

- skipinteger (int32)optional The number of subscription entries to skip from
  the start. Use this property in combination with the `take` property.

- takeinteger (int32)optional The maximum number of subscriptions to be
  retrieved. Use this property in combination with the `skip` property.

- pageNumberinteger (int32)optional The page number to be retrieved. Use this
  property in combination with the `pageSize` property.

- pageSizeinteger (int32)optional The size of each page when specify the range
  of subscriptions using the `pageNumber` property.

#### Responses

- 200OKoptional pagearrayoptional subscriptionIdstring (uuid)required The
  identifier of the subscription (a UUID). example:
  fd81c667f33247b08c48565933e1fa67
- externalReferencestringoptional An external reference to identify a set of
  imported subscriptions. This parameter is only used if your subscriptions have
  been imported from a payment platform other than Checkout.

- statusstringrequired The current processing status of the subscription.
  Possible values are: &#x27;Pending&#x27;, &#x27;Succeeded&#x27;, and
  &#x27;Failed&#x27;.

- messagestringoptional
- codestringoptional
- paymentIdstring (uuid)optional The payment identifier (a UUID).

- morebooleanoptional Indicates whether there are more subscriptions beyond the
  requested range.

- statusstringoptional Indicates whether the operation has completed or is still
  processing subscriptions. Possible values are &#x27;Done&#x27; and
  &#x27;Processing&#x27;.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

{ "page": [ { "subscriptionId": "fd81c667f33247b08c48565933e1fa67",
"externalReference": "string", "status": "string", "message": "string", "code":
"string", "paymentId": "472e651e-5a1e-424d-8098-23858bf03ad7" } ], "more": true,
"status": "string" }

## UnscheduledSubscriptions

Unscheduled subscriptions allow you to charge your customers at an unscheduled
time interval with a variable amount, for example an automatic top-up agreement
for a rail-card when the consumer drops below a certain stored value.

When an unscheduled subscription is charged, a new payment object is created to
represent the purchase of the unscheduled subscription product.

It is possible to verify and charge multiple unscheduled subscriptions in bulk
using the
[Bulk charge unscheduled subscriptions method](#v1-unscheduled-subscription-charges-post).

### Retrieve unscheduled subscription

`GET /v1/unscheduledsubscriptions/{unscheduledSubscriptionId}`

Retrieves an existing unscheduled subscription by a `unscheduledSubscriptionId`.
The `unscheduledSubscriptionId` can be obtained from the
[Retrieve payment](#get-payment) method.

#### Parameters

- unscheduledSubscriptionIdstring (uuid)required The unscheduled subscription
  identifier (a UUID).

#### Responses

- 200OKoptional unscheduledSubscriptionIdstring (uuid)required The unscheduled
  subscription identifier. example: 1906bd7ce1064d518fefeca24de0ca7e
- paymentDetailsobjectrequired paymentTypestringrequired The type of payment.
  Possible values are: &#x27;CARD&#x27;, &#x27;INVOICE&#x27;, &#x27;A2A&#x27;,
  &#x27;INSTALLMENT&#x27;, &#x27;WALLET&#x27;, and &#x27;PREPAID-INVOICE&#x27;.

- paymentMethodstringrequired The payment method. For example Visa or
  Mastercard.

- cardDetailsobjectrequired expiryDatestringrequired The four-digit expiration
  date of the payment card. The format should be: MMYY.

- maskedPanstringrequired A masked version of the PAN (Primary Account Number).
  At maximum, only the first six and last four digits of the account number are
  displayed.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

{ "unscheduledSubscriptionId": "1906bd7ce1064d518fefeca24de0ca7e",
"paymentDetails": { "paymentType": "string", "paymentMethod": "string",
"cardDetails": { "expiryDate": "string", "maskedPan": "string" } } }

### Retrieve unscheduled subscription by external reference

`GET /v1/unscheduledsubscriptions`

Retrieves an unscheduled subscription matching the specified
`externalReference`. This method can only be used for retrieving unscheduled
subscriptions that have been imported from a payment platform other than
Checkout. Unscheduled subscriptions created within Checkout do not have an
`externalReference` value set.

#### Parameters

- externalReferencestringoptional The external reference to search for.

#### Responses

- 200OKoptional unscheduledSubscriptionIdstring (uuid)required The unscheduled
  subscription identifier. example: 1906bd7ce1064d518fefeca24de0ca7e
- paymentDetailsobjectrequired paymentTypestringrequired The type of payment.
  Possible values are: &#x27;CARD&#x27;, &#x27;INVOICE&#x27;, &#x27;A2A&#x27;,
  &#x27;INSTALLMENT&#x27;, &#x27;WALLET&#x27;, and &#x27;PREPAID-INVOICE&#x27;.

- paymentMethodstringrequired The payment method. For example Visa or
  Mastercard.

- cardDetailsobjectrequired expiryDatestringrequired The four-digit expiration
  date of the payment card. The format should be: MMYY.

- maskedPanstringrequired A masked version of the PAN (Primary Account Number).
  At maximum, only the first six and last four digits of the account number are
  displayed.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

{ "unscheduledSubscriptionId": "1906bd7ce1064d518fefeca24de0ca7e",
"paymentDetails": { "paymentType": "string", "paymentMethod": "string",
"cardDetails": { "expiryDate": "string", "maskedPan": "string" } } }

### Charge unscheduled subscription

`POST /v1/unscheduledsubscriptions/{unscheduledSubscriptionId}/charges`

Charges a single unscheduled subscription. The `unscheduledSubscriptionId` can
be obtained from the [Retrieve payment](#get-payment) method. On success, this
method creates a new payment object and performs a charge of the specified
amount. Both the new `paymentId` and `chargeId` are returned in the response
body.

#### Parameters

- unscheduledSubscriptionIdstring (uuid)required The unscheduled subscription
  identifier (a UUID) returned from the
  [Retrieve payment](#v1-payments-paymentId-get) method.

- Idempotency-Keystringoptional A string that uniquely identifies the charge you
  are attempting. Must be between 1 and 64 characters.

#### Request body

Expand all orderobjectrequired Specifies an order associated with a payment. An
order must contain at least one order item. The `amount` of the order must match
the sum of the specified order items.

itemsarrayrequired A list of order items. At least one item must be specified.

referencestringrequiredA reference to recognize the product, usually the SKU
(stock keeping unit) of the product. For convenience in the case of refunds or
modifications of placed orders, the reference should be unique for each
variation of a product item (size, color, etc). The maximum length is 128
characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.
amountinteger (int32)requiredThe total base amount of the order including VAT,
if any. (Sum of all `grossTotalAmount`s in the order.) Must be higher than
0.currencystringrequiredThe [currency](../#currency-and-amount) of the payment,
for example &#x27;SEK&#x27;. The following special characters are not supported:
<, >, &#x27;, ", &, \referencestringoptionalA reference to recognize this order.
Usually a number sequence (order number). The maximum length is 128 characters.
The following special characters are not supported: <, >, &#x27;, ", &,\
notificationsobjectoptional Notifications allow you to subscribe to status
updates for a payment.

webHooksarrayoptional The list of webhooks. The maximum number of webhooks
is 32.

eventNamestringrequiredThe name of the event you want to subscribe to. See
[webhooks](#webhooks) for the complete list of events. The following special
characters are not supported: <, >, &#x27;, ", &, \urlstringrequiredThe callback
is sent to this URL. Must be HTTPS to ensure a secure communication. The maximum
allowed length of the URL is 256 characters. The following special characters
are not supported: <, >, &#x27;, ", &, \authorizationstringoptionalThe
credentials that will be sent in the HTTP Authorization request header of the
callback. Must be between **8** and **64** characters long and contain
**alphanumeric** characters.

- myReferencestringoptional

### Request body

{ "order": { "items": [ { "reference": "string", "name": "string", "quantity":
0.1, "unit": "string", "unitPrice": 0, "taxRate": 0, "taxAmount": 0,
"grossTotalAmount": 0, "netTotalAmount": 0, "imageUrl": "string" } ], "amount":
0, "currency": "string", "reference": "string" }, "notifications": { "webHooks":
[ { "eventName": "string", "url": "string", "authorization": "string",
"headers": null } ] }, "myReference": "string" }

#### Responses

- 200OKoptional paymentIdstring (uuid)required The payment identifier of the new
  payment object created when charging for the unscheduled subscription.
  example: 4d05397092bb4548bd9bb22e0ec59c2c
- chargeIdstring (uuid)required A unique identifier of the charge. example:
  23757c193fd94a9881986f174db1ac71

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 402Payment Requiredoptional
- 404Not Foundoptional
- 409Conflictoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

{ "paymentId": "4d05397092bb4548bd9bb22e0ec59c2c", "chargeId":
"23757c193fd94a9881986f174db1ac71" }

### Retrieve unscheduled subscription charge status

`GET /v1/unscheduledsubscriptions/{unscheduledSubscriptionId}/charges/status`

Retrieves an existing unscheduled subscription charge status by a
`unscheduledSubscriptionId`. The `unscheduledSubscriptionId` can be obtained
from the [Retrieve payment](#get-payment) method.

#### Parameters

- unscheduledSubscriptionIdstring (uuid)required The unscheduled subscription
  identifier (a UUID).

- Idempotency-Keystringoptional A string that uniquely identifies the charge you
  are attempting. Must be between 1 and 64 characters.

#### Responses

- 200OKoptional paymentIdstring (uuid)required The payment identifier of the new
  payment object created when charging for the unscheduled subscription.
  example: ef4baad002f842728486f03d4073f5b7
- chargeIdstring (uuid)required A unique identifier of the charge. example:
  c5dce211eb034fbfa40edb65954a0b19
- completedbooleanrequired Whether the charge was completed.

- 401Unauthorizedoptional
- 404Not Foundoptional

### 200

{ "paymentId": "ef4baad002f842728486f03d4073f5b7", "chargeId":
"c5dce211eb034fbfa40edb65954a0b19", "completed": true }

### Bulk charge unscheduled subscriptions

`POST /v1/unscheduledsubscriptions/charges`

Charges multiple unscheduled subscriptions at once. The request body must
contain:

- A unique string that identifies this bulk charge operation
- A set of unscheduled subscription identifiers that should be charged.

To get status updates about the bulk charge you can subscribe to the webhooks
for charges and refunds (`payment.charges.*` and `payments.refunds.*`). See also
the [webhooks documentation](#webhooks).

#### Parameters

#### Request body

Expand all

- externalBulkChargeIdstringoptional A string that uniquely identifies the bulk
  charge operation. Use this property for enabling safe retries. Must be between
  1 and 64 characters.

notificationsobjectoptional Notifications allow you to subscribe to status
updates for a payment.

webHooksarrayoptional The list of webhooks. The maximum number of webhooks
is 32.

eventNamestringrequiredThe name of the event you want to subscribe to. See
[webhooks](#webhooks) for the complete list of events. The following special
characters are not supported: <, >, &#x27;, ", &, \urlstringrequiredThe callback
is sent to this URL. Must be HTTPS to ensure a secure communication. The maximum
allowed length of the URL is 256 characters. The following special characters
are not supported: <, >, &#x27;, ", &, \authorizationstringoptionalThe
credentials that will be sent in the HTTP Authorization request header of the
callback. Must be between **8** and **64** characters long and contain
**alphanumeric** characters.

- unscheduledSubscriptionsarrayoptional The array of unscheduled subscriptions
  that should be charged. Each item in the array should define either a
  `subscriptionId` or an `externalReference`, but not both.

unscheduledSubscriptionIdstring (uuid)optional The subscription identifier (a
UUID) returned from the [Retrieve payment](#v1-payments-paymentId-get) method.

- externalReferencestringoptional An external reference to identify a set of
  imported subscriptions. This parameter is only used if your unscheduled
  subscriptions have been imported from a payment platform other than Checkout.

orderobjectrequired Specifies an order associated with a payment. An order must
contain at least one order item. The `amount` of the order must match the sum of
the specified order items.

itemsarrayrequired A list of order items. At least one item must be specified.

referencestringrequiredA reference to recognize the product, usually the SKU
(stock keeping unit) of the product. For convenience in the case of refunds or
modifications of placed orders, the reference should be unique for each
variation of a product item (size, color, etc). The maximum length is 128
characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.
amountinteger (int32)requiredThe total base amount of the order including VAT,
if any. (Sum of all `grossTotalAmount`s in the order.) Must be higher than
0.currencystringrequiredThe [currency](../#currency-and-amount) of the payment,
for example &#x27;SEK&#x27;. The following special characters are not supported:
<, >, &#x27;, ", &, \referencestringoptionalA reference to recognize this order.
Usually a number sequence (order number). The maximum length is 128 characters.
The following special characters are not supported: <, >, &#x27;, ", &, \

- myReferencestringoptional

### Request body

{ "externalBulkChargeId": "string", "notifications": { "webHooks": [ {
"eventName": "string", "url": "string", "authorization": "string", "headers":
null } ] }, "unscheduledSubscriptions": [ { "unscheduledSubscriptionId":
"92143051-9e78-40af-a01f-245ccdcd9c03", "externalReference": "string", "order":
{ "items": [ { "reference": "string", "name": "string", "quantity": 0.1, "unit":
"string", "unitPrice": 0, "taxRate": 0, "taxAmount": 0, "grossTotalAmount": 0,
"netTotalAmount": 0, "imageUrl": "string" } ], "amount": 0, "currency":
"string", "reference": "string" }, "myReference": "string" } ] }

#### Responses

- 202Acceptedoptional bulkIdstring (uuid)required The bulk charge identifier (a
  UUID). This identifier can be used when
  [retrieving all charges associated with a bulk charge operation](#v1-unscheduled-subscriptions-charges-bulkid-get).
  example: 2dd189144e73459a9988c6ff16e8fc61

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 202
- 400
- 500

{ "bulkId": "2dd189144e73459a9988c6ff16e8fc61" }

### Retrieve bulk unscheduled charges

`GET /v1/unscheduledsubscriptions/charges/{bulkId}`

Retrieves charges associated with the specified bulk charge operation. The
`bulkId` is returned from Nexi Group in the response of the
[Bulk charge unscheduled subscriptions](#v1-unscheduled-subscription-charges-post)
method.

This method supports pagination. Specify the range of subscriptions to retrieve
by using either `skip` and `take` or `pageNumber` together with `pageSize`. The
boolean property named `more` in the response body, indicates whether there are
more subscriptions beyond the requested range.

#### Parameters

- bulkIdstringrequired The identifier of the bulk charge operation that was
  returned from the
  [Bulk charge unscheduled subscriptions](#v1-unscheduled-subscriptions-charges-post)
  method.

- skipinteger (int32)optional The number of subscription entries to skip from
  the start. Use this property in combination with the `take` property.

- takeinteger (int32)optional The maximum number of subscriptions to be
  retrieved. Use this property in combination with the `skip` property.

- pageNumberinteger (int32)optional The page number to be retrieved. Use this
  property in combination with the `pageSize` property.

- pageSizeinteger (int32)optional The size of each page when specify the range
  of subscriptions using the `pageNumber` property.

#### Responses

- 200OKoptional pagearrayoptional unscheduledSubscriptionIdstring (uuid)required
  The unscheduled subscription identifier (a UUID) returned from the Retrieve
  bulk unscheduled subscription charges method. example:
  418150e44b1f4e54a27a21b5ade64a59
- paymentIdstring (uuid)optional The payment identifier.

- chargeIdstring (uuid)optional The charge identifier (a UUID) returned from the
  [Charge payment](#charge-payment) method.

- statusstringrequired The current processing status of the subscription.
  Possible values are: &#x27;Pending&#x27;, &#x27;Succeeded&#x27;, and
  &#x27;Failed&#x27;.

- messagestringoptional
- codestringoptional
- sourcestringoptional
- externalReferencestringoptional An external reference to identify a set of
  imported subscriptions. This parameter is only used if your unscheduled
  subscriptions have been imported from a payment platform other than Checkout.

- morebooleanoptional Indicates whether there are more subscriptions beyond the
  requested range.

- statusstringoptional Indicates whether the operation has completed or is still
  processing subscriptions. Possible values are &#x27;Done&#x27; and
  &#x27;Processing&#x27;.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

{ "page": [ { "unscheduledSubscriptionId": "418150e44b1f4e54a27a21b5ade64a59",
"paymentId": "472e651e-5a1e-424d-8098-23858bf03ad7", "chargeId":
"aec0aceb-a4db-49fb-b366-75e90229c640", "status": "string", "message": "string",
"code": "string", "source": "string", "externalReference": "string" } ], "more":
true, "status": "string" }

### Verify cards for unscheduled subscriptions

`POST /v1/unscheduledsubscriptions/verifications`

Verifies the specified set of unscheduled subscriptions in bulk. The `bulkId`
returned from a successful request can be used for querying the status of the
unscheduled subscriptions.

#### Parameters

#### Request body

Expand all

- externalBulkVerificationIdstringoptional A string that uniquely identifies the
  verification operation. Use this property for enabling safe retries. Must be
  between 1 and 64 characters.

- unscheduledSubscriptionsarrayoptional The set of unscheduled subscriptions
  that should be verified. Each item in the array should define either a
  `unscheduledSubscriptionId` or an `externalReference`, but not both.

unscheduledSubscriptionIdstring (uuid)optional The identifier of the unscheduled
subscription (a UUID). The `unscheduledSubscriptionId` can be obtained using the
[Retrieve payment](#v1-payments-paymentid-get) method.

- externalReferencestringoptional An external reference to identify a set of
  imported subscriptions. This parameter is only used if your unscheduled
  subscriptions have been imported from a payment platform other than Checkout.

### Request body

{ "externalBulkVerificationId": "string", "unscheduledSubscriptions": [ {
"unscheduledSubscriptionId": "92143051-9e78-40af-a01f-245ccdcd9c03",
"externalReference": "string" } ] }

#### Responses

- 202Acceptedoptional bulkIdstring (uuid)requiredexample:
  1ed6a89345b7498fa0da213be6732ac3

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 202
- 400
- 500

{ "bulkId": "1ed6a89345b7498fa0da213be6732ac3" }

### Retrieve bulk verifications for unscheduled subscriptions

`GET /v1/unscheduledsubscriptions/verifications/{bulkId}`

Retrieves verifications associated with the specified bulk unscheduled
verification operation. The `bulkId` is returned from Nexi Group in the response
of the
[Verify unscheduled subscriptions](#v1-unscheduledsubscriptions-verifications-post)
method.

This method supports pagination. Specify the range of subscriptions to retrieve
by using either `skip` and `take` or `pageNumber` together with `pageSize`. The
boolean property named `more` in the response body, indicates whether there are
more subscriptions beyond the requested range.

#### Parameters

- bulkIdstringrequired The identifier of the bulk verification operation that
  was returned from the
  [Verify unscheduled subscriptions](#v1-unscheduledsubscriptions-verifications-post)
  method.

- skipinteger (int32)optional The number of unscheduled subscription entries to
  skip from the start. Use this property in combination with the `take`
  property.

- takeinteger (int32)optional The maximum number of unscheduled subscriptions to
  be retrieved. Use this property in combination with the `skip` property.

- pageNumberinteger (int32)optional The page number to be retrieved. Use this
  property in combination with the `pageSize` property.

- pageSizeinteger (int32)optional The size of each page when specify the range
  of unscheduled subscriptions using the `pageNumber` property.

#### Responses

- 200OKoptional pagearrayoptional unscheduledSubscriptionIdstring (uuid)required
  The identifier of the unscheduled subscription (a UUID). example:
  c2a8f09d47dc4bf8baf76477945c9b99
- externalReferencestringoptional An external reference to identify a set of
  imported unscheduled subscriptions. This parameter is only used if your
  unscheduled subscriptions have been imported from a payment platform other
  than Nets Easy.

- statusstringrequired The current processing status of the unscheduled
  subscription. Possible values are: &#x27;Pending&#x27;, &#x27;Succeeded&#x27;,
  and &#x27;Failed&#x27;.

- messagestringoptional
- codestringoptional
- paymentIdstring (uuid)optional The payment identifier (a UUID).

- morebooleanoptional Indicates whether there are more subscriptions beyond the
  requested range.

- statusstringoptional Indicates whether the operation has completed or is still
  processing subscriptions. Possible values are &#x27;Done&#x27; and
  &#x27;Processing&#x27;.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 404Not Foundoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 200
- 400
- 500

{ "page": [ { "unscheduledSubscriptionId": "c2a8f09d47dc4bf8baf76477945c9b99",
"externalReference": "string", "status": "string", "message": "string", "code":
"string", "paymentId": "472e651e-5a1e-424d-8098-23858bf03ad7" } ], "more": true,
"status": "string" }

## CardPayment

Secure Card Payments are available for
[PCI](https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard)
compliant merchants, that wish to reserve or directly capture payments on the
behalf of their customers avoiding the
[3DS authorization](https://en.wikipedia.org/wiki/3-D_Secure) step, assuming
they&#x27;ve already pre-acquired authorizations from their customers in some
other legal and compliant form.

Attempts to reserve or directly charge a secure card payment. This endpoint can
be only used by PCI compliant merchants who are able to store, process and send
card information securely following PCI-DSS.

To access this endpoint, please reach out to NETS through the official support
channels. Your request will be reviewed and, if approved, you&#x27;ll be
provided with the required access permissions. Once your access is set up,
you’ll be able to start sending requests to the endpoint.`POST /v1/cardpayments`

#### Parameters

Idempotency-KeystringoptionalA string that uniquely identifies the payment
attempted. Must be between 1 and 64 characters.

#### Request body

Expand all

- interactionTypeinteger (int32)optional `0`

orderobjectrequired Specifies an order associated with a payment. An order must
contain at least one order item. The `amount` of the order must match the sum of
the specified order items.

itemsarrayrequired A list of order items. At least one item must be specified.

referencestringrequiredA reference to recognize the product, usually the SKU
(stock keeping unit) of the product. For convenience in the case of refunds or
modifications of placed orders, the reference should be unique for each
variation of a product item (size, color, etc). The maximum length is 128
characters. The following special characters are not supported:
`<,>,\\`namestringrequiredThe name of the product. The maximum length is 128
characters. The following special characters are not supported: `<,>,\\`-
quantitynumber (double)required The quantity of the product. The value can not
be negative.

unitstringrequiredThe defined unit of measurement for the product, for example
pcs, liters, or kg. The maximum length is 128 characters. The following special
characters are not supported: <, >, &#x27;, ", &, \- unitPriceinteger
(int32)required The price per unit excluding VAT. Note: The amount can be
negative.

- taxRateinteger (int32)optional The tax/VAT rate (in percentage times 100). For
  example, the value `2500` corresponds to 25%. Defaults to 0 if not provided.
  Must be between 0 and 99999. Tax Rate must be applied per unit.

- taxAmountinteger (int32)optional The tax/VAT amount (`unitPrice` *
  `quantity` * `taxRate` / 10000). Defaults to 0 if not provided. `taxAmount`
  should include the total tax amount for the entire order item.

- grossTotalAmountinteger (int32)required The total amount including VAT
  (`netTotalAmount` + `taxAmount`). Note: The amount can be negative.

- netTotalAmountinteger (int32)required The total amount excluding VAT
  (`unitPrice` * `quantity`). Note: The amount can be negative.

imageUrlstringoptionalUrl to image of the product. Meant to be configured before
checkout is completed. Ignored on later operations like charging, refunding etc.
Currently affecting: Riverty Invoice. Supported size: width and height between
100 pixels and 1280 pixels. Supported formats: gif, jpeg(jpg), png, webp.
amountinteger (int32)requiredThe total base amount of the order including VAT,
if any. (Sum of all `grossTotalAmount`s in the order.) Must be higher than
0.currencystringrequiredThe [currency](../#currency-and-amount) of the payment,
for example &#x27;SEK&#x27;. The following special characters are not supported:
<, >, &#x27;, ", &, \referencestringoptionalA reference to recognize this order.
Usually a number sequence (order number). The maximum length is 128 characters.
The following special characters are not supported: <, >, &#x27;, ", &,\
paymentInfoobjectrequired consumerobjectoptional Contains information about the
customer. If provided, this information will be used for initiating the consumer
data of the payment object. See also the property `merchantHandlesConsumerData`
which controls what fields to show on the checkout page.

referencestringoptionalThe maximum length is 128 characters. The following
special characters are not supported: <, >, &#x27;, ", &,

///- emailstringoptional The email address.

- shippingAddressobjectoptional The address of a customer (private or business).
  This parameter will become required whenever the `shippingAddress` is being
  used.

addressLine1stringrequired The primary address line. Must be between 1 and 128
characters. The following special characters are not supported: <, >, &#x27;, ",
&, \

- addressLine2stringoptional An additional address line. Must be between 1 and
  128 characters. The following special characters are not supported: <, >,
  &#x27;, ", &, \

postalCodestringrequiredThe postal code. Postal codes per each country: **NOR,
NO** - A four-digit code, for example, 0025. **SWE, SE** - A five-digit code,
for example, 11455. **DNK, DK** - A four-digit code, for example, 2600.
**Other** - Must be between 1 and 12 characters, the following special
characters are not supported: <, >, &#x27;, ", &, \- citystringrequired The
city. Must be between 1 and 128 characters. The following special characters are
not supported: <, >, &#x27;, ", &, \

countrystringrequiredA three-letter country code (ISO 3166-1), for example GBR.
See also the
[list of supported countries](/nexi-checkout/en-EU/api/#country-codes-and-phone-prefixes).
The following special characters are not supported: <, >, &#x27;, ", &, \

- billingAddressobjectoptional The address of a customer (private or business).
  This parameter will become required whenever the `shippingAddress` is being
  used.

addressLine1stringrequired The primary address line. Must be between 1 and 128
characters. The following special characters are not supported: <, >, &#x27;, ",
&, \

- addressLine2stringoptional An additional address line. Must be between 1 and
  128 characters. The following special characters are not supported: <, >,
  &#x27;, ", &, \

postalCodestringrequiredThe postal code. Postal codes per each country: **NOR,
NO** - A four-digit code, for example, 0025. **SWE, SE** - A five-digit code,
for example, 11455. **DNK, DK** - A four-digit code, for example, 2600.
**Other** - Must be between 1 and 12 characters, the following special
characters are not supported: <, >, &#x27;, ", &, \- citystringrequired The
city. Must be between 1 and 128 characters. The following special characters are
not supported: <, >, &#x27;, ", &, \

countrystringrequiredA three-letter country code (ISO 3166-1), for example GBR.
See also the
[list of supported countries](/nexi-checkout/en-EU/api/#country-codes-and-phone-prefixes).
The following special characters are not supported: <, >, &#x27;, ", &,\
phoneNumberobjectoptional An international phone number.

prefixstringoptionalThe
[country calling code](https://en.wikipedia.org/wiki/List_of_country_calling_codes),
for example +1. Pattern: @ `^[+]\\d{1,3}$`.numberstringoptionalThe phone number
(without the country code prefix). Pattern: @ `^[0-9]*$`
privatePersonobjectoptional The name of a natural person.

firstNamestringrequiredThe first name (also known as given name). Must be
between 1 and 128 characters. The following special characters are not
supported: <, >, &#x27;, ", &, \lastNamestringrequiredThe last name (also known
as surname/family name). Must be between 1 and 128 characters. The following
special characters are not supported: <, >, &#x27;, ", &,\
companyobjectoptional A business consumer.

namestringrequiredThe name of the company. Must be between 1 and 128
characters.contactobjectoptional The name of a natural person.

firstNamestringrequiredThe first name (also known as given name). Must be
between 1 and 128 characters. The following special characters are not
supported: <, >, &#x27;, ", &, \lastNamestringrequiredThe last name (also known
as surname/family name). Must be between 1 and 128 characters. The following
special characters are not supported: <, >, &#x27;, ", &, \

- chargebooleanoptional If set to `true`, the transaction will be charged
  automatically after the reservation has been accepted. Default value is
  `false` if not specified.

- merchantNumberstringoptional The merchant number. Use this header only if you
  are a Nexi Group partner and initiating the checkout with your partner keys.
  If you are using the integration keys for your webshop, there is no need to
  specify this header.

notificationsobjectoptional Notifications allow you to subscribe to status
updates for a payment.

webHooksarrayoptional The list of webhooks. The maximum number of webhooks
is 32.

eventNamestringrequiredThe name of the event you want to subscribe to. See
[webhooks](#webhooks) for the complete list of events. The following special
characters are not supported: <, >, &#x27;, ", &, \urlstringrequiredThe callback
is sent to this URL. Must be HTTPS to ensure a secure communication. The maximum
allowed length of the URL is 256 characters. The following special characters
are not supported: <, >, &#x27;, ", &, \authorizationstringoptionalThe
credentials that will be sent in the HTTP Authorization request header of the
callback. Must be between **8** and **64** characters long and contain
**alphanumeric** characters.

myReferencestringoptionalMerchant payment reference The maximum length is 36
characters. The following special characters are not supported: <, >, &#x27;, ",
&, \- cardDetailsobjectrequired cardNumberstringrequired The payment card number
without spaces.

- expiryMonthstringrequired The expiry month in this format: MM, e.g 08 for
  August or 12 for December.

- expiryYearstringrequired The expiry year in this format: YY, e.g 32 for 2032

- cvcstringrequired The 3 digits card verification code.

- cardHolderNamestringoptional The card holder name as issued on the card.

- networkstringoptional

### Request body

{ "interactionType": 0, "order": { "items": [ { "reference": "string", "name":
"string", "quantity": 0.1, "unit": "string", "unitPrice": 0, "taxRate": 0,
"taxAmount": 0, "grossTotalAmount": 0, "netTotalAmount": 0, "imageUrl": "string"
} ], "amount": 0, "currency": "string", "reference": "string" }, "paymentInfo":
{ "consumer": { "reference": "string", "email": "string", "shippingAddress": {
"addressLine1": "string", "addressLine2": "string", "postalCode": "string",
"city": "string", "country": "string" }, "billingAddress": { "addressLine1":
"string", "addressLine2": "string", "postalCode": "string", "city": "string",
"country": "string" }, "phoneNumber": { "prefix": "string", "number": "string"
}, "privatePerson": { "firstName": "string", "lastName": "string" }, "company":
{ "name": "string", "contact": { "firstName": "string", "lastName": "string" } }
}, "charge": true }, "merchantNumber": "string", "notifications": { "webHooks":
[ { "eventName": "string", "url": "string", "authorization": "string",
"headers": null } ] }, "myReference": "string", "cardDetails": { "cardNumber":
"string", "expiryMonth": "string", "expiryYear": "string", "cvc": "string",
"cardHolderName": "string", "network": "string" } }

#### Responses

- 201Createdoptional paymentIdstringrequired The identifier (UUID) of the newly
  created payment. Use this identifier in subsequent request when referring to
  the payment.

- idempotencyKeystringoptional Carries the same value specified in the request
  header.

- 400Bad Requestoptional errorsobjectoptional An array of error messages.

- 401Unauthorizedoptional
- 500Internal Server Erroroptional messagestringoptional An internal error
  message. This message is not meant to be presented to the customer. Instead,
  this message can be logged and used for debugging purposes.

- codestringoptional A numeric error code to be used for debugging purposes.

- sourcestringoptional The source of the error, for example:
  &#x27;internal&#x27;.

- 201
- 400
- 500

{ "paymentId": "string", "idempotencyKey": "string" }

## Webhooks

Webhooks are **configured per payment** and can be specified in the request body
of the following methods: Nets easy Payment Webhooks | Checkout | Nexi group

## Processing

Notifications related to processing events triggered by authorize, capture,
cancel, charge and refund operations

### payment.checkout.completed

The payment.checkout.completed event is triggered when the customer has
completed the checkout.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "f0ef3a6882d24f46b0219c7ad540583a"event: "payment.checkout.completed"timestamp: "2026-04-30T05:04:00.4451+00:00"merchantId: 100242833merchantNumber: 0data: {order: {amount: {amount: "10000"currency: "SEK"}reference: "1234567890"description: "Order 1234"orderItems: [0: {grossTotalAmount: "10000"name: "Product 1"netTotalAmount: "8000"quantity: "2"reference: "Red shoe 12"taxRate: "20"taxAmount: "2000"unit: "pcs"unitPrice: "4000"}]}consumer: {billingAddress: {addressLine1: "Strandvejen 56"addressLine2: "29/11"city: "Copenhagen"country: "Denmark"postcode: "1050"receiverLine: "Strandvejen 56, 29/11"}country: "Denmark"email: "test@example.com"ip: "17.172.224.47"merchantReference: "1234567890"phoneNumber: {prefix: "+47"number: "123456789"}shippingAddress: {addressLine1: "Strandvejen 56"addressLine2: "29/11"city: "Copenhagen"country: "Denmark"postcode: "1050"receiverLine: "Strandvejen 56, 29/11"}}myReference: ""paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.cancel.failed

Notification sent when a cancellation of a reservation has failed.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "1a6a85f7dd9b4532a85439959d1677e5"event: "payment.cancel.failed"timestamp: "2026-04-30T05:04:00.4500+00:00"merchantId: 100242833merchantNumber: 0data: {error: {code: "911"message: "Error occured"source: "Internal"}cancelId: ""orderItems: [0: {grossTotalAmount: "10000"name: "Product 1"netTotalAmount: "8000"quantity: "2"reference: "Red shoe 12"taxRate: "20"taxAmount: "2000"unit: "pcs"unitPrice: "4000"}]myReference: ""amount: {amount: "10000"currency: "SEK"}surchargeAmount: "100"paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.cancel.created

Notification sent when payment has been cancelled.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "3303b513ec3f4326aed93bee2856dc61"event: "payment.cancel.created"timestamp: "2026-04-30T05:04:00.4500+00:00"merchantId: 100242833merchantNumber: 0data: {cancelId: ""orderItems: [0: {grossTotalAmount: "10000"name: "Product 1"netTotalAmount: "8000"quantity: "2"reference: "Red shoe 12"taxRate: "20"taxAmount: "2000"unit: "pcs"unitPrice: "4000"}]myReference: ""amount: {amount: "10000"currency: "SEK"}surchargeAmount: "100"paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.charge.created

Notification sent when charge operation is successful.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "8beeac7b867941c4a4881fa01ce5115a"event: "payment.charge.created"timestamp: "2026-04-30T05:04:00.4501+00:00"merchantId: 100242833merchantNumber: 0data: {chargeId: "55a8e4e3d0394353b7b51a9137c6e720"invoiceDetails: {accountNumber: "1234567890"distributionType: "Email"invoiceDueDate: "2024-12-31"invoiceNumber: "1234567890"ocrOrkid: "1234567890"ourReference: "1234567890"yourReference: "9876543210"}orderItems: [0: {grossTotalAmount: "10000"name: "Product 1"netTotalAmount: "8000"quantity: "2"reference: "Red shoe 12"taxRate: "20"taxAmount: "2000"unit: "pcs"unitPrice: "4000"}]reservationId: "af681b5fe49f4844a6ed3482bf5311f7"reconciliationReference: "MRJhJvEDCx1y7uWlKfb6O3z78"myReference: ""amount: {amount: "10000"currency: "SEK"}surchargeAmount: "100"paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.charge.created.v2

Notification sent when the customer has successfully been charged, partially or
fully. A use case can be to get notified for successful subscription or
unscheduled charges.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "1e520db9d42341ca8cb659c3597077c8"event: "payment.charge.created.v2"timestamp: "2026-04-30T05:04:00.4502+00:00"merchantId: 0merchantNumber: 100242833data: {chargeId: "55a8e4e3d0394353b7b51a9137c6e720"orderItems: [0: {grossTotalAmount: "10000"name: "Product 1"netTotalAmount: "8000"quantity: "2"reference: "Red shoe 12"taxRate: "20"taxAmount: "2000"unit: "pcs"unitPrice: "4000"}]paymentMethod: "Visa"paymentType: "CARD"subscriptionId: ""reconciliationReference: "MRJhJvEDCx1y7uWlKfb6O3z78"myReference: ""amount: {amount: "10000"currency: "SEK"}surchargeAmount: "100"paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.charge.failed

Notification sent when a charge attempt has failed.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "dbc8c1bcf0954e01b08f26294b8aec3b"event: "payment.charge.failed"timestamp: "2026-04-30T05:04:00.4503+00:00"merchantId: 100242833merchantNumber: 0data: {error: {code: "911"message: "Error occured"source: "Internal"}chargeId: "55a8e4e3d0394353b7b51a9137c6e720"invoiceDetails: {accountNumber: "1234567890"distributionType: "Email"invoiceDueDate: "2024-12-31"invoiceNumber: "1234567890"ocrOrkid: "1234567890"ourReference: "1234567890"yourReference: "9876543210"}orderItems: [0: {grossTotalAmount: "10000"name: "Product 1"netTotalAmount: "8000"quantity: "2"reference: "Red shoe 12"taxRate: "20"taxAmount: "2000"unit: "pcs"unitPrice: "4000"}]reservationId: "af681b5fe49f4844a6ed3482bf5311f7"reconciliationReference: "MRJhJvEDCx1y7uWlKfb6O3z78"myReference: ""amount: {amount: "10000"currency: "SEK"}surchargeAmount: "100"paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.charge.failed.v2

Notification sent when a charge attempt has failed.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "39676f10086043c4a1c88312dd1e0ead"event: "payment.charge.failed.v2"timestamp: "2026-04-30T05:04:00.4504+00:00"merchantId: 0merchantNumber: 100242833data: {error: {code: "911"message: "Error occured"source: "Internal"}chargeId: "55a8e4e3d0394353b7b51a9137c6e720"orderItems: [0: {grossTotalAmount: "10000"name: "Product 1"netTotalAmount: "8000"quantity: "2"reference: "Red shoe 12"taxRate: "20"taxAmount: "2000"unit: "pcs"unitPrice: "4000"}]paymentMethod: "Visa"paymentType: "CARD"subscriptionId: ""reconciliationReference: "MRJhJvEDCx1y7uWlKfb6O3z78"myReference: ""amount: {amount: "10000"currency: "SEK"}surchargeAmount: "100"paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.created

Notification sent when a new payment is created. This happens when the customer
hits the "Pay" button on the checkout page.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "7dbc310f7129465fa58d78da0d1ce4d4"event: "payment.created"timestamp: "2026-04-30T05:04:00.4505+00:00"merchantId: 100242833merchantNumber: 0data: {order: {amount: {amount: "10000"currency: "SEK"}reference: "1234567890"description: "Order 1234"orderItems: [0: {grossTotalAmount: "10000"name: "Product 1"netTotalAmount: "8000"quantity: "2"reference: "Red shoe 12"taxRate: "20"taxAmount: "2000"unit: "pcs"unitPrice: "4000"}]}myReference: ""subscriptionId: ""paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.refund.completed

Notification sent when a refund has successfully been completed.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "a7e29ec0b285422f87a34a3fc36e36e6"event: "payment.refund.completed"timestamp: "2026-04-30T05:04:00.4505+00:00"merchantId: 100242833merchantNumber: 0data: {refundId: "32e1cb8de6704c4baf9974121cc1351f"invoiceDetails: {accountNumber: "1234567890"distributionType: "Email"invoiceDueDate: "2024-12-31"invoiceNumber: "1234567890"ocrOrkid: "1234567890"ourReference: "1234567890"yourReference: "9876543210"}reconciliationReference: "MRJhJvEDCx1y7uWlKfb6O3z78"amount: {amount: "10000"currency: "SEK"}surchargeAmount: "100"paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.refund.failed

Notification sent when a refund attempt has failed.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "9086318b691a4fbda1f5c836dd719713"event: "payment.refund.failed"timestamp: "2026-04-30T05:04:00.4506+00:00"merchantId: 100242833merchantNumber: 0data: {error: {code: "911"message: "Error occured"source: "Internal"}refundId: "32e1cb8de6704c4baf9974121cc1351f"invoiceDetails: {accountNumber: "1234567890"distributionType: "Email"invoiceDueDate: "2024-12-31"invoiceNumber: "1234567890"ocrOrkid: "1234567890"ourReference: "1234567890"yourReference: "9876543210"}reconciliationReference: "MRJhJvEDCx1y7uWlKfb6O3z78"amount: {amount: "10000"currency: "SEK"}surchargeAmount: "100"paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.refund.initiated

Notification sent when a refund has been initiated.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "12029d54d9ce4502a8c5275aaa7d58c7"event: "payment.refund.initiated"timestamp: "2026-04-30T05:04:00.4507+00:00"merchantId: 100242833merchantNumber: 0data: {refundId: "32e1cb8de6704c4baf9974121cc1351f"chargeId: "55a8e4e3d0394353b7b51a9137c6e720"orderItems: [0: {grossTotalAmount: "10000"name: "Product 1"netTotalAmount: "8000"quantity: "2"reference: "Red shoe 12"taxRate: "20"taxAmount: "2000"unit: "pcs"unitPrice: "4000"}]myReference: ""amount: {amount: "10000"currency: "SEK"}surchargeAmount: "100"paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.refund.initiated.v2

Notification sent when a refund has been initiated.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "181f37cb68b649f5a9ae145834c903f7"event: "payment.refund.initiated.v2"timestamp: "2026-04-30T05:04:00.4507+00:00"merchantId: 0merchantNumber: 100242833data: {refundId: "32e1cb8de6704c4baf9974121cc1351f"chargeId: "55a8e4e3d0394353b7b51a9137c6e720"orderItems: [0: {grossTotalAmount: "10000"name: "Product 1"netTotalAmount: "8000"quantity: "2"reference: "Red shoe 12"taxRate: "20"taxAmount: "2000"unit: "pcs"unitPrice: "4000"}]myReference: ""amount: {amount: "10000"currency: "SEK"}surchargeAmount: "100"paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.reservation.created

Notification sent when the amount of the payment has been reserved.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "f7a0eed6a2bd41de92a297b3eb18222b"event: "payment.reservation.created"timestamp: "2026-04-30T05:04:00.4508+00:00"merchantId: 100242833merchantNumber: 0data: {cardDetails: {creditDebitIndicator: "C"expiryMonth: "12"expiryYear: "28"issuerCountry: "NO"truncatedPan: "374500*****1009"threeDSecure: {acsUrl: "https://acs.example.com"authenticationEnrollmentStatus: "Y"authenticationStatus: "Y"eci: "05"}}paymentMethod: ""paymentType: ""consumer: {billingAddress: {addressLine1: "Strandvejen 56"addressLine2: "29/11"city: "Copenhagen"country: "Denmark"postcode: "1050"receiverLine: "Strandvejen 56, 29/11"}country: "Denmark"email: "test@example.com"ip: "17.172.224.47"merchantReference: "1234567890"phoneNumber: {prefix: "+47"number: "123456789"}shippingAddress: {addressLine1: "Strandvejen 56"addressLine2: "29/11"city: "Copenhagen"country: "Denmark"postcode: "1050"receiverLine: "Strandvejen 56, 29/11"}}reservationReference: ""reserveId: ""myReference: ""reconciliationReference: "MRJhJvEDCx1y7uWlKfb6O3z78"paymentAccountReference: ""amount: {amount: "10000"currency: "SEK"}surchargeAmount: "100"paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.reservation.created.v2

Notification sent when the amount of the payment has been reserved.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "f8df41280c43469bb4cf49a397f53fd9"event: "payment.reservation.created.v2"timestamp: "2026-04-30T05:04:00.4509+00:00"merchantId: 0merchantNumber: 100242833data: {paymentMethod: ""paymentType: ""subscriptionId: ""myReference: ""reconciliationReference: "MRJhJvEDCx1y7uWlKfb6O3z78"paymentAccountReference: ""amount: {amount: "10000"currency: "SEK"}surchargeAmount: "100"paymentId: "b015690c89d141f7b98b99dee769be62"}}`

### payment.reservation.failed

Notification sent when a reservation fails. The main use case are bulk charge
subscriptions. Another use case could be to get informed about failed
subscription or unscheduled charge attempts.

##### id

Stringrequired

##### event

Stringrequired

##### timestamp

DateTimerequired

##### merchantId

Integerrequired

##### merchantNumber

Integerrequired

##### data

`{id: "6a9d1205e1914400a97d71610d2d8d03"event: "payment.reservation.failed"timestamp: "2026-04-30T05:04:00.4509+00:00"merchantId: 100242833merchantNumber: 0data: {error: {code: "911"message: "Error occured"source: "Internal"}orderItems: [0: {grossTotalAmount: "10000"name: "Product 1"netTotalAmount: "8000"quantity: "2"reference: "Red shoe 12"taxRate: "20"taxAmount: "2000"unit: "pcs"unitPrice: "4000"}]amount: {amount: "10000"currency: "SEK"}surchargeAmount: "100"paymentId: "b015690c89d141f7b98b99dee769be62"}}`
[![Nets Logotype](data:image/png;base64,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kU2ZpnMKljk8o0JZmVrAT1ruEEGKe6y1n/rM0nPnkEaJeZ/PNXy54jq8vIQfU1liJh5J3FaL77kUrBE/VxafyQpb3ZrCNlag2V7NQsf13A/9vFarShII5zxguYse1+VP11+sazunY5lrYLkEHe/HbMruNtv3ZmJth93a0O7Ir1S2fbWv97l1iw4lvsemQL9KazMR+ecxxunZvrZXz3EIDzYr+GfUV/t6l+O12ker8ahZEanRPJNnGTiz8J6pVoHrsJtY9lecLnCV3pzfsSt0KxBNjIElUX9W2XT2v01FogkiK2RWcdjbX7S+/97e+HyaJxbeRDQ5BpZERMvArHAiIiIiioKBJRERERFFwcCSiIiIiKJgYElEREREUTCwJCIiIqIoGFgSERERURQMLImIiIgoCgaWRERERBQFA0siIiIiioKBJRERERFFwcCSiIiIiKJgYElEREREUTCwJCIiIqIoGFgSERERURQMLImIiIgoCgaWRERERBQFA0siIiIiioKBJRERERFFwcCSiIiIiKJgYElEREREUTCwJCIiIqIoGFgSERERURQMLImIiIgoCgaWRJSD763vKxARERER9SEiq3rb1ts3/R5ERDRL/w+XlVj+JHUkSgAAAABJRU5ErkJggg==)](/)
[Nexi Ecommerce](https://www.nexigroup.com/en/business/retailers-and-merchants/e-commerce/)
[Privacy policy](https://www.nexigroup.com/en/privacy-policy/)
[Legal notice](https://www.nexigroup.com/en/legal-notice/)
[Cookies](https://www.nexigroup.com/en/cookies/)
[Checkout T&C](https://support.nets.eu/document/nets-easy-general-terms-and-conditions-2022)
[System status](/status) [Nexi user login](/.auth/login/aad)Copyright © 2026
Nets Denmark A/S. All rights reserved.
