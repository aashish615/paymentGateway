import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormGroup, FormControl, Validators } from '@angular/forms';
declare var Razorpay: any;
import { CreditCardValidator } from 'angular-cc-library/lib/credit-card.validator';
import { CreditCard } from 'angular-cc-library';
@Component({
  selector: 'app-razorpay',
  templateUrl: './razorpay.component.html',
  styleUrls: ['./razorpay.component.scss']
})
export class RazorpayComponent implements OnInit {

  modalType: any = 'cash'

  model:any={}
  // razorpay
  razorpay: any;

  // INTERNET BANKING
  allBanks: any = []
  selectedBank:any;
  bank:any;

  // CARD DEBIT/CREDIT
  cardsType = [
    { key: 'card', name: 'Debit Card' },
    { key: 'credit_card', name: 'Credit Card' }
  ];
  selectedCard:any;
  showCardForm: boolean = false;
  cardForm: FormGroup;  // razorpay  credit/debit card validation
  cardType: any; // razorpay credit/debit card validation
  //WALLET
  selecteWallet = 'select';
  wallet: any = [];
  selectedWalletType: any;

  paymentOption={
    key: "rzp_test_PdoeMjfqblHXa6",
    name: "ScrollBee Tech",
    description: "In Scrollbee Tech you will find all the basic important code which help for beginner to learn new things",
    image: "https://pbs.twimg.com/profile_images/1525702326/IMG_0173-2_400x400.jpg",
    prefill: {
      name: "Ashish Pillai",
      email: "ashish@scrollbeeTech.io"
    },
    notes: {
      address: "Indirapuram",
    },
    theme: {
      color: "#4dd0e1"
    },
    modal: {
      ondismiss: function () {
        console.log('Checkout form closed');
      }
    },
    handler: function (response) {
      console.log("handler ", response);
      alert(response.razorpay_payment_id);
    },
  }



