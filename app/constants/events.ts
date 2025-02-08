export const EVENT_DESCRIPTIONS: Record<string, string> = {
    abandoned_cart: "Send a reminder to customers who added items to their cart but didn’t complete the purchase.",
    order_confirmation: "Notify customers that their order has been successfully placed.",
    order_shipped: "Inform customers when their order has been shipped along with tracking details.",
    review_request: "Follow up with customers after a purchase, encouraging them to leave a review.",
    send_limited_time_promotion: "Promote special offers or discounts to selected customers via SMS.",
    customer_first_purchase: "Welcome new customers with a thank-you message or an exclusive discount.",
    win_back_campaign: "Re-engage customers who haven’t made a purchase in a while with a special offer.",
  };
  
  export const EVENT_TEMPLATES: Record<string, string> = {
    abandoned_cart: "Hey {first_name},\n\nYou left some items in your cart! Complete your order now before they sell out: {shop_link}",
    order_confirmation: "Thank you for your order, {first_name}!\n\nYour order #{order_number} is confirmed. We'll notify you when it's shipped!",
    order_shipped: "Great news, {first_name}!\n\nYour order #{order_number} has shipped. Track it here: {tracking_link}",
    review_request: "Hope you're loving your purchase, {first_name}!\n\nWe'd appreciate a quick review: {review_link}",
    send_limited_time_promotion: "Exclusive offer for you, {first_name}!\n\nGet {discount}% off for the next 24 hours. Shop now: {shop_link}",
    customer_first_purchase: "Welcome, {first_name}!\n\nThanks for your first order. Here’s a special {discount}% off code for your next purchase: {discount_code}",
    win_back_campaign: "We miss you, {first_name}!\n\nCome back and enjoy {discount}% off your next order. Shop now: {shop_link}",
  };
  