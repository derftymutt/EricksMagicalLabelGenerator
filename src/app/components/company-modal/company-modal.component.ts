import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Company } from 'src/app/models/company';

@Component({
  selector: 'app-company-modal',
  templateUrl: './company-modal.component.html'
})
export class CompanyModalComponent implements OnInit {
  @Input() public company: Company;
  public companyForm: UntypedFormGroup;
  public isEditMode = false;

  constructor(private activeModal: NgbActiveModal, private fb: UntypedFormBuilder, private companyService: CompanyService) { }

  public ngOnInit(): void {
    if (this.company) {
      this.isEditMode = true;
    }

    this.buildForm();
  }

  public onSubmit(form: UntypedFormGroup): void {
    const company = form.value;

    if (this.isEditMode) {
      company.id = this.company.id;
      this.companyService.updateCompany(company);
    } else {
      this.companyService.addCompany(company);
    }

    this.activeModal.close();
  }

  public onDelete(): void {
    this.companyService.deleteCompany(this.company.id);
    this.activeModal.close();
  }

  public onClose(): void {
    this.activeModal.dismiss();
  }

  private buildForm(): void {
    this.companyForm = this.fb.group({
      name: [this.company ? this.company.name : '', Validators.required],
      address: this.fb.group({
        street1: [this.company ? this.company.address.street1 : ''],
        street2: [this.company ? this.company.address.street2 : ''],
        city: [this.company ? this.company.address.city : ''],
        state: [this.company ? this.company.address.state : ''],
        zip: [this.company ? this.company.address.zip : '']
      })
    });
  }
}
