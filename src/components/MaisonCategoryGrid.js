"use client";

import Image from "next/image";

export default function MaisonCategoryGrid({ categories, collection }) {
  const handleCategoryClick = (categoryName) => {
    window.dispatchEvent(
      new CustomEvent("maison:select-category", { detail: categoryName })
    );
  };

  return (
    <div className="maison-category-grid">
      {categories.map((category, index) => {
        const itemsInCat = collection.filter(
          (item) => item.category?.name === category
        );
        const product = itemsInCat[0];

        return (
          <a
            key={category}
            href="#catalogo"
            className={`maison-category maison-category--${(index % 4) + 1}`}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="maison-category__image">
              {product?.image_url && (
                <Image
                  src={product.image_url}
                  alt={category}
                  fill
                  sizes="(max-width: 700px) 48vw, 32vw"
                  unoptimized
                />
              )}
            </div>
            <span className="maison-category__index">0{index + 1}</span>
            <div className="maison-category__copy">
              <small>{String(itemsInCat.length).padStart(2, "0")} PIEZAS</small>
              <h3>{category}</h3>
            </div>
            <span className="maison-category__arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        );
      })}
    </div>
  );
}
