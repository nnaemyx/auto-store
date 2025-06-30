import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";

interface Product {
  brand?: { id: string };
  car_model?: { id: string; name: string };
  [key: string]: unknown;
}

export function useCarModelsFromProducts(brandId?: string) {
  return useQuery({
    queryKey: ["car-models-from-products", brandId],
    queryFn: async () => {
      const products = await apiClient.get("/product/all") as Product[];
      // Filter by brand/manufacturer if brandId is provided
      const filtered = brandId
        ? products.filter((p) => p.brand && String(p.brand.id) === String(brandId))
        : products;
      // Extract unique car model names
      const modelsMap: Record<string, { id: string; name: string }> = {};
      for (const product of filtered) {
        if (product.car_model && product.car_model.name) {
          modelsMap[product.car_model.name] = {
            id: product.car_model.id,
            name: product.car_model.name,
          };
        }
      }
      return Object.values(modelsMap);
    },
    enabled: true,
  });
} 