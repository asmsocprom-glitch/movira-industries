// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import products from "@/app/lib/product.json";
import ProductContent from "./ProductContent";

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const product = products.find((p) => p.slug === slug);

  if (!product) return notFound();

  return <ProductContent product={product} />;
}
