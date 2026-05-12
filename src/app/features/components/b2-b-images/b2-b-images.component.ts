import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-b2-b-images',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './b2-b-images.component.html',
  styleUrls: ['./b2-b-images.component.scss'],
})
export class B2BIMAGESComponent {
    activeTab = 'addImages';

    constructor(private router: Router){}

openMotherPanel() {
  this.activeTab = 'imagesList';
  // this.getImagesList();
}

 viewCategoryList() {

    this.router.navigate([
      '/mother-panel']);

  }
}
