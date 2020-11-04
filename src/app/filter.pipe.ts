import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filter'
})

export class FilterPipe implements PipeTransform{
	transform(items:Array<any>, searchText: string) : Array<any>{
		if(!items) return [];
		if(!searchText) return items;
		searchText = searchText.toLowerCase();
		return items.filter( it => {
		  return (it.CompanyName.toLowerCase().includes(searchText) || it.Name.toLowerCase().includes(searchText));
		});
	}
}