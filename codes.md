00	Visa, Mastercard
-	The transaction is approved and completed successfully		
01	Visa, Mastercard
SD The bank issuer declined the transaction		The consumer should contact their issuing bank to clarify the situation
03	Visa, Mastercard
SD	Refer To Card issuer		The consumer needs to contact their card issuer for more information
04	Visa, Mastercard
HD	Pick up card (no fraud)		The consumer needs to contact their card issuer for more information
05	Visa, Mastercard
SD	Do not honor	The issuing bank is unwilling to accept the transaction	Ask the consumer for another card to complete the transaction or ask them to contact their bank for more details
06	Visa, Mastercard
HD	Error	When the code occurs for a one-time transaction, do not rerun the card and do not provide any more goods or services to the cardholder.
For the recurring or scheduled transaction, ensure that the card was not incorrectly flagged as fraudulent
Ask the consumer to contact their bank or update their payment details with a new card
07	Visa, Mastercard
HD	Pickup card, special condition	The card issuer requests to retain the card, which can be due to a suspected counterfeit or stolen card.	Ask the consumer to contact their bank or update their payment details with a new card
12 Visa, Mastercard
HD	Invalid Transaction	The issuer does not allow this type of transaction on this card/account. Make sure that payments are correctly configured.	Ask the consumer to contact their bank or update their payment details with a new card
13	Visa, Mastercard
SD
Invalid Amount	The card issuer has declined the transaction because of an invalid format or field	The consumer should retry or use another payment method
14	Visa, Mastercard
HD	Invalid account number (no such number)	

Ask the consumer to contact their bank or update their payment details with a new card
15	Visa, Mastercard
HD	No such issuer (first 8 digits of account number do not relate to an issuer identifier)		Ask the consumer to contact their bank or update their payment details with a new card
19	Visa, Mastercard
SD	Re-enter transaction	
The transaction cannot be processed temporarily
22	Mastercard	SD	Suspected Malfunction	The issuing bank is not responding during the transaction	The cardholder should check the card information and try processing again
30	Mastercard	SD	Format Error	This could be because of the card configuration	Double-check the setup on your merchant account in Portal, as it may be incorrect
31	Mastercard	SD	Bank Not Supported By Switch	The consumer's bank has declined the transaction because it doesn’t allow using the card for mail/telephone, fax, email, or internet orders. The error usually comes with the Discover card, so the customer should use another card. If the cardholder didn’t use a Discover card, ask them to contact their bank.	Ask the consumer to contact their bank or update their payment details with a new card
34	
Mastercard
SD	Suspected Fraud, Retain Card	
The issuing bank declined the transaction as there is suspected fraud on this credit card number
Monitor subsequent transactions to check for fraudulent transactions on alternate cards. If there are multiple fraudulent transactions, please contact us.
41	Visa, Mastercard
HD	Lost card, pick up		Ask the consumer to contact their bank or update their payment details with a new card.
42	Mastercard	SD	No Universal Account	The issuing bank declined the transaction as the account type is not valid for this card number	Ask the consumer to use a separate card or to contact their bank.
43	
Visa, Mastercard
HD	Stolen card, pick up	The bank has declined the payment because the card has been reported stolen. This will decline both one-time an recurring transactions	Ask the consumer to contact their bank or update their payment details with a new card.
46	Visa	HD	Closed Account	The issuer will never approve	
51	Visa, Mastercard	SD	Insufficient Funds	The transaction is denied by the issuing bank as there are not enough funds in the associated bank account, or the transaction will put the consumer's credit card over the limit	Request a different card from a consumer or ask them to contact their issuing bank.
54	Visa, Mastercard	HD	Expired card or expiration date missing		Ask the consumer to contact their bank or update their payment details with a new card.
55	Visa, Mastercard	
SD
Invalid PIN	The consumer has entered an incorrect PIN	The consumer should re-enter their PIN or use another payment method.
56	Visa, Mastercard	HD	No Card Record	The issuer declined the transaction as the credit card number doesn’t exist	Ask the consumer to contact their bank or update their payment details with a new card.
57	Visa, Mastercard	
HD
Transaction not permitted to the cardholder		The consumer needs to contact their card issuer for more information.
58	Visa, Mastercard	SD	Function Not Permitted To Terminal	
The code appears when the card cannot be used for this type of transaction or when the merchant processing account is not configured properly
59	Visa, Mastercard	
SD
Suspected Fraud	The issuer declined the transaction because it appeared fraudulent.	Monitor all the transactions processed after the error occurred.
61	Visa, Mastercard	SD	Withdrawal Limit Exceeded	The issuer has declined the transaction because it will exceed the customer’s card limit.	Ask the consumer to use another card.
62	Visa, Mastercard	SD	Restricted Card	The card is invalid in a specific region or country, or the consumer tried to pay online with a card that doesn’t support your online payments	
63	Visa, Mastercard	SD	Security violation	The card issuer indicated a security issue with this card	Ask the consumer to use another payment method. Alternatively, the consumer can try again after resolving the issue with their bank.
65	Visa, Mastercard
SD	Exceeds withdrawal count limit / Withdrawal count limit exceeded	The consumer has exceeded their card usage frequency limit	The consumer can use another payment method or try again with the same card after resolving the card limit issue.
75	Visa, Mastercard
SD	Allowable number of PIN tries exceeded	The consumer has entered an incorrect PIN more times than is allowed by the issuing bank	The consumer should retry or use another payment method
78	Visa, Mastercard
SD	Invalid/nonexistent account specified (general)	The transaction is from a new cardholder, and the card has not been properly unblocked	
79	Visa, Mastercard
HD	Life Cycle	The transaction is refused due to invalid card data	Ask the consumer to contact their bank or update their payment details with a new card.
80	Visa, Mastercard
SD	Credit issuer unavailable	The issuing bank cannot be contacted	The consumer should retry or use another payment method.
82	Visa, Mastercard
SD	Policy	The transaction is refused due to a policy reason	
82	Visa
SD	Negative online CAM, dCVV, iCVV, CVV, or CAVV results or Offline PIN authentication interrupted	The cardholder verification method failed for CAM, dCVV, iCVV, CVV, or a service code for card-present transactions	
83	Mastercard
SD	Fraud/Security	The transaction is refused because the card issuer suspects this payment to be fraudulent	
85	Visa, Mastercard
SD	No reason to decline	The issuing bank cannot identify a specific problem, but the transaction still didn’t go through.	The consumer can start the transaction again from scratch, and if the issue persists, the consumer can either call their issuing bank for more information, or they can also try using another credit card
86	Visa, Mastercard
SD	Cannot verify PIN	The PIN cannot be validated	If applicable, the transaction can be reattempted as a non-PIN transaction
91	Visa, Mastercard
SD	Card Issuer Unavailable	There was a problem contacting the issuing bank to authorize the transaction	The consumer should attempt to process this transaction again. If the problem persists, the consumer should contact their bank
92	Visa, Mastercard
SD	Unable To Route Transaction	The consumer's card can’t be found for routing, and the code is mostly used for a test credit card number	The cardholder should try to complete a transaction again
93	Visa, Mastercard
SD	Transaction cannot be completed; violation of law	The issuing bank will not allow this transaction	The consumer should use another payment method
96	Mastercard
SD	System malfunction	The issuing bank cannot be contacted	The consumer should retry or use another payment method.
