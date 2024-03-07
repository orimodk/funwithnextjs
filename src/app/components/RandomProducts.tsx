'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Produkt {
  produktnavn?: string;
  kategorinavn?: string;
  billedurl?: string[];
  glpris?: number;
  nypris?: number;
  produktid?: number;
}

function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

function RandomProdukter({ nrOfProducts, prodName }: { nrOfProducts: number; prodName?: string }) {
  const [produkter, setProdukter] = useState<Produkt[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch initial data from `data.json` asynchronously
    fetch('..data/../merged.json')
      .then((response) => response.json())
      .then((data) => setProdukter(data.produkter))
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const randomProdukter = [];
  for (let i = 0; i < nrOfProducts; i++) {
    const randomIndex = getRandomIndex(produkter.length);
    randomProdukter.push(produkter[randomIndex]);
  }
console.log("data" , produkter)
  return (
    <div className="cards wrapper">
      {randomProdukter.map((produkt, i) => (
        <div key={i} className="card">
          <div className="card-info">
            <Link
        href={{
          pathname: '/anotherpage',
          query: {
            search: 'search'
          }
        }}
      >
        Go to another page
      </Link>
            <Link
              href={`/products/${produkt?.produktnavn?.toString().replace(/\s+/g, '_') // Replace spaces with underscores
                .replace(/[/\.-]/g, '_') // Replace special characters with underscores
              }?pid=${produkt?.produktid}&pnavn=${produkt?.produktnavn}`}
              alt={produkt?.produktnavn || 'Product Name Unavailable'} // Use default alt text if produktnavn is undefined
            >
              <div className="card-info__image">
                <Image
                  src={produkt?.billedurl?.[0] || '/product_placeholder.svg'} // Use fallback image
                  alt={produkt?.produktnavn || 'test'} // Use fallback alt text
                  width={200}
                  height={200}
                />
              </div>
            </Link>
            <div className="product-card">
              <span>
                <Link
                  className="product-card__category"
                  href={`/kategori/${produkt?.kategorinavn
                    ?.toString()
                    .replace(/> /g, '/') // Replace "> " sequence with "/" for proper routing
                  }`}
                >
                  {produkt?.kategorinavn?.toString().substring(
                    produkt?.kategorinavn?.toString().lastIndexOf('>') + 1
                  ) || 'Category Unavailable'}
                </Link>
              </span>
              <Link
                href={`/products/${produkt?.produktnavn?.toString().replace(/\s+/g, '_') // Replace spaces with underscores
                .replace(/[/\.-]/g, '_') // Replace special characters with underscores
              }?pid=${produkt?.produktid}&pnavn=${produkt?.produktnavn}`}
                alt={produkt?.produktnavn || 'Product Name Unavailable'} // Use default alt text if produktnavn is undefined
              >
                <h4 className="product-card__title">{produkt?.produktnavn?.toString().substring(0, 25) || 'Product Name Unavailable'}</h4>
                <div>
                  <div>
                    <span
                      className={`product-card__old ${produkt?.glpris ? 'product-card__old--strike' : ''}`}
                    >
                      {produkt?.glpris}
                    </span>
                    <span className="product-card__new"> {produkt?.nypris} kr</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RandomProdukter;
