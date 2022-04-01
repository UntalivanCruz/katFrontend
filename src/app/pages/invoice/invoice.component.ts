import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Invoice } from 'src/app/api/models';
import { InvoiceControllerService } from 'src/app/api/services';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  invoice:Invoice[]=[]
  visible: boolean = false;
  constructor(
    private invoiceService: InvoiceControllerService,
    private messageService: NzMessageService,
    private fb: FormBuilder
  ) { }

  formInvoice: FormGroup = this.fb.group({
    id: [null,Validators.required],
    correlative: [1,Validators.required],
    scheduled: [(new Date()).toISOString(), Validators.required],
    name: ["",Validators.required],
    address: ["",Validators.required],
    phone:["",Validators.required],
    email:["",[Validators.required, Validators.email]],
    special:[]
  })

  ngOnInit(): void {
    this.invoiceService.find().subscribe(data=>this.invoice=data)
  }

  eliminar(id: string): void {
    this.invoiceService.deleteById({ id }).subscribe(() => {
      this.invoice = this.invoice.filter(x => x.id !== id);
      this.messageService.success('Item deleted successfully')
    })
  }

  cancel(): void {
    this.messageService.info('Su registro sigue activo!')
  }

  ocultar(): void {
    this.visible = false
    this.formInvoice.reset()
  }

  mostrar(data?: Invoice): void {
     if (data?.id) {
      this.formInvoice.setValue({ ...data, 'special': [] })
    }
    this.visible = true
  }

  guardar(): void {
    this.formInvoice.setValue({ ...this.formInvoice.value, 'special': [] })
    if (this.formInvoice.value.id) {
      this.invoiceService.updateById({ 'id': this.formInvoice.value.id, 'body': this.formInvoice.value }).subscribe(
        () => {
          this.invoice = this.invoice.map(obj => {
            if (obj.id === this.formInvoice.value.id){
              return this.formInvoice.value;
            }
            return obj;
          })
          this.messageService.success('Item updated successfully!')
          this.formInvoice.reset()
        }
      )
    } else {
      console.log(this.formInvoice.value)
      delete this.formInvoice.value.id
      this.invoiceService.create({ body: this.formInvoice.value }).subscribe((datoAgregado) => {
        this.invoice = [...this.invoice, datoAgregado]
        this.messageService.success('Item created successfully!')
        this.formInvoice.reset()
      })
    }
    this.visible = false
  }
}
