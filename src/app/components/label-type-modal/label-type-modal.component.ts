import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LabelTypeService } from 'src/app/services/label-type.service';
import { LabelType } from 'src/app/models/label-type';

@Component({
  selector: 'app-label-type-modal',
  templateUrl: './label-type-modal.component.html'
})
export class LabelTypeModalComponent implements OnInit {
  @Input() public labelType: LabelType;
  public labelTypeForm: FormGroup;
  public isEditMode = false;

  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder, private labelTypeService: LabelTypeService) { }

  public ngOnInit(): void {
    if (this.labelType) {
      this.isEditMode = true;
    }

    this.buildForm();
  }

  public get fieldsArray(): FormArray {
    return this.labelTypeForm.get('fields') as FormArray;
  }

  public onSubmit(form: FormGroup): void {
    const labelType = form.value;

    if (this.isEditMode) {
      labelType.id = this.labelType.id;
      this.labelTypeService.updateLabelType(labelType);
    } else {
      this.labelTypeService.addLabelType(labelType);
    }

    this.activeModal.close();
  }

  public onDelete(): void {
    this.labelTypeService.deleteLabelType(this.labelType.id);
    this.activeModal.close();
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
      name: [this.labelType ? this.labelType.name : '', Validators.required],
      fields: this.fb.array([])
    });

    if (this.isEditMode) {
      this.patchFieldsValues();
    } else {
      this.AddNewFieldToFieldsFormArray();
    }
  }

  private patchFieldsValues(): void {
    this.labelType.fields.forEach(field => {
      this.fieldsArray.push(this.fb.group({
        name: [field.name, Validators.required]
      }));
    });
  }

  private AddNewFieldToFieldsFormArray(): void {
    this.fieldsArray.push(this.fb.group({
      name: ['', Validators.required]
    }));
  }

}
