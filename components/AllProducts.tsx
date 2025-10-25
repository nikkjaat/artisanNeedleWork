"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import CustomizationModal from "./CustomizationModal";

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
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});
  const scrollIntervalRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

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
        "Beautiful personalized embroidery hoop with your chosen name and design",
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
      description: "Delicate floral design with inspirational quotes",
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
        "Set of 3 hand-painted cotton hankies with watercolor designs",
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
            [product._id]: (prev[product._id] || 0 + 1) % product.images.length,
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

  const handleImageHover = (productId: string, enter: boolean) => {
    if (enter) {
      // Pause auto-scroll on hover
      if (scrollIntervalRef.current[productId]) {
        clearInterval(scrollIntervalRef.current[productId]);
      }
    } else {
      // Resume auto-scroll when not hovering
      const product = products.find((p) => p._id === productId);
      if (product && product.images.length > 1) {
        scrollIntervalRef.current[productId] = setInterval(() => {
          setCurrentImageIndex((prev) => ({
            ...prev,
            [productId]: (prev[productId] || 0 + 1) % product.images.length,
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
        [productId]: (prev[productId] || 0 + 1) % product.images.length,
      }));
    }
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

  const handleCustomize = (product: Product) => {
    setSelectedProduct(product);
  };

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
    <section className="py-8 sm:py-12 md:py-16 lg:py-24 px-4 sm:px-6 bg-cream min-h-screen">
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

          {/* Category Filter - Mobile Optimized */}
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
                <span className="xs:hidden">{category.name.split(" ")[0]}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid - 1 column on mobile, 2 columns on sm+, 3 columns on lg+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
                className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-lg sm:hover:shadow-xl transition-all"
              >
                {/* Product Image with Auto-scroll */}
                <div
                  className="relative h-48 sm:h-56 md:h-64 bg-gradient-soft overflow-hidden"
                  onMouseEnter={() =>
                    hasMultipleImages && handleImageHover(product._id, true)
                  }
                  onMouseLeave={() =>
                    hasMultipleImages && handleImageHover(product._id, false)
                  }
                  onClick={() =>
                    hasMultipleImages && handleImageClick(product._id)
                  }
                >
                  <img
                    src={product.images[currentIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />

                  {/* Price Badge */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white bg-opacity-90 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-text-dark">
                    ₹{product.basePrice}
                  </div>

                  {/* Image Indicators for Multiple Images */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2">
                      {product.images.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                            idx === currentIndex
                              ? "bg-white"
                              : "bg-white bg-opacity-50"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Multiple Images Badge */}
                  {hasMultipleImages && (
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                      {product.images.length} photos
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-6">
                  <h3 className="font-serif text-lg sm:text-xl text-text-dark mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-text-light text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Color Options */}
                  <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4">
                    {product.options.colors.slice(0, 3).map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border border-gray-300"
                        style={{
                          backgroundColor: color.toLowerCase().replace(" ", ""),
                        }}
                        title={color}
                      />
                    ))}
                    {product.options.colors.length > 3 && (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-text-light">
                        +{product.options.colors.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Customize Button */}
                  <motion.button
                    onClick={() => handleCustomize(product)}
                    className={`w-full px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:shadow-md transition-all font-medium text-sm sm:text-base ${
                      product.customizable
                        ? "bg-gradient-soft text-text-dark"
                        : "bg-rose text-white"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {product.customizable ? "Customize & Order" : "Order Now"}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-text-light text-sm sm:text-base md:text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <CustomizationModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
