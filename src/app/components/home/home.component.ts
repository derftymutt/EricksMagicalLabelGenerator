import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { LabelType } from 'src/app/models/label-type.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public orderForm: FormGroup;
  public activeDetailIndex = null;
  public labelTypes = LabelType;

  constructor(private fb: FormBuilder, private orderService: OrderService, private router: Router) {}

  public ngOnInit(): void {
    this.buildForm();
  }

  public get labelDetailsFormArray(): FormArray {
    return this.orderForm.get('labelDetails') as FormArray;
  }

  public buildForm(): void {
    this.orderForm = this.fb.group({
      to: ['', Validators.required],
      from: ['TRAMEVER, INC.', Validators.required],
      purchaseOrder: ['', Validators.required],
      dept: ['', Validators.required],
      labelCount: ['', Validators.required],
      labelDetails: this.fb.array([])
    });
  }

  public onBoxCountConfirm(boxCountInput: HTMLInputElement): void {
    const boxCountInputValue = +boxCountInput.value;
    const currentBoxCount = this.labelDetailsFormArray.length;

    if (boxCountInputValue > currentBoxCount) {
      const additionalBoxesCount = +boxCountInput.value - currentBoxCount;
      this.patchlabelDetailsFormArray(additionalBoxesCount);
    } else {
      this.labelDetailsFormArray.clear();
      this.patchlabelDetailsFormArray(boxCountInputValue);
    }
  }

  public onNextBlank(): void {
    if (this.isAnotherBoxInCount()) {
      this.incrementActiveDetailIndex();
    }
  }

  public onNextSameInfo(): void {
    if (this.isAnotherBoxInCount()) {
      const currentFormValues = this.labelDetailsFormArray.at(this.activeDetailIndex) as FormGroup;
      const nextFormGroup = this.labelDetailsFormArray.at(this.activeDetailIndex + 1) as FormGroup;

      nextFormGroup.get('venderStyleNumber').patchValue(currentFormValues.get('venderStyleNumber').value);
      nextFormGroup.get('sizeRatio').patchValue(currentFormValues.get('sizeRatio').value);
      nextFormGroup.get('color').patchValue(currentFormValues.get('color').value);
      nextFormGroup.get('totalUnits').patchValue(currentFormValues.get('totalUnits').value);
      nextFormGroup.get('university').patchValue(currentFormValues.get('university').value);

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
      const nextFormGroup = this.labelDetailsFormArray.at(this.activeDetailIndex + 1) as FormGroup;

      if (nextFormGroup) {
        result = nextFormGroup.valid;
      }
    }

    return result;
  }

  public onPrint(orderForm: FormGroup): void {
    this.orderService.order = orderForm.value;
    this.router.navigate(['print']);
  }

  public onBoxTypeSelect(labeltype: LabelType): void {
    console.log(labeltype);
  }

  public onSubmit(form: FormGroup): void {
    console.log('form submitted', form);
  }

  private patchlabelDetailsFormArray(boxCount: number): void {
    for (let i = 0; i < boxCount; i++) {
      this.labelDetailsFormArray.push(
        this.fb.group({
          venderStyleNumber: ['', Validators.required],
          sizeRatio: ['', Validators.required],
          color: ['', Validators.required],
          totalUnits: ['', Validators.required],
          university: ['', Validators.required]
        })
      );
    }

    this.activeDetailIndex = 0;
  }

  private incrementActiveDetailIndex(): void {
    if (this.isAnotherBoxInCount()) {
      this.activeDetailIndex++;
    }
  }

  private isAnotherBoxInCount(): boolean {
    return this.activeDetailIndex < this.labelDetailsFormArray.length - 1;
  }

  private isPreviousBoxInCount(): boolean {
    return this.activeDetailIndex - 1 > -1;
  }
}
