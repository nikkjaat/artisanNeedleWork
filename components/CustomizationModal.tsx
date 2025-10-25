'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaTimes, FaWhatsapp } from 'react-icons/fa';

interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  images: string[];
  customizable: boolean;
  options: {
    colors: string[];
    sizes: string[];
    materials: string[];
  };
}

interface CustomizationModalProps {
  product: Product;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CustomizationModal({ product, onClose }: CustomizationModalProps) {
  const [formData, setFormData] = useState({
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      whatsappNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
      },
    },
    customization: {
      text: '',
      color: product.options.colors[0] || '',
      size: product.options.sizes[0] || '',
      material: product.options.materials[0] || '',
      specialInstructions: '',
    },
    quantity: 1,
    giftWrap: false,
  });

  const [currentStep, setCurrentStep] = useState(product.customizable ? 1 : 1);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleInputChange = (section: string, field: string, value: string | number | boolean) => {
    if (section === 'address') {
      setFormData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          address: {
            ...prev.customerInfo.address,
            [field]: value,
          },
        },
      }));
    } else if (section === 'customerInfo') {
      setFormData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          [field]: value,
        },
      }));
    } else if (section === 'customization') {
      setFormData(prev => ({
        ...prev,
        customization: {
          ...prev.customization,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const calculateTotal = () => {
    let total = product.basePrice * formData.quantity;
    if (formData.giftWrap) total += 50;
    if (total < 500) total += 50; // Delivery charges
    return total;
  };

  const validateForm = () => {
    const { name, phone, whatsappNumber, address } = formData.customerInfo;
    if (!name || !phone || !whatsappNumber || !address.street || !address.city || !address.state || !address.pincode) {
      alert('Please fill all required fields including WhatsApp number');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Create order on backend
      const orderData = {
        customerInfo: formData.customerInfo,
        items: [{
          productId: product._id,
          quantity: formData.quantity,
          customization: product.customizable ? formData.customization : {},
        }],
        totalAmount: calculateTotal(),
        paymentMethod: 'online',
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      
      if (result.success) {
        // Initialize Razorpay payment
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: calculateTotal() * 100, // Amount in paise
          currency: 'INR',
          name: 'Handcrafted Gifts',
          description: `Order for ${product.name}`,
          order_id: result.razorpayOrderId,
          handler: async function (response: any) {
            // Payment successful
            try {
              const verifyResponse = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderId: result.order._id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyResult = await verifyResponse.json();

              if (verifyResult.success) {
                setOrderNumber(verifyResult.order.orderNumber);
                setOrderPlaced(true);
              } else {
                alert('Payment verification failed. Please contact support with your order number: ' + result.order.orderNumber);
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              alert('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: formData.customerInfo.name,
            email: formData.customerInfo.email,
            contact: formData.customerInfo.phone,
          },
          theme: {
            color: '#FFB6C1',
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!validateForm()) return;

    const message = `Hi! I'd like to order:
    
Product: ${product.name}
Quantity: ${formData.quantity}
${product.customizable ? `Customization: ${formData.customization.text}
Color: ${formData.customization.color}
Size: ${formData.customization.size}
Material: ${formData.customization.material}
Special Instructions: ${formData.customization.specialInstructions}` : ''}

Total: ₹${calculateTotal()}

My Details:
Name: ${formData.customerInfo.name}
Phone: ${formData.customerInfo.phone}
WhatsApp: ${formData.customerInfo.whatsappNumber}
Email: ${formData.customerInfo.email}
Address: ${formData.customerInfo.address.street}, ${formData.customerInfo.address.city}, ${formData.customerInfo.address.state} - ${formData.customerInfo.address.pincode}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  if (orderPlaced) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="font-serif text-2xl text-text-dark mb-4">Order Placed Successfully!</h3>
            <p className="text-text-light mb-2">Your order number is:</p>
            <p className="font-bold text-xl text-rose mb-6">{orderNumber}</p>
            <p className="text-sm text-text-light mb-6">
              You will receive order confirmation via email and WhatsApp. We&apos;ll keep you updated on your order status.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-rose text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all font-medium"
            >
              Continue Shopping
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const totalSteps = product.customizable ? 3 : 2;
  const stepLabels = product.customizable 
    ? ['Customize', 'Address', 'Payment']
    : ['Address', 'Payment'];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl text-text-dark">
                  {product.customizable ? 'Customize Your Order' : 'Place Your Order'}
                </h2>
                <p className="text-text-light">{product.name}</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 mt-6">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step
                        ? 'bg-rose text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {stepLabels[step - 1]}
                  </span>
                  {step < totalSteps && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        currentStep > step ? 'bg-rose' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Step 1: Customization (only if product is customizable) */}
            {product.customizable && currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="font-serif text-xl text-text-dark mb-4">Customize Your Product</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Personalization Text
                    </label>
                    <input
                      type="text"
                      value={formData.customization.text}
                      onChange={(e) => handleInputChange('customization', 'text', e.target.value)}
                      placeholder="Enter name, quote, or message"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Color
                    </label>
                    <select
                      value={formData.customization.color}
                      onChange={(e) => handleInputChange('customization', 'color', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                    >
                      {product.options.colors.map((color) => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Size
                    </label>
                    <select
                      value={formData.customization.size}
                      onChange={(e) => handleInputChange('customization', 'size', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                    >
                      {product.options.sizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Material
                    </label>
                    <select
                      value={formData.customization.material}
                      onChange={(e) => handleInputChange('customization', 'material', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                    >
                      {product.options.materials.map((material) => (
                        <option key={material} value={material}>{material}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={formData.customization.specialInstructions}
                    onChange={(e) => handleInputChange('customization', 'specialInstructions', e.target.value)}
                    placeholder="Any special requests or instructions..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleInputChange('', 'quantity', Math.max(1, formData.quantity - 1))}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{formData.quantity}</span>
                      <button
                        onClick={() => handleInputChange('', 'quantity', formData.quantity + 1)}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="giftWrap"
                      checked={formData.giftWrap}
                      onChange={(e) => handleInputChange('', 'giftWrap', e.target.checked)}
                      className="w-4 h-4 text-rose border-gray-300 rounded focus:ring-rose"
                    />
                    <label htmlFor="giftWrap" className="text-sm text-text-dark">
                      Gift wrapping (+₹50)
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Address Step */}
            {((product.customizable && currentStep === 2) || (!product.customizable && currentStep === 1)) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="font-serif text-xl text-text-dark mb-4">Delivery Information</h3>

                {!product.customizable && (
                  <div className="flex items-center gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Quantity
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleInputChange('', 'quantity', Math.max(1, formData.quantity - 1))}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{formData.quantity}</span>
                        <button
                          onClick={() => handleInputChange('', 'quantity', formData.quantity + 1)}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="giftWrap"
                        checked={formData.giftWrap}
                        onChange={(e) => handleInputChange('', 'giftWrap', e.target.checked)}
                        className="w-4 h-4 text-rose border-gray-300 rounded focus:ring-rose"
                      />
                      <label htmlFor="giftWrap" className="text-sm text-text-dark">
                        Gift wrapping (+₹50)
                      </label>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.customerInfo.name}
                      onChange={(e) => handleInputChange('customerInfo', 'name', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.customerInfo.phone}
                      onChange={(e) => handleInputChange('customerInfo', 'phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      WhatsApp Number * <span className="text-xs text-gray-500">(for order updates)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.customerInfo.whatsappNumber}
                      onChange={(e) => handleInputChange('customerInfo', 'whatsappNumber', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Email Address <span className="text-xs text-gray-500">(optional but recommended)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.customerInfo.email}
                      onChange={(e) => handleInputChange('customerInfo', 'email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={formData.customerInfo.address.street}
                      onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.customerInfo.address.city}
                      onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.customerInfo.address.state}
                      onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={formData.customerInfo.address.pincode}
                      onChange={(e) => handleInputChange('address', 'pincode', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Payment Step */}
            {((product.customizable && currentStep === 3) || (!product.customizable && currentStep === 2)) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="font-serif text-xl text-text-dark mb-4">Order Summary & Payment</h3>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-text-dark">{product.name}</h4>
                      <p className="text-sm text-text-light">Quantity: {formData.quantity}</p>
                      {product.customizable && formData.customization.text && (
                        <p className="text-sm text-text-light">
                          Customization: {formData.customization.text}
                        </p>
                      )}
                    </div>
                    <p className="font-medium text-text-dark">₹{product.basePrice * formData.quantity}</p>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₹{product.basePrice * formData.quantity}</span>
                    </div>
                    {formData.giftWrap && (
                      <div className="flex justify-between text-sm">
                        <span>Gift Wrapping:</span>
                        <span>₹50</span>
                      </div>
                    )}
                    {calculateTotal() - (product.basePrice * formData.quantity) - (formData.giftWrap ? 50 : 0) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Delivery Charges:</span>
                        <span>₹50</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-rose">₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-medium text-text-dark mb-2">Payment & Delivery Information</h4>
                  <p className="text-sm text-text-light">
                    • Secure payment via Razorpay (UPI, Cards, Net Banking)
                  </p>
                  <p className="text-sm text-text-light">
                    • Estimated delivery: 5-7 working days
                  </p>
                  <p className="text-sm text-text-light">
                    • Free delivery on orders above ₹500
                  </p>
                  <p className="text-sm text-text-light">
                    • Order updates via WhatsApp and Email
                  </p>
                </div>
              </motion.div>
            )}

            {/* Footer Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              {((product.customizable && currentStep > 1) || (!product.customizable && currentStep > 1)) && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border-2 border-gray-200 rounded-full hover:bg-gray-50 transition-colors font-medium"
                >
                  Back
                </button>
              )}

              <div className="flex-1 flex gap-2">
                {((product.customizable && currentStep < 3) || (!product.customizable && currentStep < 2)) ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="flex-1 bg-rose text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all font-medium"
                  >
                    Continue
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="flex-1 bg-rose text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all font-medium disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                    <button
                      onClick={handleWhatsAppOrder}
                      className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-all font-medium"
                    >
                      <FaWhatsapp />
                      WhatsApp
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}