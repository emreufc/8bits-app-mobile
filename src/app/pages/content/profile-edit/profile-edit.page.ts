import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user';
import { AlertController, IonTabs, ToastController } from '@ionic/angular';
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
    imageUrl: '',
  };

  userInitial: string = '?'; 
  userColor: string = '#95A5A6';

  public loading = false;
  // tabs!: IonTabs;

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
        this.userInitial = this.getUserInitial(this.user.name);
        this.userColor = this.getColorByInitial(this.userInitial);
        console.log('Current Form Data:', this.user);
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


  // ngAfterViewInit() {  
  //   this.tabs.ionTabsDidChange.subscribe(async () => {
  //     if (this.isActiveTab()) {
  //       this.userService.getCurrentUser().subscribe(
  //         (response: any) => {
  //           this.user = response.data;
  //         },
  //         (error) => {
  //           console.error('Kullanıcı bilgileri alınamadı:', error);
  //         }
  //       );
  //     }
  //   });
  // }
  
  // isActiveTab() {
  //   return this.tabs.getSelected() === 'profile-edit'; 
  // }

  getUserInitial(name: string): string {
    console.log('Name:', name);
    return name ? name.charAt(0).toUpperCase() : '?'; // Ad yoksa '?' döner
  }

  getColorByInitial(initial: string): string {
    const colorMap: { [key: string]: string } = {
      A: '#FF5733', B: '#33FF57', C: '#3357FF', D: '#F39C12',
      E: '#8E44AD', F: '#3498DB', G: '#E74C3C', H: '#1ABC9C',
      I: '#9B59B6', J: '#E67E22', K: '#2ECC71', L: '#E74C3C',
      M: '#2C3E50', N: '#16A085', O: '#F1C40F', P: '#D35400',
      Q: '#2980B9', R: '#8E44AD', S: '#34495E', T: '#27AE60',
      U: '#7D3C98', V: '#1F618D', W: '#117A65', X: '#B03A2E',
      Y: '#784212', Z: '#1A5276'
    };
  
    return colorMap[initial] || '#95A5A6'; // Harf yoksa varsayılan bir renk döner
  }

  public selectFile(event: any) {

  }
  

  // Sunucudan diyet türlerini getirip "dietOptions" dizisine atıyoruz
  loadDietTypes() {
    // Burada 1 ve 10 yerine istediğin sayfa numarası ve boyutu gönderebilirsin
    this.dietPreferenceService.getDietTypes(1, 11).subscribe({
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

  triggerFileInput() {
    
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    console.log('File input tetiklendi', fileInput);
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        this.user.imageUrl = reader.result as string;
  
        // Profil resmini sunucuya göndermek için bir API çağrısı yapabilirsiniz
        this.uploadProfileImage(file);
      };
  
      reader.readAsDataURL(file);
    }
  }

  uploadProfileImage(file: File) {
    this.userService.uploadProfileImage(file).subscribe({
      next: async (res) => {
        console.log('Profil resmi başarıyla yüklendi:', res);
        const toast = await this.toastController.create({
          message: 'Profil resmi başarıyla güncellendi.',
          duration: 1000,
          position: 'bottom',
          color: 'success',
        });
        await toast.present();
      },
      error: async (err) => {
        console.error('Profil resmi yüklenirken hata:', err);
        const alert = await this.alertController.create({
          header: 'Hata',
          message: 'Profil resmi güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
          buttons: ['Tamam'],
        });
        await alert.present();
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
