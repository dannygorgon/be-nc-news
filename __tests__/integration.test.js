const app = require("../app");
const request = require("supertest");
const seed  = require("../db/seeds/seed")
const db = require("../db/connection")
const testData = require("../db/data/test-data/index")

beforeEach(() => {
    return seed(testData)
})

afterAll(()=> {
    db.end()
})

describe('getTopics', () => {
    it('should return a 200 status code', () => {
        return request(app).get("/api/topics").expect(200)
    });
    it('should return an array of topic objects, each of which should have the following properties: slug, description) ', () => {
        return request(app).get("/api/topics").then((res) => {
            expect(Array.isArray(res.body.topics)).toBe(true)
            expect(res.body.topics).toHaveLength(3)
            res.body.topics.forEach((topic, index) => {
                expect(typeof res.body.topics[index]).toBe('object')
                expect(topic).hasOwnProperty('slug')
                expect(topic).hasOwnProperty('description')
            });
        })
    });
});