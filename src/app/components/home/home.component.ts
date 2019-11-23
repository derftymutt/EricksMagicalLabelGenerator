import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { LabelType } from 'src/app/models/label-type.enum';
import { CompanyService } from 'src/app/services/company.service';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/models/company';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyModal } from '../company-modal/company-modal.component';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  public orderForm: FormGroup;
  public activeDetailIndex = null;
  public labelTypes = LabelType;
  public companies: Company[] = [];
  private activeLabelType = null;
  private companySubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private companyService: CompanyService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  public ngOnInit(): void {
    this.companyService.getCompanies();

    this.companySubscription = this.companyService.getCompaniesUpdatedListener().subscribe(companies => {
      this.companies = companies;
      console.log('getCompaniesUpdatedListener', this.companies);
    });

    this.buildForm();
  }

  public ngOnDestroy(): void {
    if (this.companySubscription) {
      this.companySubscription.unsubscribe();
    }
  }

  onAddCompanyClick(): void {
    this.modalService.open(CompanyModal);
  }

  public onEditCompanyClick(): void {
    const currentCompanyId = this.orderForm.get('to').value;
    const currentCompany = this.companyService.getCompany(currentCompanyId);

    if (currentCompany) {
      const modalRef = this.modalService.open(CompanyModal);
      modalRef.componentInstance.company = currentCompany;
    }
  }

  public get labelFieldsFormArray(): FormArray {
    return this.orderForm.get('labelFields') as FormArray;
  }

  public buildForm(): void {
    this.orderForm = this.fb.group({
      to: ['', Validators.required],
      from: ['TRAMEVER, INC.', Validators.required],
      madeIn: [''],
      purchaseOrder: ['', Validators.required],
      dept: ['', Validators.required],
      labelCount: ['', Validators.required],
      labelFields: this.fb.array([]),
      printFormat: [-1, Validators.required]
    });
  }

  public onBoxCountConfirm(boxCountInput: HTMLInputElement): void {
    const boxCountInputValue = +boxCountInput.value;
    const currentBoxCount = this.labelFieldsFormArray.length;

    if (boxCountInputValue > currentBoxCount) {
      const additionalBoxesCount = +boxCountInput.value - currentBoxCount;
      this.patchlabelFieldsFormArray(additionalBoxesCount);
    } else {
      this.labelFieldsFormArray.clear();
      this.patchlabelFieldsFormArray(boxCountInputValue);
    }
  }

  public onNextBlank(): void {
    if (this.isAnotherBoxInCount()) {
      this.incrementActiveDetailIndex();
    }
  }

  public onNextSameInfo(): void {
    if (this.isAnotherBoxInCount()) {
      const currentlabelFieldsFieldsFormArray = this.labelFieldsFormArray.at(
        this.activeDetailIndex
      ) as FormArray;
      const nextlabelFieldsFieldsFormArray = this.labelFieldsFormArray.at(
        this.activeDetailIndex + 1
      ) as FormArray;

      nextlabelFieldsFieldsFormArray.controls.forEach(
        (labelFieldControl, i) => {
          const currentlabelFieldFormGroup = currentlabelFieldsFieldsFormArray.at(
            i
          ) as FormGroup;
          labelFieldControl
            .get('value')
            .setValue(currentlabelFieldFormGroup.get('value').value);
        }
      );

      this.incrementActiveDetailIndex();
    }
  }

  public onGoBackOne(): void {
    if (this.isPreviousBoxInCount()) {
      this.activeDetailIndex--;
    }
  }

  public isNextBoxValid(): boolean {
    let result = false;

    if (this.isAnotherBoxInCount()) {
      const nextFormGroup = this.labelFieldsFormArray.at(
        this.activeDetailIndex + 1
      ) as FormGroup;

      if (nextFormGroup) {
        result = nextFormGroup.valid;
      }
    }

    return result;
  }

  private printOrder(order: Order): void {
    this.orderService.order = order;
    this.router.navigate(['print']);
  }

  public onBoxTypeSelect(labeltype: LabelType): void {
    this.activeLabelType = this.orderService.getlabelFieldsData(+labeltype);
  }

  public onSubmit(form: FormGroup): void {
    const formData = form.value;

    const selectedCompany = this.companyService.getCompany(formData.to);

    if (selectedCompany) {
      formData.to = selectedCompany;
      this.printOrder(formData);
    }
  }

  private patchlabelFieldsFormArray(boxCount: number): void {
    if (this.activeLabelType) {
      for (let i = 0; i < boxCount; i++) {
        this.labelFieldsFormArray.push(this.fb.array([]));
        this.patchLabelFieldsFormArray(i);
      }
    }

    this.activeDetailIndex = 0;
  }

  private patchLabelFieldsFormArray(i: number) {
    const currentlabelFieldsLabelFieldsFormArray = this.labelFieldsFormArray.at(
      i
    ) as FormArray;
    this.activeLabelType.labelFields.forEach(field => {
      currentlabelFieldsLabelFieldsFormArray.push(
        this.fb.group({
          name: [field.name],
          value: [field.value]
        })
      );
    });
  }

  private incrementActiveDetailIndex(): void {
    if (this.isAnotherBoxInCount()) {
      this.activeDetailIndex++;
    }
  }

  private isAnotherBoxInCount(): boolean {
    return this.activeDetailIndex < this.labelFieldsFormArray.length - 1;
  }

  private isPreviousBoxInCount(): boolean {
    return this.activeDetailIndex - 1 > -1;
  }
}
