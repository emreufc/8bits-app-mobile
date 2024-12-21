// profile-edit.page.ts
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
// Tamamen random bir api isteği gönderme kodu. Değişiklikleri Kaydet'e bastıktan sonra verilerin güncellenmesi için ihityaç var.
  saveChanges() {
    // const userData = {
    //   firstName: this.firstName,
    //   lastName: this.lastName,
    //   gender: this.gender,
    //   email: this.email,
    //   mobileNumber: this.mobileNumber,
    //   birthday: this.birthday,
    // };

    // this.http.post('https://api.example.com/update-profile', userData).subscribe({
    //   next: (response) => {
    //     console.log('Profile updated successfully', response);
    //     alert('Değişiklikler başarıyla kaydedildi.');
    //   },
    //   error: (error) => {
    //     console.error('Error updating profile', error);
    //     alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    //   },
    // });
  }
}
