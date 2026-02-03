import { Users, Utensils, Heart, Briefcase } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Heart,
      title: 'Wedding Catering',
      description: 'Make your special day unforgettable with our elegant wedding catering services.',
    },
    {
      icon: Briefcase,
      title: 'Corporate Events',
      description: 'Professional catering for meetings, conferences, and corporate gatherings.',
    },
    {
      icon: Users,
      title: 'Private Parties',
      description: 'Celebrate with style at birthdays, anniversaries, and family gatherings.',
    },
    {
      icon: Utensils,
      title: 'Custom Menus',
      description: 'Personalized menus tailored to your preferences and dietary requirements.',
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4 text-gray-600">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We cater to all types of events with professionalism and culinary excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-gray-900" />
                </div>
                <h3 className="text-xl mb-3 text-gray-600">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}