import React from 'react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQsPage = () => {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. If you can't find what you're looking for, you can also submit a custom order request through our Custom Order form."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit/debit cards, bank transfers, and cash on delivery for eligible areas."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery times vary depending on your location. Generally, orders are processed within 1-2 business days, and delivery takes 2-5 business days within major cities. For more accurate delivery estimates, please check the shipping information during checkout."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day return policy for most items. Products must be unused and in their original packaging. Please visit our Returns page for detailed information about our return process."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we only ship within Nigeria. We're working on expanding our shipping capabilities to other countries."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email. You can also track your order status by logging into your account and visiting the Order History section."
    },
    {
      question: "What if I receive a damaged product?",
      answer: "If you receive a damaged product, please contact our customer support immediately with photos of the damage. We'll arrange for a replacement or refund as appropriate."
    },
    {
      question: "Do you offer installation services?",
      answer: "Yes, we offer installation services for certain products. Please check the product description or contact our support team for more information about installation services."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team through multiple channels: Phone: +234 903 975 6266, Email: support@autostores.ng, or by filling out the contact form on our website."
    },
    {
      question: "Are your products genuine?",
      answer: "Yes, we only sell genuine products from authorized manufacturers and suppliers. All our products come with a warranty and are guaranteed to be authentic."
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
          
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-brand-red">
              Homepage
            </Link>
            {" / "}
            <span className="font-medium text-gray-700">FAQs</span>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>Still have questions? We&apos;re here to help!</p>
              <div className="mt-2 space-x-4">
                <a href="tel:+2349039756266" className="text-blue-600 hover:text-blue-700">
                  Call us: +234 903 975 6266
                </a>
                <span>|</span>
                <a href="mailto:support@autostores.ng" className="text-blue-600 hover:text-blue-700">
                  Email: support@autostores.ng
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage; 