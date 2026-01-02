// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import products from "@/app/lib/product.json";
import ProductContent from "./ProductContent";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ← FIX

  const product = products.find((p) => p.slug === slug);
  if (!product) return notFound();

  return <ProductContent product={product} />;
}
