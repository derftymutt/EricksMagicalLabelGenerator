import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public labelForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.buildForm();
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

  public onBoxCountConfirm(value: any): void {
    console.log('value', value.value);
  }

  public onSubmit(form: FormGroup): void {
    console.log('form submitted', form);
  }

  private patchDetailsFormArray(): void {

  }


}
