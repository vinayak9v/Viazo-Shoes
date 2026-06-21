import axios from "axios";

const ENV = process.env.PHONEPE_ENV ?? "UAT"; // "UAT" | "PROD"

const BASE_URLS = {
  UAT: {
    auth: "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token",
    pg: "https://api-preprod.phonepe.com/apis/pg-sandbox",
  },
  PROD: {
    auth: "https://api.phonepe.com/apis/identity-manager/v1/oauth/token",
    pg: "https://api.phonepe.com/apis/pg",
  },
};

const urls = BASE_URLS[ENV as "UAT" | "PROD"];

let cachedToken: { token: string; expiresAt: number } | null = null;

// ─── Get OAuth access token ────────────────────────────────
export async function getPhonePeAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  console.log("──── PhonePe Auth Debug ────");
  console.log("Auth URL:", urls.auth);
  console.log("Client ID:", process.env.PHONEPE_CLIENT_ID);
  console.log("Client Version:", process.env.PHONEPE_CLIENT_VERSION);

  const response = await axios.post(
    urls.auth,
    new URLSearchParams({
      client_id: process.env.PHONEPE_CLIENT_ID!,
      client_version: process.env.PHONEPE_CLIENT_VERSION ?? "1",
      client_secret: process.env.PHONEPE_CLIENT_SECRET!,
      grant_type: "client_credentials",
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  console.log("✅ Token Response:", response.data);

  const { access_token, expires_at } = response.data;
  cachedToken = { token: access_token, expiresAt: expires_at * 1000 };
  return access_token;
}

// ─── Create payment order ──────────────────────────────────
export async function createPhonePeOrder(params: {
  merchantOrderId: string;
  amountInPaise: number;
  redirectUrl: string;
}) {
  const token = await getPhonePeAccessToken();

  const payload = {
    merchantOrderId: params.merchantOrderId,
    amount: params.amountInPaise,
    expireAfter: 1200,
    paymentFlow: {
      type: "PG_CHECKOUT",
      message: "Payment for your shoe order",
      merchantUrls: { redirectUrl: params.redirectUrl },
    },
  };

  console.log("──── PhonePe Create Order Debug ────");
  console.log("Payload:", JSON.stringify(payload, null, 2));
  console.log("URL:", `${urls.pg}/checkout/v2/pay`);

  try {
    const response = await axios.post(`${urls.pg}/checkout/v2/pay`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${token}`,
      },
    });

    console.log("✅ Order Response:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (err: any) {
    console.log("❌ Order Error:", JSON.stringify(err?.response?.data, null, 2));
    throw err;
  }
}

// ─── Check order status ────────────────────────────────────
export async function getPhonePeOrderStatus(merchantOrderId: string) {
  const token = await getPhonePeAccessToken();

  const response = await axios.get(
    `${urls.pg}/checkout/v2/order/${merchantOrderId}/status`,
    { headers: { Authorization: `O-Bearer ${token}` } }
  );

  return response.data;
}