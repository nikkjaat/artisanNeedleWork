"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { GiSewingNeedle, GiLipstick } from "react-icons/gi";
import { GiHairStrands } from "react-icons/gi";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
  featured: boolean;
}

export default function Products() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const modalScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  

  const categories = [
    {
      title: "Embroidery Hoops",
      description:
        "Personalised embroidered designs perfect for home décor or heartfelt gifts. Each stitch tells your unique story.",
      icon: <GiSewingNeedle />,
      color: "bg-blush",
      category: "embroidery",
    },
    {
      title: "Hand-Painted Hankies",
      description:
        "Delicate watercolor designs on soft cotton hankies. A thoughtful keepsake for special moments and memories.",
      icon: <GiLipstick />,
      color: "bg-lavender",
      category: "hanky",
    },
    {
      title: "Hair Accessories",
      description:
        "Adorable handmade bows, clips, and bands. Add a charming touch to your everyday style with these cute creations.",
      icon: <GiHairStrands />,
      color: "bg-beige",
      category: "accessories",
    },
  ];

  // Auto-scroll for modal images
  useEffect(() => {
    if (selectedProduct && selectedProduct.images.length > 1) {
      modalScrollIntervalRef.current = setInterval(() => {
        setModalImageIndex(
          (prev) => (prev + 1) % selectedProduct.images.length
        );
      }, 3000);
    }

    return () => {
      if (modalScrollIntervalRef.current) {
        clearInterval(modalScrollIntervalRef.current);
      }
    };
  }, [selectedProduct]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCloseModal();
      }
    };

    if (selectedProduct) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [selectedProduct]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalImageIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setModalImageIndex(0);

    if (modalScrollIntervalRef.current) {
      clearInterval(modalScrollIntervalRef.current);
    }
  };

  const handleNextImage = () => {
    if (selectedProduct) {
      setModalImageIndex((prev) => (prev + 1) % selectedProduct.images.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedProduct) {
      setModalImageIndex((prev) =>
        prev === 0 ? selectedProduct.images.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products?featured=true");
        const data = await response.json();

        if (data.success && data.products && data.products.length > 0) {
          // Filter only featured products
          const featured = data.products.filter(
            (product: Product) => product.featured === true
          );
          setFeaturedProducts(featured);
        } else {
          // If no featured products, show empty array
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-cream">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-rose mx-auto"></div>
            <p className="mt-3 text-text-light text-sm sm:text-base">
              Loading featured products...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-cream">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-dark mb-3 sm:mb-4">
              Featured Products
            </h2>
            <p className="text-text-light text-base sm:text-lg max-w-2xl mx-auto px-2">
              Handpicked creations showcasing our finest craftsmanship and
              attention to detail
            </p>
          </motion.div>

          {/* Featured Products Grid - Minimum 2 columns */}
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-sm hover:shadow-md sm:hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Product Image */}
                  <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 bg-gray-100 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Price Badge */}
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-text-dark shadow-sm">
                      ₹{product.basePrice}
                    </div>

                    {/* Featured Badge */}
                    <div className="absolute top-2 left-2 bg-rose text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
                      Featured
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4">
                    {/* Product Name - Maximum 2 lines */}
                    <h3 className="font-medium text-text-dark text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[3rem]">
                      {product.name}
                    </h3>

                    {/* Product Description - Maximum 1 line */}
                    <p className="text-text-light text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-1 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Color Options */}
                    <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3">
                      {product.options.colors.slice(0, 3).map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300"
                          style={{
                            backgroundColor: color
                              .toLowerCase()
                              .replace(" ", ""),
                          }}
                          title={color}
                        />
                      ))}
                      {product.options.colors.length > 3 && (
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-text-light">
                          +{product.options.colors.length - 3}
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                      className="w-full px-3 py-2 bg-gradient-soft text-text-dark rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:shadow-md transition-all group-hover:bg-rose group-hover:text-white"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Fallback to category cards if no featured products
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {categories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-md hover:shadow-lg transition-all"
                >
                  <div
                    className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-text-dark`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-text-dark mb-3">
                    {category.title}
                  </h3>
                  <p className="text-text-light text-sm sm:text-base leading-relaxed">
                    {category.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl md:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col lg:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-text-dark" />
              </button>

              {/* Image Gallery */}
              <div className="relative w-full lg:w-1/2 h-48 sm:h-64 md:h-80 lg:h-auto bg-gray-100">
                <img
                  src={selectedProduct.images[modalImageIndex]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {selectedProduct.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="hidden sm:flex absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
                    >
                      <ChevronLeft className="w-4 h-4 text-text-dark" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="hidden sm:flex absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
                    >
                      <ChevronRight className="w-4 h-4 text-text-dark" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {selectedProduct.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                    {selectedProduct.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setModalImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === modalImageIndex
                            ? "bg-white"
                            : "bg-white bg-opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Mobile Swipe Area */}
                {selectedProduct.images.length > 1 && (
                  <div className="sm:hidden absolute inset-0 flex">
                    <div className="flex-1" onClick={handlePrevImage} />
                    <div className="flex-1" onClick={handleNextImage} />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-rose text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-text-dark mb-2">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-xl sm:text-2xl md:text-3xl text-rose font-medium">
                      ₹{selectedProduct.basePrice}
                    </p>
                  </div>

                  {/* Description - Full description in modal */}
                  <div>
                    <h3 className="font-medium text-text-dark mb-2 text-base sm:text-lg">
                      Description
                    </h3>
                    <p className="text-text-light text-sm sm:text-base leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 sm:space-y-4">
                    {/* Colors */}
                    <div>
                      <h3 className="font-medium text-text-dark mb-2 text-base sm:text-lg">
                        Available Colors
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.options.colors.map((color, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-full border border-gray-200"
                          >
                            <div
                              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                              style={{
                                backgroundColor: color
                                  .toLowerCase()
                                  .replace(" ", ""),
                              }}
                            />
                            <span className="text-xs sm:text-sm text-text-dark">
                              {color}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sizes */}
                    {selectedProduct.options.sizes.length > 0 && (
                      <div>
                        <h3 className="font-medium text-text-dark mb-2 text-base sm:text-lg">
                          Sizes
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProduct.options.sizes.map((size, index) => (
                            <span
                              key={index}
                              className="px-2 py-1.5 bg-gray-100 rounded-full text-xs sm:text-sm text-text-dark"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Materials */}
                    {selectedProduct.options.materials.length > 0 && (
                      <div>
                        <h3 className="font-medium text-text-dark mb-2 text-base sm:text-lg">
                          Materials
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProduct.options.materials.map(
                            (material, index) => (
                              <span
                                key={index}
                                className="px-2 py-1.5 bg-gray-100 rounded-full text-xs sm:text-sm text-text-dark"
                              >
                                {material}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                    <motion.button
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-3 sm:px-6 sm:py-4 bg-rose text-white rounded-xl sm:rounded-2xl font-medium hover:shadow-lg transition-all text-sm sm:text-base"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {selectedProduct.customizable
                        ? "Customize & Order"
                        : "Order Now"}
                    </motion.button>
                    <motion.button
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-3 sm:px-6 sm:py-4 bg-gray-100 text-text-dark rounded-xl sm:rounded-2xl font-medium hover:shadow-lg transition-all text-sm sm:text-base"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue Shopping
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
