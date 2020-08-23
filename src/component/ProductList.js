import React, { Component } from "react";
import Product from "./Product";
import Title from "./Title";
import { ProductConsumer } from "../context";

// the parents of Product Component

class ProductList extends Component {

  render() {

    return (
      <>
        <div className="py-5">
          <div className="container">
            <Title name="our" title="product" />
            <div className="row">
              {/* ProductConsumer로 context에서 value 값으로 정해준 state값에 접근 할 수 있다. */}
              <ProductConsumer>
                {(value) => {
                  return value.products.map(product => {
                    return <Product key={product.id} product={product} />
                  })
                }}
              </ProductConsumer>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ProductList;
