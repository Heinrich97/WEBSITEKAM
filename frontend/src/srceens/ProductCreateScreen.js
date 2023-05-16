import {
  showLoading,
  showMessage,
  hideLoading,
} from '../utils';
import { createProduct } from '../api';

const ProductCreateScreen = {
  after_render: () => {

    const productform = document.getElementById('product-form')
    document
      .getElementById('product-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        const formdata = new FormData(productform);
        const data = await createProduct(formdata)
        hideLoading();
        if (data.error) {
          showMessage(data.error);
        } else {
          document.location.hash = '/productlist';
        }
      });
  },
  render: async () => `
    <div class="content">
      <div>
        <a href="/#/productlist">Back to products</a>
      </div>
      <div class="form-container">
        <form id="product-form">
          <ul class="form-items">
            <li>
              <h1>Create Product</h1>
            </li>
            <li>
              <label for="name">Name</label>
              <input type="text" name="name" id="name" />
            </li>
            <li>
              <label for="price">Price</label>
              <input type="number" name="price" id="price" />
            </li>
            <li>
              <label for="image">Image (680 x 830)</label>
              <input type="file" name="testImage" id="testImage" />
            </li>
            <li>
              <label for="brand">Brand</label>
              <input type="text" name="brand" id="brand" />
            </li>
            <li>
              <label for="countInStock">Count In Stock</label>
              <input type="text" name="countInStock" id="countInStock" />
            </li>
            <li>
              <label for="category">Category</label>
              <input type="text" name="category" id="category" />
            </li>
            <li>
              <label for="description">Description</label>
              <input type="text" name="description" id="description" />
            </li>
            <li>
              <button type="submit" class="primary">Create</button>
            </li>
          </ul>
        </form>
      </div>

    </div>
    `,
};
export default ProductCreateScreen;
