import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, map, throwError } from 'rxjs';
import { Product } from '../model/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  error = new Subject<string>();
  constructor(private http: HttpClient) {}

  createProduct(products: { pName: string; desc: string; price: string }) {
    console.log(products);
    const headers = new HttpHeaders({ myHeader: 'test' });
    this.http
      .post<{ name: string }>(
        'https://angularbykai-default-rtdb.firebaseio.com/products.json',
        products,
        { headers: headers }
      )
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          this.error.next(err.message);
        }
      );
  }

  fetchProduct() {
    const header = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    const params = new HttpParams().set('print', 'pretty').set('pageNum', 1);
    return this.http
      .get<{ [key: string]: Product }>(
        'https://angularbykai-default-rtdb.firebaseio.com/products.json',
        { headers: header, params: params }
      )
      .pipe(
        map((res) => {
          const prodcuts = [];
          for (const key in res) {
            if (res.hasOwnProperty(key)) {
              prodcuts.push({ ...res[key], id: key });
            }
          }
          return prodcuts;
        }),
        catchError((err) => {
          //write the logic for logging error
          return throwError(err);
        })
      );
  }

  deleteProduct(id: string) {
    let header = new HttpHeaders();
    header = header.append('myHeader1', 'Value1');
    header = header.append('myHeader2', 'Value2');
    this.http
      .delete(
        'https://angularbykai-default-rtdb.firebaseio.com/products/' +
          id +
          '.json',
        { headers: header }
      )
      .subscribe();
  }

  deleteAllProduct() {
    let header = new HttpHeaders();
    header = header.append('myHeader1', 'Value1');
    header = header.append('myHeader1', 'Value1');
    this.http
      .delete('https://angularbykai-default-rtdb.firebaseio.com/products.json')
      .subscribe();
  }

  updateProduct(id: string, value: Product) {
    this.http
      .put(
        'https://angularbykai-default-rtdb.firebaseio.com/products/' +
          id +
          '.json',
        value
      )
      .subscribe();
  }
}
