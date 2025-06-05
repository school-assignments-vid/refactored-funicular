import { h } from '@/h';

export const NewsPage = () => {
  return (
    <div className="text-center lg:text-left animate-in fade-in duration-500 space-y-10 xl:space-y-28">
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-4 xl:gap-6 px-4 lg:px-8">
        <div className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm">
          <div className="m-3 rounded-lg overflow-hidden border-2 border-base-400">
            <div className="h-[240px] md:h-[280px] xl:h-[340px] w-full">
              <img
                src="assets/images/news_one.webp"
                alt="Nyhedsartikel billede"
                className="object-cover w-full h-full transition-transform duration-300 transform"
              />
            </div>
          </div>
          <div className="p-4 w-full">
            <h3 className="text-xl font-medium truncate">Urban-mode</h3>
            <p className="text-base">
              Mode og kvinde magasinet Sirene har bedt Atelier BLAC lave en Foto-reportage som skal
              afspejle tidens trend i de mørkere urbane miljøer. Vi er i øjeblikket i fuld gang med
              de første billeder og flere forskellige set up. Vi har fået lov at give en lille
              smagsprøve på det som er i vente.
            </p>
          </div>
        </div>
        <div className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm md:col-span-2 xl:col-span-2">
          <div className="m-3 rounded-lg overflow-hidden border-2 border-base-400">
            <div className="h-[240px] md:h-[280px] xl:h-[340px] w-full">
              <img
                src="assets/images/news_two.webp"
                alt="Nyhedsartikel billede"
                className="object-cover w-full h-full transition-transform duration-300 transform"
              />
            </div>
          </div>
          <div className="p-4 w-full">
            <h3 className="text-xl font-medium truncate">Samarbejde med Københavns Kommune</h3>
            <p className="text-base">
              Atelier BLAC er gået i samarbejde med Københavns Kommune om en foto-serie fra nogle
              udvalgte vuggestuer. Efter den seneste tids nyhedsdækning over den ringe kvalitet af
              pasning i vuggestuerne, vil Københavns Kommune nu vise at børnene i allerhøjeste grad
              bliver taget sig af. Dette skal ske i 7 billedserier der i de kommende måneder vil
              blive brugt til kampagne materiale i form af plakater, annoncer og billeder på
              kommunens hjemmeside.
            </p>
          </div>
        </div>
        <div className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm">
          <div className="m-3 rounded-lg overflow-hidden border-2 border-base-400">
            <div className="h-[240px] md:h-[280px] xl:h-[340px] w-full">
              <img
                src="assets/images/news_three.webp"
                alt="Nyhedsartikel billede"
                className="object-cover w-full h-full transition-transform duration-300 transform"
              />
            </div>
          </div>
          <div className="p-4 w-full">
            <h3 className="text-xl font-medium truncate">Brudekjoler og nostalgi</h3>
            <p className="text-base">
              Den kendte design duo, Merlin og Morgan, har designet en kollektion brudekjoler som
              fører tankerne hen på gamle dage, romantik, flæser, forelskelse og marengsfarver.
              Atelier BLAC er blevet bestilt til at lave en romantisk, gammeldags og smuk
              billedserie over kollektionen.
            </p>
          </div>
        </div>
        <div className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm">
          <div className="m-3 rounded-lg overflow-hidden border-2 border-base-400">
            <div className="h-[240px] md:h-[280px] xl:h-[340px] w-full">
              <img
                src="assets/images/news_four.webp"
                alt="Nyhedsartikel billede"
                className="object-cover w-full h-full transition-transform duration-300 transform"
              />
            </div>
          </div>
          <div className="p-4 w-full">
            <h3 className="text-xl font-medium truncate">Fremtiden er jo nu!</h3>
            <p className="text-base">
              Arken kunstmuseum´s ny udstilling ”Fremtiden er jo nu!”, tages der afsæt i moderne
              design. Et design som for de fleste vedkomne ikke eksisterer – endnu. Fire designere
              kommer her med deres bud på hvad fremtiden lige nu ér, og den er alt lige fra
              svulmende former, minimalistisk indretning, forkromede dekorationer, digitale tanker,
              - og faktisk også fortidig. Atelier BLAC er blevet bedt om at lave billederne til
              brochure og plakatmaterialet.
            </p>
          </div>
        </div>
        <div className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm">
          <div className="m-3 rounded-lg overflow-hidden border-2 border-base-400">
            <div className="h-[240px] md:h-[280px] xl:h-[340px] w-full">
              <img
                src="assets/images/news_five.webp"
                alt="Nyhedsartikel billede"
                className="object-cover w-full h-full transition-transform duration-300 transform"
              />
            </div>
          </div>
          <div className="p-4 w-full">
            <h3 className="text-xl font-medium truncate">Motormagasinet ”Motor”</h3>
            <p className="text-base">
              Det kendte magasin har bedt Atelier BLAC om at lave en fotoserie omkring Drag-racing.
              Vore fotografer rejser i øjeblikket ikke kun land og rige rundt, men er også på
              sviptur rundt om i verden hvor der er Drag-race konkurrencer. Rygterne siger, at der
              kommer nogle fantastiske billeder ud af alt det rejseri, og når vi ser det eksempel
              der er blevet sendt til os, så tror vi dem rent faktisk.
            </p>
          </div>
        </div>
        <div className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm md:col-span-2 xl:col-span-2">
          <div className="m-3 rounded-lg overflow-hidden border-2 border-base-400">
            <div className="h-[240px] md:h-[280px] xl:h-[340px] w-full">
              <img
                src="assets/images/news_six.webp"
                alt="Nyhedsartikel billede"
                className="object-cover object-top w-full h-full transition-transform duration-300 transform"
              />
            </div>
          </div>
          <div className="p-4 w-full">
            <h3 className="text-xl font-medium truncate">Magasinet ”Dit barn”</h3>
            <p className="text-base">
              Så skal der gang i børneopdragelsen. Magasinet ”Dit Barn” skal i gang med en
              artikelserie omkring forældrerollen, og det at være overskuds mor eller far i teorien,
              og hvordan det så er i virkeligheden. Det kommer der nogle temmelig sjove og ærlige
              situationer ud af, og Atelier BLAC har været så heldige at få lov til at levere
              billedmaterialet til artikelserien, selvfølgelig i samarbejde med journalisterne.
            </p>
          </div>
        </div>
        <div className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm">
          <div className="m-3 rounded-lg overflow-hidden border-2 border-base-400">
            <div className="h-[240px] md:h-[280px] xl:h-[340px] w-full">
              <img
                src="assets/images/news_seven.webp"
                alt="Nyhedsartikel billede"
                className="object-cover w-full h-full transition-transform duration-300 transform"
              />
            </div>
          </div>
          <div className="p-4 w-full">
            <h3 className="text-xl font-medium truncate">Kalender for naturelskere</h3>
            <p className="text-base">
              Så kan du godt slå øjnene op hvis du er glad for naturen, og nyder at se spektakulære
              billeder af den danske flora. I en kalender for næste år, skal Atelier BLAC vise hvad
              vi ser for vort indre øjne, når talen falder på de danske blomster, den danske natur.
              I et samarbejde med Bogringen leverer vi billederne til deres års kalender.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
