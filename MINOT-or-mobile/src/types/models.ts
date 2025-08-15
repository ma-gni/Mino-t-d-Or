// Définition des interfaces pour les données utilisées dans l'application

export interface User {
  id: number;
  name: string;
  username: string;
  email?: string;
  role?: string;
  avatar?: string;
  phone?: string;
}

export interface Product {
  id: number;
  name: string;
  quantity: number;
  price?: number;
  unit?: string;
}

export interface Delivery {
  id: number;
  orderId?: number;
  clientName?: string;
  clientPhone?: string;
  address: string;
  postalCode?: string;
  city?: string;
  status: string;
  deliveryDate?: string;
  products?: Product[];
  qrCode?: string;
  latitude?: number;
  longitude?: number;
}
