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
  });

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

    it('edit post', () => {
      cy.get('#edit').click();
      cy.get('ion-textarea').type('!');
      cy.get('.create-publication #form').submit();
    })

    it('logout user', () => {
      cy.get('#settings').click();
      cy.get('#sign_out').click();
    })
  })

  describe('should write create form', () => {
    it('successfully loads', () => {
      cy.visit('/auth/registration');
      cy.get('#first-name').type('First-Name e2e');
      cy.get('#last-name').type('Last-Name e2e');
      cy.get('#email').type('e2e@email.com');
      cy.get('#password').type('Last-Name e2e')
    })

  })
})
