import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import imageBrandLogo from "@/assets/apple_logo.png";
import imagePromoBg from "@/assets/promo_bg.png";

const slides = [
  {
    id: 1,
    title: "iPhone 14 Series",
    discount: "Up to 10%",
    brandImage: imageBrandLogo,
    image: imagePromoBg,
    href: "#",
  },
  {
    id: 2,
    title: "New Arrivals",
    discount: "Up to 20%",
    brandImage: imageBrandLogo,
    image: imagePromoBg,
    href: "#",
  },
  {
    id: 3,
    title: "Special Offer",
    discount: "Up to 30%",
    brandImage: imageBrandLogo,
    image: imagePromoBg,
    href: "#",
  },
];

export function HomeHeaderPromo() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg bg-black">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative min-w-full">
            <div className="flex flex-col md:flex-row max-w-max mx-auto items-center justify-between p-6 md:p-8">
              <div className="space-y-4 px-6 md:px-20 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <img
                    src={slide.brandImage}
                    alt="Brand logo"
                    width={24}
                    height={24}
                  />
                  <span className="text-lg text-white">{slide.title}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {slide.discount}
                  <br />
                  off Voucher
                </h2>
                <Button
                  asChild
                  variant="outline"
                  className="bg-transparent text-white hover:bg-white hover:text-black"
                >
                  <Link to={slide.href}>Shop Now</Link>
                </Button>
              </div>
              <img
                src={slide.image}
                alt="Product"
                width={250}
                height={250}
                className="object-contain md:w-96 md:h-96"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 md:p-2 text-white hover:bg-black/75"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 md:p-2 text-white hover:bg-black/75"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 md:h-2 md:w-2 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
