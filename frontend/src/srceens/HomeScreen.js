import Rating from '../components/Rating';
import { getProducts } from '../api';
import { parseRequestUrl } from '../utils';

const HomeScreen = {
  render: async () => {
    const { value } = parseRequestUrl();
    const products = await getProducts({ searchKeyword: value });
    if (products.error) {
      return `<div class="error">${products.error}</div>`;
    }
    return `
    <ul class="products">
    ${products.map(
    (product) =>`
    <li>
        <div class="product">
            <a href="/#/product/${product._id}">
            <img src="${`data:image/jpg;base64,${btoa(String.fromCharCode(...new Uint8Array((product.image.data.data))))}`}" alt="${product.name}"/>
            </a>
        <div class="product-name">
            <a href="/#/product/1">
                ${product.name}
            </a>
        </div>
        <div class="product-rating">
            ${Rating.render({
                value: product.rating,
                text: `${product.numberReviews} reviews`,
            })}
        </div>
            <div class="product-brand">
            ${product.brand}
            </div>
        <div class="product-price">
            N$ ${product.price}
        </div>  
        </div>
    </li>
      `
        )
        .join('\n')}
    `;
  },
};
export default HomeScreen;
