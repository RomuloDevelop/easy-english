import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../product.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  products: Product[];

  constructor(private _router: Router, private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit() {
      this.productService.getProductsSmall().then(data => this.products = data);
  }

  toCreatePage() {
    this._router.navigate(['create-course'], {relativeTo: this.route})
  }
}
