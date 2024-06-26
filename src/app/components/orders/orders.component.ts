import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelType } from 'src/app/models/label-type';
import { CompanyService } from 'src/app/services/company.service';
import { LabelTypeService } from 'src/app/services/label-type.service';
import { Observable, Subscription } from 'rxjs';
import { Company } from 'src/app/models/company';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyModalComponent } from '../company-modal/company-modal.component';
import { Order } from 'src/app/models/order';
import { LabelTypeModalComponent } from '../label-type-modal/label-type-modal.component';
import { PrintService } from 'src/app/services/print.service';
import { SaveOrderModalComponent } from '../save-order-modal/save-order-modal.component';
import { LabelsPerPageType } from 'src/app/models/labels-per-page-type';
import { OriginCompanyService } from 'src/app/services/origin-company.service';
import { OriginCompanyModalComponent } from '../origin-company-modal/origin-company-modal.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit, OnDestroy {
  public order: Order;
  public orderForm: UntypedFormGroup;
  public activeDetailIndex = null;
  public labelTypes: LabelType[] = [];
  public companies$: Observable<Company[]>;
  public originCompanies$: Observable<Company[]>;
  public activeLabelType: LabelType = null;
  public isRepeatManyLabels = false;
  public labelsPerPage = LabelsPerPageType;
  public isNoFromAddress = true;
  public isNoCompanyAddress = true;
  private companySubscription: Subscription;
  private labelTypeSubscription: Subscription;

  public get labelFieldsFormArray(): UntypedFormArray {
    return this.orderForm.get('labelFields') as UntypedFormArray;
  }

  public get isCartonCountOnTop(): boolean {
    return this.printService.isCartonCountOnTop;
  }

  public get isVariety(): boolean {
    return this.printService.isVariety;
  }

  public get isDoubleLabels(): boolean {
    return this.printService.isDoubleLabels;
  }

  public get isFromFirst(): boolean {
    return this.printService.isFromFirst;
  }

  // TODO: remove
  public get isShowFromVernonAddress(): boolean {
    return this.printService.isShowFromVernonAddress;
  }

  public get isShowFromSanDiegoAddress(): boolean {
    return this.printService.isShowFromSanDiegoAddress;
  }

  constructor(
    private fb: UntypedFormBuilder,
    private companyService: CompanyService,
    private originCompanyService: OriginCompanyService,
    private printService: PrintService,
    private labelTypeService: LabelTypeService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  public ngOnInit(): void {
    this.companyService.getCompanies();
    this.originCompanyService.getOriginCompanies();
    this.labelTypeService.getLabelTypes();

    this.subscribeToLabelTypeUpdates();

    this.companies$ = this.companyService.getCompaniesUpdatedListener();
    this.originCompanies$ = this.originCompanyService.getOriginCompaniesUpdatedListener();

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

  public onAddOriginCompanyClick(): void {
    this.modalService.open(OriginCompanyModalComponent);
  }

  public onOriginCompanyChange(originCompanyId: number): void {
    this.isNoFromAddress = +originCompanyId === -1;
  }

  public onCompanyChange(companyId: number): void {
    this.isNoCompanyAddress = +companyId === -1;
  }

  public onEditCompanyClick(): void {
    const currentCompanyId = this.orderForm.get('to').value.value;
    const currentCompany = this.companyService.getCompany(currentCompanyId);

    if (currentCompany) {
      const modalRef = this.modalService.open(CompanyModalComponent);
      modalRef.componentInstance.company = currentCompany;
    }
  }

  public onEditOriginCompanyClick(): void {
    const currentOriginCompanyId = this.orderForm.get('from').value.value;
    const currentOriginCompany = this.originCompanyService.getOriginCompany(currentOriginCompanyId);

    if (currentOriginCompany) {
      const modalRef = this.modalService.open(OriginCompanyModalComponent);
      modalRef.componentInstance.originCompany = currentOriginCompany;
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
        companyName: 'MACNAMERA SUPPLY, INC', // TODO: wire this up
        value: [this.order && this.order.from.value ? this.order.from.value.id : -1],
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
        isHidden: [this.order ? this.order.purchaseOrder.isHidden : false],
        isSpaceAbove: [this.order ? this.order.purchaseOrder.isSpaceAbove : false]
      }),
      dept: this.fb.group({
        name: ['DEPT'],
        value: [this.order ? this.order.dept.value : ''],
        isHidden: [this.order ? this.order.dept.isHidden : false],
        isSpaceAbove: [this.order ? this.order.dept.isSpaceAbove : false]
      }),
      labelCount: [this.order ? this.order.labelCount : '', Validators.required],
      labelFields: this.fb.array([]),
      labelsPerPage: [this.order ? this.order.labelsPerPage : this.labelsPerPage.Four, Validators.required]
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
        this.HandlePatchlabelFieldsFormArray(additionalLabelsCount, currentLabelCount);
      } else {
        this.labelFieldsFormArray.clear();
        this.HandlePatchlabelFieldsFormArray(labelCount);
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
      ) as UntypedFormGroup;

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

  public onIsVarietyClick(checked: boolean): void {
    this.printService.isVariety = checked;
  }

  public onFromFirstClick(checked: boolean): void {
    this.printService.isFromFirst = checked;
  }

  //TODO: rename all vernon to Texas, and move all address to an appSettings file
  public onFromVernonAddressClick(checked: boolean): void {
    this.printService.isShowFromVernonAddress = checked;
  }

  public onFromSanDiegoAddressClick(checked: boolean): void {
    this.printService.isShowFromSanDiegoAddress = checked;
  }

  public onSaveOrder(orderForm: UntypedFormGroup): void {
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

  public onPrint(form: UntypedFormGroup): void {
    const order: Order = this.prepareOrder(form);
    this.printOrder(order);
  }

  private prepareOrder(orderform: UntypedFormGroup): Order {
    const formData = orderform.value;
    const selectedCompany = this.companyService.getCompany(formData.to.value);

    if (selectedCompany) {
      formData.to.value = selectedCompany;
    }

    const selectedOriginCompany = this.originCompanyService.getOriginCompany(formData.from.value);

    if (selectedOriginCompany) {
      formData.from.value = selectedOriginCompany;
    }

    formData.labelType = this.activeLabelType;

    this.printService.companyName = formData.from.companyName;

    console.log(this.printService.companyName);

    return formData;
  }

  private repeatLabel(): void {
    if (this.isAnotherLabelInCount()) {
      const currentlabelFieldsFieldsFormArray = this.labelFieldsFormArray.at(
        this.activeDetailIndex
      ) as UntypedFormArray;
      const nextlabelFieldsFieldsFormArray = this.labelFieldsFormArray.at(
        this.activeDetailIndex + 1
      ) as UntypedFormArray;

      nextlabelFieldsFieldsFormArray.controls.forEach(
        (labelFieldControl, i) => {
          const currentlabelFieldFormGroup = currentlabelFieldsFieldsFormArray.at(i) as UntypedFormGroup;

          labelFieldControl.get('value')
            .setValue(currentlabelFieldFormGroup.get('value').value);

          labelFieldControl.get('isSpaceAbove')
            .setValue(currentlabelFieldFormGroup.get('isSpaceAbove').value);

          labelFieldControl.get('isAfterValue')
            .setValue(currentlabelFieldFormGroup.get('isAfterValue').value);

          labelFieldControl.get('isHidden')
            .setValue(currentlabelFieldFormGroup.get('isHidden').value);
        }
      );

      this.incrementActiveDetailIndex();
    }
  }

  private HandlePatchlabelFieldsFormArray(labelCount: number, startingIndex: number = 0): void {
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
    ) as UntypedFormArray;
    this.activeLabelType.fields.forEach((field, fieldIndex) => {
      currentlabelFieldsLabelFieldsFormArray.push(
        this.fb.group({
          name: [field.name],
          value: [Array.isArray(this.order?.labelFields) && Array.isArray(this.order?.labelFields[i]) ? this.order.labelFields[i][fieldIndex]?.value : ''],
          isSpaceAbove: [Array.isArray(this.order?.labelFields) && Array.isArray(this.order?.labelFields[i]) ? this.order.labelFields[i][fieldIndex]?.isSpaceAbove : false],
          isHidden: [Array.isArray(this.order?.labelFields) && Array.isArray(this.order?.labelFields[i]) ? this.order.labelFields[i][fieldIndex]?.isHidden : false],
          isAfterValue: [Array.isArray(this.order?.labelFields) && Array.isArray(this.order?.labelFields[i]) ? this.order.labelFields[i][fieldIndex]?.isAfterValue : false]
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
