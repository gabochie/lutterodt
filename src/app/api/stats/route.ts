import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";

let superuserToken: string | null = null;

async function getClient() {
  const pb = new PocketBase(pbUrl);
  pb.autoCancellation(false);
  if (!superuserToken) {
    const auth = await pb.admins.authWithPassword(
      process.env.POCKETBASE_SUPERUSER_EMAIL || "gabochie@gmail.com",
      process.env.POCKETBASE_SUPERUSER_PASSWORD || "AK4QRh369GSYAA"
    );
    superuserToken = auth.token;
  } else {
    pb.authStore.save(superuserToken, null);
  }
  return pb;
}

export async function GET() {
  try {
    const pb = await getClient();
    const [articles, timeline, gallery, contacts, settings] = await Promise.all([
      pb.collection("articles").getList(1, 1, { requestKey: "stats-articles" }),
      pb.collection("timeline_events").getList(1, 1, { requestKey: "stats-timeline" }),
      pb.collection("gallery_items").getList(1, 1, { requestKey: "stats-gallery" }),
      pb.collection("contacts").getList(1, 1, { requestKey: "stats-contacts" }),
      pb.collection("settings").getList(1, 1, { requestKey: "stats-settings" }),
    ]);

    return NextResponse.json({
      articles: articles.totalItems,
      timeline: timeline.totalItems,
      gallery: gallery.totalItems,
      contacts: contacts.totalItems,
      settings: settings.totalItems,
    });
  } catch {
    return NextResponse.json(
      { articles: 0, timeline: 0, gallery: 0, contacts: 0, settings: 0 },
      { status: 503 }
    );
  }
}
