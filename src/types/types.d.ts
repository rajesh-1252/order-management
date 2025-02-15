type ProductTypes = {
  id: number;
  productName: string
  productDescription?: string | null
}

type ErrorTypes = {
  message: string
  success?: boolean
}

type OrdersTypes = {
  id: number;
  orderDescription: string;
  createdAt: Date;
  OrderProductMaps: OrderProductMapTypes[];
};
