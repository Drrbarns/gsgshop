import { getGoodsBaseUrl, getShopperBaseUrl } from '@/lib/site-urls';

// Serves /llms.txt — an emerging standard that gives AI assistants
// (ChatGPT, Claude, Perplexity, etc.) a concise, authoritative map of the
// site so the brand is summarised and cited accurately in AI answers.
export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  const goods = getGoodsBaseUrl();
  const shopper = getShopperBaseUrl();

  const body = `# GSG Convenience Goods & More

> GSG Convenience Goods & More is a Ghanaian online convenience store delivering
> groceries, household essentials, personal care, stationery, phones, electronics
> and fashion across Accra and nationwide. It also operates a Personal Shopper
> service that sources any item at market price with a 5% markup or less.

## About
- Name: GSG Convenience Goods & More
- Country: Ghana
- City: Accra
- Storefront: ${goods}
- Personal Shopper: ${shopper}
- Payments: Mobile Money (MTN, Telecel, AirtelTigo) and Visa/Mastercard
- Delivery: Free Delivery (Tue/Fri), Sole Express, Joint Express, Pickup

## Storefront (${goods})
- Home: ${goods}
- Shop all products: ${goods}/shop
- Shop by category: ${goods}/categories
- About us: ${goods}/about
- Contact: ${goods}/contact
- Shipping & delivery: ${goods}/shipping
- Returns & refunds: ${goods}/returns
- FAQ: ${goods}/faqs
- Blog: ${goods}/blog
- Gift cards: ${goods}/gift-card

## Personal Shopper (${shopper})
- Home: ${shopper}
- How it works: ${shopper}/how-it-works
- Create a shopping list: ${shopper}/shopping-list
- Track a request: ${shopper}/track
- FAQ: ${shopper}/faqs
- Customer experience: ${shopper}/customer-experience

## Key facts
- Personal Shopper markup: 5% or less on the item subtotal, no hidden fees.
- Delivery fee depends on the delivery option and destination distance.
- Fresh/perishable items must use Sole Express or Joint Express.
- Free Delivery runs Tuesdays and Fridays for qualifying orders (5% discount).

## Legal
- Terms: ${goods}/terms
- Privacy: ${goods}/privacy
- Cookies: ${goods}/cookies

## Sitemaps
- ${goods}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
