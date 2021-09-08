import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
import { SaveOrderModalComponent } from '../save-order-modal/save-order-modal.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit, OnDestroy {
  public order: Order;
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

  public get isFromFirst(): boolean {
    return this.printService.isFromFirst;
  }

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private printService: PrintService,
    private labelTypeService: LabelTypeService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  public ngOnInit(): void {
    this.companyService.getCompanies();
    this.labelTypeService.getLabelTypes();

    this.subscribeToCompanyUpdates();
    this.subscribeToLabelTypeUpdates();

    this.initOrder();
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
        value: [this.order && this.order.to.value ? this.order.to.value.id : -1],
        isHidden: [this.order ? this.order.to.isHidden : false]
      }),
      from: this.fb.group({
        name: ['FROM'],
        value: [this.order && (this.order.from.value || this.order.from.value === '') ? this.order.from.value : 'TRAMEVER, INC'],
        isHidden: [this.order ? this.order.from.isHidden : false]
      }),
      madeIn: this.fb.group({
        name: ['MADE IN'],
        value: [this.order ? this.order.madeIn.value : ''],
        isHidden: [this.order ? this.order.madeIn.isHidden : false]
      }),
      purchaseOrder: this.fb.group({
        name: ['PO#'],
        value: [this.order ? this.order.purchaseOrder.value : '', Validators.required],
        isHidden: [this.order ? this.order.purchaseOrder.isHidden : false]
      }),
      dept: this.fb.group({
        name: ['DEPT'],
        value: [this.order ? this.order.dept.value : ''],
        isHidden: [this.order ? this.order.dept.isHidden : false]
      }),
      labelCount: [this.order ? this.order.labelCount : '', Validators.required],
      labelFields: this.fb.array([]),
      printFormat: [-1, Validators.required]
    });

    if (this.order) {
      this.addLabelFieldsFormArray(+this.order.labelCount);

      if (this.order.to.value) {
        this.orderForm.get('to').get('value').setValue(this.order.to.value.id, { onlySelf: true });
      }
    }
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
        this.patchlabelFieldsFormArray(additionalLabelsCount, currentLabelCount);
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

  public onFromFirstClick(checked: boolean): void {
    this.printService.isFromFirst = checked;
  }

  public onSaveOrder(orderForm: FormGroup): void {
    const order: Order = this.prepareOrder(orderForm);
    const modalRef = this.modalService.open(SaveOrderModalComponent);

    modalRef.componentInstance.order = order;

    modalRef.result.then(savedOrder => {
      if (savedOrder) {
        // TODO: toastr? try a different one....
      }
    }, error => {
      console.error('save order error', error);
    });
  }

  public onPrint(form: FormGroup): void {
    const order: Order = this.prepareOrder(form);
    this.printOrder(order);
  }

  private prepareOrder(orderform: FormGroup): Order {
    const formData = orderform.value;
    const selectedCompany = this.companyService.getCompany(formData.to.value);

    if (selectedCompany) {
      formData.to.value = selectedCompany;
    }

    formData.labelType = this.activeLabelType;

    return formData;
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

  private patchlabelFieldsFormArray(labelCount: number, startingIndex: number = 0): void {
    if (this.activeLabelType) {
      const labelCountFromStartingIndex = labelCount + startingIndex;

      for (let i = startingIndex; i < labelCountFromStartingIndex; i++) {
        this.labelFieldsFormArray.push(this.fb.array([]));
        this.patchLabelFieldsFormArray(i);
      }
    }

    this.activeDetailIndex =
      (this.activeDetailIndex && this.activeDetailIndex < this.labelFieldsFormArray.length) ? this.activeDetailIndex : 0;
  }

  private patchLabelFieldsFormArray(i: number) {
    const currentlabelFieldsLabelFieldsFormArray = this.labelFieldsFormArray.at(
      i
    ) as FormArray;
    this.activeLabelType.fields.forEach((field, fieldIndex) => {
      currentlabelFieldsLabelFieldsFormArray.push(
        this.fb.group({
          name: [field.name],
          value: [this.order ? this.order.labelFields[i][fieldIndex].value : ''],
          isHidden: [this.order ? this.order.labelFields[i][fieldIndex].isHidden : false],
          isAfterValue: [this.order ? this.order.labelFields[i][fieldIndex].isAfterValue : false]
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

  private initOrder(): void {
    if (this.route?.snapshot?.data?.order) {
      this.order = this.route.snapshot.data.order;
    } else if (this.printService?.order) {
      this.order = this.printService.order;
    } else {
      this.order = null;
    }

    if (this.order) {
      this.activeLabelType = this.order.labelType;
    }
  }
}
