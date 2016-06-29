import {Injectable, ApplicationRef} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {PlatformInformationService} from './platformInformationService';
import {IBoardZAppWindow} from '../interfaces/boardzAppWindow';

declare var window :  IBoardZAppWindow;

@Injectable()
export class NativeIntegrationService {
    constructor(private _router: Router,
                private _platformInformationService: PlatformInformationService,
                private _applicationRef: ApplicationRef) {
    }

    public registerNavigationHook() {

        if (this._platformInformationService.isDesktop) {
            /**
             * Brave fighters, did you dare to the deepest depths and slain beasts.
             * But the greatest evil you have to overcome yet, armed with the worst, poisonous
             * weapons and disguised as well-known methods is SystemJS challenge you life and death.
             *
             * May the force be with you!
             */

            // systemJS is trying to require electron if you call it without explicitly calling it on window :facepalm:
            window.require('electron').ipcRenderer.on('navigateTo', (event, data) => {
                this._router.navigate([data]);
            });
        }
        this.applyBackWorkaround();
    }

    // issues below were targeting the deprecated router...
    // https://github.com/angular/angular/issues/7722
    // https://github.com/angular/angular/issues/7873
    private applyBackWorkaround() {
        this._router.subscribe(() => {
            setTimeout(() => {
                this._applicationRef.tick();
            });
        });
    }

}
