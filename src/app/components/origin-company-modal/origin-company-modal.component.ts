import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Company } from 'src/app/models/company';
import { OriginCompanyService } from 'src/app/services/origin-company.service';

@Component({
  selector: 'app-origin-company-modal',
  templateUrl: './origin-company-modal.component.html'
})
export class OriginCompanyModalComponent implements OnInit {
  @Input() public originCompany: Company;
  public originCompanyForm: UntypedFormGroup;
  public isEditMode = false;

  constructor(private activeModal: NgbActiveModal, private fb: UntypedFormBuilder, private originCompanyService: OriginCompanyService) { }

  public ngOnInit(): void {
    if (this.originCompany) {
      this.isEditMode = true;
    }

    this.buildForm();
  }

  public onSubmit(form: UntypedFormGroup): void {
    const originCompany = form.value;

    if (this.isEditMode) {
      originCompany.id = this.originCompany.id;
      this.originCompanyService.updateOriginCompany(originCompany);
    } else {
      this.originCompanyService.addOriginCompany(originCompany);
    }

    this.activeModal.close();
  }

  public onDelete(): void {
    this.originCompanyService.deleteOriginCompany(this.originCompany.id);
    this.activeModal.close();
  }

  public onClose(): void {
    this.activeModal.dismiss();
  }

  private buildForm(): void {
    this.originCompanyForm = this.fb.group({
      name: [this.originCompany ? this.originCompany.name : '', Validators.required],
      address: this.fb.group({
        street1: [this.originCompany ? this.originCompany.address.street1 : ''],
        street2: [this.originCompany ? this.originCompany.address.street2 : ''],
        city: [this.originCompany ? this.originCompany.address.city : ''],
        state: [this.originCompany ? this.originCompany.address.state : ''],
        zip: [this.originCompany ? this.originCompany.address.zip : '']
      })
    });
  }
}
