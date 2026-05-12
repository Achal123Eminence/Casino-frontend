import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';

import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../../services/auth.service';
import { DatahandlerService } from '../../../services/datahandler.service';

@Component({
  selector: 'app-mother-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './mother-panel.component.html',
  styleUrl: './mother-panel.component.scss',
})
export class MotherPanelComponent implements OnInit {

  userForm!: FormGroup;

  users: any[] = [];

  motherPanelList: any[] = [];

  editId: string = '';

  constructor(
    private apiService: DatahandlerService
  ) {

    this.userForm = new FormGroup({

      user_id: new FormControl(
        '123456',
        [Validators.required]
      ),

      mother_panel: new FormControl(
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._]+$/)
        ]
      )

    });

  }

  ngOnInit(): void {

    this.fetchUsers();

    this.getMotherPanels();

  }

  // =============================
  // FETCH USERS
  // =============================

  fetchUsers() {

    this.apiService.getUsers().subscribe({

      next: (response: any) => {

        if (response && response.users) {

          this.users = response.users;

        }

      },

      error: (error: any) => {

        console.error('Error fetching users:', error);

      }

    });

  }

  // =============================
  // ADD / UPDATE
  // =============================

  onSubmit() {

    if (this.userForm.invalid) {

      this.userForm.markAllAsTouched();

      return;

    }

    const payload = this.userForm.value;


    // =============================
    // UPDATE
    // =============================

    if (this.editId) {

      this.apiService
        .updateMotherPanel(this.editId, payload)
        .subscribe({

          next: (response: any) => {

            this.showAlert1('Mother Panel Updated Successfully');

            this.userForm.reset();

            this.editId = '';

            this.getMotherPanels();

          },

          error: (error: any) => {

            console.error(error);

            this.showAlert2('Something went wrong');

          }

        });

    }

    // =============================
    // ADD
    // =============================

    else {

      this.apiService
        .addMotherPanel(payload)
        .subscribe({

          next: (response: any) => {

            this.showAlert1('Mother Panel Added Successfully');

            this.userForm.reset();

            this.getMotherPanels();

          },

          error: (error: any) => {

            console.error(error);

            this.showAlert2('Something went wrong');

          }

        });

    }

  }

  // =============================
  // GET ALL
  // =============================

  getMotherPanels() {

    this.apiService.getMotherPanels().subscribe({

      next: (response: any) => {

        if (response && response.data) {

          this.motherPanelList = response.data;

        }

      },

      error: (error: any) => {

        console.error(error);

      }

    });

  }

  // =============================
  // EDIT
  // =============================

  editMotherPanel(data: any) {

    this.editId = data._id;

    this.userForm.patchValue({

      user_id: data?.user_id?._id,

      mother_panel: data?.mother_panel

    });

  }

  // =============================
  // DELETE
  // =============================

  deleteMotherPanel(id: string) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this Mother Panel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {

      if (result.isConfirmed) {

        this.apiService
          .deleteMotherPanel(id)
          .subscribe({

            next: (response: any) => {

              this.showAlert1('Deleted Successfully');

              this.getMotherPanels();

            },

            error: (error: any) => {

              console.error(error);

              this.showAlert2('Delete Failed');

            }

          });

      }

    });

  }

  // =============================
  // CANCEL
  // =============================

  onCancel() {

    this.userForm.reset();

    this.editId = '';

  }

  // =============================
  // SUCCESS ALERT
  // =============================

  showAlert1(message: any) {

    const swalWithStyle = Swal.mixin({
      customClass: {
        popup: 'my-custom-popup',
      },
    });

    swalWithStyle.fire({
      width: 400,
      color: '#000',
      icon: 'success',
      title: message,
      timer: 1000,
      showConfirmButton: false
    });

  }

  // =============================
  // ERROR ALERT
  // =============================

  showAlert2(message: any) {

    const swalWithStyle = Swal.mixin({
      customClass: {
        popup: 'my-custom-popup',
      },
    });

    swalWithStyle.fire({
      width: 400,
      color: '#000',
      icon: 'error',
      title: message,
      timer: 1000,
      showConfirmButton: false
    });

  }

  // =============================
  // BLOCK SPECIAL CHARACTER
  // =============================

  blockSpecialChars(event: KeyboardEvent): void {

    const invalidChars = /[@#$%&*]/;

    if (invalidChars.test(event.key)) {

      event.preventDefault();

    }

  }

  // =============================
  // BLOCK PASTE
  // =============================

  blockPaste(event: ClipboardEvent): void {

    const clipboardData =
      event.clipboardData?.getData('text');

    if (/[@#$%&*]/.test(clipboardData || '')) {

      event.preventDefault();

    }

  }

}
