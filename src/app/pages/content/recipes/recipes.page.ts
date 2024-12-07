import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {console.log(this.route.snapshot.params['id']);
  }
  
}
