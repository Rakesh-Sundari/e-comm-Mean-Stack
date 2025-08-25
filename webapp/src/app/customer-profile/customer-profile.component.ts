import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent {
  user: any = {
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    zip: '',
    state: '',
    country: '',
    telephone: '',
    email: '',
    profileImage: ''
  };
  get displayName() {
    return `${this.user?.firstName || ''} ${this.user?.lastName || ''}`.trim();
  }

  selectedImage: File | null = null;
  showImageModal: boolean = false;

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    // Try to populate from localStorage first
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObj = JSON.parse(userData);
      this.user = { ...this.user, ...userObj };
      if (userObj.profileImage) {
        this.user.profileImage = userObj.profileImage.startsWith('http') ? userObj.profileImage : environment.apiUrl + userObj.profileImage;
      }
    }
    // Always fetch latest from backend and update localStorage
    this.http.get(environment.apiUrl + '/profile').subscribe((res: any) => {
      this.user = { ...this.user, ...res };
      if (res.profileImage) {
        this.user.profileImage = res.profileImage.startsWith('http') ? res.profileImage : environment.apiUrl + res.profileImage;
      }
      localStorage.setItem('user', JSON.stringify(this.user));
    });
  }

  openImageModal() {
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
    this.selectedImage = null;
  }

  onImageSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];
    }
  }

  uploadImage(event: Event) {
    event.preventDefault();
    if (!this.selectedImage) return;

    const formData = new FormData();
    for (const key in this.user) {
      if (key !== 'profileImage') {
        formData.append(key, this.user[key]);
      }
    }
    formData.append('profileImage', this.selectedImage);

    this.authService.updateProfile(formData).subscribe((res: any) => {
      if (res.profileImage) {
        this.user.profileImage = environment.apiUrl + res.profileImage;
      }
      this.closeImageModal();
    });
  }

  saveProfile(event: Event) {
    event.preventDefault();
    this.authService.updateProfile(this.user).subscribe({
      next: (res: any) => {
        // Update local user object and localStorage
        this.user = { ...this.user, ...res };
        if (res.profileImage) {
          this.user.profileImage = res.profileImage.startsWith('http') ? res.profileImage : environment.apiUrl + res.profileImage;
        }
        localStorage.setItem('user', JSON.stringify(this.user));
        alert('Profile changes are updated');
      },
      error: () => {
        alert('Failed to update profile');
      }
    });
  }
}
