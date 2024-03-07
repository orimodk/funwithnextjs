'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import { useSearchParams } from 'next/navigation'


interface Produkt {
  produktnavn?: string;
  kategorinavn?: string;
  billedurl?: string[];
  glpris?: number;
  nypris?: number;
  produktid?: string;
  productId?: string;
}


function Product() {
  const [produkter, setProdukter] = useState<Produkt[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams()
  const productId = searchParams.get('pid')
  const pathname = usePathname()
  



  useEffect(() => {
    // Fetch initial data from `data.json` asynchronously
    fetch('../../data/../merged.json')
      .then((response) => response.json())
      .then((data) => setProdukter(data.produkter))
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const product = produkter.find((p) => p.kategorinavn = "Haveliv")

  const decodedSlug = pathname.replace(/\//g, ' > ');

  
  console.log("decodedSlug" , decodedSlug)

  const categories = produkter.filter(
    (p) => p.kategorinavn === decodedSlug
  );

  console.log("categories" , categories)

  return (
    <div className="cards wrapper">
      hejeee {productId}
      {product?.produktnavn}<br />
      path: {pathname}<br />
      decoded:{decodedSlug}
    </div>
  );
}

export default Product;
