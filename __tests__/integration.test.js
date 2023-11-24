const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");
const format = require("pg-format");
const sorted = require("jest-sorted");
beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("getTopics", () => {
  it("should return a 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });
  it("should return an array of topic objects, each of which should have the following properties: slug, description) ", () => {
    return request(app)
      .get("/api/topics")
      .then((res) => {
        expect(res.body.topics).toHaveLength(3);
        res.body.topics.forEach((topic, index) => {
          expect(typeof res.body.topics[index]).toBe("object");
          expect(topic).hasOwnProperty("slug");
          expect(topic).hasOwnProperty("description");
        });
      });
  });
});

describe("getAPI", () => {
  it("should return an object describing all the available endpoints on your API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        const testObject = endpoints;
        const endpointResult = res.body;
        expect(testObject).toEqual(endpointResult);
      });
  });
});

describe("getArticleByID", () => {
  it("should return correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const testArticle = res.body.article;
        const expectedArticle = {
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        expect(testArticle).toEqual(expectedArticle);
      });
  });
  it("should return a 404 error if no such id exists ", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((res) => {
        expect(res.body.error).toBe("Not found");
      });
  });
  it("should return a 400 error if invalid ID passed ", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then((res) => {
        expect(res.body.error).toBe("Bad request");
      });
  });
});

describe("getArticles", () => {
  it("should return status 200 and the correct object", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const { articles } = res.body;
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  it("should return the object in the correct order, with correct length and order", () => {
    return request(app)
      .get("/api/articles")
      .then((res) => {
        const { articles } = res.body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  it('should return correct object when passed "topic" as a query', () => {
    return request(app)
    .get("/api/articles?topic=mitch")
    .then((res) => {
      const { articles } = res.body;
      expect(articles).toHaveLength(12);
      articles.forEach((article) => {
        console.log(article);
        expect(article.topic).toBe("mitch");
      });
    })
  });
  it('should return empty array when topic does not exist', () => {
    return request(app)
    .get("/api/articles?topic=dogs")
    .then((res) => {
      const { articles } = res.body;
      expect(articles).toHaveLength(0);
      expect(articles).toEqual([]);
    })
  });
});

describe("getCommentsByID", () => {
  it("should correctly return array of objects with a status 200 code", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  it("should return a 404 whenn passed an article id that does not exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.error).toBe("Not found");
      });
  });
  it("should return 400 when passed an invalid type of article id", () => {
    return request(app)
      .get("/api/articles/dog/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.error).toBe("Bad request");
      });
  });
  it("should return object with correct  order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then((res) => {
        const { comments } = res.body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("should return 200 and an empty array when passed an article_id that exists, but has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then((res) => {
        const { comments } = res.body;
        expect(comments).toHaveLength(0);
        expect(comments).toEqual([]);
      });
  });
});

describe("postComment", () => {
  it("POST:201 inserts a new comment to the db and sends the new team back to the client", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I am a new mensaje",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          comment_id: 19,
          author: "butter_bridge",
          article_id: 5,
          body: "I am a new mensaje",
        });
      });
  });
  it("POST:400 responds with an appropriate status and error message when provided an input with no body", () => {
    return request(app) // post new comment to the API
      .post("/api/articles/5/comments")
      .send({
        username: "tickle122",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad request");
      });
  });
  it("POST:400 responds with an appropriate status and error message when provided an input with no username", () => {
    return request(app) // post new comment to the API
      .post("/api/articles/5/comments")
      .send({
        body: "I am a new mensaje",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad request");
      });
  });
  it("POST:404 responds with an appropriate status and error message when non-existent article_id is passed", () => {
    return request(app) // post new comment to the API
      .post("/api/articles/152/comments")
      .send({
        username: "butter_bridge",
        body: "I am a new mensaje",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Not found");
      });
  });
  it("POST:404 responds with appropriate error message and status when a non-existent username is passed.", () => {
    return request(app) // post new comment to the API
      .post("/api/articles/152/comments")
      .send({
        username: "butter_bri3dge",
        body: "I am a new mensaje",
      })
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Not found");
      });
  });
});
describe("patchArticleByID", () => {
  it("Should correctly update specified article when passed positive integer ", () => {
    return request(app)
      .patch("/api/articles/5/")
      .send({ inc_votes: 2 })
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 5,
          title: expect.any(String),
          body: expect.any(String),
          votes: 2,
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  it("Should correctly update specified article when passed negative integer ", () => {
    return request(app)
      .patch("/api/articles/1/")
      .send({ inc_votes: -50 })
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          body: expect.any(String),
          votes: 50,
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  it("Should correctly update specified article when passed negative integer ", () => {
    return request(app)
      .patch("/api/articles/5/")
      .send({ inc_votes: 0 })
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 5,
          title: expect.any(String),
          body: expect.any(String),
          votes: 0,
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  it("Should return 400 no inc_votes is passed. ", () => {
    return request(app)
      .patch("/api/articles/5/")
      .send()
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad request");
      });
  });
  it("Should return 200 and ignore extra properties in the request body", () => {
    return request(app)
      .patch("/api/articles/5/")
      .send({ inc_votes: 1, extra_prop: "I am unnecessary" })
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 5,
          title: expect.any(String),
          body: expect.any(String),
          votes: expect.any(Number),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
        });
        expect(response.body.article).not.toHaveProperty("extra_property");
      });
  });
  it("should return a 404 when passed an article id that does not exist", () => {
    return request(app)
      .patch("/api/articles/15")
      .expect(404)
      .send({ inc_votes: 2 })
      .then((res) => {
        expect(res.body.error).toBe("Not found");
      });
  });
  it("should return a 400 when passed invalid vote value", () => {
    return request(app)
      .patch("/api/articles/5/")
      .send({ inc_votes: "dog" })
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad request");
      });
  });
  it("should return a 400 when passed invalid article_id value", () => {
    return request(app)
      .patch("/api/articles/foo/")
      .send({ inc_votes: 5 })
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad request");
      });
  });
});

describe("deleteComment", () => {
  it("should return a 204 and an empty body", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .expect((res) => {
        expect(res.body).toEqual({});
      });
  });
  it("should return 404 when passed a comment_id that does not exist", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((res) => {
        expect(res.body.error).toBe("Not found");
      });
  });
  it("should return 400 when passed invalid id", () => {
    return request(app)
      .delete("/api/comments/dog")
      .expect(400)
      .then((res) => {
        expect(res.body.error).toBe("Bad request");
      });
  });
});

describe("getUsers", () => {
  it("should return 200 and the correct object", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const { users } = res.body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            avatar_url: expect.any(String),
            name: expect.any(String),
          });
        });
      });
  });
});
