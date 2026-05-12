// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-add-website-b2b',
// imports: [
//     CommonModule,
//     ReactiveFormsModule
//   ],
//   templateUrl: './add-website-b2b.component.html',
//   styleUrl: './add-website-b2b.component.scss',
// })
// export class AddWebsiteB2bComponent {

// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-add-website',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule
//   ],
//  templateUrl: './add-website-b2b.component.html',
//   styleUrl: './add-website-b2b.component.scss',
// })
@Component({
  selector: 'app-add-website-b2b',
imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-website-b2b.component.html',
  styleUrl: './add-website-b2b.component.scss',
})
export class AddWebsiteB2bComponent implements OnInit {

  userName: string = 'rezul';

  websiteForm!: FormGroup;

  websiteLogo: any;
  wLoginImage: any;
  mLoginImage: any;
  favIcon: any;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {

    this.websiteForm = this.fb.group({

      panel_id: ['Bets3.in'],

      website_name: [''],

      website_url: [''],

      refresh_endpoint: [''],

      wLogoVariant: [''],

      wLoginVariant: [''],

      mLoginVariant: ['']

    });

  }

  // =========================================
  // FILE CHANGE
  // =========================================

  onFileChange(event: any, type: string): void {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (type === 'website_logo') {
      this.websiteLogo = file;
    }

    if (type === 'wLoginImageFile') {
      this.wLoginImage = file;
    }

    if (type === 'mLoginImageFile') {
      this.mLoginImage = file;
    }

    if (type === 'favImageFile') {
      this.favIcon = file;
    }

    console.log(type, file);

  }

  // =========================================
  // SAVE
  // =========================================

  saveWebsite(): void {

    const formData = {
      ...this.websiteForm.value,
      websiteLogo: this.websiteLogo,
      wLoginImage: this.wLoginImage,
      mLoginImage: this.mLoginImage,
      favIcon: this.favIcon
    };

    console.log('FORM DATA => ', formData);

    alert('Website Saved Successfully');

  }

}
