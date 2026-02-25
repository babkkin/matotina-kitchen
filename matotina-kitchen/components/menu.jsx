"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const DESC_LIMIT = 120;
const INTERVAL   = 4000;

function ExpandableDesc({ text, expanded, onToggle }) {
  const isLong    = text && text.length > DESC_LIMIT;
  const displayed = isLong && !expanded ? text.slice(0, DESC_LIMIT).trimEnd() + "…" : text;
  if (!text) return null;

  return (
    <p className="text-gray-600 text-sm leading-relaxed">
      {displayed}
      {isLong && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="ml-1 text-xs font-semibold text-gray-500 underline underline-offset-2 hover:text-gray-700 bg-transparent border-none cursor-pointer p-0"
        >
          {expanded ? "Less" : "More"}
        </button>
      )}
    </p>
  );
}

export default function Menu() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [current, setCurrent]     = useState(0);
  const [sliding, setSliding]     = useState(false);
  const [expanded, setExpanded]   = useState({}); // { [itemId]: boolean }
  const intervalRef               = useRef(null);
  const pausedRef                 = useRef(false);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((d) => { setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const advance = useCallback(() => {
    if (pausedRef.current) return;
    setCurrent((prev) => (prev + 1) % items.length);
    setExpanded({}); // collapse all on auto-advance
  }, [items.length]);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    if (items.length <= 1) return;
    intervalRef.current = setInterval(advance, INTERVAL);
  }, [advance, items.length]);

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [startInterval]);

  const jumpTo = (i) => {
    if (i === current || sliding) return;
    setSliding(true);
    setExpanded({});
    setTimeout(() => { setCurrent(i); setSliding(false); }, 300);
    startInterval();
  };

  const handleMouseEnter = () => {
    pausedRef.current = true;
    clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    pausedRef.current = false;
    startInterval();
  };

  const toggleExpanded = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getVisible = () => {
    if (items.length === 0) return [];
    if (items.length <= 3) return items.map((item, i) => ({ item, i }));
    return [-1, 0, 1].map((offset) => {
      const i = (current + offset + items.length) % items.length;
      return { item: items[i], i };
    });
  };

  const visible = getVisible();

  if (loading) return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-5 w-80 bg-gray-100 rounded animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg overflow-hidden shadow-md">
              <div className="h-64 bg-gray-200 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (items.length === 0) return null;

  return (
    <section id="menu" className="py-20 bg-white relative overflow-hidden">
      <style>{`
        .menu-card { transition: opacity 0.3s ease, transform 0.3s ease; }
        .menu-card-center { transform: scale(1.04); z-index: 2; }
        .menu-card-side   { transform: scale(0.96); opacity: 0.7; z-index: 1; }
        .menu-card-single { transform: scale(1); z-index: 2; }
        .menu-carousel-sliding .menu-card { opacity: 0; transform: scale(0.96); }
        .dot-btn { width: 8px; height: 8px; border-radius: 50%; border: none; cursor: pointer; transition: all 0.2s; padding: 0; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-5xl mb-4 text-gray-600">Our Menu</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A taste of what we offer — every menu is customized for your event
          </p>
          <Link
            href="/menu"
            className="absolute top-0 right-0 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:bg-gray-100 transition"
          >
            View All →
          </Link>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`grid gap-8 items-start ${
            visible.length === 1 ? "grid-cols-1 max-w-sm mx-auto"
            : visible.length === 2 ? "grid-cols-2 max-w-2xl mx-auto"
            : "grid-cols-1 md:grid-cols-3"
          } ${sliding ? "menu-carousel-sliding" : ""}`}>
            {visible.map(({ item, i }, pos) => {
              const isCenter = visible.length === 3 ? pos === 1 : pos === 0;
              return (
                <div
                  key={`${pos}-${item.id}`}
                  onClick={() => jumpTo(i)}
                  className={`menu-card group overflow-hidden rounded-lg shadow-md hover:shadow-xl cursor-pointer ${
                    visible.length === 3
                      ? (isCenter ? "menu-card-center" : "menu-card-side")
                      : "menu-card-single"
                  }`}
                >
                  <div className="relative h-64 overflow-hidden">
                    {item.image_url
                      ? <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-110 transition duration-300" />
                      : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No Image</div>
                    }
                  </div>
                  <div className="p-6 bg-white">
                    <div className="text-sm text-gray-500 mb-2">{item.category}</div>
                    <h3 className="text-2xl mb-2 text-gray-500">{item.title}</h3>
                    <ExpandableDesc
                      text={item.description}
                      expanded={!!expanded[item.id]}
                      onToggle={() => toggleExpanded(item.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        {items.length > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {items.map((_, i) => (
              <button
                key={i}
                className="dot-btn"
                onClick={() => jumpTo(i)}
                style={{
                  background: i === current ? "#374151" : "#d1d5db",
                  width: i === current ? "24px" : "8px",
                  borderRadius: i === current ? "4px" : "50%"
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}