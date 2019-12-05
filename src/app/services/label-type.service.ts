import { Injectable } from '@angular/core';
import { LabelType } from '../models/label-type';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LabelTypeService {
  private labelTypes: LabelType[] = [];
  private labelTypesUpdated = new Subject<LabelType[]>();

  constructor(private http: HttpClient) { }

  public getLabelTypes(): void {
    this.http.get<any>('http://localhost:3000/api/label-types')
      .pipe(map((labelTypesData) => {
        return labelTypesData.map(labelType => {
          return {
            name: labelType.name,
            fields: labelType.fields,
            id: labelType._id
          };
        });
      }))
      .subscribe(labelTypes => {
        this.labelTypes = labelTypes;
        this.labelTypesUpdated.next([...this.labelTypes]);
      });
  }

  public getLabelTypesUpdatedListener() {
    return this.labelTypesUpdated.asObservable();
  }

  public getLabelType(id: string): LabelType {
    return { ...this.labelTypes.find(labelType => labelType.id === id) };
  }

  public addLabelType(labelType: LabelType) {

    this.http.post<{ labelTypeId: string }>('http://localhost:3000/api/label-types', labelType).subscribe(result => {
      labelType.id = result.labelTypeId;
      this.labelTypes.push(labelType);
      this.labelTypesUpdated.next([...this.labelTypes]);
      console.log('post success, new label types array', this.labelTypes);
    });
  }

  public updateLabelType(labelType: LabelType) {
    this.http.put(`http://localhost:3000/api/label-types/${labelType.id}`, labelType).subscribe(result => {
      const updatedLabelTypes = [...this.labelTypes];
      const oldLabelTypeIndex = updatedLabelTypes.findIndex(l => l.id === labelType.id);
      if (oldLabelTypeIndex > -1) {
        updatedLabelTypes[oldLabelTypeIndex] = labelType;
        this.labelTypes = updatedLabelTypes;
        this.labelTypesUpdated.next([...this.labelTypes]);
      }
    });
  }

  public deleteLabelType(id: string) {
    this.http.delete(`http://localhost:3000/api/label-types/${id}`).subscribe(() => {
      this.labelTypes = this.labelTypes.filter(labelType => labelType.id !== id);
      this.labelTypesUpdated.next([...this.labelTypes]);
    });
  }
}
