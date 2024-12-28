import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = ''; // Kullanıcıdan alınan email
  password: string = ''; // Kullanıcıdan alınan şifre

  showPassword: boolean = false; // Şifreyi gizleme/gösterme kontrolü
  errorMessage: string = ''; // Login hataları için mesaj

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  // Şifreyi görünür yapmak için toggle fonksiyonu
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Login butonuna tıklandığında çağrılan fonksiyon
  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    // AuthService'in login metodunu çağırarak API'ye veri gönderiyoruz
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        if (response && response.success) {
          // Giriş başarılıysa bir sonraki sayfaya yönlendiriyoruz
          this.router.navigate(['/content']);
        } else {
          // Başarısız yanıt durumunda hata mesajı
          this.errorMessage = response.message || 'Invalid credentials. Please try again.';
        }
      },
      error: (err) => {
        // Hata durumunda hata mesajını yakalıyoruz
        this.errorMessage = 'An error occurred during login. Please try again later.';
      }
    });
  }
}
