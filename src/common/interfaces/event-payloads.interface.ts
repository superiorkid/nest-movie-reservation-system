export interface EventPayloads {
  'payment.success': { name: string; email: string };
  'payment.cancelled': { name: string; email: string; link: string };
}
