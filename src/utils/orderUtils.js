export const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD${timestamp.slice(-6)}${random}`;
  };
  
  export const calculateDeliveryDate = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days delivery time
    return deliveryDate;
  };
  
  export const calculateOrderTotal = (items, promoCode = null, coinsUsed = 0) => {
    let total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Apply coins discount
    if (coinsUsed > 0) {
      const coinsDiscount = coinsUsed * 0.1; // 1 coin = ₹0.1 discount
      total = Math.max(0, total - coinsDiscount);
    }
  
    // Apply promo code discount if available
    if (promoCode) {
      // Implement promo code logic here
    }
  
    return total;
  };