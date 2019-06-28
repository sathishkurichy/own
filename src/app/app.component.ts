import { Component, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from './../services/auth.service';
import {Constantes} from '../environments/environment';
import {UserService} from '../services/user.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import { faBars, faMapMarkerAlt, faUserAlt, faCaretDown, faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

    title = 'app';
    faBars = faBars;
    faMapMarkerAlt = faMapMarkerAlt;
    faUserAlt = faUserAlt;
    faCaretDown = faCaretDown;
    faChevronDown = faChevronDown;
    selectedTabIndex: number = 0;
    menuIsDisplay: boolean = false;

    cookieAccepted: string = '';
    politiqueUrl: string = '';

    showSubMenuMobile1 : boolean = false;
    showSubMenuMobile2 : boolean = false;
    showSubMenuMobile3 : boolean = false;
    showSubMenuMobile4 : boolean = false;

    runInBrowser: boolean = false;

    constructor(
      private authService: AuthService,
      private translate: TranslateService,
      private router: Router,
      private userService: UserService,
      @Inject(PLATFORM_ID) private platformId: Object,
      @Inject(APP_ID) private appId: string ) {
        this.runInBrowser = isPlatformBrowser(platformId);
      }

    ngOnInit(): void {

      let currentLang = this.userService.navigatorLanguageToLocale();
      this.userService.getUser().then( (res) => {
        console.log("res getUser()", res);
      })
      this.politiqueUrl = Constantes.SERVER_URL + Constantes.PDF_ENDPOINT + '/pc_' + currentLang + '.pdf';

      if (this.runInBrowser) {
        Cookie.delete(Constantes.COOKIE_SOCIAL_ACCEPTED);
        this.cookieAccepted = Cookie.get(Constantes.COOKIE_ACCEPTED);
      }

      this.initAppLanguage();

      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {

          switch (event.url) {
            case '/recipes/all':
              this.selectedTabIndex = 0;
              break;
            case '/recipes/favorite':
              this.selectedTabIndex = 1;
              break;
            case '/recipes/personnal':
              this.selectedTabIndex = 2;
              break;
            case '/sav':
              this.selectedTabIndex = 3;
              break;
            case '/users':
              this.selectedTabIndex = 4;
              break;
            case '/reviews-management':
              this.selectedTabIndex = 5;
              break;
            case '/recipes-management':
              this.selectedTabIndex = 6;
              break;
            default:
              console.warn('navigation page does not match any header tab');
              break;
          }
          this.menuIsDisplay = false;
        }
      });

    }

    initAppLanguage() {

      let language = '';
      var userLang = this.runInBrowser ? navigator.language : "";;


      switch (userLang) {
        case 'fr':
          language = 'fr_FR';
          break;
        case 'en-GB':
          language = 'en_UK';
          break;
        case 'en-US':
          language = 'en_US';
          break;
        case 'zh-CN':
          language = 'zh_CN';
          break;
        case 'es-ES':
          language = 'es_ES';
          break;
        case 'zh-HK':
          language = 'zh_HK';
          break;
        case 'en-HK':
          language = 'en_HK';
          break;
        default:
          language = 'en_US';
          break;
      }

      console.info('LANG CHOOSEN : ' + language);

      this.translate.setDefaultLang('en_US');
      this.translate.use(language);

    }

    navigate(page) {
      this.router.navigate([page]);
    }

    logout(): void {
      this.authService.logout();
    }

    isLogged(): boolean {
      return this.authService.isLogged();
    }

    isAdmin(): boolean {
      return this.authService.isAdmin();
    }

    isSAV(): boolean {
      return this.authService.isSav();
    }

    isTranslator(): boolean {
      return this.authService.isTranslator();
    }

    isModerator(): boolean {
      return this.authService.isModerator();
    }
    cookieOk(): void {
        const acceptedValue = 'true';
        Cookie.set(Constantes.COOKIE_ACCEPTED, acceptedValue);
        this.cookieAccepted = acceptedValue;
    }

    cookieKnowMore(): void {
        const currentLang: string = this.userService.navigatorLanguageToLocale();
        const politiqueUrl: string = Constantes.SERVER_URL + Constantes.PDF_ENDPOINT + '/pc_' + currentLang + '.pdf';
        window.open(politiqueUrl, '_self');
    }

    openLink(url: string) : void {
        window.open(url, "_self");
    }

    openShop() : void {
      if (Constantes.SERVER_URL != "http://nutrition.beaba.com") {
        this.navigate("/recipes/personnal");
      } else {
        window.open("https://shop.beaba.com/fr/mon-compte", "_self");
      }
  }

    changeStateMenu(menuValue: number, show: boolean): void {
      let subMenu = document.getElementById('subMenu'+menuValue);
      if (show) {
        subMenu.classList.remove("hide");
        subMenu.classList.add("show");
      } else {
        subMenu.classList.remove("show");
        subMenu.classList.add("hide");
      }
    }

    changeStateIcon(show: boolean, type: string): void {
      let icon = document.getElementById(type);
      if (show) {
        icon.classList.add("overhide-color-icon");
      } else {
        icon.classList.remove("overhide-color-icon");
      }
    }

    changeStateLanguage(show: boolean) {
      let language = document.getElementById("select-language");
      if (show) {
        language.classList.remove("hide");
        language.classList.add("show");
      } else {
        language.classList.remove("show");
        language.classList.add("hide");
      }
    }

    changeStateHeaderMobile(menuValue: number) {
        switch (menuValue) {
          case 1:
            this.showSubMenuMobile1 = !this.showSubMenuMobile1;
            break;
          case 2:
            this.showSubMenuMobile2 = !this.showSubMenuMobile2;
            break;
          case 3:
            this.showSubMenuMobile3 = !this.showSubMenuMobile3;
            break;
          case 4:
            this.showSubMenuMobile4 = !this.showSubMenuMobile4;
            break;
        }
    }

}
