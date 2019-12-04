import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-label-type-modal',
  templateUrl: './label-type-modal.component.html'
})
export class LabelTypeModalComponent implements OnInit {
public labelTypeForm: FormGroup;

  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder, private compnanyService: CompanyService) { }

  public ngOnInit(): void {
    this.buildForm();
  }

  public get fieldsArray(): FormArray {
    return this.labelTypeForm.get('fields') as FormArray;
  }

  public onSubmit(form: FormGroup): void {

  }

  public onAddFieldClick(): void {
    this.AddNewFieldToFieldsFormArray();
  }

  public onRemoveField(index: number): void {
    this.fieldsArray.removeAt(index);
  }

  public onClose(): void {
    this.activeModal.dismiss();
  }

  private buildForm(): void {
    this.labelTypeForm = this.fb.group({
      name: ['', Validators.required],
      fields: this.fb.array([])
    });

    this.AddNewFieldToFieldsFormArray();
  }

  private AddNewFieldToFieldsFormArray(): void {
    this.fieldsArray.push(this.fb.group({
      name: ['', Validators.required]
    }));
  }

}
