import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
<<<<<<< HEAD
import { UserRegister } from 'src/app/core/interfaces/user';
import { Router } from '@angular/router';
=======
import { User } from 'src/app/core/models/user';
import { lastValueFrom } from 'rxjs';
>>>>>>> 49eae7d37ef5eaf2d6813698dff54ee1974b8c8e

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
<<<<<<< HEAD
  constructor(private alertController: AlertController, private authService: AuthService, private router: Router
  ) {}
=======
  constructor(private alertController: AlertController, private authService: AuthService, private navController: NavController) {}
>>>>>>> 49eae7d37ef5eaf2d6813698dff54ee1974b8c8e

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
   * Kayıt olma işlemini gerçekleştirir.
   * Kullanıcının şartları kabul edip etmediğini ve şifrelerin eşleşip eşleşmediğini kontrol eder.
   * Doğrulama başarısız olursa uygun uyarılar gösterir.
   */
  async onSignup() {
    // Kullanıcı şartları kabul etmemişse uyarı göster
    if (!this.termsAccepted) {
      const alert = await this.alertController.create({
<<<<<<< HEAD
        header: 'Kullanım Şartları',
        message: 'Kayıt olmak için kullanım şartlarını kabul etmelisiniz.',
=======
        header: 'Şartlar ve Koşullar',
        message: 'Kayıt olmak için şartlar ve koşulları kabul etmelisiniz.',
>>>>>>> 49eae7d37ef5eaf2d6813698dff54ee1974b8c8e
        buttons: ['Tamam'],
      });
      await alert.present();
      return;
    }
<<<<<<< HEAD
  
    if (this.userData.password !== this.rePassword) {
      const alert = await this.alertController.create({
        header: 'Şifre Uyuşmazlığı',
        message: 'Girdiğiniz şifreler birbiriyle uyuşmuyor.',
=======

    // Şifreler eşleşmiyorsa uyarı göster
    if (this.userData.password !== this.rePassword) {
      const alert = await this.alertController.create({
        header: 'Şifre Uyuşmazlığı',
        message: 'Şifreler uyuşmuyor.',
>>>>>>> 49eae7d37ef5eaf2d6813698dff54ee1974b8c8e
        buttons: ['Tamam'],
      });
      await alert.present();
      return;
    }
<<<<<<< HEAD
  
=======

    // Kayıt olma işlemini gerçekleştir
>>>>>>> 49eae7d37ef5eaf2d6813698dff54ee1974b8c8e
    try {
      const response: any = await lastValueFrom(this.authService.register(this.userData));
      // Kayıt başarılıysa uyarı göster
      const alert = await this.alertController.create({
      header: 'Kayıt Başarılı',
      message: 'Hesabınız başarıyla oluşturuldu.',
      buttons: ['Tamam'],
      });
      await alert.present();
      console.log(response);
<<<<<<< HEAD
      const alert = await this.alertController.create({
        header: 'Başarılı',
        message: 'Kayıt işleminiz başarıyla tamamlandı!',
        buttons: ['Tamam'],
      });
      await alert.present();
      await alert.onDidDismiss(); // Alert kapandıktan sonra yönlendirme yap
      this.router.navigate(['/auth/login']); // Kayıt başarılı ise yönlendirme yap
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Hata',
        message: 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        buttons: ['Tamam'],
      });
      await alert.present();
=======
      // Başarılı kayıt sonrası giriş sayfasına yönlendir
      this.navController.navigateRoot('auth/login');
    } catch (error: any) {
>>>>>>> 49eae7d37ef5eaf2d6813698dff54ee1974b8c8e
      console.error(error);
      // Kayıt başarısızsa uyarı göster
      const alert = await this.alertController.create({
      header: 'Kayıt Başarısız',
      message: 'Hesabınız oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
      buttons: ['Tamam'],
      });
      await alert.present();
    }
  }
  
}
