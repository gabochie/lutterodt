import {
  buildOgCard,
  ogCardAlt,
  ogCardContentType,
  ogCardSize,
} from "@/lib/brand/ogCard";

export const alt = ogCardAlt;
export const size = ogCardSize;
export const contentType = ogCardContentType;

export default function OpengraphImage() {
  return buildOgCard();
}
