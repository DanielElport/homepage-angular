import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private http: HttpClient) {
    this.load();
  }

  public selectedLanguage = 'en';
  public sub = new BehaviorSubject<any>(0);

  public load() {

    this.http.get('https://code-smart.com/content/' + this.selectedLanguage + '.json')
      .toPromise()
      .then(res => {
        this.sub.next(res);
      });

  }

  public getSelectedLanguage() {
    switch (this.selectedLanguage) {
      case 'en':
        return 'English';
      case'de':
        return 'Deutsch';
    }
  }

  public setSelectedLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.load();
  }

}
