import Image from "next/image";
import chef from "@/app/public/pictures/chef.jpg";
export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Image
                src={chef}
                alt="Chef preparing food"
                width={600}
                height={400}
                className="rounded-lg shadow-lg object-cover"
            />
          </div>
          
          <div>
            <h2 className="text-4xl md:text-5xl mb-6 text-gray-600">About Us</h2>
            <p className="text-lg text-gray-600 mb-6">
              With over 15 years of experience in the catering industry, we pride ourselves on 
              delivering exceptional culinary experiences that exceed expectations.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Our team of professional chefs and event specialists work closely with you to create 
              custom menus that reflect your taste and vision, using only the finest, locally-sourced 
              ingredients.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              From intimate gatherings to large-scale events, we handle every detail with precision 
              and care, ensuring your event is nothing short of extraordinary.
            </p>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2 text-gray-600">15+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2 text-gray-600">500+</div>
                <div className="text-gray-600">Events Catered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2 text-gray-600">100%</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
