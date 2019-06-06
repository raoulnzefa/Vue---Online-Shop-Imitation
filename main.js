var eventBus = new Vue()



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
        cart: {
            type: Array,
            required: true
        }
      
    },

    template: `
    <div class="product" >

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

         <button  
            v-if="cart.length"
                  @click="removeFromCart"
                >Remove
        </button>
            
        <br>
        
    </div>

    <product-tabs :reviews="reviews"></product-tabs>

    

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
            sizes: ['M', 'L', 'XL'],
            reviews: []
            
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
      
    }, 
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})


// Vue.component('remove-button', {
//     props: {
//       cart: {
//           type: Array,
//           required: true
//       }
//     },
//     template: `
//     <button  @click="removeFromCart"
//               v-if="cart > 0"  >Remove
//         </button>
//     `
// })


Vue.component('product-review', {

    template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null
        }
    },
    methods: {
        onSubmit() {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating
            }
            eventBus.$emit('review-submitted', productReview)

            this.name =  null,
            this.review = null,
            this.rating = null
        }
    }
})


Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
        },
    template: `
    <div>
        <span class="tab"
              :class="{ activeTab: selectedTab === tab}"
              v-for="(tab, index) in tabs"
              :key="index"
              @click="selectedTab = tab"
              >{{ tab }}</span>

              <div v-show="selectedTab === 'Reviews' ">
    <h2>Reviews</h2>
    <p v-if="!reviews.length">There are no reviews yet.</p>
    <ul>
        <li v-for="review in reviews">
        <p>{{ review.name }}</p>
        <p>{{ review.review }}</p>
        <p>Rating: {{ review.rating }}</p>
        </li>
    </ul>
    </div>

        <product-review
        v-show="selectedTab === 'Make a Review' ">
        </product-review>
    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
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