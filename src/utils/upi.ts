import QRCode from 'qrcode';

export interface UpiUriOptions {
  upiId: string;
  upiName: string;
  amount?: number;
  orderNumber?: string;
  transactionNote?: string;
}

/**
 * Builds standard NPCI-compliant UPI payment intent URI.
 * Example: upi://pay?pa=store@upi&pn=Store%20Name&am=499.00&cu=INR&tn=Order_ORD-1234
 */
export function buildUpiUri(options: UpiUriOptions): string {
  const { upiId, upiName, amount, orderNumber, transactionNote } = options;

  const params = new URLSearchParams();
  params.set('pa', upiId.trim());
  params.set('pn', upiName.trim() || 'Store Merchant');
  
  if (amount && amount > 0) {
    params.set('am', amount.toFixed(2));
  }
  
  params.set('cu', 'INR');
  
  const note = transactionNote || (orderNumber ? `Payment for Order ${orderNumber}` : 'Grocery Store Order');
  params.set('tn', note);

  return `upi://pay?${params.toString()}`;
}

/**
 * Builds app-specific UPI deep links for seamless 1-tap payment on mobile devices.
 */
export function buildUpiAppLinks(upiUri: string) {
  const query = upiUri.replace(/^upi:\/\/pay\?/, '');

  return {
    // Generic standard UPI intent (triggers Android intent resolver or default app)
    generic: upiUri,
    
    // Google Pay
    gpay: `tez://upi/pay?${query}`,
    
    // PhonePe
    phonepe: `phonepe://pay?${query}`,
    
    // Paytm
    paytm: `paytmmp://pay?${query}`,
    
    // BHIM
    bhim: `bhim://pay?${query}`,
    
    // CRED
    cred: `cred://upi/pay?${query}`
  };
}

/**
 * Generates an SVG or PNG data URL for a given UPI URI using the qrcode library.
 */
export async function generateQrDataUrl(text: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: options?.width || 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
        ...(options?.color || {})
      }
    });
  } catch (err) {
    console.error('[UPI] QR code generation error:', err);
    throw err;
  }
}

/**
 * Validates standard UPI Virtual Payment Address (VPA) format.
 * Examples: username@okhdfcbank, 9876543210@paytm, store@upi
 */
export function isValidUpiId(upiId: string): boolean {
  if (!upiId) return false;
  const regex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return regex.test(upiId.trim());
}

/**
 * Validates 12-digit Indian banking UTR (Unique Transaction Reference) / Ref No.
 */
export function isValidUtr(utr: string): boolean {
  if (!utr) return false;
  const cleaned = utr.trim().replace(/\s+/g, '');
  return cleaned.length >= 8 && cleaned.length <= 22;
}
