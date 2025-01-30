import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DietPreferenceService } from 'src/app/core/services/diet-preference.service'; // Servisin doğru yolunu kontrol edin

@Component({
  selector: 'app-edit-diet-preferences',
  templateUrl: './edit-diet-preferences.page.html',
  styleUrls: ['./edit-diet-preferences.page.scss'],
})
export class EditDietPreferencesPage implements OnInit {
  dietOptions: any[] = []; // API'den alınacak diyetler buraya atanacak
  selectedDiets: Set<number> = new Set(); // Türü number olarak güncellendi
  alertController: any;

  constructor(
    private navCtrl: NavController,
    private dietPreferenceService: DietPreferenceService // Servis ekleniyor
  ) {}

  ngOnInit() {
    this.loadDietTypes(); // Component yüklendiğinde API'ye istek at
  }

  // Diet tiplerini API'den yükleme
  loadDietTypes() {
    const pageNumber = 1;
    const pageSize = 11;
  
    this.dietPreferenceService.getDietTypes(pageNumber, pageSize).subscribe(
      (response) => {
        this.dietOptions = response.data.map((diet: any) => ({
          dietTypeId: diet.dietTypeId, // API'den gelen ID
          dietTypeName: diet.dietTypeName.replace(/_/g, ' '), // Alt tireleri boşluk ile değiştir
        }));
        console.log('Diet Types:', this.dietOptions);
      },
      (error) => {
        console.error('Error fetching diet types:', error);
      }
    );
  }
  
  
  
  

  toggleDiet(diet: any) {
    if (diet.dietTypeName === "Normal") {
      // Eğer "Normal" seçilmişse diğer tüm seçimleri kaldır ve sadece "Normal"i ekle
      this.selectedDiets.clear();
      this.selectedDiets.add(diet.dietTypeId);
    } else {
      // Eğer başka bir diyet seçilmişse "Normal"i kaldır
      this.selectedDiets.delete(
        this.dietOptions.find((option) => option.dietTypeName === "Normal")?.dietTypeId
      );
  
      // Seçilen diyeti toggle yap
      if (this.selectedDiets.has(diet.dietTypeId)) {
        this.selectedDiets.delete(diet.dietTypeId); // Seçilmişse kaldır
      } else {
        this.selectedDiets.add(diet.dietTypeId); // Yeni bir değer ekle
      }
    }
  
    console.log("Selected Diets:", Array.from(this.selectedDiets));
  }
  
  
  
  

  isDietSelected(dietTypeId: string): boolean {
    console.log('dietTypeId:', dietTypeId);
    const id = Number(dietTypeId); // Number'a dönüştür
    console.log('isDietSelected:', id);
    console.log('Selected Diets:', this.selectedDiets);
    // const isSelected = this.selectedDiets.has(id); // Eşleşme kontrolü
    // console.log('Return Value:', isSelected);
    return this.selectedDiets.has(id);
  }
  
  
  
  async next() {
    if (this.selectedDiets.size > 0) {
      try {
        // Seçilen diyetleri filtrele
        const selectedDiets = this.dietOptions.filter(diet => this.selectedDiets.has(diet.dietTypeId));
        
        // API isteği için seçilen diyetlerin ID'lerini al
        const selectedDietIds = Array.from(this.selectedDiets);
        
        // Servis fonksiyonuna istek at
        await this.dietPreferenceService.updateDietPreferences(new Set(selectedDietIds)).toPromise();
        
        // Başarılı olduğunda yönlendirme yap
        this.navCtrl.navigateForward('/content/home', { state: { diets: selectedDiets } });
      } catch (error) {
        console.error('Error updating diet preferences:', error);
        const alert = await this.alertController.create({
          header: 'Hata',
          message: 'Diyet tercihlerinizi güncellerken bir hata oluştu. Lütfen tekrar deneyin.',
          buttons: ['Tamam']
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Uyarı',
        message: 'Lütfen en az bir diyet seçin.',
        buttons: ['Tamam']
      });
      await alert.present();
    }
  }
  
}
