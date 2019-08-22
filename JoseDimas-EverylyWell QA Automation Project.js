/*
  cypress.json  might have some items like these
    {
      "baseUrl": "https://everlywell.com/testsite",
      "itemURL":"{`baseUrl`}/productpage",
      "checkoutURL":  "{`baseUrl`}/checkout",
      "cartItems":[item1,item2,item3,item4,item5],
      "volumeDiscount": 30,
      "discountAmount": 20,
      "discountCode": discount20,
    }
*/

describe("Purchasing a product",() =>{

  beforeEach( ()=>{
    cy.visit(baseURL);
    cy.get('product1').click(); // Should assert that item exists, assumes it redirects you to the product page
    cy.url.should(eq,itemURL); //make sure that we are at the right page
    for(let i=0; i< 5; i ++){
      cy.get('addToCart').click(); 
    }
    cy.get('shoppingCart').should(eq,cartItems) //this is kinda vague for right now since im comparing an object
                                                //to a CY DOM element  
    cy.get('checkOut').click() 
  })
  
  context("with volume discount", () => {
    it("should have a 20% discount",() => {
      cy.get(discountAmount).should(eq,discountAmount) //Assrting that the volume discount is equal the correct amount
    })
  });    

  context("with a promo code", () => {
    cy.get('promoCodeField').type(discountCode);
    if(cy.get(discountAmount).its('amount').to.be.greaterThan(volumeDiscount)){ //figuring out if the promoCode is higher than the volumeDiscount
      it("should apply the discountAmount value", ()=> {
        cy.get('discountAmount').should(eq,discountAmount); // Assert that the code matches the discount amount
      })
    }
    else {
      cy.get('removePromoCode').click() //should click the option to remove the promo code, since the volume discount is higher
      it("should apply the volume discount", () => {
        cy.get('discountAmount').should(eq,volumeDiscount); //the discount amount should be the volume amount
      })
    }
  });
});