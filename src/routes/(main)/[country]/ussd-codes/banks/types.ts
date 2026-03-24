export type USSD = {
    [key: string]: string;
};
export type BankData = {
    id: string;
    name: string;
    city: string;
    address: string;
    branch: string;
    ussd: USSD;
};
