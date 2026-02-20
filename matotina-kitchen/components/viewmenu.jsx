"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { menuItems } from "../app/data/menuItems";

export default function MenuGallery() {

  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <section className="py-20 bg-gray-50 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Buttons */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition">
            ← Back to Home
          </Link>
          <Link href="/quote" className="px-4 py-2 bg-blue-200 text-gray-800 rounded-full hover:bg-blue-300 transition">
            Get a Quote
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4 text-gray-600">Full Menu Gallery</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Explore our complete collection of carefully curated dishes for your event
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
                activeCategory === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "border-gray-300 text-gray-600 hover:bg-orange-500 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Category Sections */}
        {activeCategory === "All" ? (
          categories
            .filter((cat) => cat !== "All")
            .map((cat) => (
              <div key={cat} className="mb-16">
                <h2 className="text-2xl text-gray-600 mb-6 pb-2 border-b border-gray-200">{cat}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {menuItems
                    .filter((item) => item.category === cat)
                    .map((item, index) => (
                      <Card key={index} item={item} />
                    ))}
                </div>
              </div>
            ))
        ) : (
          <div>
            <h2 className="text-2xl text-gray-600 mb-6 pb-2 border-b border-gray-200">{activeCategory}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <Card key={index} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Card({ item }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
      <div className="relative h-60 overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition duration-300" />
        <span className="absolute top-3 left-3 bg-white/90 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
          {item.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-xl text-gray-600 mb-1">{item.title}</h3>
        <p className="text-gray-500 text-sm">{item.description}</p>
      </div>
    </div>
  );
}