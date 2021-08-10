export interface Networks {
  [index: string]: {
    icon: string
    url: string
  }
}

export interface Phone {
  number: string
  url: string
}

class ContactInfo {
  private phones: Phone[] = [
    {
      number: '+(58) 424-7392583',
      url: 'tel:+584247392583'
    },
    {
      number: '+(58) 412-1738985',
      url: 'tel:+584121738985'
    }
  ]

  private networks: Networks = {
    instagram: {
      icon: 'bx bxl-instagram',
      url: 'https://www.instagram.com/aeasy_english'
    },
    facebook: {
      icon: 'bx bxl-facebook',
      url: 'https://www.facebook.com/aeasy_english'
    },
    whatsapp: {
      icon: 'bx bxl-whatsapp',
      url: 'https://wa.me/message/ZSQFDPIOHLHQE1'
    }
  }

  constructor() {}

  static getNetworks() {
    return new ContactInfo().networks
  }

  static getPhones() {
    return new ContactInfo().phones
  }
}
export default ContactInfo
