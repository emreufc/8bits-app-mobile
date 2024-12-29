import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
  });

  public showpassword = false;
  public remember = false;
  public loading = false;
  public loginError = false;

  // This property controls whether the password is shown or hidden
  showPassword: boolean = false;

  // This method toggles the value of showPassword, which controls the input type
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.required],
    });
  }

  login() {
    console.log('loginForm', this.loginForm.value);
    // if (this.loading || this.loginForm.invalid) {
    //   return;
    // }

    this.loading = true;
    this.loginError = false;

    this.authService.login({
      email: this.loginForm.value.email as string,
      password: this.loginForm.value.password as string,
    }).subscribe(() => {
      this.navCtrl.navigateRoot('/content/home');
      this.loading = false;
    }, (error) => {
      console.log('error', error);
      this.loginError = true;
      this.loading = false;
    });
  }

  loginWith(type: string) {
    this.loading = true;

    if (type === 'google') {
      this.authService.loginWithGoogle().then((value: any) => {
        if (value.status) {
          if (value.isNewUser) {
            this.navCtrl.navigateRoot('/content/health-form');
          } else {
            this.navCtrl.navigateRoot('/content/home');
          }
        }
      });
    } else if (type === 'facebook') {
      this.authService.loginWithFacebook().then((value: any) => {
        if (value.status) {
          if (value.isNewUser) {
            this.navCtrl.navigateRoot('/content/health-form');
          } else {
            this.navCtrl.navigateRoot('/content/home');
          }
        }
      });
    }
  }
}
