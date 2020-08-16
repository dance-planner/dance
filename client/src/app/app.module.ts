import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { NavbarModule } from 'ng-responsive-navbar'
import { NgRangeModule } from 'ng-range'
import { HttpClientModule } from '@angular/common/http'
import { TypeaheadModule } from 'ngx-bootstrap/typeahead'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TypeaheadComponent } from './typeahead/typeahead.component'
import { FormsModule } from '@angular/forms'
import { ContactComponent } from './contact/contact.component'
import { CardComponent } from './card/card.component'
import { TypingAreaComponent } from './typing-area/typing-area.component'
import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from '../environments/environment'
import { RouterModule } from '@angular/router'
import { NavbarComponent } from './navbar/navbar.component'
import { FurtherOptionsComponent } from './further-options/further-options.component'
import { RangeComponent } from './range/range.component'

@NgModule({
  declarations: [
    AppComponent,
    TypeaheadComponent,
    ContactComponent,
    CardComponent,
    TypingAreaComponent,
    NavbarComponent,
    FurtherOptionsComponent,
    RangeComponent,
  ],
  imports: [
    RouterModule.forRoot([]),
    FormsModule,
    NgRangeModule,
    NavbarModule,
    HttpClientModule,
    BrowserModule,
    TypeaheadModule.forRoot(),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
