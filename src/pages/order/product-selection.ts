import { Component } from '@angular/core';
import { ViewController, LoadingController } from 'ionic-angular';

import { WS } from '../../app/app.services';

@Component({
  selector: 'product-selection-page',
  templateUrl: 'product-selection.html'
})

export class ProductSelectionPage {
	products: Array<{}>;
	searchText: string = '';

	constructor(public viewCtrl: ViewController, public loadingCtrl: LoadingController, public ws: WS) {
		this.products = [];
	}

	ionViewDidEnter(){
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		loader.present();
		this.ws.GetProductList().subscribe(
			(data) => {
				loader.dismiss();
				this.products = data;
			},
			(error) => {
				loader.dismiss();
				console.log(error);
			}
		);
	}

	public selectProduct(product){
		this.viewCtrl.dismiss({ProductID : product.ID, Price: product.Price, ProductName: product.ProductName, MinPrice: product.MinPrice, Tax: product.Tax});
	}
	
	public dismiss(){
		this.viewCtrl.dismiss();
	}
}
