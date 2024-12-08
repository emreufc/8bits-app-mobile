import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  user = {
    name: "Jhanvi Dixit",
    surname: "Dixit",
    dateOfBirth: "1993-05-09",
  };
  constructor() { }

  ngOnInit() {
  }

}
