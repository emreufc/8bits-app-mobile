export interface Ingredient {
    ingredientId: number | any;         // Malzeme ID'si
    ingredientName: string | any;       // Malzeme adı
    ingImgUrl: string | any;            // Malzeme görsel URL'
    quantityTypeID: number | any;       // Miktar tipi ID'si
    quanity: number | any;              // Miktar
    allergenId: number | any;           // Alerjen ID'si
    isDeleted: boolean | any;           // Silinme durumu
    allergen: any | null;         // Alerjen bilgisi (nullable)
  }
  