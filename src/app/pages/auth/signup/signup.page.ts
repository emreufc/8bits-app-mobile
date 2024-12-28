import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/interfaces/all';

/**
 * SignupPage component handles the user signup functionality.
 */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  showPassword = false; // Indicates whether the password is visible or not.
  rePassword: string = ''; // Stores the re-entered password for confirmation.
  termsAccepted: boolean = false; // Indicates whether the user has accepted the terms and conditions.

  /**
   * Interface for user data structure.
   */


  // Kullanıcı verileri için User interface'ini kullanıyoruz
  userData: User = {
    name: '',
    surname: '',
    email: '',
    phoneNumber: '+90',
    password: '',
  };

  /**
   * Constructor for SignupPage.
   * @param alertController - Injects AlertController for displaying alerts.
   * @param authService - Handles authentication-related operations.
   */
  constructor(private alertController: AlertController, private authService: AuthService) {}

  ngOnInit() {}

  /**
   * Toggles the visibility of the password field.
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Ensures phone number starts with +90.
   */
  enforcePrefix(event: any): void {
    let val: string = event.target.value || '';
    if (!val.startsWith('+90 ')) {
      val = '+90 ' + val.replace(/^\+90\s*/, '');
    }
    this.userData.phoneNumber = val;
    event.target.value = this.userData.phoneNumber;
  }

  /**
   * Handles the signup process.
   * Validates the terms acceptance and password match.
   * Displays appropriate alerts if validation fails.
   */
  async onSignup() {
    if (!this.termsAccepted) {
      const alert = await this.alertController.create({
        header: 'Terms and Conditions',
        message: 'You must accept the terms and conditions to sign up.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (this.userData.password !== this.rePassword) {
      const alert = await this.alertController.create({
        header: 'Password Mismatch',
        message: 'Passwords do not match.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      const response = await this.authService.register(this.userData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
}
