import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user';
import { AlertController, ToastController } from '@ionic/angular';
import { DietPreferenceService } from 'src/app/core/services/diet-preference.service'; // <-- Servisimizi import ediyoruz

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  user: User = {
    name: '',
    surname: '',
    gender: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
  };

  public loading = false;

  // Düzenleme modları (hangi alanın düzenleme modunda olduğunu tutmak için)
  isEditingFirstName = false;
  isEditingLastName = false;
  isEditingGender = false;
  isEditingEmail = false;
  isEditingMobileNumber = false;
  isEditingBirthday = false;

  // API'den gelecek diyet türlerini ID + Ad şeklinde saklamak için
  // (örneğin: [{id:1, name:"Vegan"}, {id:2, name:"Vegetarian"} ... ])
  dietOptions: { id: number; name: string }[] = [];

  // Mevcut kullanıcının seçili diyet tercihleri (ID’lerin saklandığı set)
  // Sunucudan gelen "dietPreferenceId, dietTypeId" gibi alanları ID olarak alıp bu sete ekleyeceğiz.
  selectedDietIds: Set<number> = new Set<number>();

  // Modal açılıp kapama kontrolü
  isDietModalOpen = false;

  constructor(
    private userService: UserService,
    private alertController: AlertController,
    private toastController: ToastController,
    private dietPreferenceService: DietPreferenceService // <-- DietPreferenceService dependency injection
  ) {}

  ngOnInit(): void {
    // Kullanıcı bilgilerini çeken servis
    this.userService.getCurrentUser().subscribe({
      next: (response: any) => {
        this.user = response.data;
      },
      error: (err) => {
        console.error('Kullanıcı bilgileri alınamadı:', err);
      }
    });

    // Tüm diyet türlerini getir
    this.loadDietTypes();

    // Mevcut kullanıcının diyet tercihlerini getir
    this.loadMyDietPreferences();
  }

  // Sunucudan diyet türlerini getirip "dietOptions" dizisine atıyoruz
  loadDietTypes() {
    // Burada 1 ve 10 yerine istediğin sayfa numarası ve boyutu gönderebilirsin
    this.dietPreferenceService.getDietTypes(1, 10).subscribe({
      next: (res) => {
        // res.data, her diyet tipi objesini içeren bir dizi
        // Örn: { dietTypeId:1, dietTypeName:'Vegan', ... }
        this.dietOptions = res.data.map((item: any) => {
          return {
            id: item.dietTypeId,
            name: item.dietTypeName.replace(/_/g, ' ')
          };
        });
      },
      error: (err) => {
        console.error('Diyet tipleri alınamadı:', err);
      }
    });
  }

  // Sunucudan o anki kullanıcının seçili olduğu diyet tercihlerini çekiyoruz
  loadMyDietPreferences() {
    this.dietPreferenceService.getMyDietPreferences().subscribe({
      next: (res) => {
        // res.data, her biri "dietTypeId" bilgisini taşıyan diyetPreference objelerinden oluşuyor
        // Örnek: [ {dietPreferenceId:4, userId:7, dietTypeId:3, ...}, {...} ]
        const myPrefs = res.data;
        myPrefs.forEach((pref: any) => {
          // Hangi dietTypeId kullanılıyorsa o set’e ekleniyor
          this.selectedDietIds.add(pref.dietTypeId);
        });
      },
      error: (err) => {
        console.error('Mevcut diyet tercihleri alınamadı:', err);
      }
    });
  }

  // Herhangi bir alanı düzenleme moduna geçirip çıkarmak için
  toggleEdit(field: string) {
    switch (field) {
      case 'firstName':
        this.isEditingFirstName = !this.isEditingFirstName;
        break;
      case 'lastName':
        this.isEditingLastName = !this.isEditingLastName;
        break;
      case 'gender':
        this.isEditingGender = !this.isEditingGender;
        break;
      case 'email':
        this.isEditingEmail = !this.isEditingEmail;
        break;
      case 'mobileNumber':
        this.isEditingMobileNumber = !this.isEditingMobileNumber;
        break;
      case 'birthday':
        this.isEditingBirthday = !this.isEditingBirthday;
        break;
    }
  }

  // Diet modalını açıyoruz ve "dietOptions" ile kullanıcıya seçim sunacağız
  openDietModal() {
    this.isDietModalOpen = true;
  }

  // Modalı kapama
  closeDietModal() {
    this.isDietModalOpen = false;
  }

  // Kullanıcının modal içindeki checkbox vb. seçili diyetlerini kaydetme
  // (TS tarafında "selectedDietIds" set'ine atayacağız)
  // Sonunda da updateDietPreferences servisini çağıracağız
  saveDietPreferences() {
    // Modalı kapatıyoruz
    this.closeDietModal();

    // "selectedDietIds" set'indeki ID'leri array'e çevirip servise gönderiyoruz
    this.dietPreferenceService.updateDietPreferences(this.selectedDietIds).subscribe({
      next: async (res) => {
        console.log('Diyet tercihi güncelleme başarılı:', res);
        const toast = await this.toastController.create({
          message: 'Diyet tercihleriniz kaydedildi.',
          duration: 1000,
          position: 'bottom',
          color: 'success',
        });
        await toast.present();
      },
      error: async (err) => {
        console.error('Diyet tercihi güncellenirken hata:', err);
        const alert = await this.alertController.create({
          header: 'Hata',
          message: 'Diyet tercihleriniz güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
          buttons: ['Tamam'],
        });
        await alert.present();
      }
    });
  }

  async onCheckboxChange(event: any, dietId: number) {
    if (event.detail.checked) {
      this.selectedDietIds.add(dietId);
      // Başarılı toast mesajı
      const toast = await this.toastController.create({
        message: `Diyet tercihi başarıyla eklendi.`,
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();
    } else {
      this.selectedDietIds.delete(dietId);
      // Uyarı toast mesajı
      const toast = await this.toastController.create({
        message: `Diyet tercihi başarıyla kaldırıldı.`,
        duration: 2000,
        position: 'bottom',
        color: 'warning',
      });
      await toast.present();
    }
  }
  

  // HTML’de diyet chip’lerinin yanındaki “X” ikonuna tıklanınca ID’yi set’ten çıkarabilirsin
  async removeDietPreference(dietId: number) {
    this.selectedDietIds.delete(dietId);
    // Başarılı toast mesajı
    const toast = await this.toastController.create({
      message: `Diyet tercihi başarıyla kaldırıldı.`,
      duration: 2000,
      position: 'bottom',
      color: 'warning',
    });
    await toast.present();
  }

  // Kullanıcı bilgileri + diyet tercihleri dahil her şeyi kaydetmek istediğinde
  // (örneğin “Değişiklikleri Kaydet” butonuna tıkladığında)
  async saveChanges() {
  this.loading = true;
  const updatedUserData = {
    ...this.user,
    // Eğer backend userService.editProfile metodu dietPreferences’ı işliyorsa
    // dietPreferences: Array.from(this.selectedDietIds)
  };

  this.userService.editProfile(updatedUserData).subscribe({
    next: async (response) => {
      // Kullanıcı bilgileri güncellenince buraya düşecek
      console.log('Kullanıcı bilgileri başarıyla güncellendi:', response);

      // Şimdi diyet tercihlerini güncelle
      this.dietPreferenceService.updateDietPreferences(this.selectedDietIds).subscribe({
        next: async (res) => {
          console.log('Diyet tercihleri güncellendi:', res);
          this.loading = false;
          const toast = await this.toastController.create({
            message: 'Kullanıcı ve Diyet Bilgileriniz başarıyla güncellendi.',
            duration: 1000,
            position: 'bottom',
            color: 'success',
          });
          await toast.present();
        },
        error: async (err) => {
          console.error('Diyet tercihleri güncellenirken hata oluştu:', err);
          this.loading = false;
          const alert = await this.alertController.create({
            header: 'Hata',
            message: 'Diyet tercihleriniz güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
            buttons: ['Tamam'],
          });
          await alert.present();
        }
      });
    },
    error: async (error) => {
      console.error('Kullanıcı bilgileri güncellenirken hata oluştu:', error);
      this.loading = false;
      const alert = await this.alertController.create({
        header: 'Hata',
        message: 'Kullanıcı bilgileriniz güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
        buttons: ['Tamam'],
      });
      await alert.present();
    }
  });
}

}
