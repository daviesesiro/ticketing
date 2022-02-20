import axios, { Method } from "axios";
import { randomBytes } from "crypto";

class PaystackAPI {
  private client = axios.create({
    baseURL: "https://api.paystack.co",
    headers: this.headers,
  });

  private get headers() {
    return {
      authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
    };
  }

  private async makeRequest(path: string, method: Method, body: any) {
    try {
      const res = await this.client(path, {
        method,
        data: body,
        headers: this.headers,
      });

      return res.data;
    } catch (err: any) {
      console.log(err?.response.data);
      throw err;
    }
  }

  initializePayment(email: string, amount: number) {
    const reference = "tx_ref_" + randomBytes(10).toString("hex");
    return this.makeRequest("/transaction/initialize", "POST", {
      email,
      reference,
      amount,
      currency: "NGN",
    });
  }
}

export const paystackApi = new PaystackAPI();
