import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Company } from '../models/company';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/companies';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companies: Company[] = [];
  private companiesUpdated = new Subject<Company[]>();

  constructor(private http: HttpClient) { }

  public getCompanies(): void {
    this.http.get<any>(BACKEND_URL)
      .pipe(map((companyData) => {
        return companyData.map(company => {
          return {
            name: company.name,
            address: company.address,
            id: company._id
          };
        });
      }))
      .subscribe(companies => {
        this.companies = companies;
        this.companiesUpdated.next([...this.companies]);
      });
  }

  public getCompaniesUpdatedListener() {
    return this.companiesUpdated.asObservable();
  }

  public getCompany(id: string): Company {
    return { ...this.companies.find(company => company.id === id) };
  }

  public addCompany(company: Company) {
    this.http.post<{ companyId: string }>(BACKEND_URL, company).subscribe(result => {
      company.id = result.companyId;
      this.companies.push(company);
      this.companiesUpdated.next([...this.companies]);
      console.log('post success, new companies array', this.companies);
    });
  }

  public updateCompany(company: Company) {
    this.http.put(`${BACKEND_URL}/${company.id}`, company).subscribe(result => {
      const updatedCompanies = [...this.companies];
      const oldCompanyIndex = updatedCompanies.findIndex(c => c.id === company.id);
      if (oldCompanyIndex > -1) {
        updatedCompanies[oldCompanyIndex] = company;
        this.companies = updatedCompanies;
        this.companiesUpdated.next([...this.companies]);
      }
    });
  }

  public deleteCompany(id: string) {
    this.http.delete(`${BACKEND_URL}/${id}`).subscribe(() => {
      this.companies = this.companies.filter(company => company.id !== id);
      this.companiesUpdated.next([...this.companies]);
    });
  }


}
