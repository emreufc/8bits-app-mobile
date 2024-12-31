export interface Ingredient {
    ingredientId: number;         // Malzeme ID'si
    ingredientName: string;       // Malzeme adı
    ingImgUrl: string;            // Malzeme görsel URL'si
    allergenId: number;           // Alerjen ID'si
    isDeleted: boolean;           // Silinme durumu
    allergen: any | null;         // Alerjen bilgisi (nullable)
  }
  