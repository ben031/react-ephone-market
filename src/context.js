import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";

//contextAPI

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    //원본 데이터의 수정과 변경을 막기 위해서 빈 배열로 state를 설정한다.
    products: [],
    detailProduct: detailProduct,
    cart: [],
    modalOpen: false,
    modalProduct: detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0,
  };
  //페이지가 마운트될 때 (즉, 처음 페이지가 렌더링 될 떄) setProducts라는 함수를 실행한다.
  componentDidMount() {
    this.setProducts();
  }

  setProducts = () => {
    // 빈 배열을 변수로 선언, 할당한 뒤 storeProducts 배열에 map method를 사용해 각 배열 원소 꺼내 singleitem 변수에 할당한다. 그런 뒤 빈 배열을 할당한 tempProducts에 스프레드 기법을 사용해 모든 아이템을 넣어준다.
    let tempProducts = [];
    storeProducts.map((item) => {
      const singleitem = { ...item };
      tempProducts = [...tempProducts, singleitem];
      //   tempProducts = tempProducts.concat(singlitem) , 배열의 불변성을 지켜줘야 한다.(오리지널한(?)데이터를 변경하지 않아야 한다.)
    });
    //setState()로 state 값을 변경해준다.
    this.setState(() => {
      return { products: tempProducts };
    });
  };

  getItem = (id) => {
    const product = this.state.products.find((item) => item.id === id);
    return product;
  };

  handleDetail = (id) => {
    const product = this.getItem(id);
    this.setState(() => {
      return { detailProduct: product };
    });
  };

  addToCart = (id) => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const product = tempProducts[index];
    product.inCart = true;
    product.count = 1;
    const price = product.price;
    product.total = price;
    console.log(product);
    this.setState(
      () => {
        return { products: tempProducts, cart: [...this.state.cart, product] };
      },
      () => {
        this.addTotals();
      }
    );
  };

  openModal = (id) => {
    const product = this.getItem(id);
    this.setState(() => {
      return { modalProduct: product, modalOpen: true };
    });
  };

  closeModal = () => {
    this.setState(() => {
      return { modalOpen: false };
    });
  };

  increment = (id) => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.indexOf(this.getItem(id));
    const increasedItem = tempProducts[index];
    increasedItem.count += 1;
    let itemTotal = increasedItem.count * increasedItem.price;
    this.setState(
      () => {
        increasedItem.total = itemTotal;
      },
      () => {
        this.addTotals();
      }
    );
  };

  decrement = (id) => {
    let tempProduts = [...this.state.products];
    const index = tempProduts.indexOf(this.getItem(id));
    const decreasedItem = tempProduts[index];
    decreasedItem.count -= 1;
    if (decreasedItem.count === 0) {
      this.removeItem(id);
    } else {
      let itemTotal = decreasedItem.count * decreasedItem.price;
      this.setState(
        () => {
          decreasedItem.total = itemTotal;
        },
        () => {
          this.addTotals();
        }
      );
    }
  };

  removeItem = (id) => {
    //filter
    const { cart } = this.state;

    let tempProducts = [...this.state.products];
    // let tempCart = [...this.state.cart];
    // tempCart = tempCart.filter((item) => item.id !== id);
    const index = tempProducts.indexOf(this.getItem(id));
    const removedProduct = tempProducts[index];
    removedProduct.inCart = false;

    const stillIn = cart.filter((item) => item.id !== id);
    this.setState(
      () => {
        return { cart: stillIn };
      },
      () => {
        this.addTotals();
      }
    );
  };

  clearCart = () => {
    this.setState(
      () => {
        return { cart: [] };
      },
      () => {
        this.setProducts();
        this.addTotals();
      }
    );
    console.log("clearCart");
    console.log(this.state.cart);
  };

  addTotals = () => {
    let subTotal = 0;
    this.state.cart.map((item) => {
      subTotal += item.total;
    });
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    this.setState(() => {
      return {
        cartSubTotal: subTotal,
        cartTax: tax,
        cartTotal: total,
      };
    });
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart,
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
