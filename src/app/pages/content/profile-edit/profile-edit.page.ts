import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit{
  firstName: string = 'Jhanvi';
  lastName: string = 'Dixit';
  gender: string = 'Male';
  email: string = 'jhanvi@mymail.com';
  mobileNumber: string = '9182198657';
  birthday: Date = new Date('1993-04-08');

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

  constructor(private userService: UserService) {}
  

  ngOnInit(): void {
    // this.userService.getCurrentUser().subscribe((user) => {
    //   console.log(user);
    // });
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
    };

  }
}
