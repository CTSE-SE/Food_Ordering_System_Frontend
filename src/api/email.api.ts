import customFetch from "../utils/customFetch";

export interface OrderConfirmationEmailPayload {
  to: string;
  userName: string;
  orderId: string;
  restaurantName: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  deliveryAddress: string;
}

export interface EmailApiResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

/**
 * Sends an order confirmation email via the backend SQS email queue.
 * The backend publishes a message to AWS SQS; a Lambda/consumer processes
 * it and dispatches the email via SES / SMTP.
 */
export const sendOrderConfirmationEmail = async (
  payload: OrderConfirmationEmailPayload
): Promise<EmailApiResponse> => {
  const response = await customFetch.post("/email/order-confirmation", payload);
  return response.data;
};

/**
 * Generic email queue — use for any transactional email.
 */
export const queueEmail = async (payload: {
  to: string;
  subject: string;
  body: string;
  templateId?: string;
}): Promise<EmailApiResponse> => {
  const response = await customFetch.post("/email/queue", payload);
  return response.data;
};
