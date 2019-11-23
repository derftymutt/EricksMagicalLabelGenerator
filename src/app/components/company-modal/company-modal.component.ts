import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Company } from 'src/app/models/company';

@Component({
  selector: 'app-company-modal',
  templateUrl: './company-modal.component.html'
})
export class CompanyModal implements OnInit {
  @Input() company: Company;
  public companyForm: FormGroup;
  public isEditMode = false;

  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder, private compnanyService: CompanyService) { }

  public ngOnInit(): void {
    if (this.company) {
      this.isEditMode = true;
    }

    this.buildForm();
  }

  public onSubmit(form: FormGroup): void {
    const company = form.value;

    if (this.isEditMode) {
      company.id = this.company.id;
      this.compnanyService.updateCompany(company);
    } else {
      this.compnanyService.addCompany(company);
    }

    this.activeModal.close();
  }

  public onDelete(): void {
    this.compnanyService.deleteCompany(this.company.id);
    this.activeModal.close();
  }

  public onClose(): void {
    this.activeModal.dismiss();
  }

  private buildForm(): void {
    this.companyForm = this.fb.group({
      name: [this.company ? this.company.name : '', Validators.required],
      address: this.fb.group({
        street1: [this.company ? this.company.address.street1 : '', Validators.required],
        street2: [this.company ? this.company.address.street2 : ''],
        city: [this.company ? this.company.address.city : '', Validators.required],
        state: [this.company ? this.company.address.state : '', Validators.required],
        zip: [this.company ? this.company.address.zip : '', Validators.required]
      })
    });
  }



}