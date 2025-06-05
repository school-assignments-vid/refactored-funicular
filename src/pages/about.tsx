import { h } from '@/h';

export const AboutPage = () => {
  return (
    <div className="text-center lg:text-left animate-in fade-in duration-500 space-y-10 xl:space-y-28 px-8">
      <section className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        <div className="w-full lg:w-1/3 aspect-square overflow-hidden rounded-lg border-2 border-base-400 shadow-sm">
          <img src="assets/images/jvb_five.webp" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="w-full lg:w-2/3">
          <h2 className="mb-4 text-4xl font-bold">Om Atelier BLAC</h2>
          <p className="text-xl mb-4 lg:mr-20">
            Ideen til Atelier BLAC opstod da 4 fotografer som i nogle år havde samarbejdet på kryds
            og tværs omkring diverse freelance projekter af større art, alle blev sat i stævne som
            dommere i konkurrencen 24 timers foto-maraton i København . Med deres forskellige
            baggrunde og interessefelter indenfor faget, samt en stor erfaring fra internationale
            aviser og magasiner, fandt de at de sammen ville kunne skabe kreative og spændende
            projekter både i Danmark, men også internationalt. Deres erfaring inden for faget
            spænder meget vidt, hvilket gør at de sammen dækker et meget bredt felt lige fra mode,
            arkitektur, lyssætning, natur og presse fotografering, over til det mere kunstneriske
            islæt i portræt og projekt foto.
          </p>
          <p className="text-xl lg:mr-20">
            De er alle nysgerrige, søgende og ikke bange at bryde grænser for at afprøve nye ideer.
          </p>
        </div>
      </section>
      <section className="flex flex-col">
        <h2 className="mb-4 text-4xl font-bold">Velkommen til Atelier BLAC som består af:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm">
            <div className="m-3 rounded-lg overflow-hidden border-2 border-base-400">
              <div className="h-[240px] md:h-[280px] xl:h-[340px] w-full">
                <img
                  src="assets/images/portrait_jvb.webp"
                  alt="Portræt af fotograf Jens Videnhoff Bertsen"
                  className="object-contain object-bottom w-full h-full transition-transform duration-300 transform"
                />
              </div>
            </div>
            <div className="p-4 w-full">
              <h3 className="text-xl font-medium truncate">Jens Videnhoff Bertsen</h3>
              <p className="text-base">
                er også er arkitekt af uddannelse, har som fotograf specialiseret sig indenfor fotos
                af arkitektur, bygningsværker og design genstande. Med arkitektens øje for detaljer,
                viden om rum, lys og former, har han en enorm erfaring i at opnå de bedste
                resultater i sine motiver.
              </p>
            </div>
          </div>
          <div className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm">
            <div className="m-3 rounded-lg overflow-hidden border-2 border-base-400">
              <div className="h-[240px] md:h-[280px] xl:h-[340px] w-full">
                <img
                  src="assets/images/portrait_cl.webp"
                  alt="Portræt af fotograf Christiane Langhoff"
                  className="object-contain object-bottom w-full h-full transition-transform duration-300 transform"
                />
              </div>
            </div>
            <div className="p-4 w-full">
              <h3 className="text-xl font-medium truncate">Christiane Langhoff</h3>
              <p className="text-base">
                har siden barnsben være fascineret af menneskets udtryk, både i portrætform, men
                også i grupper. Christiane er kendt for at have et spændende kunstnerisk set up på
                hendes billeder, ofte i kombination med redigering i Photoshop bagefter. En af
                Christianes helt store passioner (foruden foto) er rock musik, og med en kombination
                af disse leverer Christiane varen, både til de glittede magasiner, billederne i
                hjemmet og de helt store koncertplakater.
              </p>
            </div>
          </div>
          <div className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm">
            <div className="m-3 rounded-lg overflow-hidden border-2 border-base-400">
              <div className="h-[240px] md:h-[280px] xl:h-[340px] w-full">
                <img
                  src="assets/images/portrait_msa.webp"
                  alt="Portræt af naturfotograf Mikkel Sibjel Andersen"
                  className="object-contain object-bottom w-full h-full transition-transform duration-300 transform"
                />
              </div>
            </div>
            <div className="p-4 w-full">
              <h3 className="text-xl font-medium truncate">Mikkel Sibjel Andersen</h3>
              <p className="text-base">
                har rejst rundt som naturfotograf over hele verden, og har gennem årene oparbejdet
                en fantastisk evne til at fange naturen når den er mest smuk, spektakulær eller
                spændende. WWF gør ofte brug af hans motiver, både til salgsmateriale, men også til
                bøger om truede dyrearter.
              </p>
            </div>
          </div>
          <div className="w-full h-full border-2 border-base-300 flex flex-col rounded-lg shadow-sm">
            <div className="m-3 rounded-lg overflow-hidden border-2 border-base-400">
              <div className="h-[240px] md:h-[280px] xl:h-[340px] w-full">
                <img
                  src="assets/images/portrait_dhc.webp"
                  alt="Portræt af pressefotograf David Høgh Christiansen"
                  className="object-contain object-bottom w-full h-full transition-transform duration-300 transform"
                />
              </div>
            </div>
            <div className="p-4 w-full">
              <h3 className="text-xl font-medium truncate">David Høgh Christiansen</h3>
              <p className="text-base">
                er uddannet journalist og pressefotograf, og har derfor en helt speciel evne til at
                fange sit motiv i det splitsekund hvor det fortæller en historie. David har arbejdet
                i rundt om på jordens brændpunkter gennem de sidste 14 år, og har et hjerte som
                banker for demokrati og ligeret for alle. Dette fremgår meget tydeligt af hans
                motiver.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