  constructor( private toaster:ToastrManager) {

    this.cardForm = new FormGroup({
      creditName: new FormControl('', [Validators.required]),
      creditCard: new FormControl('', [<any>CreditCardValidator.validateCCNumber]),
      expirationDate: new FormControl('', [<any>CreditCardValidator.validateExpDate]),
      cvc: new FormControl('', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]),
    })
  }

  ngOnInit() {
    this.getBanks();
    this.getWalletType();
  }

  click(type){
    if (type ==='wallet'){
      this.modalType='wallet'
    } else if (type === 'card'){
      this.modalType = 'card'
    } else if (type ==='cash'){
      this.modalType ='cash'
    } else if (type === 'net_banking'){
      this.modalType ='net_banking'
      this.getBanks();
    }else{
      this.modalType ='wallet'
    }
    console.log("type", type);

  }

  onSearchChange(num) {
    this.cardType = CreditCard.cardFromNumber(num);
    console.log("this.", this.cardType);

  }
  getBanks() {
    this.razorpay = new Razorpay({ "key": "rzp_test_PdoeMjfqblHXa6", });
    this.razorpay.once('ready', (response) => {
      var p = [];
      Object.keys(response['methods']['netbanking']).forEach(function (key) {
        p.push({
            key: key,
            name: response['methods']['netbanking'][key]
          })
      });
      setTimeout(() => {
        this.allBanks = p
       console.log("this.banks", this.allBanks);
      }, 0)
    })
  }
  getWalletType() {
    this.razorpay.once('ready', (response) => {
      if (response) {
        var p = [];
        Object.keys(response['methods']['wallet']).forEach(function (key) {
          p.push(
            {
              name: key
            }
          )

        });
        console.log("p", p);
        setTimeout(() => {
          this.wallet = p;
           console.log("wallet", this.wallet);
        }, 100)
      }
    })
  }

  // Internet banking
  onChange(newValue) {
    console.log(newValue);
    this.selectedBank = newValue;
    console.log("selectedBank", this.selectedBank);
  }

  // card type value
  // Radio Change Event
  onItemChange(item) {
    console.log("item", item);
    this.showCardForm = true
    if (item ==='credit_card'){
      this.selectedCard = 'card'
    }else{
      this.selectedCard = 'card'
    }
    console.log("this.selectedCard", this.selectedCard);
  }

  // wallet type onchange
  onItemWalletChange(item) {
    console.log("item", item);
    this.selectedWalletType=item
    console.log("this.selectedWalletType", this.selectedWalletType);
  }

  paynow(){
    if (this.modalType === 'wallet') {
      console.log("wallet");
      this.walletPay();
    } else if (this.modalType === 'card') {
      this.cardPay();
    } else if (this.modalType === 'cash') {
      this.toaster.successToastr('Cash', '',{position:'bottom-right'})
    } else if (this.modalType === 'net_banking') {
      this.internetBankingPay();
    }

  }

  // Internet Banking
  internetBankingPay() {
    var razorpay = new Razorpay(this.paymentOption);
    razorpay.createPayment({
      amount: 5000,
      email: 'gaurav.kumar@example.com',
      contact: '9123456780',
      // order_id: 'order_9A33XWu170gUtm', // we will get an order_id from beckend guys for testing purpose iam just commenting now
      method: 'netbanking',
      bank: this.selectedBank
    })

    razorpay.on('payment.success', (resp) => {
      var paymentId = (resp.razorpay_payment_id);
      this.toaster.successToastr("payment success",'', {position:'bottom-right'})

      this.orderanything(paymentId)
    })
    razorpay.on('payment.error', function (resp) {
      console.log(resp.error.description);
      this.toaster.errorToastr(resp.error.description,'',{position:'bottom-right'})

    });
  }

  // Card  Payment
  cardPay() {
    this.razorpay = new Razorpay(this.paymentOption);
    var data = {
      amount: 200 * 100,
      email: 'gaurav.kumar@example.com',
      contact: '9123456780',
      // order_id: 'order_9A33XWu170gUtm', // we will get an order_id from beckend guys for testing purpose iam just commenting now
      save: 1,
      method: this.selectedCard,
      'card[number]': this.model.cardNumber,
      'card[expiry_month]': this.model.expiryMonth,
      'card[expiry_year]': this.model.expiryYear,
      'card[cvv]': this.model.cvv,
      'card[name]': this.model.name,
    }
    this.razorpay.createPayment(data, {
      // paused: true,
      message: 'Confirming order..'
    }
    );
    this.razorpay.on('payment.success', (resp) => {
      console.log("success response", resp);
      this.toaster.successToastr("payment success",'', {position:'bottom-right'})

      var paymentId = (resp.razorpay_payment_id);
      this.orderanything(paymentId)
    })

    this.razorpay.on('payment.error', (resp) => {
      console.log(resp.error.description);
      this.toaster.errorToastr(resp.error.description,'',{position:'bottom-right'})

    })

  }

  // Wallet Payment
  walletPay() {
    this.razorpay = new Razorpay(this.paymentOption);
    this.razorpay.createPayment({
      amount: 5000,
      email: 'gaurav.kumar@example.com',
      contact: '9716052171',
      // order_id: 'order_9A33XWu170gUtm', // we will get an order_id from beckend guys for testing purpose iam just commenting now
      method: 'wallet',
      wallet: this.selectedWalletType
    })

    this.razorpay.on('payment.success', (resp) => {
      console.log("success response", resp);
      this.toaster.successToastr("payment success",'', {position:'bottom-right'})

      var paymentId = (resp.razorpay_payment_id);
      this.orderanything(paymentId)
    })
    this.razorpay.on('payment.error', function (resp) {
      console.log(resp.error.description);
      this.toaster.errorToastr(resp.error.description,'',{position:'bottom-right'})
    });


  }

  // When Payment done CALL API
  orderanything(paymentId) {
    console.log("order payment id", paymentId);
  }


}
