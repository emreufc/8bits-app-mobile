import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user';
import { AlertController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  // Kullanıcı bilgileri
  user: User = {
    name: '',
    surname: '',
    gender: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
  };

  public loading = false;

  // Düzenleme modları
  isEditingFirstName: boolean = false;
  isEditingLastName: boolean = false;
  isEditingGender: boolean = false;
  isEditingEmail: boolean = false;
  isEditingMobileNumber: boolean = false;
  isEditingBirthday: boolean = false;

  // Diet Preferences
  dietPreferences: string[] = [];
  dietOptions: string[] = ['Vegetarian', 'Vegan', 'Paleo', 'Keto', 'Halal', 'Kosher'];
  selectedDietPreferences: { [key: string]: boolean } = {};
  isDietModalOpen: boolean = false;

  constructor(private userService: UserService,
              private alertController: AlertController,
              private toastController: ToastController
  ) {}


  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      (response: any) => {
        console.log('API Response:', response);
        // Yanıttaki data katmanından kullanıcı bilgilerini çek
        this.user = response.data;
        console.log('Current Form Data:', this.user);
      },
      (error) => {
        console.error('Kullanıcı bilgileri alınamadı:', error);
      }
    );
  }
  

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

  // Modal açma
  openDietModal() {
    this.isDietModalOpen = true;
    this.dietOptions.forEach(option => {
      this.selectedDietPreferences[option] = this.dietPreferences.includes(option);
    });
  }

  // Modal kapama
  closeDietModal() {
    this.isDietModalOpen = false;
  }

  // Diet tercihlerini kaydetme
  saveDietPreferences() {
    this.dietPreferences = Object.keys(this.selectedDietPreferences)
      .filter(option => this.selectedDietPreferences[option]);
    this.closeDietModal();
  }

  // Diet tercihini kaldırma
  removeDietPreference(preference: string) {
    this.dietPreferences = this.dietPreferences.filter(item => item !== preference);
  }

  async saveChanges() {
    this.loading = true;
    const updatedUserData = {
      ...this.user, // Kullanıcıdan gelen güncel bilgiler
      dietPreferences: this.dietPreferences, // Diet tercihlerini de ekle
    };
  
    this.userService.editProfile(updatedUserData).subscribe(
      async (response) => {
        console.log('Kullanıcı bilgileri başarıyla güncellendi:', response);
        this.loading = false;

        const toast = await this.toastController.create({
          message: 'Kullanıcı bilgileriniz başarıyla güncellendi.',
          duration: 1000,
          position: 'bottom',
          color: 'warning',
        });
        await toast.present();
      },
      async (error) => {
        console.error('Kullanıcı bilgileri güncellenirken hata oluştu:', error);
        this.loading = false;
  
        const alert = await this.alertController.create({
          header: 'Hata',
          message: 'Kullanıcı bilgileriniz güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
          buttons: ['Tamam'],
        });
        await alert.present();
      }
    );
  }
}
