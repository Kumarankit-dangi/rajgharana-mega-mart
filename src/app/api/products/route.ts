import { NextRequest } from "next/server";
import { filterProducts, getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = params.get("q") ?? undefined;
  const category = params.get("category") ?? undefined;
  const sort = params.get("sort") ?? undefined;
  const limit = Math.min(60, Math.max(1, Number(params.get("limit") ?? 60) || 60));

  const all = await getAllProducts();
  const products = filterProducts(all, { q, category, sort }).slice(0, limit);
  return Response.json({ products, total: products.length });
}
