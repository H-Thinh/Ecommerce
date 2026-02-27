type StatusSale = "percent" | "fixed";

export default interface SaleType {
  name_sale: string;
  description: string;
  discount_type: StatusSale;
  discount_value: number;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
}
