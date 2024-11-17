import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
    // Any initialization logic can go here
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    // Here you would typically load different data based on the selected segment
    console.log('Segment changed to:', this.selectedSegment);
  }

  editProfile() {
    // Implement the logic to navigate to the edit profile page or open a modal
    console.log('Edit profile clicked');
  }

  openNotifications() {
    // Implement the logic to open notifications
    console.log('Notifications clicked');
  }

  // You can add more methods here for handling other interactions
  // For example, methods for handling tab changes, viewing recipe details, etc.
}