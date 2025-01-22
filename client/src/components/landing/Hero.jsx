import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const carouselImages = [
    {
        url: "/images/carousel/carousel-1.jpeg",
        alt: "Modern restaurant interior"
    },
    {
        url: "/images/carousel/carousel-2.jpeg",
        alt: "Restaurant POS system in action"
    },
    {
        url: "/images/carousel/carousel-3.jpeg",
        alt: "Restaurant staff using POS"
    },
    {
        url: "/images/carousel/carousel-4.jpeg",
        alt: "Digital payment and ordering"
    },
    {
        url: "/images/carousel/carousel-5.jpg",
        alt: "Digital payment and ordering"
    }
];

// Register service worker for caching
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceWorker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 1,
        scale: 1,
        position: 'absolute'
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
        position: 'relative'
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 1,
        scale: 1,
        position: 'absolute'
    })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

export default function Hero() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const intervalRef = useRef(null);
    const imageCache = useRef(new Map());

    // Preload and cache images
    useEffect(() => {
        const loadImages = async () => {
            const loadPromises = carouselImages.map(image => {
                return new Promise((resolve, reject) => {
                    // Try to get from cache first
                    caches.match(image.url).then(cachedResponse => {
                        if (cachedResponse) {
                            imageCache.current.set(image.url, cachedResponse.url);
                            resolve();
                            return;
                        }

                        // If not in cache, load normally
                        const img = new Image();
                        img.onload = () => {
                            imageCache.current.set(image.url, img.src);
                            resolve();
                        };
                        img.onerror = reject;
                        img.src = image.url;

                        // Set cache headers
                        fetch(image.url, {
                            cache: 'force-cache',
                            headers: {
                                'Cache-Control': 'public, max-age=31536000',
                            },
                        });
                    });
                });
            });

            try {
                await Promise.all(loadPromises);
                setImagesLoaded(true);
            } catch (error) {
                console.error('Error preloading images:', error);
                setImagesLoaded(true);
            }
        };

        loadImages();

        // Add preload hints
        carouselImages.forEach(image => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = image.url;
            link.crossOrigin = 'anonymous';
            // Add cache headers to preload
            link.setAttribute('cache-control', 'public, max-age=31536000');
            document.head.appendChild(link);
        });

        // Cleanup function
        return () => {
            document.querySelectorAll('link[rel="preload"][as="image"]').forEach(link => {
                link.remove();
            });
        };
    }, []);

    useEffect(() => {
        if (!isPaused && imagesLoaded) {
            intervalRef.current = setInterval(() => {
                setDirection(1);
                setCurrentImageIndex((prevIndex) =>
                    prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
                );
            }, 4000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPaused, imagesLoaded]);

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentImageIndex((prevIndex) => {
            if (newDirection === 1) {
                return prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1;
            }
            return prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1;
        });
    };

    const handleSlideChange = (newIndex) => {
        setDirection(newIndex > currentImageIndex ? 1 : -1);
        setCurrentImageIndex(newIndex);
    };

    return (
        <div className="relative isolate overflow-hidden pt-10">
            {/* Layered Background */}
            <div className="absolute inset-0 -z-10">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-700 via-orange-600 to-red-600"></div>

                {/* Radial gradient overlay for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(0,0,0,0.2),_transparent_50%)]"></div>

                {/* Mesh pattern overlay */}
                <svg
                    className="absolute inset-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern
                            id="hero-pattern"
                            width="60"
                            height="60"
                            patternUnits="userSpaceOnUse"
                            patternTransform="rotate(30)"
                        >
                            <path
                                d="M0 0h60v60H0z"
                                fill="none"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="1"
                            />
                            <circle
                                cx="30"
                                cy="30"
                                r="2"
                                fill="rgba(255,255,255,0.05)"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hero-pattern)" />
                </svg>

                {/* Floating shapes for additional depth */}
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 transform opacity-20">
                    <div className="h-48 w-48 rounded-full bg-orange-500 blur-3xl"></div>
                </div>
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 transform opacity-20">
                    <div className="h-48 w-48 rounded-full bg-red-500 blur-3xl"></div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-12 sm:py-20 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:min-h-[85vh] lg:py-24">
                <motion.div
                    className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="mt-6 max-w-lg text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">
                        Streamline Your Restaurant Operations
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-orange-100 max-w-xl [text-shadow:_0_1px_1px_rgb(0_0_0_/_10%)]">
                        The all-in-one POS solution for modern restaurants. Manage orders, staff, and inventory with ease.
                    </p>
                    <div className="mt-8 flex items-center gap-x-6">
                        <Link
                            to="/login"
                            className="rounded-md bg-white/90 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-orange-600 shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 hover:shadow-lg"
                        >
                            Get Started
                        </Link>
                        <a href="#features" className="text-sm font-semibold leading-6 text-white hover:text-orange-100 transition-colors duration-200">
                            Learn more <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    className="mt-12 sm:mt-16 lg:mt-0 lg:flex-shrink-0 lg:flex-grow relative"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: imagesLoaded ? 1 : 0, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div
                        className="relative isolate overflow-hidden rounded-2xl shadow-2xl bg-white/5 backdrop-blur-sm"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <AnimatePresence
                            initial={false}
                            custom={direction}
                            mode="popLayout"
                        >
                            <motion.div
                                key={currentImageIndex}
                                className="relative w-full"
                                style={{ overflow: 'hidden' }}
                            >
                                <motion.img
                                    src={carouselImages[currentImageIndex].url}
                                    alt={carouselImages[currentImageIndex].alt}
                                    className="w-full max-w-[40rem] rounded-2xl ring-1 ring-white/10 object-cover aspect-[4/3] lg:aspect-[16/10]"
                                    variants={slideVariants}
                                    custom={direction}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0 },
                                        scale: { duration: 0 }
                                    }}
                                    loading="eager"
                                    decoding="async"
                                    fetchpriority="high"
                                    style={{
                                        willChange: 'transform',
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden'
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.8}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = swipePower(offset.x, velocity.x);
                                        if (swipe < -swipeConfidenceThreshold) {
                                            paginate(1);
                                        } else if (swipe > swipeConfidenceThreshold) {
                                            paginate(-1);
                                        }
                                    }}
                                    crossOrigin="anonymous"
                                    data-cache-control="public, max-age=31536000"
                                />
                            </motion.div>
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/30 via-orange-900/10 to-transparent"></div>

                        {/* Navigation Arrows */}
                        <div className="absolute inset-y-0 left-0 flex items-center z-10">
                            <button
                                onClick={() => paginate(-1)}
                                className="p-2 m-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors duration-200 backdrop-blur-sm"
                                aria-label="Previous slide"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center z-10">
                            <button
                                onClick={() => paginate(1)}
                                className="p-2 m-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors duration-200 backdrop-blur-sm"
                                aria-label="Next slide"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                            {carouselImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSlideChange(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 backdrop-blur-sm ${index === currentImageIndex
                                        ? 'bg-white w-6'
                                        : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 