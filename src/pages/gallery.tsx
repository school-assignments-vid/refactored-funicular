import { h } from '@/h';

export const GalleryPage = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-8">
        <div className="aspect-square rounded-lg border-2 border-base-400 shadow-sm overflow-hidden">
          <img
            src="assets/images/cl_three.webp"
            alt="Galleri billede 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-lg border-2 border-base-400 shadow-sm overflow-hidden">
          <img
            src="assets/images/cl_one.webp"
            alt="Galleri billede 2"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-[2/1] rounded-lg border-2 border-base-400 shadow-sm col-span-2 overflow-hidden">
          <img
            src="assets/images/together_three.webp"
            alt="Galleri billede 3"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-lg border-2 border-base-400 shadow-sm col-span-2 md:row-span-2 overflow-hidden">
          <img
            src="assets/images/together_two.webp"
            alt="Galleri billede 4"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-lg border-2 border-base-400 shadow-sm overflow-hidden">
          <img
            src="assets/images/dhc_three.webp"
            alt="Galleri billede 5"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square md:aspect-auto rounded-lg border-2 border-base-400 shadow-sm row-span-2 overflow-hidden">
          <img
            src="assets/images/together_four.webp"
            alt="Galleri billede 6"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-[2/1] md:aspect-square rounded-lg border-2 border-base-400 shadow-sm overflow-hidden col-span-2 md:col-span-1">
          <img
            src="assets/images/dhc_two.webp"
            alt="Galleri billede 7"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-lg border-2 border-base-400 shadow-sm overflow-hidden">
          <img
            src="assets/images/jvb_four.webp"
            alt="Galleri billede 8"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-lg border-2 border-base-400 shadow-sm overflow-hidden">
          <img
            src="assets/images/jvb_two.webp"
            alt="Galleri billede 9"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-lg border-2 border-base-400 shadow-sm col-span-2 md:row-span-2 overflow-hidden">
          <img
            src="assets/images/together_one.webp"
            alt="Galleri billede 10"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-lg border-2 border-base-400 shadow-sm overflow-hidden">
          <img
            src="assets/images/msa_four.webp"
            alt="Galleri billede 11"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-lg border-2 border-base-400 shadow-sm overflow-hidden">
          <img
            src="assets/images/msa_three.webp"
            alt="Galleri billede 12"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
};
