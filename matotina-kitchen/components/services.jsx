import { Users, Utensils, Heart, Briefcase } from 'lucide-react';

const services = [
  {
    icon: Heart,
    title: 'Wedding Catering',
    description: 'Make your special day unforgettable with our elegant wedding catering services.',
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
  },
  {
    icon: Briefcase,
    title: 'Corporate Events',
    description: 'Professional catering for meetings, conferences, and corporate gatherings.',
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
  },
  {
    icon: Users,
    title: 'Private Parties',
    description: 'Celebrate with style at birthdays, anniversaries, and family gatherings.',
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
  },
  {
    icon: Utensils,
    title: 'Custom Menus',
    description: 'Personalized menus tailored to your preferences and dietary requirements.',
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative w-full bg-gray-50 flex items-center" style={{ minHeight: "100vh" }}>
      <style>{`
        .service-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }
        .service-icon {
          transition: transform 0.2s ease;
        }
        .service-card:hover .service-icon {
          transform: scale(1.12);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <span style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 500 }}>
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl mt-3 mb-4 text-gray-600">Our Services</h2>
          <div style={{ width: "40px", height: "2px", background: "#d1d5db", margin: "0 auto 16px" }} />
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We cater to all types of events with professionalism and culinary excellence
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="service-card bg-white p-8 rounded-xl text-center"
                style={{ border: "1px solid #f3f4f6", borderTop: `3px solid ${service.color}` }}
              >
                <div
                  className="service-icon inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5"
                  style={{ background: service.bg }}
                >
                  <Icon style={{ width: "26px", height: "26px", color: service.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}