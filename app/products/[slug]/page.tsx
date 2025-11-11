import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import products from "@/app/lib/product.json";
import TopSection from "@/components/ui/TopSection";

interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  image: string;
  variants?: string[];
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product: Product | undefined = products.find((p) => p.slug === slug);

  if (!product) return notFound();

  return (
    <div>
      <TopSection title={product.title} />
      <main className="bg-[#F8F8F8] min-h-screen py-16 px-4 md:px-12 lg:px-24 text-[#1C1C1C] font-Int">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          {/* Product Image */}
          <div className="relative w-full lg:w-1/2 h-[400px] rounded-2xl overflow-hidden border-4 border-[#1C1C1C] shadow-lg">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <h1 className="font-Play uppercase text-3xl md:text-4xl font-semibold mb-3">
              {product.title}
            </h1>
            <p className="italic text-[#333333] mb-2">{product.category}</p>

            <p className="text-base md:text-lg text-[#333333] mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Variants Section */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-10">
                <h4 className="font-semibold text-lg mb-3">
                  Available Sizes / Variants:
                </h4>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <span
                      key={variant}
                      className="border border-[#1C1C1C] rounded-xl px-4 py-2 text-sm hover:bg-[#1C1C1C] hover:text-[#EAEAEA] transition duration-200 cursor-pointer"
                    >
                      {variant}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Features List */}
            {product.features && product.features.length > 0 && (
              <ul className="space-y-2 mb-8">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[#1C1C1C] font-bold">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="https://api.whatsapp.com/send?phone=918291527207"
                className="px-6 py-3 border-2 border-[#1C1C1C] bg-[#1C1C1C] text-[#EAEAEA] font-semibold uppercase tracking-wide hover:bg-transparent hover:text-[#1C1C1C] transition duration-300"
              >
                Enquire Now
              </Link>
              <Link
                href="/products"
                className="px-6 py-3 border-2 border-[#1C1C1C] text-[#1C1C1C] font-semibold uppercase tracking-wide hover:bg-[#1C1C1C] hover:text-[#EAEAEA] transition duration-300"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
