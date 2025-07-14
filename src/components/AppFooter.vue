<template>
    <el-footer>
      <div class="footer-content">
        <div class="footer-columns">
          <!-- Payment Methods Column -->
          <div class="footer-column">
            <h3>Payment Methods</h3>
            <div class="payment-methods">
              <img src="https://img.lazcdn.com/g/tps/tfs/TB1a7taR.Y1gK0jSZFCXXcwqXXa-824-305.png" alt="Visa" />
              <img src="https://img.lazcdn.com/us/domino/92e4b5da-14a4-4f22-a72b-6334933196ff_PH-117-70.png" alt="Mastercard" />
              <img src="https://img.lazcdn.com/us/domino/2cd27cdf-a067-4ca6-a117-3a9232b058b3_PH-63-48.png" alt="PayPal" />
              <img src="https://img.lazcdn.com/g/tps/tfs/TB1uQjzOVzqK1RjSZFvXXcB7VXa-225-114.png" alt="American Express" />

            </div>
          </div>

          <!-- Delivery Services Column -->
          <div class="footer-column">
            <h3>Delivery Services</h3>
            <div class="delivery-services">
              <img src="https://img.lazcdn.com/g/tps/imgextra/i3/O1CN01RNizk522j2cPtaRjc_!!6000000007155-2-tps-96-70.png" alt="DHL" />
              <img src="https://img.lazcdn.com/g/tps/imgextra/i2/O1CN01md1Up71hMVCAxe2HZ_!!6000000004263-2-tps-96-70.png" alt="J&T" />
              <img src="https://img.lazcdn.com/g/tps/imgextra/i3/O1CN01WNUpFq1JZjrZz6erP_!!6000000001043-2-tps-96-70.png" alt="Ninja Van" />
              <img src="https://img.lazcdn.com/g/tps/imgextra/i3/O1CN01gH5UI724D6E6K9Pko_!!6000000007356-2-tps-96-70.png" alt="X-DE" />
            </div>
          </div>

          <!-- Verified by Column -->
          <div class="footer-column">
            <h3>Verified by</h3>
            <div class="verified-by">
                <img src="https://img.lazcdn.com/g/tps/tfs/TB1lbmoqYr1gK0jSZR0XXbP8XXa-340-200.png" alt="X-DE" />
                <img src="https://img.lazcdn.com/g/tps/tfs/TB1jyJMv.H1gK0jSZSyXXXtlpXa-184-120.png" alt="X-DE" />
            </div>
          </div>
        </div>
      </div>
    </el-footer>
</template>

<style scoped>
.footer-container {
  background-color: #ffffff;
  padding: 20px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-columns {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  gap: 40px;
}

.footer-column {
  flex: 1;
  text-align: center;
}

.footer-column h3 {
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.payment-methods,
.delivery-services,
.verified-by {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.payment-methods img,
.delivery-services img {
  max-width: 120px;
  height: auto;
  border-radius: 4px;
}

/* Responsive design */
@media (max-width: 768px) {
  .footer-columns {
    flex-direction: column;
    gap: 30px;
  }
  
  .footer-column {
    text-align: center;
  }
}
</style>



  