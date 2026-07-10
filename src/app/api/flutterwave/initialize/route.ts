import { NextRequest, NextResponse } from "next/server";

const FW_API = "https://api.flutterwave.com/v3/payments";

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!secretKey || secretKey === "FLW_SECRET_KEY_placeholder") {
      return NextResponse.json({ error: "Payment not configured. Please contact us directly." }, { status: 501 });
    }

    const { amount, email, name, description } = await request.json();

    if (!amount || !email || !name) {
      return NextResponse.json({ error: "amount, email, and name are required" }, { status: 400 });
    }

    const tx_ref = `LI-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const body = {
      tx_ref,
      amount: Number(amount),
      currency: "GHS",
      redirect_url: `${request.nextUrl.origin}/services?payment=completed`,
      customer: { email, name },
      customizations: {
        title: "Lutterodt Institute — Services",
        description: description || "Creative services payment",
      },
      meta: { service: description || "Creative services" },
    };

    const res = await fetch(FW_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.status !== "success") {
      return NextResponse.json({ error: data.message || "Payment initiation failed" }, { status: 400 });
    }

    return NextResponse.json({ link: data.data.link, tx_ref });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
