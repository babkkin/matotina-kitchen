import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Catering"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div> {/* dark overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
          Exceptional Catering
        </h1>
        <p className="text-gray-200 text-lg md:text-xl mb-6">
          Creating unforgettable culinary experiences for your special events
        </p>
        <a
          href="/contact"
          className="bg-white text-gray-900 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
        >
          Get a Quote
        </a>
      </div>
    </section>
  );
}
