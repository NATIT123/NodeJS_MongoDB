import React, { Component } from "react";
import axios from "axios";

import Products from "../../components/Products/Products";

class ProductsPage extends Component {
  state = { isLoading: true, products: [] };
  componentDidMount() {
    axios
      .get("http://localhost:3100/products?page=2&limit=4")
      .then((productsResponse) => {
        console.log(productsResponse);
        this.setState({
          isLoading: false,
          products: productsResponse.data.data,
        });
      })
      .catch((err) => {
        this.setState({ isLoading: false, products: [] });
        this.props.onError("Loading products failed. Please try again later");
        console.log(err);
      });
  }

  productDeleteHandler = (productId) => {
    axios
      .delete("http://localhost:3100/products/" + productId)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        this.props.onError(
          "Deleting the product failed. Please try again later"
        );
        console.log(err);
      });
  };

  render() {
    let content = <p>Loading products...</p>;

    if (!this.state.isLoading && this.state.products.length > 0) {
      content = (
        <Products
          products={this.state.products}
          onDeleteProduct={this.productDeleteHandler}
        />
      );
    }
    if (!this.state.isLoading && this.state.products.length === 0) {
      content = <p>Found no products. Try again later.</p>;
    }
    return <main>{content}</main>;
  }
}

export default ProductsPage;
