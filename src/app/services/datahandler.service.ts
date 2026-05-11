import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DatahandlerService {
  baseUrl = environment.baseUrl;

  /**
   * constructor function.
   * @param {*} http - Parameter.
   * @param {*} router - Parameter.
   * @returns {*} Result.
   */
  constructor(private http: HttpClient, private router: Router) { }

  /**
   * ngOnInit function.
   * @returns {*} Result.
   */
  ngOnInit(): void {

  }
  /**
   * getCaptcha function.
   * @param {*} fingerPrintHash - Parameter.
   * @returns {*} Result.
   */
  getCaptcha(fingerPrintHash: string,): Observable<Blob> {
    const url = `${this.baseUrl}/captcha/generate?fingerprint=${fingerPrintHash}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  // getCaptcha(fingerPrintHash: string,): Observable<Blob> {
  //   const url = `${this.baseUrl}/auth/generate-captcha?fingerprint=${fingerPrintHash}`;
  //   return this.http.get(url, { responseType: 'blob' });
  // }

  /**
   * validateLogin function.
   * @param {*} obj - Parameter.
   * @returns {*} Result.
   */
  validateLogin(obj: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, { ...obj })
  }

  /**
   * generateFingerprint function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  generateFingerprint(data: any) {
    return this.http.post(`${this.baseUrl}/fingerprint/generate`, { components: data })
  }

  /**
   * logout function.
   * @returns {*} Result.
   */
  logout() {
    return this.http.post(`${this.baseUrl}/auth/logout`, {});
  }

  /**
   * getDownlineUser function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  getDownlineUser(data: any) {
    return this.http.get(`${this.baseUrl}/user/list`, { params: data })
  }

  /**
   * getUserDetail function.
   * @param {*} userId - Parameter.
   * @returns {*} Result.
   */
  getUserDetail(userId?: string) {
    if (userId) {
      return this.http.get(`${this.baseUrl}/user/detail`, { params: { userId } });
    }
    return this.http.get(`${this.baseUrl}/user/detail`);
  }

  /**
   * getUserActivityLogs function.
   * @param {*} params - Parameter.
   * @returns {*} Result.
   */
  getUserActivityLogs(params: any) {
    return this.http.get(`${this.baseUrl}/user/activity-logs`, { params });
  }

  /**
   * getUserPermissionLogs function.
   * @param {*} params - Parameter.
   * @returns {*} Result.
   */
  getUserPermissionLogs(params: any) {
    return this.http.get(`${this.baseUrl}/user/permission-logs`, { params });
  }

  /**
   * getDownlineUserForPermission function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  getDownlineUserForPermission(data: any) {
    return this.http.get(`${this.baseUrl}/user/list`, { params: data })
  }

  /**
   * getAgentList function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  getAgentList(data: any) {
    return this.http.get(`${this.baseUrl}/user/agent-list`, { params: data })
  }

  /**
   * updatePemissions function.
   * @param {*} obj - Parameter.
   * @returns {*} Result.
   */
  updatePemissions(obj: any) {
    return this.http.put(`${this.baseUrl}/user/update-permission`, { ...obj })
  }

  /**
   * getUserLevels function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  getUserLevels(data: any) {
    return this.http.get(`${this.baseUrl}/user-level/list`, { params: data })
  }

  /**
   * getFormByLevel function.
   * @param {*} userLevelUuid - Parameter.
   * @returns {*} Result.
   */
  getFormByLevel(userLevelUuid: string) {
    return this.http.get(`${this.baseUrl}/user-level-form-fields/get/${userLevelUuid}`);
  }

  /**
   * createUserLevel function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  createUserLevel(payload: any) {
    return this.http.post(`${this.baseUrl}/user-level/create`, payload);
  }

  /**
   * createUser function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  createUser(payload: any) {
    return this.http.post(`${this.baseUrl}/user/create`, payload);
  }

  /**
   * updateUser function.
   * @param {*} uuid - Parameter.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateUser(uuid: string, payload: any) {
    return this.http.put(`${this.baseUrl}/user/${uuid}`, payload);
  }

  /**
   * createFormFields function.
   * @param {*} obj - Parameter.
   * @returns {*} Result.
   */
  createFormFields(obj: any) {
    return this.http.post(`${this.baseUrl}/form-fields/create`, { ...obj })
  }

  /**
   * getFormFields function.
   * @param {*} params - Parameter.
   * @returns {*} Result.
   */
  getFormFields = (params?: any) => {
    return this.http.get(`${this.baseUrl}/form-fields/list`, { params });
  }

  /**
   * updateFormFields function.
   * @param {*} uuid - Parameter.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateFormFields = (uuid: string, payload: any) => {
    return this.http.put(`${this.baseUrl}/form-fields/edit/${uuid}`, payload);
  }

  /**
   * updateFormFieldStatus function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateFormFieldStatus = (payload: any) => {
    return this.http.post(`${this.baseUrl}/form-fields/update-status`, payload);
  }

  /**
   * updateDefaultLevelFormFields function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateDefaultLevelFormFields(payload: any) {
    return this.http.post(`${this.baseUrl}/user-level-form-fields/create`, payload);
  }

  /**
   * getModulesWithSubmodules function.
   * @param {*} params - Parameter.
   * @returns {*} Result.
   */
  getModulesWithSubmodules = (params?: any) => {
    return this.http.get(`${this.baseUrl}/module/list`, { params });
  }

  /**
   * getModules function.
   * @param {*} params - Parameter.
   * @returns {*} Result.
   */
  getModules = (params?: any) => {
    return this.http.get(`${this.baseUrl}/module/list-all`, { params });
  }

  /**
   * addModule function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  addModule = (payload: any) => {
    return this.http.post(`${this.baseUrl}/module/create`, payload);
  }

  updateModule = (payload: any, moduleId: string) => {
    return this.http.put(`${this.baseUrl}/module/update/${moduleId}`, payload);
  };

  /**
   * getRoles function.
   * @param {*} params - Parameter.
   * @returns {*} Result.
   */
  getRoles = (params?: any) => {
    return this.http.get(`${this.baseUrl}/role/list`, { params });
  }

  /**
   * createRole function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  createRole = (payload: any) => {
    return this.http.post(`${this.baseUrl}/role/create`, payload);
  }

  /**
   * updateRole function.
   * @param {*} uuid - Parameter.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateRole = (uuid: string, payload: any) => {
    return this.http.put(`${this.baseUrl}/role/${uuid}`, payload);
  }

  /**
   * updateRolePermissions function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateRolePermissions = (payload: any) => {
    return this.http.post(`${this.baseUrl}/role/update-permission-level `, payload);
  }

  /**
   * createManagementUser function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  createManagementUser = (payload: any) => {
    return this.http.post(`${this.baseUrl}/user/management-create`, payload);
  }

  /**
   * updateUserLevel function.
   * @param {*} uuid - Parameter.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateUserLevel = (uuid: string, payload: any) => {
    return this.http.put(`${this.baseUrl}/user-level/${uuid}`, payload);
  }

  /**
   * getRoleAndPermission function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  getRoleAndPermission = (data: any) => {
    return this.http.post(`${this.baseUrl}/role/getRoleAndPermission`, data);
  }

  /**
   * getManagementUsersByRole function.
   * @param {*} params - Parameter.
   * @returns {*} Result.
   */
  getManagementUsersByRole = (params?: any) => {
    return this.http.post(`${this.baseUrl}/user/users-by-role`, params);
  }
  /**
   * updateRoleUser function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateRoleUser = (payload?: any) => {
    return this.http.post(`${this.baseUrl}/user/update-role-user`, payload);
  }

  /**
   * getLanguages function.
   * @param {*} params - Parameter.
   * @returns {*} Result.
   */
  getLanguages = (params?: any) => {
    return this.http.get(`${this.baseUrl}/language/list`, { params });
  }

  /**
   * createLanguage function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  createLanguage = (payload: any) => {
    return this.http.post(`${this.baseUrl}/language/create`, payload);
  }

  /**
   * updateLanguage function.
   * @param {*} uuid - Parameter.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateLanguage = (uuid: string, payload: any) => {
    return this.http.put(`${this.baseUrl}/language/update/${uuid}`, payload);
  }

  /**
   * updateLanguageStatus function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateLanguageStatus = (payload: any) => {
    return this.http.post(`${this.baseUrl}/language/update-status`, payload);
  }

  /**
   * getCountries function.
   * @param {*} params - Parameter.
   * @returns {*} Result.
   */
  getCountries = (params?: any) => {
    return this.http.get(`${this.baseUrl}/country/list`, { params });
  }

  /**
   * getAvailableCountries function.
   * @returns {*} Result.
   */
  getAvailableCountries = () => {
    return this.http.get(`${this.baseUrl}/country/available`);
  }

  /**
   * createCountry function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  createCountry = (payload: any) => {
    return this.http.post(`${this.baseUrl}/country/create`, payload);
  }

  /**
   * updateCountry function.
   * @param {*} uuid - Parameter.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateCountry = (uuid: string, payload: any) => {
    return this.http.put(`${this.baseUrl}/country/update/${uuid}`, payload);
  }

  /**
   * updateCountryStatus function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateCountryStatus = (payload: any) => {
    return this.http.post(`${this.baseUrl}/country/update-status`, payload);
  }

  /**
   * uploadImage function – uploads a single file (legacy), returns public URL.
   * @param file - File to upload.
   * @param folder - Optional folder prefix (default: 'country').
   * @returns Observable with { success, url }.
   */
  uploadImage = (file: File, folder = 'country') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return this.http.post<{ success: boolean; url: string }>(`${this.baseUrl}/upload`, formData);
  }

  /**
   * uploadCountryImages – uploads flag and/or jersey in one request.
   * @param flag - Optional flag image file.
   * @param jersey - Optional jersey image file.
   * @returns Observable with { success, flagUrl?, jerseyUrl? }.
   */
  uploadCountryImages = (flag?: File | null, jersey?: File | null) => {
    const formData = new FormData();
    if (flag) formData.append('flag', flag);
    if (jersey) formData.append('jersey', jersey);
    return this.http.post<{ success: boolean; flagUrl?: string; jerseyUrl?: string }>(
      `${this.baseUrl}/upload`,
      formData
    );
  }

  /**
   * uploadWebsiteGuideImage function.
   * @param {*} file - Parameter.
   * @param {*} folder - Parameter.
   * @returns {*} Result.
   */
  uploadWebsiteGuideImage = (file: File, folder = 'website-guide/images') => {
    const formData = new FormData();
    formData.append('guideImage', file);
    formData.append('folder', folder);
    return this.http.post<{ success: boolean; imageUrl?: string; imagePathname?: string }>(
      `${this.baseUrl}/upload`,
      formData
    );
  };

  /**
   * uploadWebsiteGuideDoc function.
   * @param {*} file - Parameter.
   * @param {*} folder - Parameter.
   * @returns {*} Result.
   */
  uploadWebsiteGuideDoc = (file: File, folder = 'website-guide/docs') => {
    const formData = new FormData();
    formData.append('guideDoc', file);
    formData.append('folder', folder);
    return this.http.post<{ success: boolean; docPathname?: string; docUrl?: string }>(
      `${this.baseUrl}/upload`,
      formData
    );
  };

  /**
   * getCurrencies function.
   * @param {*} params - Parameter.
   * @returns {*} Result.
   */
  getCurrencies = (params?: any) => {
    return this.http.get(`${this.baseUrl}/currency/list`, { params });
  }

  /**
   * createCurrency function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  createCurrency = (payload: any) => {
    return this.http.post(`${this.baseUrl}/currency/create`, payload);
  }

  /**
   * updateCurrency function.
   * @param {*} uuid - Parameter.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateCurrency = (uuid: string, payload: any) => {
    return this.http.put(`${this.baseUrl}/currency/update/${uuid}`, payload);
  }

  /**
   * updateCurrencyStatus function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateCurrencyStatus = (payload: any) => {
    return this.http.post(`${this.baseUrl}/currency/update-status`, payload);
  }

  /**
   * getSportTypes function.
   * @returns {*} Result.
   */
  getSportTypes = () => {
    return this.http.get(`${this.baseUrl}/sport/types`);
  }

  /**
   * getReservedSports function.
   * @returns {*} Result.
   */
  getReservedSports = () => {
    return this.http.get(`${this.baseUrl}/sport/reserved`);
  }

  /**
   * getSports function.
   * @param {*} params - Parameter.
   * @returns {*} Result.
   */
  getSports = (params?: any) => {
    return this.http.get(`${this.baseUrl}/sport/list`, { params });
  }

  /**
   * createSport function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  createSport = (payload: any) => {
    return this.http.post(`${this.baseUrl}/sport/create`, payload);
  }

  /**
   * updateSport function.
   * @param {*} uuid - Parameter.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateSport = (uuid: string, payload: any) => {
    return this.http.put(`${this.baseUrl}/sport/update/${uuid}`, payload);
  }

  /**
   * updateSportStatus function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateSportStatus = (payload: any) => {
    return this.http.post(`${this.baseUrl}/sport/update-status`, payload);
  }

  /**
   * changeUserPassword function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  changeUserPassword = (data: any) => {
    const url = `${this.baseUrl}/user/change-user-password`;
    return this.http.post(url, data);
  };

  /**
   * changePassword function.
   * @param {*} data - Parameter.
   * @returns {*} Result.
   */
  changePassword = (data: any) => {
    const url = `${this.baseUrl}/user/change-password`;
    return this.http.post(url, data);
  };

  addCategory = (data: any) => {
    const url = `${this.baseUrl}/module-category/create`;
    return this.http.post(url, data);
  };

  updateCategory = (data: any) => {
    const url = `${this.baseUrl}/module-category/update`;
    return this.http.put(url, data);
  };

  updateModuleStatus = (data: any) => {
    const url = `${this.baseUrl}/module/update-status`;
    return this.http.post(url, data);
  };

  getCategory = () => {
    const url = `${this.baseUrl}/module-category/list-all`;
    return this.http.get(url);
  };

  /**
   * setupMyCtfcModuleCategory function.
   * @returns {*} Result.
   */
  setupMyCtfcModuleCategory = () => {
    return this.http.post(`${this.baseUrl}/module-category/setup-my-ctfc`, {});
  };

  /**
   * getWebsiteGuideCategories function.
   * @param {*} params - Parameter.
   * @returns {*} Result.
   */
  getWebsiteGuideCategories = (params?: any) => {
    return this.http.get(`${this.baseUrl}/website-guide-category/list`, { params });
  };

  /**
   * createWebsiteGuideCategory function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  createWebsiteGuideCategory = (payload: any) => {
    return this.http.post(`${this.baseUrl}/website-guide-category/create`, payload);
  };

  /**
   * updateWebsiteGuideCategory function.
   * @param {*} uuid - Parameter.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateWebsiteGuideCategory = (uuid: string, payload: any) => {
    return this.http.put(`${this.baseUrl}/website-guide-category/update/${uuid}`, payload);
  };

  /**
   * updateWebsiteGuideCategoryStatus function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updateWebsiteGuideCategoryStatus = (payload: any) => {
    return this.http.post(`${this.baseUrl}/website-guide-category/update-status`, payload);
  };

  /**
   * getPageMediaList function.
   * @param {*} params - Parameter.
   * @returns {*} Result.
   */
  getPageMediaList = (params?: any) => {
    return this.http.get(`${this.baseUrl}/page-media/list`, { params });
  };

  /**
   * createPageMedia function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  createPageMedia = (payload: any) => {
    return this.http.post(`${this.baseUrl}/page-media/create`, payload);
  };

  /**
   * updatePageMedia function.
   * @param {*} uuid - Parameter.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updatePageMedia = (uuid: string, payload: any) => {
    return this.http.put(`${this.baseUrl}/page-media/update/${uuid}`, payload);
  };

  /**
   * updatePageMediaAutoPlay function.
   * @param {*} payload - Parameter.
   * @returns {*} Result.
   */
  updatePageMediaAutoPlay = (payload: any) => {
    return this.http.post(`${this.baseUrl}/page-media/update-autoplay`, payload);
  };

}
