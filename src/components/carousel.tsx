import { h } from '@/h';
import { ComponentProps } from '@/types';

interface CarouselOwnProps {
  items: string[];
  autoplayDelay?: number;
  className?: string;
}

export const Carousel = (props: ComponentProps<CarouselOwnProps>) => {
  const { items = [], autoplayDelay = 3000, className } = props;
  if (!items.length) {
    return <div></div>;
  }

  let currentIndex = 0;
  let slideTrack: HTMLElement;
  let counterElement: HTMLElement;
  let autoplayInterval: number | undefined;

  const goToSlide = (index: number) => {
    if (index < 0) {
      index = items.length - 1;
    } else if (index >= items.length) {
      index = 0;
    }
    currentIndex = index;

    if (slideTrack) {
      slideTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    if (counterElement) {
      counterElement.textContent = `${currentIndex + 1} / ${items.length}`;
    }
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayInterval = window.setInterval(nextSlide, autoplayDelay);
  };

  const stopAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  };

  const baseClasses = 'relative w-full mx-auto shadow-lg rounded-lg overflow-hidden';
  const finalClasses = `${baseClasses} ${className || ''}`;

  const carouselElement = (
    <div className={finalClasses} onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay}>
      <div
        ref={(el: HTMLElement) => (slideTrack = el)}
        className="flex transition-transform duration-500 ease-in-out"
      >
        {items.map((imageUrl) => (
          <div className="flex-shrink-0 w-full bg-gray-100">
            <img src={imageUrl} alt="Carousel image" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div
        ref={(el: HTMLElement) => (counterElement = el)}
        className="absolute top-2 right-3 bg-black/50 text-white text-sm font-mono rounded-md px-2 py-1"
      >
        1 / {items.length}
      </div>
    </div>
  );

  startAutoplay();

  return carouselElement;
};
