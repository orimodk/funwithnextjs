'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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



  useEffect(() => {
    // Fetch initial data from `data.json` asynchronously
    fetch('../data/../merged.json')
      .then((response) => response.json())
      .then((data) => setProdukter(data.produkter))
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const product = produkter.find((p) => p.produktid == productId)
  console.log("product " , product)
  return (
    <div className="cards wrapper">
      hejeee {productId}
      {product?.produktnavn}
    </div>
  );
}

export default Product;
