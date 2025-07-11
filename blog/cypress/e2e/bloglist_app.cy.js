describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      username: "blogtester",
      name: "blogger",
      password: "iheartblogs",
    };
    cy.createUser(user);
  });

  it("Login form is shown", function () {
    cy.visit("http://localhost:3003");
    cy.contains("log in to application");
    cy.contains("log in").click();
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.visit("http://localhost:3003");
      cy.contains("log in").click();
      cy.get("#username").type("blogtester");
      cy.get("#password").type("iheartblogs");
      cy.get("#login-button").click();
      cy.get(".message")
        .should("contain", "logged in")
        .and("have.css", "color", "rgb(204, 232, 205)");
    });

    it("fails with wrong credentials", function () {
      cy.visit("http://localhost:3003");
      cy.contains("log in").click();
      cy.get("#username").type("newuser");
      cy.get("#password").type("wrongpassword");
      cy.get("#login-button").click();
      cy.get(".error")
        .should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(244, 199, 199)");
    });
  });
  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "blogtester", password: "iheartblogs" });
      cy.contains("new blog").trigger("click");
    });

    it("a blog can be created", function () {
      cy.get("#title").focus().type("Cypress Title");
      cy.get("#author").focus().type("Singu Wasifa");
      cy.get("#url").focus().type("www.singufanclub.net");
      cy.get("#create").click();
      cy.get("#blog_title_blog_author").contains("Cypress Title Singu Wasifa");
      cy.contains("view").click();
      cy.get("#blog_url").contains("www.singufanclub.net");
    });

    it("a blog can be liked", function () {
      cy.createBlog({
        title: "liketester",
        author: "likemaster",
        url: "www.likes.net",
      });
      cy.contains("liketester").click();
      cy.contains("0 likes");
      cy.get("a").contains("blogs").click();
      cy.addLikes("liketester", 1);
      cy.contains("liketester likemaster").click();
      cy.contains("1 likes");
    });

    it("a blog can be deleted", function () {
      cy.createBlog({
        title: "deletetester",
        author: "deletemaster",
        url: "www.delete.net",
      });
      cy.contains("deletetester deletemaster");
      cy.contains("deletetester").click();
      cy.contains("blogtester");
      cy.get("#delete-button").click();
      cy.contains("deletetester deletemaster").should("not.exist");
    });

    it("the delete button can only be seen by the poster", function () {
      cy.createBlog({
        title: "buttontester",
        author: "cannotsee",
        url: "www.invisiblebutton.com",
      });
      cy.contains("buttontester cannotsee");
      cy.contains("logout").click();
      cy.createUser({
        username: "temp",
        name: "temporary",
        password: "temppass",
      });
      cy.login({ username: "temp", password: "temppass" });
      cy.contains("buttontester cannotsee");
      cy.contains("view").click();
      cy.contains("delete").should("not.exist");
    });

    it("the blogs are ordered by likes in descending order", function () {
      cy.createBlog({
        title: "underdog",
        author: "bestsoon",
        url: "www.soon.com",
      });
      cy.createBlog({ title: "average", author: "okay", url: "www.good.com" });
      cy.createBlog({
        title: "mostliked",
        author: "best",
        url: "www.best.com",
      });
      cy.addLikes("underdog", 1);
      cy.addLikes("average", 3);
      cy.addLikes("mostliked", 5);
      cy.get(".entry").eq(0).should("contain", "mostliked");
      cy.get(".entry").eq(1).should("contain", "average");
      cy.get(".entry").eq(2).should("contain", "underdog");
    });
  });
});
