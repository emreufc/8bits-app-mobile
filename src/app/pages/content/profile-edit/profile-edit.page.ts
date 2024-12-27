import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage {
  firstName: string = 'Jhanvi';
  lastName: string = 'Dixit';
  gender: string = 'Male';
  email: string = 'jhanvi@mymail.com';
  mobileNumber: string = '9182198657';
  birthday: string = '1993-04-08'; // Format: YYYY-MM-DD

  isEditingFirstName: boolean = false;
  isEditingLastName: boolean = false;
  isEditingGender: boolean = false;
  isEditingEmail: boolean = false;
  isEditingMobileNumber: boolean = false;
  isEditingBirthday: boolean = false;

  // Diet Preferences
  dietPreferences: string[] = [];
  dietOptions: string[] = ['Vejeteryan', 'Vegan', 'Paleo', 'Keto', 'Helal', 'Koşer'];
  selectedDietPreferences: { [key: string]: boolean } = {};
  isDietModalOpen: boolean = false;

    // Alerjen Tercihler,
    alergenPreferences: string[] = [];
    alergenOptions: string[] = ['Süt Ürünleri', 'Glüten', 'Sarımsak', 'Soğan', 'Balık', 'Deniz Ürünleri', 'Mantar','Kuruyemiş'];
    selectedAlergenPreferences: { [key: string]: boolean } = {};
    isAlergenModalOpen: boolean = false;

  constructor() {}

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
  openAlergenModal() {
    this.isAlergenModalOpen = true;
    this.alergenOptions.forEach(option => {
      this.selectedAlergenPreferences[option] = this.alergenPreferences.includes(option);
    });
  }
  // Modal kapama
  closeDietModal() {
    this.isDietModalOpen = false;
  }
  closeAlergenModal() {
    this.isAlergenModalOpen = false;
  }

  // Diet tercihlerini kaydetme
  saveDietPreferences() {
    this.dietPreferences = Object.keys(this.selectedDietPreferences)
      .filter(option => this.selectedDietPreferences[option]);
    this.closeDietModal();
  }
  
  saveAlergenPreferences() {
    this.alergenPreferences = Object.keys(this.selectedAlergenPreferences)
      .filter(option => this.selectedAlergenPreferences[option]);
    this.closeDietModal();
  }


  // Diet tercihini kaldırma
  removeDietPreference(preference: string) {
    this.dietPreferences = this.dietPreferences.filter(item => item !== preference);
  }
  removeAlergenPreference(preference: string) {
    this.alergenPreferences = this.alergenPreferences.filter(item => item !== preference);
  }
  // Verileri API'ye göndererek kaydetme
  saveChanges() {
    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      email: this.email,
      mobileNumber: this.mobileNumber,
      birthday: this.birthday,
      dietPreferences: this.dietPreferences,
      alergenPreferences:this.alergenPreferences
    };

  }
}
