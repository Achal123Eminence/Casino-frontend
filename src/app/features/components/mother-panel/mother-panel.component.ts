import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatahandlerService } from '../../../services/datahandler.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mother-panel',
  imports: [CommonModule, ReactiveFormsModule, RouterModule,FormsModule],
  templateUrl: './mother-panel.component.html',
  styleUrl: './mother-panel.component.scss',
})
export class MotherPanelComponent {
 editForm:FormGroup
    searchText: string = '';
    filteredPanels:any

  motherPanelList: any[] = [];
  users:any
  usernameName: any;
  userObjId: any;
  loggedinId=localStorage.getItem("loggedInUserId")
  userData:any
    constructor(private apiService:DatahandlerService) {
      this.editForm = new FormGroup({
      user_id: new FormControl('', [Validators.required]),
      mother_panel: new FormControl('', [Validators.required])
    });
    }

    // You can also add methods to handle user actions, such as adding or deleting users.
    ngOnInit() {
      // Call the fetchUsers method when the component initializes
      this.getUserById()
      this.fetchUsers();
      this.fetchMotherPanel()
    }

      fetchMotherPanel() {
      this.apiService.getMotherPanelforuserandAdmin(this.loggedinId).subscribe(
        (response: any) => {
          console.log(response, 'response');
                      this.motherPanelList = response.data;
                      this.filteredPanels=response.data
        },
        (error: any) => {
          console.error('Error fetching users:', error);
        }
      );

    }


    openEdiTPop(item:any){
      this.usernameName=item.user_id.username
      this.userObjId=item._id
      this.editForm.patchValue({
        user_id:item.user_id.username,
        mother_panel: item.mother_panel
      })

    }

 editMotherPanel() {
  this.apiService.editMotherPanel(this.userObjId, this.editForm.value).subscribe({
    next: (res: any) => {
      console.log('Updated successfully:', res);
            this.showAlert1("Updated successfully")


      // // Close the modal
      const modalEl = document.getElementById('updateModel');
      if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl); // Get existing modal instance
        modal?.hide();
      }

      // Optional: Refresh data or emit event to parent
      this.fetchMotherPanel(); // Or whatever method reloads your data
    },
    error: (err: any) => {
      console.error('Error updating user:', err);
      // Optional: show error message
    }
  });
}



      fetchUsers() {
    this.apiService.getUsers().subscribe(
      (response: any) => {
        console.log(response, 'response');
        if (response && response.users) {
          this.users = response.users;
        } else {
          console.error('No users found in the response');
        }
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    );

  }

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
      });
      const customCss = `
        .swal2-popup.my-custom-popup {
          border: 5px solid green;
          border-radius: 10px;
        }
        .swal2-styled.swal2-confirm {
          background: green;
          border-color:green
      }
      `;
      const style = document.createElement('style');
      style.textContent = customCss;
      document.head.append(style);
    }

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
      });
      const customCss = `
        .swal2-popup.my-custom-popup {
          border: 5px solid red;
          border-radius: 10px;
        }
        .swal2-styled.swal2-confirm {
          background: red;
          border-color:red
      }
      `;
      const style = document.createElement('style');
      style.textContent = customCss;
      document.head.append(style);
    }


     filterData() {
    try {
      const regex = new RegExp(this.searchText, 'i'); // case-insensitive
      this.motherPanelList = this.filteredPanels.filter((panel:any) =>
        regex.test(panel.user_id.username) || regex.test(panel.mother_panel)
      );
    } catch (e) {
      // If invalid regex, show no results or all
      this.filteredPanels = [];
    }
  }



   getUserById(){
    // this.apiService.getUserByObjId(this.loggedinId).subscribe((res:any)=>{
    //   this.userData=res.users
    //   console.log(this.userData?.type,"userData?.type");



    // })
  }
}
