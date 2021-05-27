import { Component, OnInit } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';

@Component({
    selector: 'app-gallery-page',
    templateUrl: './gallery-page.component.html',
    styleUrls: ['./gallery-page.component.scss']
})
export class GalleryPageComponent implements OnInit {

    ngOnInit(): void {
    }

    public _album = [];
    constructor(public _lightbox: Lightbox) {
        for (let i = 1; i <= 9; i++) {
            const src = 'assets/img/gallery/gallery' + i + '.jpg';
            const caption = 'Image ' + i;
            const thumb = 'assets/img/gallery/gallery' + i + '.jpg';
            const album = {
                src: src,
                caption: caption,
                thumb: thumb
            };
            this._album.push(album);
        }
    }
 
    open(index: number): void {
        // open lightbox
        this._lightbox.open(this._album, index);
    }
    
    close(): void {
        // close lightbox programmatically
        this._lightbox.close();
    }

}