import { faker } from '@faker-js/faker'
import BaseModel from '~/models/BaseModel'
import AccountTransformer from '~/transformers/AccountTransformer'
import AccountRepository from '~/repository/AccountRepository'
import _, { get } from 'lodash'
import Transaction from '~/models/Transaction'
import { NUMBER_FORMAT } from '~/utils/MathUtils.js'

class Account extends BaseModel {
  getTransformer() {
    return AccountTransformer
  }

  getRepository() {
    return new AccountRepository()
  }

  getEmpty() {
    return {
      attributes: {
        name: '',
        icon: null,
        type: null,
        role: null,
        include_net_worth: true,
        is_dashboard_visible: true,
      },
    }
  }

  // ------------

  getFake(id) {

    if (process.env.NODE_ENV === 'production') {
      return {}
    }
    return {
      type: 'accounts',
      id: id,
      attributes: {
        created_at: '2023-02-18T13:42:04+02:00',
        updated_at: '2023-03-11T10:12:29+02:00',
        active: true,
        order: null,
        name: faker.word.noun(),
        type: 'expense',
        account_role: null,
        currency_id: '28',
        currency_code: 'RON',
        currency_symbol: 'RON',
        currency_decimal_places: 2,
        current_balance: '1049.49',
        current_balance_date: '2023-04-02T23:59:59+03:00',
        notes: null,
        monthly_payment_date: null,
        credit_card_type: null,
        account_number: null,
        iban: null,
        bic: null,
        virtual_balance: '0',
        opening_balance: '0',
        opening_balance_date: null,
        liability_type: null,
        liability_direction: null,
        interest: null,
        interest_period: null,
        current_debt: null,
        include_net_worth: true,
        longitude: null,
        latitude: null,
        zoom_level: null,
      },
    }
  }

  // ------------

  static get creditCardPaymentPlans() {
    return {
      monthlyFull: 'monthlyFull',
    }
  }

  static get types() {
    return {
      cash: {
        name: 'Cash',
        fireflyCode: 'cash',
      },
      asset: {
        name: 'Asset',
        fireflyCode: 'asset',
      },
      expense: {
        name: 'Expense',
        fireflyCode: 'expense',
      },
      revenue: {
        name: 'Revenue',
        fireflyCode: 'revenue',
      },
    }
  }

  static typesList() {
    return Object.values(this.types)
  }

  // ------------

  static get roleAssets() {
    return {
      default: {
        name: 'Default',
        fireflyCode: 'defaultAsset',
      },
      shared: {
        name: 'Shared',
        fireflyCode: 'sharedAsset',
      },
      saving: {
        name: 'Savings',
        fireflyCode: 'savingAsset',
      },
      creditCard: {
        name: 'Credit card',
        fireflyCode: 'ccAsset',
      },
      cash: {
        name: 'Cash',
        fireflyCode: 'cashWalletAsset',
      },
    }
  }

  static roleAssetsList() {
    return Object.values(this.roleAssets)
  }

  static getDisplayName(account) {
    return _.get(account, 'attributes.name')
  }

  static getCurrency(account) {
    return get(account, 'attributes.currency_symbol')
  }

  static getCurrencyId(account) {
    return get(account, 'attributes.currency_id')
  }

  static getBalance(account) {
    return get(account, 'attributes.current_balance')
  }

  static getBalanceWithCurrency(account) {
    const profileStore = useProfileStore()
    let digits = profileStore.dashboard.showDecimal ? 2 : 0
    let numberFormatCode = profileStore.numberFormat.code ?? NUMBER_FORMAT.eu.code
    let amount = this.getBalance(account)

    amount = new Intl.NumberFormat(numberFormatCode, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(amount)

    return `${amount} ${this.getCurrency(account)}`
  }

  static getIsActive(account) {
    return _.get(account, 'attributes.active', false)
  }

  static getIsVisibleOnDashboard(account) {
    return _.get(account, 'attributes.is_dashboard_visible', true)
  }

  static getIsIncludedInNetWorth(account) {
    return _.get(account, 'attributes.include_net_worth', false)
  }

  static getType(account) {
    return get(account, 'attributes.type')
  }

  // -------

  static getAccountTypesForTransactionTypeSource(transactionType) {
    let transactionTypeCode = get(transactionType, 'code')
    if (!transactionTypeCode) {
      return []
    }
    switch (transactionTypeCode) {
      case Transaction.types.income.code:
        return [Account.types.revenue]
      case Transaction.types.expense.code:
        return [Account.types.asset, Account.types.cash]
      case Transaction.types.transfer.code:
        return [Account.types.asset]
    }
    return []
  }

  static getAccountTypesForTransactionTypeDestination(transactionType) {
    let transactionTypeCode = get(transactionType, 'code')
    if (!transactionTypeCode) {
      return []
    }
    switch (transactionTypeCode) {
      case Transaction.types.income.code:
        return [Account.types.asset, Account.types.cash]
      case Transaction.types.expense.code:
        return [Account.types.expense]
      case Transaction.types.transfer.code:
        return [Account.types.asset]
    }
    return []
  }
}

export default Account

export {}
