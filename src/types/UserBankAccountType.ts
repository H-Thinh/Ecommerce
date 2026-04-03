interface UserBankAccountBase {
  bankCode: string;
  bankName: string;
  accountNo: string;
  accountName: string;
}

export interface CreateUserBankAccountType extends UserBankAccountBase {
  userId: number;
}
