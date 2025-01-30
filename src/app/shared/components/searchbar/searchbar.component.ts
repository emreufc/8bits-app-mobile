import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit {
  @Output() search = new EventEmitter<string>(); // Kullanıcı arama girdisini dışarı iletmek için
  private searchSubject = new Subject<string>(); // Debounce işlemi için Subject

  constructor() {}

  ngOnInit() {
    console.log('SearchbarComponent initialized');

    // Kullanıcı girdisi için debounce işlemi
    this.searchSubject.pipe(debounceTime(1000)).subscribe((keyword) => {
      this.search.emit(keyword); // Girdiyi üst bileşene ilet
    });
  }

  onSearchInput(event: any) {
    const keyword = event.target.value.trim(); // Kullanıcı girdisi
    this.searchSubject.next(keyword); // Subject'e girdiyi ilet
  }
}
