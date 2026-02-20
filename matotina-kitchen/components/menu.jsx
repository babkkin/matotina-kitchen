import Image from "next/image";
import Link from "next/link"; // <-- import Link
import appetizer from "@/app/public/pictures/appetizer.png";
import main from "@/app/public/pictures/main.png";
import dessert from "@/app/public/pictures/dessert.jpg";

export default function Menu() {
  const menuItems = [
    {
      image: appetizer,
      category: "Appetizers",
      title: "Gourmet Starters",
      description: "Light and savory starters to kick off your meal",
    },
    {
      image: main,
      category: "Main Course",
      title: "Premium Entrées",
      description: "Chef-inspired mains made for sharing and savoring",
    },
    {
      image: dessert,
      category: "Desserts",
      title: "Sweet Delights",
      description: "Perfectly balanced sweets to end your dining experience",
    },
  ];

  return (
    <section id="menu" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-5xl mb-4 text-gray-600">Our Menu</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A taste of what we offer - every menu is customized for your event
          </p>

          {/* View All Menu Button */}
          <Link
            href="/menu"
            className="absolute top-0 right-0 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:bg-gray-100 transition"
          >
            View All Menu {'\u2192'}
          </Link>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-6 bg-white">
                <div className="text-sm text-gray-500 mb-2">{item.category}</div>
                <h3 className="text-2xl mb-2 text-gray-500">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}