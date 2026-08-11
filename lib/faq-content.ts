export const FAQ_CATEGORIES = [
  { id: 'all', name: 'All Questions', icon: 'ri-question-line' },
  { id: 'orders', name: 'Orders', icon: 'ri-shopping-bag-line' },
  { id: 'shipping', name: 'Shipping', icon: 'ri-truck-line' },
  { id: 'returns', name: 'Returns', icon: 'ri-arrow-go-back-line' },
  { id: 'payment', name: 'Payment', icon: 'ri-bank-card-line' },
  { id: 'account', name: 'Account', icon: 'ri-user-line' },
] as const;

export const STORE_FAQS = [
  {
    category: 'orders',
    question: 'How do I place an order?',
    answer:
      "Browse our products, add items to your cart, proceed to checkout, provide your delivery address, select payment method, and confirm your order. You'll receive an email confirmation with your order details and tracking number.",
  },
  {
    category: 'orders',
    question: 'Can I modify or cancel my order?',
    answer:
      "Yes — as long as it hasn't been dispatched yet. Contact us via WhatsApp at +233 20 959 7443 or email info@gsgbrands.com.gh and we'll make the change at no cost. If your order is already on its way, you'll need to cover the delivery cost already incurred (and any return-trip cost) before we can cancel or modify. Perishable items can't be cancelled once dispatched.",
  },
  {
    category: 'orders',
    question: 'How do I track my order?',
    answer:
      "After your order ships, you'll receive a tracking number via email and SMS. Visit our Order Tracking page and enter your order number and email address to see real-time updates on your delivery status.",
  },
  {
    category: 'orders',
    question: 'What if I receive the wrong item?',
    answer:
      "We sincerely apologise if you receive the wrong item. Contact us within 48 hours with photos of the item received. We'll arrange for the correct item to be sent immediately and collect the wrong item at no cost to you.",
  },
  {
    category: 'shipping',
    question: 'What are your delivery times?',
    answer:
      'It depends on the delivery choice you pick at checkout. Sole Express and Joint Express run daily with 2hr, 6hr, 12hr, 24hr or 48hr slots after order confirmation — fresh and perishable items must use one of these. Free Delivery runs on Tuesdays and Fridays only, and your order must be confirmed before noon the preceding day. Pickup is ready within 72 hours of confirmation (excluding Sundays), and you collect at the location shared in your confirmation. Personal Shopper requests are scheduled separately once we confirm market prices with you. See Shipping for the full fee formulas.',
  },
  {
    category: 'shipping',
    question: 'How much does shipping cost?',
    answer:
      'We publish the formulas and show your exact fee at checkout before you pay. Sole Express = GH₵0.50 × km × 5 + 1.5% of your purchase total. Joint Express = (GH₵0.50 × km × 7 + 1.5% of purchase) ÷ 2 (you split with a neighbour). Free Delivery (Tue/Fri) = GH₵0.50 × km × 3 − 1% of purchase (larger carts can bring this to GH₵0). Pickup is GH₵0. Enter your distance from our GSG hub in km at checkout — or use the calculator on the Shipping page — to see the amount before you confirm.',
  },
  {
    category: 'shipping',
    question: 'Do you ship outside Ghana?',
    answer:
      "Currently, we only ship within Ghana. We're working on expanding to neighbouring West African countries. Sign up for our newsletter to be notified when international shipping becomes available.",
  },
  {
    category: 'shipping',
    question: 'What if nobody is home for delivery?',
    answer:
      "We always reach out and confirm collection arrangements with you before your order is dispatched, so this rarely happens. If the agreed handover still falls through on the day, we'll reschedule a fresh delivery with you — the rebooked delivery fee is paid by the customer, and applies to non-perishable items only. Perishables (fresh produce, frozen, etc.) cannot be rebooked once dispatched and are non-refundable for missed handover.",
  },
  {
    category: 'returns',
    question: 'What is your return policy?',
    answer:
      'We offer a 14-day return policy for unused items in original packaging. Simply initiate a return from your account, print the return label, and ship it back. Refunds are processed within 5-7 business days after we receive the item.',
  },
  {
    category: 'returns',
    question: 'Which items cannot be returned?',
    answer:
      'For hygiene reasons, we cannot accept returns on opened cosmetics, intimate apparel, earrings, or perishable goods. Custom or personalised items are also non-returnable unless defective.',
  },
  {
    category: 'returns',
    question: 'Who pays for return shipping?',
    answer:
      'If you\'re returning due to a defect or our error, we cover return shipping in full. For change-of-mind returns, the customer pays return shipping — the cost depends on the delivery option you choose to send the item back (Sole Express, Joint Express, Free Delivery on Tue/Fri, or pickup at our location).',
  },
  {
    category: 'returns',
    question: 'Can I exchange an item instead of returning it?',
    answer:
      'Yes — select "Exchange" when initiating your return and we\'ll send the replacement as soon as we receive your original item. Exchange shipping is paid by the customer because the swap is driven by your own change of mind (wrong size, colour, etc.). The exact cost depends on which delivery option you pick for the swap (Sole Express, Joint Express, Free Delivery on Tue/Fri, or pickup). If the item was defective or we shipped you the wrong one, exchange shipping is on us.',
  },
  {
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer:
      'We accept MTN Mobile Money, Vodafone Cash, AirtelTigo Money, and Visa/Mastercard credit and debit cards via our secure Moolre payment gateway. All transactions are encrypted and processed securely.',
  },
  {
    category: 'payment',
    question: 'Is it safe to use my credit card on your site?',
    answer:
      'Absolutely. We use industry-standard SSL encryption and partner with Moolre for secure payment processing. We never store your full card details on our servers. All transactions are PCI-DSS compliant.',
  },
  {
    category: 'payment',
    question: 'Can I pay in instalments?',
    answer:
      'Yes! We offer payment plans through our partners for purchases over GHS 500. Select "Pay in Instalments" at checkout to see available options. Approval is instant and no interest is charged.',
  },
  {
    category: 'payment',
    question: 'When will my payment be charged?',
    answer:
      "For card and mobile money payments, you're charged immediately. For Cash on Delivery, you pay when you receive your order. If an item is out of stock, we'll refund you within 24 hours.",
  },
  {
    category: 'payment',
    question: 'How do refunds work?',
    answer:
      "Refunds are processed to your original payment method within 5-7 business days after we receive and inspect your return. For mobile money refunds, ensure you provide correct details. You'll receive confirmation via email.",
  },
  {
    category: 'account',
    question: 'Do I need an account to place an order?',
    answer:
      'No, you can checkout as a guest. However, creating an account lets you track orders, save addresses, view purchase history, manage your wishlist, and receive exclusive offers. It only takes 30 seconds to sign up.',
  },
  {
    category: 'account',
    question: 'How do I reset my password?',
    answer:
      "Click \"Forgot Password\" on the login page, enter your email address, and we'll send you a reset link. The link is valid for 1 hour. If you don't receive it, check your spam folder or contact support.",
  },
  {
    category: 'account',
    question: 'Can I have multiple delivery addresses?',
    answer:
      'Yes! You can save multiple delivery addresses in your account. During checkout, simply select the address you want to use or add a new one. This is perfect for sending gifts or alternating between work and home.',
  },
  {
    category: 'account',
    question: 'How do I update my account information?',
    answer:
      "Log in to your account and go to \"Account Settings\". You can update your name, email, phone number, password, and saved addresses. Changes are saved instantly and you'll receive a confirmation email.",
  },
  {
    category: 'account',
    question: 'What are loyalty points and how do they work?',
    answer:
      'Earn 1 point for every GHS 10 spent. 100 points = GHS 10 discount on your next purchase. Points are automatically added to your account after each order. Check your points balance in your account dashboard.',
  },
] as const;
