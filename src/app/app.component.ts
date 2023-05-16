import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { Product } from './model/products';
import { ProductService } from './service/products.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'AngularHttpRequest';
  allProducts: Product[] = [];
  isFetching: boolean = false;

  editMode: boolean = false;

  currentProductId: string;

  errorMessage: string = null;
  errorSub: Subscription;

  @ViewChild('productsForm') form: NgForm;

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.fetchProducts();
    this.errorSub = this.productService.error.subscribe((message) => {
      this.errorMessage = message;
    });
  }

  onProductsFetch() {
    this.fetchProducts();
  }

  onProductCreated(product: { pName: string; desc: string; price: string }) {
    if (!this.editMode) this.productService.createProduct(product);
    else this.productService.updateProduct(this.currentProductId, product);
  }

  private fetchProducts() {
    this.isFetching = true;
    this.productService.fetchProduct().subscribe((products) => {
      this.allProducts = products;
      this.isFetching = false;
    }),
      (err) => {
        this.errorMessage = err.message;
      };
  }

  onDeleteProduct(id: string) {
    this.productService.deleteProduct(id);
  }

  onDeleteAllProduct() {
    this.productService.deleteAllProduct();
  }

  onEditClicked(id: string) {
    this.currentProductId = id;
    //Get the product based on the id
    let currentProduct = this.allProducts.find((p) => {
      return p.id === id;
    });
    console.log(currentProduct);

    //Populate the form with the product details
    this.form.setValue({
      pName: currentProduct.pName,
      desc: currentProduct.desc,
      price: currentProduct.price,
    });

    //Change the button value to update product
    this.editMode = true;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
