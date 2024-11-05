import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  user: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUser().then((res: any) => {
      this.user = res;
    })
  }

}
