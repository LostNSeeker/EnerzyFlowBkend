import FAQ from '../models/FAQ.js';

const initialFAQs = [
  {
    question: 'How do I track my order?',
    answer: 'You can track your order by going to "My Orders" section in your profile and clicking on the specific order. You\'ll see real-time updates on your order status.',
    category: 'Shopping',
    order: 1
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. The item must be unused and in its original packaging. Shipping costs for returns are covered by the customer unless the item is defective.',
    category: 'Shopping',
    order: 2
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Google Pay. Some regions also support cash on delivery.',
    category: 'Payment',
    order: 1
  },
  {
    question: 'Is it safe to save my payment information?',
    answer: 'Yes, we use industry-standard encryption to protect your payment information. We don\'t store actual card numbers, only secure tokens provided by our payment processor.',
    category: 'Payment',
    order: 2
  },
  {
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login screen. Enter your email address, and we\'ll send you a link to reset your password. The link is valid for 24 hours.',
    category: 'Account',
    order: 1
  },
  {
    question: 'How can I update my profile information?',
    answer: 'Go to your profile and click on "Personal Details." Click the "Edit" button to update your information. Don\'t forget to save your changes.',
    category: 'Account',
    order: 2
  }
];

// Connect to MongoDB
const seedFaq = async () => {
  try {
    
    // Delete existing FAQs
    // await FAQ.deleteMany({});
    // console.log('Existing FAQs deleted');
    
    // Insert new FAQs
    await FAQ.insertMany(initialFAQs);
    console.log('FAQs seeded successfully');
    return true
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default seedFaq;