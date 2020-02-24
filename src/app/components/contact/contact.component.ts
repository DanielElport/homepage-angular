import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LanguageService} from '../../services/language.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {PrivacyComponent} from '../privacy/privacy.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(private ls: LanguageService,
              private http: HttpClient,
              private bsModalRef: BsModalRef,
              private modalService: BsModalService) {
  }

  public name: string;
  public email: string;
  public message: string;
  public agreed: boolean;

  public errorMsg: string;
  public sent = false;

  public text;

  ngOnInit() {
    this.ls.sub.subscribe((res: any) => {
      this.text = res.contact;
    });
  }

  submit() {

    this.errorMsg = '';

    if (!this.name || !this.email || !this.message) {
      this.errorMsg = this.text.error;
    } else if (!this.validateEmail(this.email)) {
      this.errorMsg = this.text.errorEmail;
    } else if (!this.agreed) {
      this.errorMsg = this.text.errorPrivacy;
    } else {

      this.http.post('./mail/contact_me.php', {
        name: this.name,
        email: this.email,
        message: this.message
      }).toPromise()
        .then(() => {
          this.sent = true;
        })
        .catch(() => {
          this.errorMsg = this.text.errorHttp;
        });
    }
  }

  openPrivacyModal(e: Event) {
    e.preventDefault();
    this.bsModalRef = this.modalService.show(PrivacyComponent, {});
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  validateEmail(email): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
