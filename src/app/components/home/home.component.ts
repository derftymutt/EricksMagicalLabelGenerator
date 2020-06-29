import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LabelType } from 'src/app/models/label-type';
import { CompanyService } from 'src/app/services/company.service';
import { LabelTypeService } from 'src/app/services/label-type.service';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/models/company';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyModalComponent } from '../company-modal/company-modal.component';
import { Order } from 'src/app/models/order';
import { LabelTypeModalComponent } from '../label-type-modal/label-type-modal.component';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  public orderForm: FormGroup;
  public activeDetailIndex = null;
  public labelTypes: LabelType[] = [];
  public companies: Company[] = [];
  public activeLabelType: LabelType = null;
  public isRepeatManyLabels = false;
  private companySubscription: Subscription;
  private labelTypeSubscription: Subscription;

  public get labelFieldsFormArray(): FormArray {
    return this.orderForm.get('labelFields') as FormArray;
  }

  public get isCartonCountOnTop(): boolean {
    return this.printService.isCartonCountOnTop;
  }

  public get isDoubleLabels(): boolean {
    return this.printService.isDoubleLabels;
  }

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private printService: PrintService,
    private labelTypeService: LabelTypeService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  public ngOnInit(): void {
    this.companyService.getCompanies();
    this.labelTypeService.getLabelTypes();

    this.subscribeToCompanyUpdates();
    this.subscribeToLabelTypeUpdates();

    if (this.printService.order) {
      this.activeLabelType = this.printService.order.labelType;
    }

    this.buildForm();
  }

  public ngOnDestroy(): void {
    if (this.companySubscription) {
      this.companySubscription.unsubscribe();
    }

    if (this.labelTypeSubscription) {
      this.labelTypeSubscription.unsubscribe();
    }
  }

  public onAddCompanyClick(): void {
    this.modalService.open(CompanyModalComponent);
  }

  public onEditCompanyClick(): void {
    const currentCompanyId = this.orderForm.get('to').value.value;
    const currentCompany = this.companyService.getCompany(currentCompanyId);

    if (currentCompany) {
      const modalRef = this.modalService.open(CompanyModalComponent);
      modalRef.componentInstance.company = currentCompany;
    }
  }

  public buildForm(): void {
    this.orderForm = this.fb.group({
      to: this.fb.group({
        name: ['SHIP TO'],
        value: [this.printService.order ? this.printService.order.to.value.id : ''],
        isHidden: [false]
      }),
      from: this.fb.group({
        name: ['FROM'],
        value: ['TRAMEVER, INC'],
        isHidden: [false]
      }),
      madeIn: this.fb.group({
        name: ['MADE IN'],
        value: [this.printService.order ? this.printService.order.madeIn.value : ''],
        isHidden: [false]
      }),
      purchaseOrder: this.fb.group({
        name: ['PO#'],
        value: [this.printService.order ? this.printService.order.purchaseOrder.value : ''],
        isHidden: [false]
      }),
      dept: this.fb.group({
        name: ['DEPT'],
        value: [this.printService.order ? this.printService.order.dept.value : ''],
        isHidden: [false]
      }),
      labelCount: [this.printService.order ? this.printService.order.labelCount : '', Validators.required],
      labelFields: this.fb.array([]),
      printFormat: [-1, Validators.required]
    });

    if (this.printService.order) {
      this.addLabelFieldsFormArray(+this.printService.order.labelCount);
    }

    console.log(this.orderForm);
  }

  public onLabelCountConfirm(labelCountInput: HTMLInputElement): void {
    const labelCountInputValue = +labelCountInput.value;
    this.addLabelFieldsFormArray(labelCountInputValue);
  }

  private addLabelFieldsFormArray(labelCount: number): void {
    if (labelCount) {
      const currentLabelCount = this.labelFieldsFormArray.length;

      if (labelCount > currentLabelCount) {
        const additionalLabelsCount = labelCount - currentLabelCount;
        this.patchlabelFieldsFormArray(additionalLabelsCount);
      } else {
        this.labelFieldsFormArray.clear();
        this.patchlabelFieldsFormArray(labelCount);
      }
    }
  }

  public onNextBlank(): void {
    if (this.isAnotherLabelInCount()) {
      this.incrementActiveDetailIndex();
    }
  }

  public onRepeatLabel(): void {
    this.repeatLabel();
  }

  public onRepeatManyLabels(repeats: number): void {
    this.isRepeatManyLabels = false;
    const isPositiveNumber = Math.sign(repeats) === 1;

    if (isPositiveNumber) {
      for (let index = 0; index < repeats; index++) {
          this.repeatLabel();
      }
    }
  }

  public onGoBackOne(): void {
    if (this.isPreviousLabelInCount()) {
      this.activeDetailIndex--;
    }
  }

  public isNextLabelValid(): boolean {
    let result = false;

    if (this.isAnotherLabelInCount()) {
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
    this.printService.order = order;
    this.printService.order.labelType = this.activeLabelType;
    this.router.navigate(['print']);
  }

  public onEditLabelTypeClick(): void {
    if (this.activeLabelType) {
      const modalRef = this.modalService.open(LabelTypeModalComponent);
      modalRef.componentInstance.labelType = this.activeLabelType;
    }
  }

  public onAddLabelTypeClick(): void {
    this.modalService.open(LabelTypeModalComponent);
  }

  public isAnotherLabelInCount(): boolean {
    return this.activeDetailIndex < this.labelFieldsFormArray.length - 1;
  }

  public onDoubleLabelsClick(checked: boolean): void {
    this.printService.isDoubleLabels = checked;
  }

  public onCartonCountOnTopClick(checked: boolean): void {
    this.printService.isCartonCountOnTop = checked;
  }

  public onSubmit(form: FormGroup): void {
    const formData = form.value;

    const selectedCompany = this.companyService.getCompany(formData.to.value);

    if (selectedCompany) {
      formData.to.value = selectedCompany;
      this.printOrder(formData);
    }
  }

  private repeatLabel(): void {
    if (this.isAnotherLabelInCount()) {
      const currentlabelFieldsFieldsFormArray = this.labelFieldsFormArray.at(
        this.activeDetailIndex
      ) as FormArray;
      const nextlabelFieldsFieldsFormArray = this.labelFieldsFormArray.at(
        this.activeDetailIndex + 1
      ) as FormArray;

      nextlabelFieldsFieldsFormArray.controls.forEach(
        (labelFieldControl, i) => {
          const currentlabelFieldFormGroup = currentlabelFieldsFieldsFormArray.at(i) as FormGroup;

          labelFieldControl.get('value')
            .setValue(currentlabelFieldFormGroup.get('value').value);

          labelFieldControl.get('isAfterValue')
            .setValue(currentlabelFieldFormGroup.get('isAfterValue').value);

          labelFieldControl.get('isHidden')
            .setValue(currentlabelFieldFormGroup.get('isHidden').value);
        }
      );

      this.incrementActiveDetailIndex();
    }
  }

  private patchlabelFieldsFormArray(labelCount: number): void {
    if (this.activeLabelType) {
      for (let i = 0; i < labelCount; i++) {
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
    this.activeLabelType.fields.forEach((field, fieldIndex) => {
      currentlabelFieldsLabelFieldsFormArray.push(
        this.fb.group({
          name: [field.name],
          value: [this.printService.order ? this.printService.order.labelFields[i][fieldIndex].value : ''],
          isHidden: [this.printService.order ? this.printService.order.labelFields[i][fieldIndex].isHidden : false],
          isAfterValue: [this.printService.order ? this.printService.order.labelFields[i][fieldIndex].isAfterValue : false]
        })
      );
    });
  }

  private incrementActiveDetailIndex(): void {
    if (this.isAnotherLabelInCount()) {
      this.activeDetailIndex++;
    }
  }

  private isPreviousLabelInCount(): boolean {
    return this.activeDetailIndex - 1 > -1;
  }

  private subscribeToCompanyUpdates(): void {
    this.companySubscription = this.companyService.getCompaniesUpdatedListener().subscribe(companies => {
      this.companies = companies;
    });
  }

  private subscribeToLabelTypeUpdates(): void {
    this.labelTypeSubscription = this.labelTypeService.getLabelTypesUpdatedListener().subscribe(labelTypes => {
      this.labelTypes = labelTypes;

      if (this.activeLabelType) {
        this.activeLabelType = labelTypes.find(l => l.id === this.activeLabelType.id);

      } else if (this.labelTypes.length > 0) {
        this.activeLabelType = this.labelTypes[0];
      }
    });
  }
}
