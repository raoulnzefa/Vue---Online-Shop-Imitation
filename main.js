// Vue.component('remove-button', {
//     props: {
//       vis, 
//     },
//     template: `
//     <button  @click="removeFromCart"
//               v-if="cart > 0"  >Remove
//         </button>
//     `
// })

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        },
        sizes: {
            type: Array,
            required: true
        }
    },
    template: `
    <div >
    <ul>
    <li v-for="detail in details">
        {{detail}}
    </li>
</ul>

<ul>
    <li v-for="size in sizes">
        {{size}}
    </li>
</ul>
    </div>
    `
})

Vue.component('product', {
  props: {
        premium: {
            type: Boolean,
            required: true
        },
    },

    template: `
    <div class="product">

    <div class="product-image">
        <img v-bind:src="image" alt="Snowboard Boots">
    </div>
<p class=""></p>
    <div class="product-info">
        <h1>{{title}} </h1>
        <span >{{onSaleNow}}</span>
        <a v-if="!onSaleNow" :href="link">More like this</a>


        <p :class="{outOfStock: !inStock }">In stock</p>
        <p>Shipping: {{ shipping }}</p>
      <!--  <p v-else-if="inventory <= 10 && inventory > 0">Almost gone</p>
        <p v-else>Out of Stock</p>-->

    <product-details :details="details" :sizes="sizes"></product-details>
      

        <div v-for="(variant, index) in variants" 
             :key="variant.variantId"
             class="color-box"
             :style="{ backgroundColor: variant.variantColour }"
             @mouseover="updateProduct(index)">


        </div>

        <button v-on:click="addToCart"
                :disabled="!inStock"
                :class="{disabledButton: !inStock}">Add to Cart
        </button>

        <button  @click="removeFromCart"
                      >Remove
                </button>     

    </div>


  </div>
    `,


    data() {
        return {
            brand: 'DC',
            product: 'Snowboard Boots',
            selectedVariant: 0,
            link: 'https://www.absolute-snow.co.uk/S/Snowboard_Boots/Mens_/_Unisex(48).aspx',
            /*inventory: 11,*/
            
            onSale: true,
            details: ["80% leather", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColour: '#6df230',
                    variantImage: './assets/boot-green.jpg',
                    variantQuantity: 22
                },
                {
                    variantId: 2235,
                    variantColour: '#e23c26',
                    variantImage: './assets/boot-red.jpg',
                    variantQuantity: 0
                }
            ],
            sizes: ['M', 'L', 'XL']
            
        }
    },
    
    methods: {
        addToCart: function() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function (index) {
            this.selectedVariant = index
            console.log(index)
        }
    },
    
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        onSaleNow() {
            if (this.variants[this.selectedVariant].variantQuantity > 10) {
                return 'On Sale Now!' 
            }
        }, 
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return "2.99"
        },
      
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeItem(id) {


            for(var i = this.cart.length - 1; i >= 0; i--) {
              if (this.cart[i] === id) {
                 this.cart.splice(i, 1);
              }
            }
            
        }
    }

})