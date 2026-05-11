/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';

import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { routes } from '../../../../shared/routes/routes';
import { LightgalleryModule } from 'lightgallery/angular';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-ui-lightbox',
    templateUrl: './ui-lightbox.component.html',
    styleUrl: './ui-lightbox.component.scss',
    imports: [LightgalleryModule,LightboxModule,RouterLink]
})
export class UiLightboxComponent {
  public routes = routes;
  public albumsOne: any = [];
  public albumsTwo: any = [];

  /**
   * constructor function.
   * @param {*} _lightbox - Parameter.
   * @returns {*} Result.
   */
  constructor(private _lightbox: Lightbox) {
    for (let i = 1; i <= 5; i++) {
      const src = 'assets/img/media/img-0' + i + '.jpg';
      const caption = 'Image ' + i + ' caption here';

      this.albumsOne.push({ src: src });
      this.albumsTwo.push({ src: src, caption: caption });
    }
  }

  /**
   * open function.
   * @param {*} index - Parameter.
   * @param {*} albumArray - Parameter.
   * @returns {*} Result.
   */
  open(index: number, albumArray: Array<any>): void {
    this._lightbox.open(albumArray, index);
  }

  /**
   * close function.
   * @returns {*} Result.
   */
  close(): void {
    this._lightbox.close();
  }
}
