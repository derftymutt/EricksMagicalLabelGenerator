import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Company } from '../models/company';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companies: Company[] = [];
  private companiesUpdated = new Subject<Company[]>();

  constructor(private http: HttpClient) {}

  public getCompanies(): void {

    this.http.get<Company[]>('http://localhost:3000/api/companies').subscribe(companyData => {
      this.companies = companyData;
      this.companiesUpdated.next([...this.companies])
    });

  }

  public getCompaniesUpdatedListener() {
    return this.companiesUpdated.asObservable();
  }

  public addCompany() {
    const companyData: Company = {
      name: 'my first company post',
      address: 'some place special',
      id: 9889
    };

    this.http.post('http://localhost:3000/api/companies', companyData).subscribe(data => {
      console.log('post success', data);
    });
  }


}
