# 💳 Payment Gateway & QR Installation Guide
### My General Store - Indian Kirana & Grocery Platform

This guide explains how to install, configure, and use your payment gateway and custom QR codes (Google Pay, PhonePe, Paytm, BharatPe, or sovereign self-hosted **YouPI-PG**).

---

## ⚡ Option 1: Built-in 0% Fee Instant UPI Gateway (Ready & Active)

Your store has an instant, zero-commission UPI gateway already built into the codebase:
- **0% Gateway Charges**: No 2%–3% cut taken by Razorpay, Cashfree, or Stripe.
- **Direct-to-Bank**: Customer money lands directly in your bank account via UPI.
- **Dynamic Amount QR**: Encodes the exact order bill total and merchant VPA (`upi://pay?pa=...&am=...`).
- **1-Tap Mobile Intent**: Customers on Android/iOS can tap Google Pay, PhonePe, Paytm, or CRED to pay in one click.

### How to configure your UPI ID:
1. Log in to the Admin Dashboard (default password: `admin` or use your credentials).
2. Go to **Store Settings** > **Payment Gateway & UPI QR Center**.
3. Under **Store Merchant UPI VPA / ID**, enter your UPI ID:
   - *Example:* `parveshchauhan980@okhdfcbank` or `9876543210@paytm` or `kirana@upi`
4. Enter your **Registered Business Name** (e.g., `My General Store Enterprises (Parvesh Chauhan)`).
5. Click **"Save All Store Settings"**.
6. Switch to the **"Live QR Test"** tab to test scanning the QR with your phone's UPI app!

---

## 📸 Option 2: Upload Your Store's Physical QR Standee Photo

If you already have a physical printed QR standee sticker at your retail counter (from PhonePe, Google Pay for Business, Paytm Soundbox, or BharatPe):

1. Take a clean photo or screenshot of your QR code on your phone.
2. Go to **Admin Dashboard > Store Settings > Payment Gateway & UPI QR Center**.
3. Under **"Store Physical QR Standee Photo"**, click **"Choose file from device..."** and select your photo.
4. Set **Checkout QR Presentation Mode** to **"Both (Dynamic + Standee)"**.
5. Click **"Save All Store Settings"**.
6. At checkout, customers can toggle between the auto-generated dynamic amount QR and your shop's official standee sticker!

---

## ⚡ Option 3: Install Sovereign Self-Hosted YouPI-PG Gateway

You have cloned the repository **`youpi-pg`** into your project directory. 
YOUPI PG is a self-hosted Indian UPI gateway that provides automated payment status verification by observing bank SMS alerts and Gmail webhook notifications.

### Architecture:
```
Customer Checkout (Store) ---> Dynamic Vector QR ---> Customer pays via UPI
                                                        │
Merchant Bank Account <---------------------------------┘
         │
Bank SMS / Email Alert
         │
YouPI-PG Observer (youpi-pg) ---> Matches Order UTR ---> Approves Payment
```

### Installation & Launch Steps:
To run the YouPI-PG server on your local machine or VPS:

```bash
# 1. Open terminal and navigate to the directory
cd youpi-pg

# 2. Install dependencies
npm install

# 3. Create your environment configuration
cp .env.example .env

# 4. Configure your merchant VPA in .env:
# YOUPI_MERCHANT_VPA=yourname@bank
# YOUPI_MERCHANT_NAME=My General Store

# 5. Start the YouPI-PG gateway server:
npm run dev
```

### Connect to Store:
1. Once running, copy your YouPI server URL (e.g. `http://localhost:4000` or your production domain).
2. Go to **Admin Dashboard > Store Settings > Payment Gateway & UPI QR Center > YouPI PG tab**.
3. Paste the URL into **YouPI-PG Server / Webhook Endpoint**.
4. Click **"Save All Store Settings"**.

---

## 📱 How to Get Official Merchant VPAs:

| Provider | Steps to Obtain VPA & QR |
| :--- | :--- |
| **Google Pay for Business** | Download *Google Pay for Business* app > Register with PAN/Bank > Tap Business Profile > Copy VPA (`store@okhdfcbank` or `...@okaxis`). |
| **PhonePe Business** | Download *PhonePe Business* app > Complete instant OTP verification > Go to "Manage QR Codes" > Download QR sticker image. |
| **Paytm for Business** | Download *Paytm for Business* app > Generate All-In-One Merchant QR linked to your bank account. |
| **BharatPe** | Download *BharatPe* app > Instant zero-charge merchant account > Link bank account > Copy QR. |

---

## 🔒 Customer Checkout & Order Verification Workflow:

1. **Customer places items in cart** and proceeds to **Checkout**.
2. **Customer selects "Instant UPI Payment"**:
   - On **Desktop/Laptop**: The screen displays the dynamic vector QR code with the exact order amount.
   - On **Mobile**: The customer can tap **GPay**, **PhonePe**, **Paytm**, or **Any App** to open their payment app directly with the amount pre-filled!
3. **Customer completes payment** and copies the **12-digit Bank Reference (UTR) Number** from their payment confirmation receipt.
4. **Customer enters the UTR number** in the checkout field and places the order.
5. **Admin receives order in Backoffice**:
   - Admin goes to **Admin > Payment Verification** (or **Orders**).
   - Admin checks the customer's submitted UTR against their bank account / notification app.
   - Admin clicks **"Verify & Approve Payment"** to confirm and dispatch the groceries!
