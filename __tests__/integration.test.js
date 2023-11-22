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

describe('getArticles', () => {
  it('should return status 200 and the correct object', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then((res) => {
      const {articles} = res.body
      articles.forEach((article) => {
        expect(typeof article.author).toBe('string');
        expect(typeof article.title).toBe('string');
        expect(typeof article.article_id).toBe('number');
        expect(typeof article.topic).toBe('string');
        expect(typeof article.created_at).toBe('string');
        expect(typeof article.votes).toBe('number');
        expect(typeof article.article_img_url).toBe('string');
        expect(typeof article.comment_count).toBe('string');
      });
    })
  });
  it('should return the object in the correct order, with correct length and order', () => {
    return request(app)
    .get('/api/articles')
    .then((res) => {
      const {articles} = res.body
      expect(articles).toHaveLength(13);
      expect(articles).toBeSortedBy('created_at', {descending: true});
    })
  });
});

describe('getCommentsByID', () => {
it('should correctly return array of objects with a status 200 code', () => {
  return request(app)
  .get('/api/articles/1/comments')
  .expect(200)
  .then((res) => {
    const {comments} = res.body
    expect(comments).toHaveLength(11);
    comments.forEach((comment) => {
      expect(typeof comment.comment_id).toBe('number');
      expect(typeof comment.votes).toBe('number');
      expect(typeof comment.created_at).toBe('string');
      expect(typeof comment.author).toBe('string');
      expect(typeof comment.body).toBe('string');
      expect(typeof comment.article_id).toBe('number');
    });
  })
});
it('should return 404 when passed an article id that does not exist', () => {
  return request(app)
  .get('/api/articles/999/comments')
  .expect(404)
  .then((res) => {
    expect(res.body.error).toBe('Not found');
  })
});
it('should return 400 when passed an invalid type of article id', () => {
  return request(app)
  .get('/api/articles/dog/comments')
  .expect(400)
  .then((res) => {
    expect(res.body.error).toBe('Bad request');
  })
})
it('should return object with correct  order', () => {
  return request(app)
  .get('/api/articles/1/comments')
  .then((res) => {
    const {comments} = res.body
    expect(comments).toBeSortedBy('created_at', {descending: true});
  })
});
})