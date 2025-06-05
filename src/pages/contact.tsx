import { h } from '@/h';

export const ContactPage = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <section className="flex flex-wrap justify-center gap-8 lg:gap-12">
          <aside className="w-full max-w-lg lg:max-w-md bg-base-100 border-2 border-base-300 flex flex-col rounded-lg shadow-sm p-6 sm:p-8 text-center lg:text-left">
            <h3 className="mb-4 text-3xl sm:text-4xl font-bold">Kontaktoplysninger</h3>
            <address className="not-italic text-lg sm:text-xl font-medium space-y-2">
              <p>Foto Atelier BLAC ApS</p>
              <p>Ydesvej 4, 8500 Grenaa</p>
              <p>
                Telefon:{' '}
                <a
                  href="tel:+4531141000"
                  className="text-green underline hover:text-green/80 transition-colors"
                >
                  31 14 10 00
                </a>
              </p>
              <p>
                E-mail:{' '}
                <a
                  href="mailto:info@fa-blac.dk"
                  className="text-green underline hover:text-green/80 transition-colors"
                >
                  info@fa-blac.dk
                </a>
              </p>
            </address>
          </aside>
          <div className="w-full max-w-lg bg-base-100 border-2 border-base-300 flex flex-col rounded-lg shadow-sm p-6 sm:p-8 text-center lg:text-left">
            <h2 className="mb-4 text-3xl sm:text-4xl font-bold">Kontakt os</h2>
            <form action="">
              <div className="flex flex-col text-left">
                <label htmlFor="name" className="text-lg sm:text-xl font-medium pl-0.5 mb-1">
                  Navn
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="John Doe"
                  className="text-base sm:text-lg font-medium bg-white border-2 border-base-300 p-2 rounded-lg focus:ring-2 focus:ring-green focus:outline-none"
                />
              </div>
              <div className="mt-4 flex flex-col text-left">
                <label htmlFor="mail" className="text-lg sm:text-xl font-medium pl-0.5 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="mail"
                  id="mail"
                  placeholder="JohnDoe@example.com"
                  className="text-base sm:text-lg font-medium bg-white border-2 border-base-300 p-2 rounded-lg focus:ring-2 focus:ring-green focus:outline-none"
                />
              </div>
              <div className="mt-4 flex flex-col text-left">
                <label htmlFor="message" className="text-lg sm:text-xl font-medium pl-0.5 mb-1">
                  Besked
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  className="text-base sm:text-lg font-medium bg-white border-2 border-base-300 p-2 rounded-lg focus:ring-2 focus:ring-green focus:outline-none"
                />
              </div>
              <input
                type="submit"
                value="Send Besked"
                className="bg-green mt-6 text-white w-full py-2.5 text-lg sm:text-xl font-medium rounded-lg cursor-pointer hover:bg-green/90 transition-all"
              />
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
