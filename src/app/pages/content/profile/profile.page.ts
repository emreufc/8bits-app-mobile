import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Recipe {
  id: number;
  title: string;
  image: string;
  rating: number;
  duration: string;
  views: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public userName: string = 'Name - Surname';
  public userLocation: string = 'New York, USA';
  public selectedSegment: string = 'old-recipes';
  public recipes: Recipe[] = [
    {
      id: 1,
      title: 'Vegetable Noodle',
      image: 'assets/vegetable-noodle.jpg',
      rating: 4.3,
      duration: '20 min',
      views: '2.3k'
    },
    {
      id: 2,
      title: 'Seafood Fried Rice',
      image: 'assets/seafood-fried-rice.jpg',
      rating: 4.8,
      duration: '15 min',
      views: '4.4k'
    }
  ];

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  editProfile() {
    this.router.navigate(['/content/profile-edit']);
  }

  openNotifications() {
    console.log('Notifications clicked');
  }

}