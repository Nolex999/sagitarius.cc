export function getOrderEmailTemplate(orderId: string, productName: string, activationKey: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Sagitarius Order Confirmation</title>
        <style>
          body { 
            background-color: #000000; 
            color: #ffffff; 
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #050505;
            border: 1px solid #111;
            border-radius: 24px;
            padding: 40px;
            text-align: center;
          }
          .logo {
            font-size: 24px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            margin-bottom: 30px;
            color: #ffffff;
          }
          .accent { 
            color: #C5A059;
            text-shadow: 0 0 20px rgba(197, 160, 89, 0.4);
          }
          h1 {
            font-size: 20px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 20px;
          }
          p {
            color: rgba(255, 255, 255, 0.4);
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .order-id {
            display: inline-block;
            padding: 4px 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.3);
            margin-bottom: 40px;
          }
          .key-container {
            background: rgba(197, 160, 89, 0.03);
            border: 1px dashed rgba(197, 160, 89, 0.2);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 40px;
            position: relative;
          }
          .key-value {
            font-family: 'Courier New', Courier, monospace;
            font-size: 20px;
            font-weight: 900;
            color: #ffffff;
            letter-spacing: 0.1em;
            word-break: break-all;
          }
          .btn {
            display: inline-block;
            background: #ffffff;
            color: #000000;
            padding: 14px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            transition: all 0.3s;
          }
          .footer {
            margin-top: 40px;
            font-size: 10px;
            color: rgba(255, 255, 255, 0.1);
            text-transform: uppercase;
            letter-spacing: 0.3em;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Sagitarius<span class="accent">.cc</span></div>
          <h1>Activation Key Delivered</h1>
          <p>Thank you for choosing Sagitarius. Your access to <b>${productName}</b> is now ready.</p>
          
          <div class="order-id">Order #${orderId}</div>
          
          <div class="key-container">
            <div class="key-value">${activationKey}</div>
          </div>
          
          <a href="https://sagitarius.cc/dashboard/software" class="btn">Access Portal</a>
          
          <div class="footer">
            Automated Delivery System &bull; Private Access Only
          </div>
        </div>
      </body>
    </html>
  `;
}
