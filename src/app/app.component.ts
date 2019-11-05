import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public labelForm: FormGroup;
  public activeDetailIndex = null;
  constructor(private fb: FormBuilder) {}

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

  public onBoxCountConfirm(): void {
    const boxCount = this.labelForm.get('boxCount').value;
    this.patchDetailsFormArray(boxCount);
  }

  public onNextBlank(): void {
    if (this.isAnotherBoxInCount()) {
      this.activeDetailIndex++;
    }
  }

  public onNextSameInfo(): void {
    if (this.isAnotherBoxInCount()) {
      const currentFormValues = this.detailsFormArray.at(this.activeDetailIndex) as FormGroup;
      const nextFormGroup = this.detailsFormArray.at(this.activeDetailIndex + 1) as FormGroup;

      nextFormGroup.get('thing1').patchValue(currentFormValues.get('thing1').value);
      nextFormGroup.get('thing2').patchValue(currentFormValues.get('thing2').value);
      nextFormGroup.get('thing3').patchValue(currentFormValues.get('thing3').value);
      nextFormGroup.get('thing4').patchValue(currentFormValues.get('thing4').value);

      this.activeDetailIndex++;
    }
  }

  public onSubmit(form: FormGroup): void {
    console.log('form submitted', form);
  }

  private patchDetailsFormArray(boxCount: number): void {
    for (let i = 0; i < boxCount; i++) {
      this.detailsFormArray.push(
        this.fb.group({
          thing1: ['', Validators.required],
          thing2: ['', Validators.required],
          thing3: ['', Validators.required],
          thing4: ['', Validators.required]
        })
      );
    }

    this.activeDetailIndex = 0;
  }

  private isAnotherBoxInCount(): boolean {
    return this.activeDetailIndex < this.detailsFormArray.length - 1;
  }
}
