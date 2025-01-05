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
    surname: '',
    imageUrl: '',
  };

  userInitial: string = '?'; 
  userColor: string = '#95A5A6';
  userName: string = 'Kullanıcı Adı';
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadUser();
  }

  async loadUser() {
    try {
        this.user= await this.authService.getUser(); // API çağrısı
        this.userName = this.user.name + ' ' + this.user.surname;
        this.userInitial = this.getUserInitial(this.user.name);
        this.userColor = this.getColorByInitial(this.userInitial);  
        console.log('Kullanıcı başarıyla yüklendi:', this.user);
    } catch (error) {
        console.error('Kullanıcı yüklenirken hata oluştu:', error);
    }
}

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

}
