import { h } from '@/h';
import { Carousel } from '@/components';

export const HomePage = () => {
  const carouselItems = [
    'assets/images/hero_one.webp',
    'assets/images/hero_two.webp',
    'assets/images/hero_three.webp',
  ];

  return (
    <div className="text-center lg:text-left animate-in fade-in duration-500 space-y-16 lg:space-y-24">
      <Carousel
        items={carouselItems}
        autoplayDelay={4000}
        className="w-full max-h-64 sm:max-h-80 md:max-h-96 lg:max-h-120 border-2 border-base-400 brightness-70"
      />
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-8">
        <a
          href="#/news"
          className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 group"
        >
          <div className="hidden sm:block m-3 rounded-lg overflow-hidden border-2 border-base-400">
            <div className="aspect-[4/3] w-full">
              <img
                src="assets/images/news_three.webp"
                alt="En model iført en nostalgisk brudekjole."
                className="object-cover w-full h-full transition-transform duration-300 transform group-hover:scale-105"
              />
            </div>
          </div>
          <div className="p-4 w-full">
            <h3 className="text-xl font-medium truncate">Brudekjoler og nostalgi</h3>
            <p className="text-base line-clamp-3">
              Den kendte design duo, Merlin og Morgan, har designet en kollektion brudekjoler som
              fører tankerne hen på gamle dage, romantik, flæser, forelskelse og marengsfarver.
              Atelier BLAC er blevet bestilt til at lave en romantisk, gammeldags og smuk
              billedserie over kollektionen.
            </p>
          </div>
        </a>
        <a
          href="#/news"
          className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 group"
        >
          <div className="hidden sm:block m-3 rounded-lg overflow-hidden border-2 border-base-400">
            <div className="aspect-[4/3] w-full">
              <img
                src="assets/images/news_one.webp"
                alt="En model i et urbant miljø med moderne tøj."
                className="object-cover w-full h-full transition-transform duration-300 transform group-hover:scale-105"
              />
            </div>
          </div>
          <div className="p-4 w-full">
            <h3 className="text-xl font-medium truncate">Urban-mode</h3>
            <p className="text-base line-clamp-3">
              Mode og kvinde magasinet Sirene har bedt Atelier BLAC lave en Foto-reportage som skal
              afspejle tidens trend i de mørkere urbane miljøer. Vi er i øjeblikket i fuld gang med
              de første billeder og flere forskellige set up. Vi har fået lov at give en lille
              smagsprøve på det som er i vente.
            </p>
          </div>
        </a>
        <a
          href="#/news"
          className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 group"
        >
          <div className="hidden sm:block m-3 rounded-lg overflow-hidden border-2 border-base-400">
            <div className="aspect-[4/3] w-full">
              <img
                src="assets/images/news_five.webp"
                alt="Et drag-racing køretøj i høj fart."
                className="object-cover w-full h-full transition-transform duration-300 transform group-hover:scale-105"
              />
            </div>
          </div>
          <div className="p-4 w-full">
            <h3 className="text-xl font-medium truncate">Motormagasinet ”Motor”</h3>
            <p className="text-base line-clamp-3">
              Det kendte magasin har bedt Atelier BLAC om at lave en fotoserie omkring Drag-racing.
              Vore fotografer rejser i øjeblikket ikke kun land og rige rundt, men er også på
              sviptur rundt om i verden hvor der er Drag-race konkurrencer.
            </p>
          </div>
        </a>
      </section>
      <section className="px-4 md:px-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          href="#/gallery"
          className="aspect-square w-full h-full overflow-hidden rounded-lg border-2 border-base-400 shadow-sm"
        >
          <img
            src="assets/images/cl_two.webp"
            alt="Galleri billede 1"
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </a>
        <a
          href="#/gallery"
          className="aspect-square w-full h-full overflow-hidden rounded-lg border-2 border-base-400 shadow-sm"
        >
          <img
            src="assets/images/dhc_two.webp"
            alt="Galleri billede 2"
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </a>
        <a
          href="#/gallery"
          className="aspect-square w-full h-full overflow-hidden rounded-lg border-2 border-base-400 shadow-sm"
        >
          <img
            src="assets/images/jvb_one.webp"
            alt="Galleri billede 3"
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </a>
        <a
          href="#/gallery"
          className="aspect-square w-full h-full overflow-hidden rounded-lg border-2 border-base-400 shadow-sm"
        >
          <img
            src="assets/images/msa_one.webp"
            alt="Galleri billede 4"
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </a>
        <a
          href="#/gallery"
          className="aspect-square lg:aspect-auto w-full h-full overflow-hidden rounded-lg border-2 border-base-400 shadow-sm lg:row-span-2"
        >
          <img
            src="assets/images/dhc_one.webp"
            alt="Galleri billede 5, vertikalt"
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </a>
        <a
          href="#/gallery"
          className="aspect-square w-full h-full overflow-hidden rounded-lg border-2 border-base-400 shadow-sm"
        >
          <img
            src="assets/images/msa_two.webp"
            alt="Galleri billede 6"
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </a>
        <a
          href="#/gallery"
          className="aspect-square w-full h-full overflow-hidden rounded-lg border-2 border-base-400 shadow-sm"
        >
          <img
            src="assets/images/cl_four.webp"
            alt="Galleri billede 7"
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </a>
        <a
          href="#/gallery"
          className="aspect-square w-full h-full overflow-hidden rounded-lg border-2 border-base-400 shadow-sm"
        >
          <img
            src="assets/images/jvb_three.webp"
            alt="Galleri billede 8"
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </a>
      </section>
      <section className="h-fit mx-4 md:mx-8 p-6 md:p-12 bg-base-100 border-2 border-base-300 flex flex-col items-center space-y-6 rounded-lg shadow-lg">
        <div className="text-center max-w-lg">
          <h2 className="font-bold text-2xl md:text-3xl">Hold dig opdateret</h2>
          <p className="font-normal text-lg mt-2">
            Tilmeld dig vores nyhedsbrev og få de seneste nyheder og tilbud direkte i din indbakke.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row bg-white gap-0 rounded-lg border-2 border-base-300 overflow-hidden w-full max-w-lg">
          <input
            type="email"
            placeholder="JohnDoe@example.com"
            className="p-3 focus:outline-none font-medium text-md flex-1 w-full"
          />
          <button className="bg-green text-lg text-white px-6 py-2 font-medium border-t-2 sm:border-t-0 sm:border-l-2 border-base-300 hover:bg-opacity-90 transition-colors">
            Tilmeld
          </button>
        </div>
      </section>
      <section className="px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="#/gallery"
          className="md:row-span-2 overflow-hidden rounded-lg shadow-sm border-2 border-base-300 aspect-[9/16] md:aspect-auto"
        >
          <img
            src="assets/images/together_three.webp"
            alt="En balletdanser i en positur."
            className="object-cover h-full w-full transition hover:scale-105 duration-300"
          />
        </a>
        <a
          href="#/gallery"
          className="overflow-hidden rounded-lg shadow-sm border-2 border-base-300 aspect-[16/9] md:aspect-auto"
        >
          <img
            src="assets/images/together_five.webp"
            alt="To modeller fra en modefotografering."
            className="object-cover h-full w-full transition hover:scale-105 duration-300"
          />
        </a>
        <a
          href="#/gallery"
          className="overflow-hidden rounded-lg shadow-sm border-2 border-base-300 aspect-[16/9] md:aspect-auto"
        >
          <img
            src="assets/images/together_one.webp"
            alt="Et kunstnerisk billede af en blomst til en kalender."
            className="object-cover h-full w-full transition hover:scale-105 duration-300"
          />
        </a>
      </section>
    </div>
  );
};
