import { Component, NgZone, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { DatahandlerService } from '../../services/datahandler.service';
import { FingerprintService } from '../../services/fingerprint.service';
import Fingerprint2 from 'fingerprintjs2';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormArray,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { routes } from '../../shared/routes/routes';
import { ValidationDirective } from '../../shared/directives/validation.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ValidationDirective],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  routes = routes;

  captchaUrl: string = '';
  captchaInput = '';
  fingerprintHash = '';
  captchaLoaded = false;
  loggedData!: FormGroup;
  otpForm!: FormGroup;
  emailOtpForm!: FormGroup;
  whatsappOtpForm!: FormGroup;

  fingeruuid: any;
  loadingCaptchaFP: any;
  step: number = 1;
  tempUserData: any = null;
  isSubmittingLogin = false;

  userId: string | null = null;

  showGoogleSetupModalFlag = 'none';
  isGoogleVerification = false;
  isEmailVerification = false;
  isWhatsAppVerification = false;
  googleAuthQrCode: string | null = null;
  isgoogleQrCodeScanned: boolean = false;

  password: boolean[] = [false];

  constructor(
    private dataserve: DatahandlerService,
    private fingerprintService: FingerprintService,
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {
    // Login form
    this.loggedData = new FormGroup({
      userId: new FormControl(null, [Validators.required]),
      pass: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      validCode: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[A-HJ-NP-Z2-9]{6}$/i),
      ]),
      honeypot: new FormControl(''),
    });

    // Google OTP form
    this.otpForm = new FormGroup({
      otp: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
      ]),
    });

    // Email OTP form (6 digits)
    this.emailOtpForm = new FormGroup({
      digits: new FormArray(Array.from({ length: 6 }).map(() => new FormControl('', Validators.pattern(/^\d$/)))),
    });

    // WhatsApp OTP form (6 digits)
    this.whatsappOtpForm = new FormGroup({
      digits: new FormArray(Array.from({ length: 6 }).map(() => new FormControl('', Validators.pattern(/^\d$/)))),
    });
  }

  /**
   * ngAfterViewInit function.
   * @returns {*} Result.
   */
  ngAfterViewInit(): void {
    this.getFingerprintHash();
  }

  get emailOtpControls(): FormArray {
    return this.emailOtpForm.get('digits') as FormArray;
  }

  get whatsappOtpControls(): FormArray {
    return this.whatsappOtpForm.get('digits') as FormArray;
  }

  /**
   * getOtpControl function.
   * @param {*} index - Parameter.
   * @param {*} type - Parameter.
   * @returns {*} Result.
   */
  getOtpControl(index: number, type: 'whatsapp' | 'email' | 'google'): FormControl {
  if (type === 'whatsapp') {
    return this.whatsappOtpControls.at(index) as FormControl;
  }
 return this.emailOtpControls.at(index) as FormControl;
}


  /**
   * togglePassword function.
   * @param {*} index - Parameter.
   * @returns {*} Result.
   */
  togglePassword(index: number): void {
    this.password[index] = !this.password[index];
  }

  /**
   * getFingerprintHash function.
   * @returns {Promise<*>} Result.
   */
  async getFingerprintHash(): Promise<void> {
    Fingerprint2.get((components) => {
      const hash = Fingerprint2.x64hash128(
        components.map((c) => c.value).join(''),
        31
      );
      this.ngZone.run(() => {
        this.fingerprintHash = hash;
        this.loadingCaptchaFP = this.fingerprintHash;
        this.identify();
      });
    });
  }

  /**
   * loadCaptcha function.
   * @returns {*} Result.
   */
  loadCaptcha(): void {
    this.captchaLoaded = false;
    this.dataserve.getCaptcha(this.loadingCaptchaFP).subscribe((res: Blob) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.captchaUrl = reader.result as string;
        this.captchaLoaded = true;
      };
      reader.readAsDataURL(res);
    }, () => {
      this.captchaLoaded = false;
    });
  }

  /**
   * identify function.
   * @returns {*} Result.
   */
  identify(): void {
    this.fingerprintService.collect().then((comps) => {
      this.dataserve.generateFingerprint(comps).subscribe((res: any) => {
        if (res) {
          this.fingerprintHash = comps;
          this.fingeruuid = res?.uuid;
          this.loadCaptcha();
        }
      });
    });
  }

  /**
   * login function.
   * @returns {*} Result.
   */
  login(): void {
    this.sanitizeCaptchaInput();

    if (this.loggedData.invalid || this.isSubmittingLogin) {
      this.toastr.warning('All fields are required and captcha must be valid.', 'Warning');
      return;
    }

    this.isSubmittingLogin = true;

    const body = {
      userId: this.loggedData.value.userId,
      password: this.loggedData.value.pass,
      captchaInput: this.loggedData.value.validCode,
      fingerprintComponents: this.fingerprintHash,
      multiLogin: false,
      honeypot: this.loggedData.value.honeypot,
    };

    this.dataserve.validateLogin(body).subscribe({
      next: (res: any) => {
        const user = res.data.user;
        this.tempUserData = user;
        this.userId = user.uuid;
        this.isGoogleVerification = user.googleAuthVerification;
        this.isEmailVerification = user.emailVerification;
        this.isWhatsAppVerification = user.whatsAppVerification;
        this.googleAuthQrCode = user.googleAuthQrCode;
        this.isgoogleQrCodeScanned = user.isgoogleQrCodeScanned;

        // Decide which step to start with
        if (this.isGoogleVerification) {
          this.step = 2;
        } else if (this.isEmailVerification) {
          this.step = 3;
        } else if (this.isWhatsAppVerification) {
          this.step = 4;
        } else {
          this.finalLogin(res.message);
        }
        this.isSubmittingLogin = false;
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Login failed', 'Error');
        this.loggedData.get('validCode')?.reset();
        this.loadCaptcha();
        this.isSubmittingLogin = false;
      },
    });

    this.loggedData.patchValue({
      validCode: '',
      honeypot: '',
    });
  }

  /**
   * sanitizeCaptchaInput function.
   * @returns {void} Result.
   */
  sanitizeCaptchaInput(): void {
    const currentValue = this.loggedData.get('validCode')?.value || '';
    const normalizedValue = String(currentValue)
      .toUpperCase()
      .replace(/[^A-HJ-NP-Z2-9]/g, '')
      .slice(0, 6);

    this.loggedData.get('validCode')?.setValue(normalizedValue, { emitEvent: false });
  }

  // OTP verification
  /**
   * verifyOtp function.
   * @returns {*} Result.
   */
  verifyOtp(): void {
    let otp = '';
    let channel = '';

    if (this.step === 2 && this.isGoogleVerification) {
      otp = this.otpForm.value.otp;
      channel = 'google';
    } else if (this.step === 3 && this.isEmailVerification) {
      otp = this.emailOtpControls.value.join('');
      channel = 'email';
    } else if (this.step === 4 && this.isWhatsAppVerification) {
      otp = this.whatsappOtpControls.value.join('');
      channel = 'whatsapp';
    }

    if (!otp || otp.length !== 6) {
      this.toastr.warning('Please enter a valid 6-digit OTP', 'Warning');
      return;
    }

    const payload = {
      userId: this.userId,
      otp: otp,
      channel: channel,
      fingerprintComponents: this.fingerprintHash,
    };

    this.authService.otpVeify(payload).subscribe({
      next: (res: any) => {
        if (this.step === 2 && this.isEmailVerification) {
          this.step = 3;
        } else if (
          (this.step === 2 && !this.isEmailVerification && this.isWhatsAppVerification) ||
          (this.step === 3 && this.isWhatsAppVerification)
        ) {
          this.step = 4;
        } else {
          this.finalLogin(res.message);
        }
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'OTP verification failed', 'Error');
      },
    });
  }

  /**
   * finalLogin function.
   * @param {*} message - Parameter.
   * @returns {*} Result.
   */
  private async finalLogin(message: string): Promise<void> {
    // this.authService.login(this.tempUserData);
    await this.authService.loadUserFromApi();
    this.toastr.success(message, 'Success');
    this.router.navigate(['/index']);
  }

  /**
   * onOtpInput function.
   * @param {*} event - Parameter.
   * @param {*} index - Parameter.
   * @param {*} channel - Parameter.
   * @returns {*} Result.
   */
  onOtpInput(event: any, index: number, channel: 'email' | 'whatsapp'): void {
    const input = event.target as HTMLInputElement;
    const nextInput = input.nextElementSibling as HTMLInputElement;
    if (input.value && nextInput) {
      nextInput.focus();
    }
  }

  /**
   * onOtpKeydown function.
   * @param {*} event - Parameter.
   * @param {*} index - Parameter.
   * @param {*} channel - Parameter.
   * @returns {*} Result.
   */
  onOtpKeydown(event: KeyboardEvent, index: number, channel: 'email' | 'whatsapp'): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value) {
      const prevInput = input.previousElementSibling as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  /**
   * onlyDigits function.
   * @param {*} event - Parameter.
   * @returns {*} Result.
   */
  onlyDigits(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  /**
   * showGoogleModal function.
   * @returns {*} Result.
   */
  showGoogleModal(): void {
    this.showGoogleSetupModalFlag = 'block';
  }

  /**
   * hideGoogleModal function.
   * @returns {*} Result.
   */
  hideGoogleModal(): void {
    this.showGoogleSetupModalFlag = 'none';
  }
  /**
   * numberOnly function.
   * @param {*} event - Parameter.
   * @returns {*} Result.
   */
  numberOnly(event: any): any {
    var regex = new RegExp("^[0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }

  /**
   * otpVerification function.
   * @returns {*} Result.
   */
  otpVerification(): void {
    if (this.otpForm.valid) {
      const otpBody = {
        googleOtp: this.otpForm.value.otp.toString(),
        userId: this.userId
      };
      this.authService.otpVeify(otpBody).subscribe({
        next: (res: any) => {
          this.authService.login(this.tempUserData); this.router.navigate(['/index']);
          this.toastr.success(res.message, 'Success');
        }, error: (err) => { this.toastr.error(err?.error?.message, 'Error'); }
      });
    } else { this.toastr.warning('Enter a valid 6-digit OTP', 'Warning'); }
  }
}
