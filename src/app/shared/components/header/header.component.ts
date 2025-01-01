import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  user: User = {
    name: '',
    surname: ''
  };
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadUser();
  }

  async loadUser() {
    try {
        this.user= await this.authService.getUser(); // API çağrısı
        console.log('Kullanıcı başarıyla yüklendi:', this.user);
    } catch (error) {
        console.error('Kullanıcı yüklenirken hata oluştu:', error);
    }
}

}
