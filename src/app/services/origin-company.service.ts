import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from '../models/company';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/origin-companies';

@Injectable({
  providedIn: 'root'
})
export class OriginCompanyService {
  private originCompanies: Company[] = [];
  private originCompaniesUpdated = new Subject<Company[]>();

  constructor(private http: HttpClient) { }

  public getOriginCompanies(): void {
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
      .subscribe(originCompanies => {
        this.originCompanies = originCompanies;
        this.originCompaniesUpdated.next([...this.originCompanies]);
      });
  }

  public getOriginCompaniesUpdatedListener() {
    return this.originCompaniesUpdated.asObservable();
  }

  public getOriginCompany(id: string): Company {
    return { ...this.originCompanies.find(company => company.id === id) };
  }

  public addOriginCompany(company: Company) {
    this.http.post<{ companyId: string }>(BACKEND_URL, company).subscribe(result => {
      company.id = result.companyId;
      this.originCompanies.push(company);
      this.originCompaniesUpdated.next([...this.originCompanies]);
      console.log('post success, new originCompanies array', this.originCompanies);
    });
  }

  public updateOriginCompany(company: Company) {
    this.http.put(`${BACKEND_URL}/${company.id}`, company).subscribe(result => {
      const updatedCompanies = [...this.originCompanies];
      const oldCompanyIndex = updatedCompanies.findIndex(c => c.id === company.id);
      if (oldCompanyIndex > -1) {
        updatedCompanies[oldCompanyIndex] = company;
        this.originCompanies = updatedCompanies;
        this.originCompaniesUpdated.next([...this.originCompanies]);
      }
    });
  }

  public deleteOriginCompany(id: string) {
    this.http.delete(`${BACKEND_URL}/${id}`).subscribe(() => {
      this.originCompanies = this.originCompanies.filter(company => company.id !== id);
      this.originCompaniesUpdated.next([...this.originCompanies]);
    });
  }
}
