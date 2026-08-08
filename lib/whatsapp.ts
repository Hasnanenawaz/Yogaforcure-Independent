/**
 * WhatsApp utility functions
 */

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918310764597";
const WHATSAPP_MESSAGE = "Hi, I'm interested in joining a yoga class. Please share details.";

/**
 * Generates a WhatsApp URL with pre-filled message
 * Works on both mobile (WhatsApp app) and desktop (WhatsApp Web)
 */
export function getWhatsAppUrl(message?: string): string {
  const text = message || WHATSAPP_MESSAGE;
  const encodedMessage = encodeURIComponent(text);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
}

/**
 * WhatsApp phone number constant
 */
export const WHATSAPP_PHONE_NUMBER = WHATSAPP_PHONE;

/**
 * Default WhatsApp message constant
 */
export const DEFAULT_WHATSAPP_MESSAGE = WHATSAPP_MESSAGE;
