describe('The Home Page', () => {

  describe('should write login form', () => {
    it('successfully loads', () => {
      cy.visit('/auth/login');
    })

    it('login form', () => {
      cy.get('#email input').type('test@mail.com');
      cy.get('#password input').type('12345');
      cy.get('#form').submit();
    })
  })

  describe('home page', () => {
    it('/home', () => {
      cy.on('url:changed', (url) => {
        cy.url().should('include', '/');
      })
    })

    it('start post', () => {
      cy.get('.new-publications__btn').click();
      cy.get('textarea').type('e2e test');
      cy.get('#close').click();
    })
  })
})
