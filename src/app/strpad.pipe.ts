import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'strpad'
})

export class StrPadPipe implements PipeTransform{
	transform(text:string, length:number, padLeft: boolean = true, padChar: string = "0") : string{
		if(!length) return text;
		if(text.length >= length) return text;
		if(padLeft){
			while (text.length < length)
				text = padChar + text;
		} else {
			while (text.length < length)
				text = text + padChar;
		}
		return text;
	}
}