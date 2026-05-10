import { MercadoPagoConfig, Preference } from 'mercadopago';

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const createPaymentPreference = async (data: {
  title: string;
  price: number;
  quantity: number;
  payer_email?: string;
  briefingId: string;
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sitepronto.com';
  try {
    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            id: 'sitepronto-001',
            title: data.title,
            quantity: data.quantity,
            currency_id: 'BRL',
            unit_price: data.price,
          },
        ],
        payer: {
          email: data.payer_email,
        },
        external_reference: data.briefingId,
        back_urls: {
          success: `${baseUrl}/obrigado/${data.briefingId}`,
          failure: `${baseUrl}/failure`,
          pending: `${baseUrl}/obrigado/${data.briefingId}`,
        },
        auto_return: 'approved',
      },
    });

    return {
      init_point: preference.init_point!,
      id: preference.id!,
    };
  } catch (error) {
    console.error('Error creating payment preference:', error);
    throw error;
  }
};

export default mercadopago;