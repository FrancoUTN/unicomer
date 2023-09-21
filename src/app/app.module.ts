// Basics
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Firebase
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
// Others
import { NgChartsModule } from 'ng2-charts';
// Local
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './pages/auth/auth.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthFormsComponent } from './components/auth-forms/auth-forms.component';
import { BalanceComponent } from './components/balance/balance.component';
import { CreditCardComponent } from './components/credit-card/credit-card.component';
import { ActivityComponent } from './components/activity/activity.component';
import { IncomeOutcomeComponent } from './components/income-outcome/income-outcome.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CardsComponent } from './pages/cards/cards.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { SpinnerOrErrorComponent } from './components/spinner-or-error/spinner-or-error.component';
import { BinaryQuestionComponent } from './components/binary-question/binary-question.component';
import { AmountInputComponent } from './components/amount-input/amount-input.component';
import { AmountErrorsComponent } from './components/amount-errors/amount-errors.component';
import { BalanceValueComponent } from './components/balance-value/balance-value.component';
import { ContinueButtonComponent } from './components/continue-button/continue-button.component';
import { SummaryComponent } from './components/summary/summary.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { SelectedUserComponent } from './components/selected-user/selected-user.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { DepositWithdrawalComponent } from './pages/deposit-withdrawal/deposit-withdrawal.component';
import { GoBackButtonComponent } from './components/go-back-button/go-back-button.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    NotFoundComponent,
    AuthFormsComponent,
    BalanceComponent,
    CreditCardComponent,
    ActivityComponent,
    IncomeOutcomeComponent,
    NavbarComponent,
    CardsComponent,
    TransactionsComponent,
    TransferComponent,
    SpinnerOrErrorComponent,
    BinaryQuestionComponent,
    AmountInputComponent,
    AmountErrorsComponent,
    BalanceValueComponent,
    ContinueButtonComponent,
    SummaryComponent,
    UsersListComponent,
    SelectedUserComponent,
    TransactionComponent,
    DepositWithdrawalComponent,
    GoBackButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    NgChartsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
