export interface Ingredient {
    ingredientId: number | any;         // Malzeme ID'si
    ingredientName: string | any;       // Malzeme adı
    ingImgUrl: string | any;            // Malzeme görsel URL'
    quantityTypeIds: any[] | null;       // Miktar tipi ID'si
    quantityTypes: any[] | null;     // Miktar tipi bilgisi (nullable)
    quantityId: number | any;           // Miktar ID'si
    quantity: number | any;              // Miktar
    allergenId: number | any;           // Alerjen ID'si
    isDeleted: boolean | any;           // Silinme durumu
    allergen: any | null;         // Alerjen bilgisi (nullable)
  }
  