import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public labelForm: FormGroup;
  public activeDetailIndex = null;

  constructor(private fb: FormBuilder, private router: Router) {}

  public ngOnInit(): void {
    this.buildForm();
  }

  public get detailsFormArray(): FormArray {
    return this.labelForm.get('details') as FormArray;
  }

  public buildForm(): void {
    this.labelForm = this.fb.group({
      to: ['', Validators.required],
      from: ['TRAMEVER, INC.', Validators.required],
      purchaseOrder: ['', Validators.required],
      dept: ['', Validators.required],
      boxCount: ['', Validators.required],
      details: this.fb.array([])
    });
  }

  public onBoxCountConfirm(boxCountInput: HTMLInputElement): void {
    const boxCountInputValue = +boxCountInput.value;
    const currentBoxCount = this.detailsFormArray.length;

    if (boxCountInputValue > currentBoxCount) {
      const additionalBoxesCount = +boxCountInput.value - currentBoxCount;
      this.patchDetailsFormArray(additionalBoxesCount);
    } else {
      this.detailsFormArray.clear();
      this.patchDetailsFormArray(boxCountInputValue);
    }
  }

  public onNextBlank(): void {
    if (this.isAnotherBoxInCount()) {
      this.incrementActiveDetailIndex();
    }
  }

  public onNextSameInfo(): void {
    if (this.isAnotherBoxInCount()) {
      const currentFormValues = this.detailsFormArray.at(this.activeDetailIndex) as FormGroup;
      const nextFormGroup = this.detailsFormArray.at(this.activeDetailIndex + 1) as FormGroup;

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

  public onGoForwardOne(): void {
    this.incrementActiveDetailIndex();
  }

  public isNextBoxValid(): boolean {
    let result = false;

    if (this.isAnotherBoxInCount()) {
      const nextFormGroup = this.detailsFormArray.at(this.activeDetailIndex + 1) as FormGroup;

      if (nextFormGroup) {
        result = nextFormGroup.valid;
      }
    }

    return result;
  }

  public onPrint(): void {
    this.router.navigate(['print']);
  }

  public onSubmit(form: FormGroup): void {
    console.log('form submitted', form);
  }

  private patchDetailsFormArray(boxCount: number): void {
    for (let i = 0; i < boxCount; i++) {
      this.detailsFormArray.push(
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
    this.activeDetailIndex++;
  }

  private isAnotherBoxInCount(): boolean {
    return this.activeDetailIndex < this.detailsFormArray.length;
  }

  private isPreviousBoxInCount(): boolean {
    return this.activeDetailIndex - 1 > -1;
  }
}
