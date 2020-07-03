import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { onErrorResumeNextStatic } from 'rxjs/internal/operators/onErrorResumeNext';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-save-order-modal',
  templateUrl: './save-order-modal.component.html'
})
export class SaveOrderModalComponent implements OnInit, OnDestroy {
  @Input() public order: Order;
  public saveOrderForm: FormGroup;
  public isEditMode = false;
  private orderSubscription: Subscription;

  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder, private orderService: OrderService) { }

  public ngOnInit(): void {
    if (this.order.id) {
      this.isEditMode = true;
    }

    this.buildForm();
    this.subscribeToOrderUpdates();
  }

  public ngOnDestroy(): void {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

  public onClose(): void {
    this.activeModal.close();
  }

  public onSubmit(orderForm: FormGroup): void {
    if (orderForm.valid) {
      const orderFormData = orderForm.value;
      this.order.title = orderFormData.title;

      this.orderService.addOrder(this.order);
    }
  }

  private buildForm(): void {
    this.saveOrderForm = this.fb.group({
      title: [this.order ? this.order.title : '', Validators.required]
    });
  }

  private subscribeToOrderUpdates(): void {
    this.orderSubscription = this.orderService.getOrdersUpdatedListener().subscribe(orders => {
      this.activeModal.close(orders);
    });
  }
}
