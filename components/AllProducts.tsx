"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import CustomizationModal from "./CustomizationModal";
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
}

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customizationProduct, setCustomizationProduct] =
    useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const scrollIntervalRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const modalScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: "all", name: "All Products", emoji: "✨" },
    { id: "embroidery", name: "Embroidery Hoops", emoji: "🧵" },
    { id: "hanky", name: "Hand-painted Hankies", emoji: "🌈" },
    { id: "accessories", name: "Hair Accessories", emoji: "🎀" },
  ];

  useEffect(() => {
    document.title = "All Products - Handcrafted Gifts";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Browse our complete collection of handmade embroidery hoops, hand-painted hankies, and hair accessories. Find the perfect personalized gift for any occasion."
      );
  }, []);

  const sampleProducts: Product[] = [
    {
      _id: "1",
      name: "Custom Name Embroidery Hoop",
      category: "embroidery",
      description:
        "Beautiful personalized embroidery hoop with your chosen name and design. Each piece is meticulously handcrafted with love and attention to detail, making it a perfect keepsake for special occasions.",
      basePrice: 899,
      images: [
        "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg",
        "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg",
        "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg",
      ],
      customizable: true,
      options: {
        colors: ["Pink", "Blue", "Green", "Purple", "Yellow"],
        sizes: ["6 inch", "8 inch", "10 inch"],
        materials: ["Cotton", "Linen", "Canvas"],
      },
    },
    {
      _id: "2",
      name: "Floral Quote Embroidery",
      category: "embroidery",
      description:
        "Delicate floral design with inspirational quotes, perfect for home decor or as a thoughtful gift. Each stitch tells a story of craftsmanship and passion.",
      basePrice: 1299,
      images: [
        "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg",
        "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg",
      ],
      customizable: true,
      options: {
        colors: ["Pastel Pink", "Lavender", "Mint Green", "Peach"],
        sizes: ["8 inch", "10 inch", "12 inch"],
        materials: ["Cotton", "Linen"],
      },
    },
    {
      _id: "3",
      name: "Watercolor Hanky Set",
      category: "hanky",
      description:
        "Set of 3 hand-painted cotton hankies with beautiful watercolor designs. Each hanky is unique and painted with high-quality, non-toxic colors that last through gentle washing.",
      basePrice: 699,
      images: [
        "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg",
      ],
      customizable: true,
      options: {
        colors: ["Floral Mix", "Ocean Blues", "Sunset Hues", "Garden Greens"],
        sizes: ["Standard"],
        materials: ["Cotton", "Muslin"],
      },
    },
    {
      _id: "4",
      name: "Personalized Initial Hanky",
      category: "hanky",
      description: "Elegant hanky with hand-painted initial and floral border",
      basePrice: 399,
      images: [
        "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg",
        "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg",
      ],
      customizable: true,
      options: {
        colors: ["Rose Gold", "Silver", "Gold", "Lavender"],
        sizes: ["Standard"],
        materials: ["Cotton", "Silk"],
      },
    },
    {
      _id: "5",
      name: "Cute Bow Hair Clips Set",
      category: "accessories",
      description: "Set of 5 adorable handmade bow clips in matching colors",
      basePrice: 299,
      images: [
        "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg",
        "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg",
        "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg",
      ],
      customizable: true,
      options: {
        colors: [
          "Pastel Mix",
          "Bright Colors",
          "Neutral Tones",
          "Floral Prints",
        ],
        sizes: ["Small", "Medium", "Large"],
        materials: ["Cotton", "Satin", "Velvet"],
      },
    },
    {
      _id: "6",
      name: "Scrunchie Collection",
      category: "accessories",
      description: "Set of 3 handmade scrunchies in coordinating fabrics",
      basePrice: 199,
      images: [
        "https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg",
      ],
      customizable: true,
      options: {
        colors: [
          "Spring Florals",
          "Vintage Prints",
          "Solid Pastels",
          "Boho Patterns",
        ],
        sizes: ["Regular", "Mini"],
        materials: ["Cotton", "Silk", "Chiffon"],
      },
    },
  ];

  // Auto-scroll images for products with multiple images
  useEffect(() => {
    products.forEach((product) => {
      if (product.images.length > 1) {
        scrollIntervalRef.current[product._id] = setInterval(() => {
          setCurrentImageIndex((prev) => ({
            ...prev,
            [product._id]:
              ((prev[product._id] || 0) + 1) % product.images.length,
          }));
        }, 3000);
      }
    });

    return () => {
      Object.values(scrollIntervalRef.current).forEach((interval) => {
        clearInterval(interval);
      });
    };
  }, [products]);

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

  const handleImageHover = (productId: string, enter: boolean) => {
    if (enter) {
      if (scrollIntervalRef.current[productId]) {
        clearInterval(scrollIntervalRef.current[productId]);
      }
    } else {
      const product = products.find((p) => p._id === productId);
      if (product && product.images.length > 1) {
        scrollIntervalRef.current[productId] = setInterval(() => {
          setCurrentImageIndex((prev) => ({
            ...prev,
            [productId]: ((prev[productId] || 0) + 1) % product.images.length,
          }));
        }, 3000);
      }
    }
  };

  const handleImageClick = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [productId]: ((prev[productId] || 0) + 1) % product.images.length,
      }));
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalImageIndex(0);

    // Pause auto-scroll for grid items
    if (scrollIntervalRef.current[product._id]) {
      clearInterval(scrollIntervalRef.current[product._id]);
    }
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

  const handleCustomize = (product: Product) => {
    setCustomizationProduct(product);
    handleCloseModal();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?all=true");
        const data = await response.json();

        if (data.success && data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(sampleProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-rose mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-text-light text-sm sm:text-base">
              Loading our beautiful collection...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-3 sm:px-6 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-text-dark mb-3 sm:mb-4">
              Our Complete Collection
            </h2>
            <p className="text-text-light text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-8">
              Browse all our handmade products and find the perfect gift
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-12">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full font-medium transition-all text-xs sm:text-sm md:text-base ${
                    selectedCategory === category.id
                      ? "bg-rose text-white shadow-md sm:shadow-lg"
                      : "bg-white text-text-dark hover:bg-blush"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-1 sm:mr-2">{category.emoji}</span>
                  <span className="hidden xs:inline">{category.name}</span>
                  <span className="xs:hidden">
                    {category.name.split(" ")[0]}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Products Grid - 2 columns on mobile, 3 on tablet, 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => {
              const currentIndex = currentImageIndex[product._id] || 0;
              const hasMultipleImages = product.images.length > 1;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-sm hover:shadow-md sm:hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Product Image */}
                  <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 bg-gray-100 overflow-hidden">
                    <img
                      src={product.images[currentIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Price Badge */}
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-text-dark shadow-sm">
                      ₹{product.basePrice}
                    </div>

                    {/* Image Indicators */}
                    {hasMultipleImages && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {product.images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              idx === currentIndex
                                ? "bg-white shadow-sm"
                                : "bg-white bg-opacity-50"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Multiple Images Badge */}
                    {hasMultipleImages && (
                      <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-1.5 py-0.5 rounded-full text-xs">
                        {product.images.length}
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-medium text-text-dark text-sm sm:text-base mb-1 sm:mb-2 line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[3rem]">
                      {product.name}
                    </h3>
                    <p className="text-text-light text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-1 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Color Options - Hidden on mobile, shown on tablet+ */}
                    <div className="hidden sm:flex gap-1 mb-2 sm:mb-3">
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
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="text-6xl mb-4">😔</div>
              <p className="text-text-light text-base sm:text-lg md:text-xl">
                No products found in this category.
              </p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="mt-4 px-6 py-3 bg-rose text-white rounded-full font-medium hover:shadow-lg transition-all"
              >
                View All Products
              </button>
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
                    <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-text-dark mb-2">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-xl sm:text-2xl md:text-3xl text-rose font-medium">
                      ₹{selectedProduct.basePrice}
                    </p>
                  </div>

                  {/* Description */}
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
                      onClick={() => handleCustomize(selectedProduct)}
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

      {/* Customization Modal */}
      {customizationProduct && (
        <CustomizationModal
          product={customizationProduct}
          onClose={() => setCustomizationProduct(null)}
        />
      )}
    </>
  );
}
