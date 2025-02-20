import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const ImageCarousel = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  const images = [
    {
      url: 'https://cdn.pixabay.com/photo/2019/07/03/09/41/national-history-museum-4314035_1280.jpg',
      title: 'Ancient Egyptian Artifacts',
      description: 'Explore the fascinating artifacts from ancient Egypt.'
    },
    {
      url: 'https://cdn.pixabay.com/photo/2020/04/16/18/05/stairs-5051779_1280.jpg',
      title: 'Contemporary Art Installation',
      description: 'Discover the latest trends in contemporary art installations.'
    },
    {
      url: 'https://cdn.pixabay.com/photo/2015/09/19/23/04/vatican-947818_1280.jpg',
      title: 'Impressionist Paintings',
      description: 'Delve into the beauty of 19th-century impressionist paintings.'
    },
    {
      url: 'https://cdn.pixabay.com/photo/2019/03/24/17/48/sarcophagus-4078175_1280.jpg',
      title: 'Interactive Museum Exhibits',
      description: 'Engage with our interactive exhibits to learn more about art.'
    }
  ];

  const CustomDot = ({ onClick, active }) => {
    return (
      <button
        className={`
          w-3 h-3 mx-1 rounded-full transition-all duration-300 
          ${active 
            ? "bg-white scale-110" 
            : "bg-white/50 hover:bg-white/70"
          }
        `}
        onClick={() => onClick()}
      />
    );
  };

  return (
    <div className="relative w-full px-4">
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={5000}
        keyBoardControl={true}
        showDots={true}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        customDot={<CustomDot />}
        containerClass="pb-12"
        itemClass="px-2"
      >
        {images.map((image, index) => (
          <div key={index} className="relative h-[500px] w-full overflow-hidden rounded-xl shadow-xl">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 rounded-b-xl backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-2 transform translate-y-0 transition-transform duration-300 group-hover:translate-y-[-10px]">
                {image.title}
              </h3>
              <p className="text-gray-200 transform translate-y-0 transition-transform duration-300 group-hover:translate-y-[-5px]">
                {image.description}
              </p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel; 