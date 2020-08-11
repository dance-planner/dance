import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
// import { NgRangeModule } from 'ng-range'
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
import { RangeComponent } from './range/range.component'
import { NavbarComponent } from './navbar/navbar.component'

@NgModule({
  declarations: [
    AppComponent,
    TypeaheadComponent,
    ContactComponent,
    CardComponent,
    TypingAreaComponent,
    NavbarComponent,
    RangeComponent,
  ],
  imports: [
    RouterModule.forRoot([]),
    TypeaheadModule.forRoot(),
    FormsModule,
    // NgRangeModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
