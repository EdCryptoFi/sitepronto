/**
 * Lightweight analytics wrapper.
 * Supports Google Analytics 4 (GA4) via gtag.
 * Falls back silently when GA is not configured.
 *
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env to enable.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') return;
  try {
    window.gtag?.('event', eventName, params);
  } catch {
    // silently ignore
  }
}

// Pre-defined conversion events
export const analytics = {
  /** User lands on quiz page */
  quizStart: () => trackEvent('quiz_start'),

  /** User submits the quiz form (clicks generate) */
  quizSubmit: (businessName: string) =>
    trackEvent('quiz_submit', { business_name: businessName }),

  /** Site generation complete, preview shown */
  previewLoaded: (briefingId: string) =>
    trackEvent('preview_loaded', { briefing_id: briefingId }),

  /** User opens checkout (Pix or card) */
  checkoutStart: (method: 'pix' | 'card') =>
    trackEvent('checkout_start', { payment_method: method }),

  /** Pix QR generated */
  pixQrGenerated: (amount: number) =>
    trackEvent('pix_qr_generated', { value: amount, currency: 'BRL' }),

  /** Payment approved (conversion!) */
  purchase: (briefingId: string, amount: number, method: 'pix' | 'card') =>
    trackEvent('purchase', {
      transaction_id: briefingId,
      value: amount,
      currency: 'BRL',
      payment_type: method,
    }),

  /** User customizes palette/template */
  customize: (type: 'palette' | 'template', value: string) =>
    trackEvent('customize', { customize_type: type, customize_value: value }),

  /** User visits landing page */
  pageView: (path: string) =>
    trackEvent('page_view', { page_path: path }),
};
